from src.services.gemini import GeminiService
from fastapi import APIRouter
from src.schemas.dialog import Dialog
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()

@router.post("", response_model=Dialog)
def get_paraphrase(dialogData: Dialog) -> Dialog:
    previousPrompt = "Give me only, without presentation text, paraphrases of the following sentences as an array separated by ';':"
    
    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(GeminiService.process_paraphrase, "questStart", previousPrompt, dialogData),
            executor.submit(GeminiService.process_paraphrase, "questInProgress", previousPrompt, dialogData),
            executor.submit(GeminiService.process_paraphrase, "questFinished", previousPrompt, dialogData),
        ]

        for future in futures:
            future.result() 

    return dialogData
