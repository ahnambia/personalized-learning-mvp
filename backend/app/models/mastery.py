from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.base import Base


class Mastery(Base):
    __tablename__ = "mastery"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    p_know = Column(Float, nullable=False, default=0.1)  # Probability of knowing the skill
    exposures = Column(Integer, nullable=False, default=0)  # Number of exposures
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="mastery")
    skill = relationship("Skill", back_populates="mastery")
