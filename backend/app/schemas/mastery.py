from pydantic import BaseModel


class MasteryOut(BaseModel):
    skill_id: int
    p_know: float
    exposures: int

    class Config:
        from_attributes = True
