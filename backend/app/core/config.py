from pydantic_settings import BaseSettings
from pydantic import AnyUrl, field_validator
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: AnyUrl
    JWT_SECRET: str
    JWT_ALGO: str = "HS256"
    ACCESS_TOKEN_MINUTES: int = 15
    REFRESH_TOKEN_DAYS: int = 7
    CORS_ORIGINS: str = "http://localhost:5173"
    ENV: str = "dev"

    @property
    def cors_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
