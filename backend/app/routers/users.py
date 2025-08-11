from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.schemas.user import UserMe

router = APIRouter(prefix="", tags=["users"])

@router.get("/me", response_model=UserMe)
def me(current = Depends(get_current_user), db: Session = Depends(get_db)):
    prof = current.profile
    return UserMe(id=str(current.id), email=current.email, display_name=prof.display_name if prof else None)
