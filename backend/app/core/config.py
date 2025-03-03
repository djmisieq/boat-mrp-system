from typing import List, Optional, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
import os


class Settings(BaseSettings):
    """
    Ustawienia aplikacji, które mogą być nadpisane przez zmienne środowiskowe
    """
    PROJECT_NAME: str = "MRP System"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "b6d01c8de68f9c85e5bc2e0554c3e0f9db3e42651a1a8e5e"  # W produkcji użyj silnego klucza
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 dni

    # CORS
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = ["http://localhost:3000", "http://localhost:8000"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Baza danych
    # Używaj SQLite w środowisku Codespaces, jeśli nie ma dostępu do PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./mrp_db.sqlite" if os.environ.get("CODESPACES") else "postgresql://postgres:postgres@localhost:5432/mrp_db"
    )

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
