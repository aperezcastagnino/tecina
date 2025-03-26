from src.services.gemini_service import GeminiService
from fastapi import APIRouter
from src.schemas.dialog import DialogContent
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()


@router.post("", response_model=DialogContent)
async def get_paraphrase(dialogData: DialogContent) -> DialogContent:
    PROMPT_TEMPLATE = (
        "Give me only, without presentation text, paraphases of the following "
        "sentences as an array separated by ';':"
    )

    DIALOG_TYPES = ["questStart", "questInProgress", "questFinished"]

    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(
                GeminiService.process_paraphrase,
                dialog_type,
                PROMPT_TEMPLATE,
                dialogData,
            )
            for dialog_type in DIALOG_TYPES
        ]

        try:
            for future in futures:
                future.result()
        except Exception as e:
            raise Exception(f"Error processing paraphrases: {str(e)}")

    return dialogData
