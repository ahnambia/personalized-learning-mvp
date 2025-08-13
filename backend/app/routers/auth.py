from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginIn, SignupIn, TokenOut
from app.core.deps import get_db

# Adjust these imports if your models live elsewhere
from app.models import User, Profile  # User: id, email, created_at, <hashed_password|password_hash>; Profile: user_id, <display_name|full_name|name>

router = APIRouter(prefix="/auth", tags=["auth"])


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _set_user_password_hash(user: User, pwd_hash: str) -> None:
    """
    Assign the password hash to whichever attribute exists on the User model.
    Supports either 'hashed_password' or 'password_hash'.
    """
    if hasattr(user, "hashed_password"):
        setattr(user, "hashed_password", pwd_hash)
        return
    if hasattr(user, "password_hash"):
        setattr(user, "password_hash", pwd_hash)
        return
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="User model is missing a password hash column ('hashed_password' or 'password_hash').",
    )


def _get_user_password_hash(user: User) -> Optional[str]:
    if hasattr(user, "hashed_password"):
        return getattr(user, "hashed_password")
    if hasattr(user, "password_hash"):
        return getattr(user, "password_hash")
    return None


def _create_profile_for_user(db: Session, user: User, display_name_in: Optional[str]) -> None:
    """
    Create a Profile row for the user, mapping display name to the first supported field.
    Accepts one of: display_name, full_name, name. No-op if Profile lacks those fields.
    """
    try:
        profile = Profile()  # avoid kwargs; set attrs defensively
    except Exception:
        # If Profile constructor needs args, fallback to kwargs with user_id only
        profile = Profile(user_id=getattr(user, "id"))

    # user_id mapping (required)
    if hasattr(profile, "user_id"):
        setattr(profile, "user_id", getattr(user, "id"))
    else:
        # If your schema uses a different FK name, add another branch here
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile model is missing expected 'user_id' column.",
        )

    # best-effort map for name-like attribute
    dn = (display_name_in or "").strip() or None
    for attr in ("display_name", "full_name", "name"):
        if hasattr(profile, attr):
            setattr(profile, attr, dn)
            break  # stop at the first supported name attribute

    db.add(profile)


@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupIn, db: Session = Depends(get_db)) -> TokenOut:
    email = _normalize_email(payload.email)

    # Reject duplicate email
    existing = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create user in one transaction; avoid ctor kwargs that may not exist in your model
    try:
        user = User()  # instantiate empty, then set known attributes
    except Exception:
        # If your declarative constructor requires args, fallback to a permissive path
        user = User  # type: ignore  # will still fail below if unusable
        try:
            user = User(email=email)  # try with just email
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"User model constructor mismatch: {e}",
            )

    # Assign email
    try:
        setattr(user, "email", email)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"User model missing 'email' column: {e}",
        )

    # Assign password hash (supports both hashed_password/password_hash)
    _set_user_password_hash(user, hash_password(payload.password))

    # Stage user insert
    db.add(user)
    db.flush()  # ensure user.id is available for Profile FK

    # Create profile (best-effort)
    _create_profile_for_user(db, user, payload.display_name)

    # Let get_db() commit; return JWT
    token = create_access_token(sub=str(getattr(user, "id")))
    return TokenOut(access_token=token)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> TokenOut:
    email = _normalize_email(payload.email)

    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    stored_hash = _get_user_password_hash(user)
    if not stored_hash or not verify_password(payload.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(sub=str(getattr(user, "id")))
    return TokenOut(access_token=token)
