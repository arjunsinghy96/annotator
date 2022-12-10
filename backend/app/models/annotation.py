from typing import List
from pydantic import BaseModel

class AnnotationModel(BaseModel):
    tags: List[str]
    coords: str
