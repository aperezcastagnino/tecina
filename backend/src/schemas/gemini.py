from pydantic import BaseModel


class PromptRequest(BaseModel):
    prompt: str


class ParaphraseResponse(BaseModel):
    paraphrase: str
