from __future__ import annotations
from typing import Optional
import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class Profile(Base):
    __tablename__ = "profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    display_name: Mapped[Optional[str]] = mapped_column(String(120), default=None)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), default=None)
    timezone: Mapped[Optional[str]] = mapped_column(String(64), default=None)

    user: Mapped["app.models.user.User"] = relationship(back_populates="profile")
