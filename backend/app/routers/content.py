from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.deps import get_db
from app.models.content import ContentItem
from app.schemas.content import ContentOut

router = APIRouter(prefix="/content", tags=["content"])

@router.get("", response_model=List[ContentOut])
def list_content(db: Session = Depends(get_db), q: str | None = None, type: str | None = None, min_diff: int | None = None, max_diff: int | None = None):
    query = db.query(ContentItem).filter(ContentItem.is_active == True)  # noqa: E712
    if q:
        like = f"%{q.lower()}%"
        query = query.filter((ContentItem.title.ilike(like)) | (ContentItem.slug.ilike(like)))
    if type:
        query = query.filter(ContentItem.content_type == type)
    if min_diff is not None:
        query = query.filter(ContentItem.difficulty >= min_diff)
    if max_diff is not None:
        query = query.filter(ContentItem.difficulty <= max_diff)
    return query.order_by(ContentItem.created_at.desc()).all()
