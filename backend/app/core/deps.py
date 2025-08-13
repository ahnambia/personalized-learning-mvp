from __future__ import annotations

import os
from typing import Generator, Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

from app.core.security import decode_token
# Adjust these imports to match your project's models location if needed
from app.models import User  # expects a SQLAlchemy 2.x declarative model with fields: id, email, hashed_password


# --- Database Session Provider ---
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set in the environment.")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=Session,
)


def get_db() -> Generator[Session, None, None]:
    """
    Yields a SQLAlchemy session and ensures proper close/rollback behavior.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# --- Auth Dependencies ---
WWW_AUTH_VALUE = 'Bearer realm="auth"'


def _extract_bearer_token(authorization: Optional[str]) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": WWW_AUTH_VALUE},
        )
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": WWW_AUTH_VALUE},
        )
    return parts[1]


def get_current_user(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None, alias="Authorization"),
) -> User:
    """
    Extracts and validates the Bearer token, loads the current user.
    Returns a User or raises 401 consistently for any auth failure.
    """
    token = _extract_bearer_token(authorization)

    # Decode & validate JWT
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": WWW_AUTH_VALUE},
        )

    user_id = str(payload.get("sub", "")).strip()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": WWW_AUTH_VALUE},
        )

    # Load user
    stmt = select(User).where(User.id == user_id)
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": WWW_AUTH_VALUE},
        )

    return user
