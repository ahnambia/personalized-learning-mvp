from pydantic import BaseModel
from typing import List, Optional


class OptionOut(BaseModel):
    id: int
    text: str
    order: int

    class Config:
        from_attributes = True


class QuestionOut(BaseModel):
    id: int
    question_type: str
    prompt: str
    starter_code: Optional[str] = None
    language: Optional[str] = None
    order: int
    options: List[OptionOut] = []

    class Config:
        from_attributes = True


class QuizOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    skill_id: int
    questions: List[QuestionOut] = []

    class Config:
        from_attributes = True
