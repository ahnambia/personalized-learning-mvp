from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..core.deps import get_db, get_current_active_user
from ..models.user import User
from ..models.attempts import Attempt, Response
from ..models.quiz import Quiz, QuizQuestion, QuestionOption
from ..schemas.attempts import AttemptStart, ResponseSave, AttemptSubmit, AttemptOut
from ..services.grading import grade_mcq_question, grade_short_answer
from ..services.bkt import update_mastery

router = APIRouter()


@router.post("/start", response_model=AttemptOut)
def start_attempt(
    attempt_data: AttemptStart,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if quiz exists
    quiz = db.query(Quiz).filter(Quiz.id == attempt_data.quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    # Create new attempt
    attempt = Attempt(
        user_id=current_user.id,
        quiz_id=attempt_data.quiz_id,
        started_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    
    return {
        "id": attempt.id,
        "quiz_id": attempt.quiz_id,
        "started_at": attempt.started_at.isoformat(),
        "submitted_at": None,
        "score": None
    }


@router.post("/{attempt_id}/response")
def save_response(
    attempt_id: int,
    response_data: ResponseSave,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if attempt exists and belongs to current user
    attempt = db.query(Attempt).filter(
        Attempt.id == attempt_id,
        Attempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )
    
    if attempt.submitted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attempt already submitted"
        )
    
    # Check or create response
    response = db.query(Response).filter(
        Response.attempt_id == attempt_id,
        Response.question_id == response_data.question_id
    ).first()
    
    if not response:
        response = Response(
            attempt_id=attempt_id,
            question_id=response_data.question_id,
            answer=response_data.answer
        )
        db.add(response)
    else:
        response.answer = response_data.answer
    
    db.commit()
    return {"message": "Response saved"}


@router.post("/{attempt_id}/submit")
def submit_attempt(
    attempt_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if attempt exists and belongs to current user
    attempt = db.query(Attempt).filter(
        Attempt.id == attempt_id,
        Attempt.user_id == current_user.id
    ).first()
    
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attempt not found"
        )
    
    if attempt.submitted_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attempt already submitted"
        )
    
    # Grade all responses
    responses = db.query(Response).filter(Response.attempt_id == attempt_id).all()
    total_score = 0
    total_questions = 0
    
    for response in responses:
        question = db.query(QuizQuestion).filter(QuizQuestion.id == response.question_id).first()
        if question.question_type == "mcq":
            is_correct = grade_mcq_question(response.answer, question.id, db)
        elif question.question_type == "short_answer":
            is_correct = grade_short_answer(response.answer, question.id, db)
        else:
            is_correct = False  # Default for unsupported types
        
        response.is_correct = is_correct
        if is_correct:
            total_score += 1
        total_questions += 1
    
    # Calculate final score
    final_score = total_score / total_questions if total_questions > 0 else 0
    
    # Update attempt
    attempt.submitted_at = datetime.utcnow()
    attempt.score = final_score
    
    db.commit()
    
    # Update mastery using BKT
    quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
    if quiz:
        update_mastery(current_user.id, quiz.skill_id, final_score > 0.7, db)
    
    return {"message": "Attempt submitted", "score": final_score}
