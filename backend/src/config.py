from enum import Enum

from pydantic_settings import BaseSettings


class LogLevel(str, Enum):
    critical = "CRITICAL"
    error = "ERROR"
    warning = "WARNING"
    info = "INFO"
    debug = "DEBUG"


class Settings(BaseSettings):
    log_level: LogLevel = LogLevel.debug
    server_url: str


settings = Settings()
