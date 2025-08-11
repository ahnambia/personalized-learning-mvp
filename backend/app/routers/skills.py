from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..core.deps import get_db
from ..models.skill import Skill
from ..schemas.skill import Skill as SkillSchema, SkillCreate, SkillUpdate

router = APIRouter()


@router.get("/", response_model=List[SkillSchema])
def list_skills(
    domain: Optional[str] = Query(None, description="Filter by domain/category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Skill)
    
    if domain:
        query = query.filter(Skill.category == domain)
    
    skills = query.offset(skip).limit(limit).all()
    return skills


@router.get("/{skill_id}", response_model=SkillSchema)
def get_skill(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    return skill


@router.post("/", response_model=SkillSchema)
def create_skill(
    skill_data: SkillCreate,
    db: Session = Depends(get_db)
):
    # Check if skill name already exists
    if db.query(Skill).filter(Skill.name == skill_data.name).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill with this name already exists"
        )
    
    skill = Skill(**skill_data.dict())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
