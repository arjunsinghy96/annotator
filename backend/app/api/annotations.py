from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

class Coordinate(BaseModel):
    x: int
    y: int

class AnnotationModel(BaseModel):
    annotation: str
    bb_top: Coordinate
    bb_bottom: Coordinate

class AnnotateFileRequestModel(BaseModel):
    image_id: str
    annotations: List[AnnotationModel]

router = APIRouter(
    prefix="/annotations"
)

@router.post("/")
async def create_annotation(annotations: AnnotateFileRequestModel):
    print(annotations)
    return annotations
