from logging.config import dictConfig

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.logging import LogConfig
from src.main_router import router

dictConfig(LogConfig().model_dump())

app = FastAPI()

app.include_router(router)

origins = [
    '*'
    # settings.server_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
