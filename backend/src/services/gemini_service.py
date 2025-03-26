from src.config import settings
import google.generativeai as genai


class GeminiService:
    MODEL_NAME = "gemini-2.0-flash"

    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)

    @staticmethod
    def process_paraphrase(
        text_list: list[str],
        prompt_template: str
    ) -> list[str]:
        """
        Process a list of texts and generate paraphrases for them.

        Args:
            text_list: List of strings to paraphrase
            prompt_template: The template for the prompt

        Returns:
            List of paraphrased strings
        """
        if not text_list:
            return []

        full_prompt = f"{prompt_template};{';'.join(text_list)}"
        model_response = GeminiService._get_model_paraphrase(full_prompt)
        return [x.strip() for x in model_response.split(";")]

    @staticmethod
    def _get_model_paraphrase(prompt: str) -> str:
        try:
            model = genai.GenerativeModel(GeminiService.MODEL_NAME)
            model_output = model.generate_content(prompt).text
            return model_output
        except Exception as e:
            raise Exception(f"Error generating content with Gemini: {str(e)}")
