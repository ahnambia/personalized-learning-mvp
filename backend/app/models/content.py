from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Integer, Boolean, DateTime, Text, func
import uuid
from app.db.base import Base

class ContentItem(Base):
    __tablename__ = "content_items"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(256))
    content_type: Mapped[str] = mapped_column(String(32))   # video/article/challenge
    difficulty: Mapped[int] = mapped_column(Integer, default=3)
    url: Mapped[str | None] = mapped_column(String(1024))
    est_minutes: Mapped[int | None] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())
