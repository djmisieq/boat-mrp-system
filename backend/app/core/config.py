from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl


class Settings(BaseSettings):
    """
    Ustawienia aplikacji, które mogą być nadpisane przez zmienne środowiskowe
    """
    PROJECT_NAME: str = "MRP System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "b6d01c8de68f9c85e5bc2e0554c3e0f9db3e42651a1a8e5e"  # W produkcji użyj silnego klucza
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 dni

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # Baza danych
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/mrp_db"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
