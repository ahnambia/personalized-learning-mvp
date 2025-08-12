from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Text, DateTime, func
import uuid
from app.db.base import Base

class Skill(Base):
    __tablename__ = "skills"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(128))
    domain: Mapped[str] = mapped_column(String(64), default="dsa")
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped = mapped_column(DateTime(timezone=True), server_default=func.now())
