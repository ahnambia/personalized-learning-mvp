# Import all models here for Alembic metadata
from .user import User
from .profile import Profile
from .skill import Skill
from .content import ContentItem
from .quiz import Quiz, QuizQuestion, QuestionOption
from .attempts import Attempt, Response
from .mastery import Mastery
from .prereq import SkillPrerequisite
from .event import Event

# Import the Base class
from ..db.base import Base

# Make Base available for Alembic
__all__ = ["Base"]
