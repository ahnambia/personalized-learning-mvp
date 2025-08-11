import datetime as dt
from typing import Optional
import jwt
from passlib.hash import argon2

from app.core.config import settings

def hash_password(raw: str) -> str:
    return argon2.hash(raw)

def verify_password(raw: str, hashed: str) -> bool:
    return argon2.verify(raw, hashed)

def create_access_token(sub: str) -> str:
    now = dt.datetime.utcnow()
    exp = now + dt.timedelta(minutes=settings.ACCESS_TOKEN_MINUTES)
    payload = {"sub": sub, "type": "access", "iat": int(now.timestamp()), "exp": int(exp.timestamp())}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)

def create_refresh_token(sub: str) -> str:
    now = dt.datetime.utcnow()
    exp = now + dt.timedelta(days=settings.REFRESH_TOKEN_DAYS)
    payload = {"sub": sub, "type": "refresh", "iat": int(now.timestamp()), "exp": int(exp.timestamp())}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGO)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGO])
    except jwt.PyJWTError:
        return None
