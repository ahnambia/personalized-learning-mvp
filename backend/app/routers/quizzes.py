from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..core.deps import get_db
from ..models.quiz import Quiz, QuizQuestion, QuestionOption
from ..schemas.quiz import QuizOut

router = APIRouter()


@router.get("/", response_model=List[QuizOut])
def list_quizzes(
    skill_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(Quiz)
    
    if skill_id:
        query = query.filter(Quiz.skill_id == skill_id)
    
    quizzes = query.all()
    
    # Load questions and options for each quiz
    result = []
    for quiz in quizzes:
        questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz.id).order_by(QuizQuestion.order).all()
        quiz_dict = {
            "id": quiz.id,
            "title": quiz.title,
            "description": quiz.description,
            "skill_id": quiz.skill_id,
            "questions": []
        }
        
        for question in questions:
            options = db.query(QuestionOption).filter(QuestionOption.question_id == question.id).order_by(QuestionOption.order).all()
            question_dict = {
                "id": question.id,
                "question_type": question.question_type,
                "prompt": question.prompt,
                "starter_code": question.starter_code,
                "language": question.language,
                "order": question.order,
                "options": [{"id": opt.id, "text": opt.text, "order": opt.order} for opt in options]
            }
            quiz_dict["questions"].append(question_dict)
        
        result.append(quiz_dict)
    
    return result


@router.get("/{quiz_id}", response_model=QuizOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz.id).order_by(QuizQuestion.order).all()
    quiz_dict = {
        "id": quiz.id,
        "title": quiz.title,
        "description": quiz.description,
        "skill_id": quiz.skill_id,
        "questions": []
    }
    
    for question in questions:
        options = db.query(QuestionOption).filter(QuestionOption.question_id == question.id).order_by(QuestionOption.order).all()
        question_dict = {
            "id": question.id,
            "question_type": question.question_type,
            "prompt": question.prompt,
            "starter_code": question.starter_code,
            "language": question.language,
            "order": question.order,
            "options": [{"id": opt.id, "text": opt.text, "order": opt.order} for opt in options]
        }
        quiz_dict["questions"].append(question_dict)
    
    return quiz_dict
