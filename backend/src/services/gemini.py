from src.config import settings
import google.generativeai as genai


class GeminiService:
    MODEL_NAME = "gemini-1.0-pro"
    genai.configure(api_key=settings.gemini_api_key)

    @staticmethod
    def get_paraphrase(prompt: str) -> str:
        model = genai.GenerativeModel(GeminiService.MODEL_NAME)
        model_output = model.generate_content(prompt).text
        return model_output
