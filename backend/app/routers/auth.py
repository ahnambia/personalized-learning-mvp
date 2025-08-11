from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse
from app.models.user import User
from app.models.profile import Profile
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

REFRESH_COOKIE_NAME = "refresh_token"

def set_refresh_cookie(resp: Response, token: str):
    resp.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=(settings.ENV != "dev"),
        samesite="lax",
        max_age=60 * 60 * 24 * settings.REFRESH_TOKEN_DAYS,
        path="/",
    )

@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignupRequest, response: Response, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password))
    profile = Profile(user=user, display_name=payload.display_name)
    db.add_all([user, profile])
    db.commit()
    db.refresh(user)
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    set_refresh_cookie(response, refresh)
    return AuthResponse(access_token=access, user_id=str(user.id))

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    set_refresh_cookie(response, refresh)
    return AuthResponse(access_token=access, user_id=str(user.id))

@router.post("/refresh", response_model=AuthResponse)
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE_NAME)
    data = decode_token(token) if token else None
    if not data or data.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user_id = data["sub"]
    if not db.get(User, user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    access = create_access_token(user_id)
    new_refresh = create_refresh_token(user_id)
    set_refresh_cookie(response, new_refresh)
    return AuthResponse(access_token=access, user_id=user_id)

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/")
    return {"ok": True}
