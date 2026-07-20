from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    DEBUG: bool = False
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    AT_USERNAME: str = ""
    AT_API_KEY: str = ""

    model_config = {"env_file": ".env"}


settings = Settings()
