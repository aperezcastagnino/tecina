from fastapi import APIRouter

from src.api.v1.controllers import gemini_controller

v1_router = APIRouter()
v1_router.include_router(gemini_controller.router, prefix="/gemini")
