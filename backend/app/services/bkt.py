"""
Bayesian Knowledge Tracing (BKT) implementation for skill mastery tracking.
"""
from sqlalchemy.orm import Session
from datetime import datetime

from ..models.mastery import Mastery


def update_mastery(user_id: int, skill_id: int, correct: bool, db: Session):
    """
    Update user's mastery probability for a skill using Bayesian Knowledge Tracing.
    
    Args:
        user_id: User ID
        skill_id: Skill ID
        correct: Whether the user answered correctly
        db: Database session
    """
    # BKT parameters (these could be skill-specific in a more advanced system)
    p_learn = 0.1  # Probability of learning from one exposure
    p_slip = 0.1   # Probability of slip (knowing but getting wrong)
    p_guess = 0.25 # Probability of guess (not knowing but getting right)
    
    # Get or create mastery record
    mastery = db.query(Mastery).filter(
        Mastery.user_id == user_id,
        Mastery.skill_id == skill_id
    ).first()
    
    if not mastery:
        mastery = Mastery(
            user_id=user_id,
            skill_id=skill_id,
            p_know=0.1,  # Initial probability
            exposures=0
        )
        db.add(mastery)
    
    # Current probability of knowing
    p_know_prior = mastery.p_know
    
    # Update based on observation (correct/incorrect)
    if correct:
        # P(know | correct) = P(correct | know) * P(know) / P(correct)
        p_correct_given_know = 1 - p_slip
        p_correct_given_not_know = p_guess
        p_correct = p_correct_given_know * p_know_prior + p_correct_given_not_know * (1 - p_know_prior)
        
        p_know_posterior = (p_correct_given_know * p_know_prior) / p_correct
    else:
        # P(know | incorrect) = P(incorrect | know) * P(know) / P(incorrect)
        p_incorrect_given_know = p_slip
        p_incorrect_given_not_know = 1 - p_guess
        p_incorrect = p_incorrect_given_know * p_know_prior + p_incorrect_given_not_know * (1 - p_know_prior)
        
        p_know_posterior = (p_incorrect_given_know * p_know_prior) / p_incorrect
    
    # Apply learning opportunity
    # P(know_after_learning) = P(know_before) + (1 - P(know_before)) * P(learn)
    p_know_final = p_know_posterior + (1 - p_know_posterior) * p_learn
    
    # Update mastery record
    mastery.p_know = min(max(p_know_final, 0.01), 0.99)  # Keep within bounds
    mastery.exposures += 1
    mastery.updated_at = datetime.utcnow()
    
    db.commit()
