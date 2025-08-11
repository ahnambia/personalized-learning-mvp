from sqlalchemy import Column, Integer, Float, ForeignKey
from ..db.base import Base


class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"

    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    prerequisite_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
    weight = Column(Float, nullable=False, default=1.0)  # Importance weight of prerequisite
