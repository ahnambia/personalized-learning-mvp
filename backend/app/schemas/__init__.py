# Import all schemas here for easy access
from .auth import Token, UserLogin, UserRegister
from .user import User, UserCreate, UserUpdate, Profile, ProfileCreate, ProfileUpdate
from .skill import Skill, SkillCreate, SkillUpdate
from .content import ContentItem, ContentItemCreate, ContentItemUpdate
from .quiz import QuizOut, QuestionOut, OptionOut
from .attempts import AttemptStart, ResponseSave, AttemptSubmit
from .mastery import MasteryOut

__all__ = [
    "Token",
    "UserLogin", 
    "UserRegister",
    "User",
    "UserCreate",
    "UserUpdate", 
    "Profile",
    "ProfileCreate",
    "ProfileUpdate",
    "Skill",
    "SkillCreate",
    "SkillUpdate",
    "ContentItem",
    "ContentItemCreate", 
    "ContentItemUpdate",
    "QuizOut",
    "QuestionOut",
    "OptionOut",
    "AttemptStart",
    "ResponseSave",
    "AttemptSubmit",
    "MasteryOut"
]
