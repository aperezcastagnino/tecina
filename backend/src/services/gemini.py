from src.config import settings
import google.generativeai as genai


class GeminiService:
    @staticmethod
    def get_paraphrase(prompt: str) -> str:
        MODEL_NAME = "gemini-1.0-pro"
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel(MODEL_NAME)

        model_output = model.generate_content(prompt).text
        return model_output
