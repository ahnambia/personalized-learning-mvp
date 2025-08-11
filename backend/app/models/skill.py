from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    difficulty = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    content_items = relationship("ContentItem", back_populates="skill")
    quizzes = relationship("Quiz", back_populates="skill")
    mastery = relationship("Mastery", back_populates="skill")
    
    # Prerequisites relationships
    prerequisites = relationship(
        "Skill",
        secondary="skill_prerequisites",
        primaryjoin="Skill.id == SkillPrerequisite.skill_id",
        secondaryjoin="Skill.id == SkillPrerequisite.prerequisite_id",
        back_populates="dependent_skills"
    )
    dependent_skills = relationship(
        "Skill",
        secondary="skill_prerequisites", 
        primaryjoin="Skill.id == SkillPrerequisite.prerequisite_id",
        secondaryjoin="Skill.id == SkillPrerequisite.skill_id",
        back_populates="prerequisites"
    )
