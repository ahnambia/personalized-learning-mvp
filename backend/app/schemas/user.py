from pydantic import BaseModel, EmailStr

class UserMe(BaseModel):
    id: str
    email: EmailStr
    display_name: str | None = None
