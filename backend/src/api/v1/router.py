from fastapi import APIRouter

from src.api.v1.controllers import gemini

v1_router = APIRouter()
v1_router.include_router(gemini.router, prefix="/gemini")
