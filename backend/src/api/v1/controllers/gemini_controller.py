from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter

from src.schemas.dialog import DialogContentInput, DialogContentParaphrased
from src.services.gemini_service import GeminiService

router = APIRouter(tags=["Gemini"])


@router.post("", response_model=DialogContentParaphrased)
async def get_paraphrase(dialogData: DialogContentInput):
    PROMPT_TEMPLATE = (
        "Give me only, without presentation text, paraphrases of the following "
        "sentences as an array separated by ';':"
    )

    DIALOG_TYPES = [
        "questStart",
        "questInProgress",
        "questFinished",
        "hints",
        "questWrongItem",
    ]
    generated_results = {}

    with ThreadPoolExecutor() as executor:
        futures = {}
        for dialog_type in DIALOG_TYPES:
            original_texts = getattr(dialogData, dialog_type, [])
            futures[dialog_type] = executor.submit(
                GeminiService.process_paraphrase, original_texts, PROMPT_TEMPLATE
            )

        try:
            for dialog_type, future in futures.items():
                generated_key = f"{dialog_type}IAGenerated"
                generated_results[generated_key] = future.result()
        except Exception as e:
            raise Exception(f"Error processing paraphrases: {str(e)}")

    response_data = {
        **{k: getattr(dialogData, k, []) for k in DIALOG_TYPES},
        **generated_results,
    }

    return DialogContentParaphrased(**response_data)
