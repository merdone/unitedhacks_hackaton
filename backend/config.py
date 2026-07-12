from pydantic_settings import BaseSettings
from dotenv import dotenv_values
from pathlib import Path

path = Path(__file__).parent.parent.resolve() / ".env"

values = dotenv_values(path)

class Settings(BaseSettings):
    DATABASE_URL: str = values.get("DATABASE_URL")
    SECRET_KEY: str = values.get("SECRET_KEY")
    ALGORITHM: str = values.get("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(values.get("ACCESS_TOKEN_EXPIRE_MINUTES"))
    OPENAI_API_KEY: str = values.get("OPENAI_API_KEY")


settings = Settings()