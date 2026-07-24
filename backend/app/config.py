import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "V.Live Backend Engine"
    
    # Environment & API Keys
    GEMINI_API_KEY: Optional[str] = None
    LIVEKIT_URL: Optional[str] = "wss://livekit.example.com"
    LIVEKIT_API_KEY: Optional[str] = None
    LIVEKIT_API_SECRET: Optional[str] = None
    REDIS_URL: Optional[str] = None
    POSTGRES_URL: Optional[str] = None
    DATABASE_URL: Optional[str] = "sqlite:///./vlive_app.db"
    S3_BUCKET: Optional[str] = None
    SENTRY_DSN: Optional[str] = None
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    JWT_SECRET_KEY: Optional[str] = "vlive_secret_jwt_key_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200
    ADMIN_API_KEY: Optional[str] = "admin_secret_key_vlive"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
