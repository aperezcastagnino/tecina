from concurrent.futures import ThreadPoolExecutor

from fastapi import APIRouter

from src.schemas.dialog import DialogContentInput, DialogContentParaphrased
from src.services.gemini_service import GeminiService

router = APIRouter(tags=["Gemini"])


@router.post("", response_model=DialogContentParaphrased)
async def get_paraphrase(dialogData: DialogContentInput):
    PROMPT_TEMPLATE = """
            For each of the sentences I will list below, separated by semicolon, 
            give me a paraphrase of each one. The result must have the same format.
            Make sure to keep the same language as the original sentences.
            Do not return empty strings. The sentences are:
    """

    DIALOG_TYPES = [
        "questStart",
        "questInProgress",
        "questPartiallyCompleted",
        "questWrongItem",
        "questFinished",
        "questHints",
    ]
    generated_results = {}

    with ThreadPoolExecutor() as executor:
        futures = {}
        for dialog_type in DIALOG_TYPES:
            original_texts = getattr(dialogData, dialog_type, [])
            prompt_to_use = dialogData.prompt or PROMPT_TEMPLATE

            futures[dialog_type] = executor.submit(
                GeminiService.process_paraphrase, original_texts, prompt_to_use
            )

        try:
            for dialog_type, future in futures.items():
                generated_key = f"{dialog_type}IA"
                generated_results[generated_key] = future.result()
        except Exception as e:
            raise Exception(f"Error processing paraphrases: {str(e)}")

    response_data = {
        **{k: getattr(dialogData, k, []) for k in DIALOG_TYPES},
        **generated_results,
    }

    return DialogContentParaphrased(**response_data)
