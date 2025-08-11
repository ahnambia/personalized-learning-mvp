from pydantic import BaseModel

class SkillOut(BaseModel):
    id: str
    slug: str
    name: str
    domain: str
    class Config:
        from_attributes = True
