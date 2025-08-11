from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..core.deps import get_db
from ..models.content import ContentItem
from ..schemas.content import ContentItem as ContentItemSchema, ContentItemCreate

router = APIRouter()


@router.get("/", response_model=List[ContentItemSchema])
def list_content(
    q: Optional[str] = Query(None, description="Search query"),
    type: Optional[str] = Query(None, description="Content type filter"),
    skill_id: Optional[int] = Query(None, description="Filter by skill ID"),
    min_diff: Optional[int] = Query(None, ge=1, le=5, description="Minimum difficulty"),
    max_diff: Optional[int] = Query(None, ge=1, le=5, description="Maximum difficulty"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(ContentItem)
    
    if q:
        query = query.filter(ContentItem.title.ilike(f"%{q}%"))
    
    if type:
        query = query.filter(ContentItem.type == type)
    
    if skill_id:
        query = query.filter(ContentItem.skill_id == skill_id)
    
    # Note: difficulty filtering would require joining with skills table
    # For now, we'll skip this filter
    
    content_items = query.offset(skip).limit(limit).all()
    return content_items


@router.get("/{content_id}", response_model=ContentItemSchema)
def get_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(ContentItem).filter(ContentItem.id == content_id).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Content not found"
        )
    return content


@router.post("/", response_model=ContentItemSchema)
def create_content(
    content_data: ContentItemCreate,
    db: Session = Depends(get_db)
):
    content = ContentItem(**content_data.dict())
    db.add(content)
    db.commit()
    db.refresh(content)
    return content
