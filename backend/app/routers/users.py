from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.schemas.user import UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserOut)
def read_me(current_user = Depends(get_current_user)) -> UserOut:
    """
    Return the current authenticated user's public profile.
    """
    # Shape to UserOut; display_name expected from related profile if your ORM populates it
    # If display_name lives only in Profile, ensure your ORM relationship populates it
    # or extend the query in get_current_user to join Profile as needed.
    display_name = getattr(getattr(current_user, "profile", None), "display_name", None)
    # If your User model already has display_name column, the above will still fall back cleanly.
    return UserOut(
        id=str(current_user.id),
        email=current_user.email,
        display_name=display_name if display_name is not None else getattr(current_user, "display_name", None),
        created_at=current_user.created_at,
    )
