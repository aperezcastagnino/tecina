from pydantic import BaseModel


class PromptRequest(BaseModel):
    prompt: str


class ParaphraseResponse(BaseModel):
    initial_prompt: str
    paraphrase: str
