from typing import Optional

from pydantic import BaseModel


class DialogContentInput(BaseModel):
    questStart: list[str]
    questStartIAGenerated: Optional[list[str]] = None
    questInProgress: list[str]
    questInProgressIAGenerated: Optional[list[str]] = None
    questFinished: list[str]
    questFinishedIAGenerated: Optional[list[str]] = None
    hints: list[str]
    hintsIAGenerated: Optional[list[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "questStart": ["Hablar con el rey", "Recibir la espada mágica"],
                "questInProgress": ["Viajar al bosque oscuro", "Derrotar al dragón"],
                "questFinished": ["Rescatar al príncipe", "Regresar al castillo"],
                "hints": [
                    "El rey te encomienda la misión",
                    "Encuentras un mapa antiguo",
                ],
            }
        }


class DialogContentParaphrased(BaseModel):
    questStart: list[str]
    questStartIAGenerated: list[str]
    questInProgress: list[str]
    questInProgressIAGenerated: list[str]
    questFinished: list[str]
    questFinishedIAGenerated: list[str]
    hints: list[str]
    hintsIAGenerated: list[str]
