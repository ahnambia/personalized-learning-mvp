from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, users

# If your project already exposes a settings object with cors_list, import it.
# It should include http://localhost:5176 (you mentioned it's already updated).
try:
    from app.core.config import settings  # expects: settings.cors_list: list[str]
    CORS_LIST = getattr(settings, "cors_list", ["http://localhost:5176"])
except Exception:
    # Fallback to allow 5176 explicitly if settings aren't available
    CORS_LIST = ["http://localhost:5176"]

app = FastAPI(title="API", version="1.0.0")

# CORS: allow the new frontend dev server on 5176 (and anything in settings)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(users.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok"}
