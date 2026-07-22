# pyrefly: ignore [missing-import]
import json
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: Union[str, List[str]] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            try:
                return json.loads(self.CORS_ORIGINS)
            except json.JSONDecodeError:
                return [self.CORS_ORIGINS]
        return self.CORS_ORIGINS

    @property
    def allow_credentials(self) -> bool:
        # El estandar CORS prohibe combinar credenciales con el origen comodin "*".
        # Si se usa "*", desactivamos las credenciales para evitar un middleware invalido.
        return "*" not in self.get_cors_origins


settings = Settings()
