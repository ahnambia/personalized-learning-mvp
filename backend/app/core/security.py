from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt  # PyJWT
from passlib.hash import argon2


# --- Environment / Defaults ---
JWT_SECRET: str = os.getenv("JWT_SECRET", "dev_super_secret_change_me")
JWT_ALGO: str = os.getenv("JWT_ALGO", "HS256")
DEFAULT_ACCESS_MINUTES: int = int(os.getenv("ACCESS_TOKEN_MINUTES", "15"))


# --- Password hashing (Argon2 via passlib) ---
def hash_password(plain_password: str) -> str:
    """
    Hash a plaintext password using Argon2.

    Argon2 parameters are controlled by passlib defaults or env vars if configured
    inside the image. The returned string includes the salt and parameters.
    """
    return argon2.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """
    Constant-time verification of a plaintext password against an Argon2 hash.
    Returns True on success, False otherwise.
    """
    try:
        return argon2.verify(plain_password, password_hash)
    except Exception:
        # Covers malformed hashes or internal errors; never leak details.
        return False


# --- JWT helpers ---
def create_access_token(
    sub: str,
    expires_minutes: Optional[int] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Create a signed JWT access token.
    - sub: subject (user id as UUID string)
    - expires_minutes: custom expiry minutes; falls back to env/default
    """
    now = datetime.now(timezone.utc)
    exp_minutes = expires_minutes if expires_minutes is not None else DEFAULT_ACCESS_MINUTES
    exp = now + timedelta(minutes=exp_minutes)

    payload: Dict[str, Any] = {
        "sub": sub,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "type": "access",
    }
    if extra_claims:
        payload.update(extra_claims)

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)
    # PyJWT returns str for modern versions.
    return token


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode & validate a JWT. Returns the payload dict on success.
    Raises jwt.PyJWTError subclasses on failure (caller should handle uniformly).
    """
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    # Minimal sanity check
    if "sub" not in payload:
        raise jwt.InvalidTokenError("Missing 'sub' claim")
    return payload
