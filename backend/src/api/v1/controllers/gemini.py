from fastapi import APIRouter

from src.schemas.gemini import ParaphraseResponse, PromptRequest
from src.services.gemini import GeminiController

router = APIRouter()


@router.get("", response_model=PromptRequest)
def get_items(
    prompt: str,
) -> ParaphraseResponse:
    return GeminiController.get_paraphrase(prompt)
