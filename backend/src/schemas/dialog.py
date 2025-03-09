from typing import List
from pydantic import BaseModel

class Dialog(BaseModel):
    id: str
    description: str
    questStart: List[str]
    questStartIAGenerated: List[str]
    questInProgress: List[str]
    questInProgressIAGenerated: List[str]
    questFinished: List[str]
    questFinishedIAGenerated: List[str]
    hints: List[str]
    hintsIAGenerated: List[str]
    assetKey: str
    quantityToCollect: int
    options: List[str]
    correctOption: str
