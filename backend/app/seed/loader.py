"""
Seed data loader for populating the database with initial skills, prerequisites, and quizzes.
"""
import json
import os
from sqlalchemy.orm import Session

from ..models.skill import Skill
from ..models.prereq import SkillPrerequisite
from ..models.quiz import Quiz, QuizQuestion, QuestionOption
from ..db.session import SessionLocal


def load_seed_data(db: Session):
    """Load all seed data into the database."""
    current_dir = os.path.dirname(__file__)
    
    # Load skills
    skills_file = os.path.join(current_dir, "skills.json")
    if os.path.exists(skills_file):
        load_skills(db, skills_file)
    
    # Load prerequisites
    prereqs_file = os.path.join(current_dir, "prereqs.json")
    if os.path.exists(prereqs_file):
        load_prerequisites(db, prereqs_file)
    
    # Load quizzes
    quizzes_file = os.path.join(current_dir, "quizzes.json")
    if os.path.exists(quizzes_file):
        load_quizzes(db, quizzes_file)


def load_skills(db: Session, file_path: str):
    """Load skills from JSON file."""
    with open(file_path, 'r') as f:
        skills_data = json.load(f)
    
    for skill_data in skills_data:
        # Check if skill already exists
        existing = db.query(Skill).filter(Skill.name == skill_data["name"]).first()
        if not existing:
            skill = Skill(
                name=skill_data["name"],
                description=skill_data.get("description"),
                category=skill_data.get("category"),
                difficulty=skill_data.get("difficulty")
            )
            db.add(skill)
    
    db.commit()


def load_prerequisites(db: Session, file_path: str):
    """Load skill prerequisites from JSON file."""
    with open(file_path, 'r') as f:
        prereqs_data = json.load(f)
    
    for prereq_data in prereqs_data:
        skill = db.query(Skill).filter(Skill.name == prereq_data["skill"]).first()
        prerequisite = db.query(Skill).filter(Skill.name == prereq_data["prerequisite"]).first()
        
        if skill and prerequisite:
            # Check if prerequisite relationship already exists
            existing = db.query(SkillPrerequisite).filter(
                SkillPrerequisite.skill_id == skill.id,
                SkillPrerequisite.prerequisite_id == prerequisite.id
            ).first()
            
            if not existing:
                prereq = SkillPrerequisite(
                    skill_id=skill.id,
                    prerequisite_id=prerequisite.id,
                    weight=prereq_data.get("weight", 1.0)
                )
                db.add(prereq)
    
    db.commit()


def load_quizzes(db: Session, file_path: str):
    """Load quizzes from JSON file."""
    with open(file_path, 'r') as f:
        quizzes_data = json.load(f)
    
    for quiz_data in quizzes_data:
        skill = db.query(Skill).filter(Skill.name == quiz_data["skill"]).first()
        if not skill:
            continue
        
        # Check if quiz already exists
        existing = db.query(Quiz).filter(
            Quiz.title == quiz_data["title"],
            Quiz.skill_id == skill.id
        ).first()
        
        if existing:
            continue
        
        # Create quiz
        quiz = Quiz(
            title=quiz_data["title"],
            description=quiz_data.get("description"),
            skill_id=skill.id
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        
        # Create questions
        for i, question_data in enumerate(quiz_data["questions"]):
            question = QuizQuestion(
                quiz_id=quiz.id,
                question_type=question_data["type"],
                prompt=question_data["prompt"],
                starter_code=question_data.get("starter_code"),
                language=question_data.get("language"),
                order=i + 1
            )
            db.add(question)
            db.commit()
            db.refresh(question)
            
            # Create options for MCQ questions
            if question_data["type"] == "mcq" and "options" in question_data:
                for j, option_data in enumerate(question_data["options"]):
                    option = QuestionOption(
                        question_id=question.id,
                        text=option_data["text"],
                        is_correct=option_data["is_correct"],
                        order=j + 1
                    )
                    db.add(option)
        
        db.commit()


if __name__ == "__main__":
    # Create database session
    db = SessionLocal()
    try:
        print("Loading seed data...")
        load_seed_data(db)
        print("Seed data loaded successfully!")
    except Exception as e:
        print(f"Error loading seed data: {e}")
        db.rollback()
    finally:
        db.close()
