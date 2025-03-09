from typing import List
from fastapi import APIRouter
from src.schemas.dialog import Dialog
from src.services.gemini import GeminiService

router = APIRouter()

@router.post("", response_model=Dialog)
def get_items(
    jsonObject: Dialog
) -> Dialog:
    previousText = "Give me only, without presentation text, paraphrases of the following sentences as an array separated by ';':"
    
    process_paraphrase("questStart", previousText, jsonObject)
    process_paraphrase("questInProgress", previousText, jsonObject)
    process_paraphrase("questFinished", previousText, jsonObject)

    return jsonObject 


def process_paraphrase(questKey, previousText, jsonObject):
    if hasattr(jsonObject, questKey): 
        questToParaphrases = getattr(jsonObject, questKey)
        modelResponse = GeminiService.get_paraphrase(previousText + ";".join(questToParaphrases))
        
        generated_key = f"{questKey}IAGenerated"
        setattr(jsonObject, generated_key, [x.strip() for x in modelResponse.split(";")])
        