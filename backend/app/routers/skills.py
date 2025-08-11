from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.deps import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillOut

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("", response_model=List[SkillOut])
def list_skills(db: Session = Depends(get_db), domain: str | None = None):
    q = db.query(Skill)
    if domain:
        q = q.filter(Skill.domain == domain)
    return q.order_by(Skill.name.asc()).all()
