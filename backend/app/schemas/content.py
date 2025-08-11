from pydantic import BaseModel

class ContentOut(BaseModel):
    id: str
    slug: str
    title: str
    content_type: str
    difficulty: int
    url: str | None = None
    est_minutes: int | None = None
    class Config:
        from_attributes = True
