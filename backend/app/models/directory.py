from typing import Optional

from pydantic import BaseModel, Field

from ..database.mongo import db
from bson.objectid import ObjectId

class DirectoryModel(BaseModel):
    name: str = Field(...)

    @staticmethod
    def serialize(obj):
        return {
            "id": str(obj["_id"]),
            "name": str(obj["name"]),
            "files": [{"id": str(f["_id"]), "name": f.get('name', '')} for f in obj["files"]] if obj.get('files') else None
        }
    
    @classmethod
    async def retrieve_one(cls, directory_id: str):
        directory = await db.directories.find_one({"_id": ObjectId(directory_id)})
        images = db.files.find({"directoryId": ObjectId(directory_id)}, {"_id": 1, "annotated": 1, "name": 1})
        images = await images.to_list(length=100)
        result = {
            "id": str(directory["_id"]),
            "name": str(directory["name"]),
            "files": [
                {"id": str(image["_id"]), "name": image.get("name"), "annotated": image.get("annotated")}
                for image in images
            ]
        }
        return result
