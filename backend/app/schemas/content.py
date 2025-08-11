from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class ContentItemBase(BaseModel):
    title: str
    type: str  # article, video, exercise, etc.
    data: Optional[Dict[str, Any]] = None
    skill_id: int
    duration_minutes: Optional[int] = None


class ContentItemCreate(ContentItemBase):
    pass


class ContentItemUpdate(ContentItemBase):
    title: Optional[str] = None
    type: Optional[str] = None
    skill_id: Optional[int] = None


class ContentItem(ContentItemBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
