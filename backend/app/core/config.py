from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/app/core/config.py -> sube 3 niveles para llegar a backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    cors_origins: list[str] = ["http://localhost:3000"]
    chroma_path: str = str(BASE_DIR / "chroma_db")
    embedding_model: str = "paraphrase-multilingual-MiniLM-L12-v2"


@lru_cache
def get_settings() -> Settings:
    return Settings()
