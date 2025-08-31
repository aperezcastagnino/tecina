from typing import Optional

from pydantic import BaseModel

OptionalList = Optional[list[str]]

class DialogContentInput(BaseModel):
    questStart: OptionalList = None
    questInProgress: OptionalList = None
    questPartiallyCompleted: OptionalList = None
    questWrongItem: OptionalList = None
    questFinished: OptionalList = None
    questHints: OptionalList = None
    prompt: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "questStart": [
                    "Hi! I'm a friendly scientist!",
                    "Can you help me find three tiny frogs?",
                    "I want to learn about how they jump!"
                ],
                "questInProgress": ["Have you seen any jumping frogs?"],
                "questPartiallyCompleted": [
                    "Yay! You're doing great! Let's find more frogs!"
                ],
                "questWrongItem": [
                    "Oops! That's not a frog - I'm looking for green jumping friends!"
                ],
                "questFinished": [
                    "Wow! Thank you! Now I can watch these cute frogs jump!"
                ],
                "questHints": ["Search for tiny green creatures that hop in the grass!"],
                "prompt": "For each of the sentences I will list below, separated by semicolon, give me a paraphrase of each one. The result must have the same format. Make sure to keep the same language as the original sentences. The sentences are",
            }
        }


class DialogContentParaphrased(BaseModel):
    questStartIA: OptionalList = None
    questInProgressIA: OptionalList = None
    questPartiallyCompletedIA: OptionalList = None
    questWrongItemIA: OptionalList = None
    questFinishedIA: OptionalList = None
    questHintsIA: OptionalList = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "questStartIA": [
                    "Hello there! I'm a scientist who's approachable!",
                    "Could you assist me in locating three very small frogs?",
                    "My goal is to understand the mechanics of their leaps!"
                ],
                "questInProgressIA": [
                    "Have you spotted any leaping amphibians?"
                ],
                "questPartiallyCompletedIA": [
                    "Hooray! Your performance is excellent! We should search for additional frogs!"
                ],
                "questWrongItemIA": [
                    "Whoops! That is not the amphibian I seek",
                    "I'm searching for verdant, leaping companions!"
                ],
                "questFinishedIA": [
                    "Amazing! I appreciate it! Now I'm able to observe these adorable frogs leaping!"
                ],
                "questHintsIA": [
                    "Seek out miniature verdant beings that leap within the lawn!"
                ]
            }
        }