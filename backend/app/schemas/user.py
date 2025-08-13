from __future__ import annotations

from datetime import datetime
from typing import Any
from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: str
    email: EmailStr
    display_name: str | None = None
    created_at: datetime

    model_config: Any = {
        "from_attributes": True  # Pydantic v2: allow reading from ORM objects
    }
