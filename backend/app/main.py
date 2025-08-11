from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routers import (
    auth_router,
    users_router,
    skills_router,
    content_router,
    quizzes_router,
    attempts_router,
    mastery_router,
    health_router
)

app = FastAPI(
    title="Personalized Learning API",
    description="Backend API for personalized learning platform",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, tags=["health"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(skills_router, prefix="/skills", tags=["skills"])
app.include_router(content_router, prefix="/content", tags=["content"])
app.include_router(quizzes_router, prefix="/quizzes", tags=["quizzes"])
app.include_router(attempts_router, prefix="/attempts", tags=["attempts"])
app.include_router(mastery_router, prefix="/mastery", tags=["mastery"])


@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup."""
    # You could add database initialization or seed data loading here
    pass
