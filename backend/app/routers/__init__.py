# Import all routers here for easy access
from .auth import router as auth_router
from .users import router as users_router
from .skills import router as skills_router
from .content import router as content_router
from .quizzes import router as quizzes_router
from .attempts import router as attempts_router
from .mastery import router as mastery_router
from .health import router as health_router

__all__ = [
    "auth_router",
    "users_router", 
    "skills_router",
    "content_router",
    "quizzes_router",
    "attempts_router",
    "mastery_router",
    "health_router"
]
