from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[int] = None


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    name: Optional[str] = None


class Skill(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SkillWithContent(Skill):
    content_count: int = 0
