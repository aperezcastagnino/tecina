from fastapi import APIRouter

from src.schemas.gemini import ParaphraseResponse
from src.services.gemini import GeminiService

router = APIRouter()


@router.get("", response_model=ParaphraseResponse)
def get_items(
    prompt: str,
) -> ParaphraseResponse:
    result = GeminiService.get_paraphrase(prompt)  # Esto devuelve un str
    return ParaphraseResponse(initial_prompt=prompt, paraphrase=result)
