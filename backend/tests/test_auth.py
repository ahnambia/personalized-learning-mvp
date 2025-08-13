import uuid
import time
from datetime import datetime, timedelta, timezone

import jwt  # PyJWT
from fastapi.testclient import TestClient

from app.main import app
from app.core import security  # reuse server's secret/alg and helpers

client = TestClient(app)


def _unique_email() -> str:
    return f"test_{uuid.uuid4().hex}@example.com"


def _signup(email: str, password: str = "testpass123", display_name: str = "Alice"):
    return client.post(
        "/auth/signup",
        json={"email": email, "password": password, "display_name": display_name},
    )


def _login(email: str, password: str = "testpass123"):
    return client.post("/auth/login", json={"email": email, "password": password})


def _me(token: str):
    return client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})


# ------------------------
# Baseline happy-path tests
# ------------------------

def test_signup_success_returns_token():
    email = _unique_email()
    r = _signup(email)
    assert r.status_code == 201, r.text
    data = r.json()
    assert "access_token" in data
    assert data.get("token_type") == "bearer"


def test_signup_duplicate_email_conflict():
    email = _unique_email()
    r1 = _signup(email)
    assert r1.status_code == 201, r1.text

    r2 = _signup(email)
    assert r2.status_code == 409, r2.text
    body = r2.json()
    assert body.get("detail") == "Email already registered"


def test_login_success_and_me_roundtrip():
    email = _unique_email()
    password = "Sup3rSecr3t!"
    display_name = "Alice"

    rs = _signup(email, password=password, display_name=display_name)
    assert rs.status_code == 201, rs.text

    rl = _login(email, password=password)
    assert rl.status_code == 200, rl.text
    token = rl.json()["access_token"]

    rm = _me(token)
    assert rm.status_code == 200, rm.text
    me = rm.json()
    assert me["email"] == email
    assert "display_name" in me
    assert me["display_name"] == display_name or me["display_name"] is None
    assert "id" in me
    assert "created_at" in me


def test_login_bad_password_unauthorized():
    email = _unique_email()
    _ = _signup(email, password="right-password")
    bad = _login(email, password="wrong-password")
    assert bad.status_code == 401, bad.text
    assert bad.json().get("detail") == "Invalid email or password"


def test_me_unauthorized_without_token():
    r = client.get("/auth/me")
    assert r.status_code == 401, r.text
    assert "WWW-Authenticate" in r.headers


# ------------------------
# Stricter JWT validation
# ------------------------

def test_token_structure_and_claims_are_valid():
    email = _unique_email()
    password = "p@ssword123"
    # Create account (also returns a token)
    rs = _signup(email, password=password, display_name="Alice")
    assert rs.status_code == 201, rs.text
    token = rs.json()["access_token"]

    # Header checks (unverified)
    header = jwt.get_unverified_header(token)
    assert header.get("alg") == security.JWT_ALGO

    # Decode with server's secret/alg to validate signature and claims
    payload = security.decode_token(token)
    assert payload.get("type") == "access"
    assert "sub" in payload and isinstance(payload["sub"], str)
    assert "iat" in payload and isinstance(payload["iat"], int)
    assert "exp" in payload and isinstance(payload["exp"], int)

    # /auth/me must match token sub
    rm = _me(token)
    assert rm.status_code == 200, rm.text
    me = rm.json()
    assert me["id"] == payload["sub"]

    # Expiry within configured window (+/- small margin)
    now = int(datetime.now(timezone.utc).timestamp())
    exp = payload["exp"]
    assert exp > now  # not expired
    # upper bound: default minutes + 90s wiggle for test timing
    max_delta = security.DEFAULT_ACCESS_MINUTES * 60 + 90
    assert (exp - now) <= max_delta


def test_tampered_token_is_rejected():
    email = _unique_email()
    _ = _signup(email)

    rl = _login(email)
    token = rl.json()["access_token"]
    # Tamper with token by flipping the last character safely
    tampered = token[:-1] + ("A" if token[-1] != "A" else "B")

    rm = _me(tampered)
    assert rm.status_code == 401, rm.text
    assert rm.json().get("detail") in {"Could not validate credentials", "Not authenticated", "Invalid authorization header"}


def test_wrong_secret_token_is_rejected():
    email = _unique_email()
    _ = _signup(email)
    rl = _login(email)
    assert rl.status_code == 200
    # Build a token with a different secret
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "fake-id",
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=5)).timestamp()),
        "type": "access",
    }
    bad_token = jwt.encode(payload, "not_the_server_secret", algorithm=security.JWT_ALGO)
    rm = _me(bad_token)
    assert rm.status_code == 401, rm.text


def test_missing_sub_claim_is_rejected():
    # Create a token without 'sub' using the real secret so signature is valid
    now = datetime.now(timezone.utc)
    payload = {
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=5)).timestamp()),
        "type": "access",
    }
    token = jwt.encode(payload, security.JWT_SECRET, algorithm=security.JWT_ALGO)
    rm = _me(token)
    assert rm.status_code == 401, rm.text


def test_expired_token_is_rejected():
    # Create an already-expired token (valid signature)
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "someone",
        "iat": int((now - timedelta(minutes=10)).timestamp()),
        "exp": int((now - timedelta(minutes=5)).timestamp()),
        "type": "access",
    }
    expired = jwt.encode(payload, security.JWT_SECRET, algorithm=security.JWT_ALGO)
    rm = _me(expired)
    assert rm.status_code == 401, rm.text
