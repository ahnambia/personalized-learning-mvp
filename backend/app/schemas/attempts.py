from pydantic import BaseModel
from typing import Optional


class AttemptStart(BaseModel):
    quiz_id: int


class ResponseSave(BaseModel):
    question_id: int
    answer: str


class AttemptSubmit(BaseModel):
    attempt_id: int


class AttemptOut(BaseModel):
    id: int
    quiz_id: int
    started_at: str
    submitted_at: Optional[str] = None
    score: Optional[float] = None

    class Config:
        from_attributes = True
