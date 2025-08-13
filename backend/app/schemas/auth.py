from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class SignupIn(BaseModel):
    email: EmailStr = Field(..., description="User email (will be lowercased/trimmed)")
    password: str = Field(..., min_length=8, description="User password")
    display_name: str | None = Field(None, description="Optional display name")


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
