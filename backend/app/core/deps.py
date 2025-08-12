from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import create_access_token  # placeholder import for later

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
