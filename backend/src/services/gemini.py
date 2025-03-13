from src.config import settings
import google.generativeai as genai
from src.schemas.dialog import Dialog


class GeminiService:
    MODEL_NAME = "gemini-1.0-pro"
    genai.configure(api_key=settings.gemini_api_key)

    @staticmethod
    def get_model_paraphrase(prompt: str) -> str:
        model = genai.GenerativeModel(GeminiService.MODEL_NAME)
        model_output = model.generate_content(prompt).text
        return model_output
    
    @staticmethod
    def process_paraphrase(questKey: str, previousPrompt: str, dialogData: Dialog):
        if hasattr(dialogData, questKey):
            questToParaphrases = getattr(dialogData, questKey)
            modelResponse = GeminiService.get_model_paraphrase(previousPrompt + ";".join(questToParaphrases))
            
            generated_key = f"{questKey}IAGenerated"
            setattr(dialogData, generated_key, [x.strip() for x in modelResponse.split(";")])

