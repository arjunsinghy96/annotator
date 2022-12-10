import io
from typing import List
from fastapi import FastAPI, APIRouter, Response

from ..database.mongo import db
from ..models.annotation import AnnotationModel
from bson.objectid import ObjectId

router = APIRouter(
	prefix="/images",
	tags=['images']
)

@router.get("/{image_id}")
async def retrieve_image(image_id):
    image = await db.files.find_one({"_id": ObjectId(image_id)})
    if image:
        image_bytes = image["file"]
        return Response(content=image_bytes, media_type="image/png")

@router.post("/{image_id}/annotations")
async def create_image_annotations(image_id, annotations: List[AnnotationModel]):
    print(dir(annotations))
    annos = [anno.dict() for anno in annotations]
    image = await db.files.update_one({"_id": ObjectId(image_id)}, {"$set": {"annotations": annos, "annotated": True}})
    return {"annotations": annos, "annotated": True}

@router.get("/{image_id}/annotations")
async def get_image_annotations(image_id):
    annotations = await db.files.find_one({"_id": ObjectId(image_id)}, {"_id": 0, "annotations": 1, "annotated": 1})
    return annotations