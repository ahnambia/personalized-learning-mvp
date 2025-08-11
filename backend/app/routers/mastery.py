from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..core.deps import get_db, get_current_active_user
from ..models.user import User
from ..models.mastery import Mastery
from ..schemas.mastery import MasteryOut

router = APIRouter()


@router.get("/", response_model=List[MasteryOut])
def get_user_mastery(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    mastery_records = db.query(Mastery).filter(Mastery.user_id == current_user.id).all()
    return mastery_records
