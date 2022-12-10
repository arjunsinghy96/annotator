from typing import List
from typing import AsyncIterator
from fastapi import FastAPI, APIRouter, UploadFile
from pydantic import BaseModel
from ..database.mongo import db
from ..models.directory import DirectoryModel
from bson.objectid import ObjectId
from bson.binary import Binary

from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/directories",
    tags=['directories'],
)

async def to_csv_stream(cursor: AsyncIterator):
    yield f'fileId,filename,x1,y1,x2,y2,tags\n'
    async for row in cursor:
        for ann in row["annotations"]:
            yield f'{str(row["_id"])},{row["name"]},{ann["coords"]},{ann["tags"]}\n'

@router.get('/')
async def get_all():
    resp = []
    cursor = db.directories.find({})
    async for obj in cursor:
        resp.append(DirectoryModel.serialize(obj))
    return resp

@router.post('/')
async def create_directory(directory: DirectoryModel):
    await db.directories.insert_one({"name": directory.name})
    return directory

@router.get('/{directory_id}')
async def read_directory(directory_id: str):
    return await DirectoryModel.retrieve_one(directory_id)

@router.post("/{directory_id}/upload")
async def upload_file(directory_id: str, files: List[UploadFile]):
    for file in files:
        doc = await db.files.insert_one({
            "file": Binary(file.file.read()),
            "directoryId": ObjectId(directory_id),
            "annotated": False,
            "name": file.filename
            }
        )
        
    return {"status": "success"}

@router.get("/{directory_id}/download")
async def download_annotation_csv(directory_id: str):
    directoryId = ObjectId(directory_id)
    directory = await db.directories.find_one({"_id": directoryId})
    image_cursor = db.files.find({"directoryId": directoryId, "annotated": True}, {"_id": 1, "annotations": 1, "name": 1})
    export_media_type = 'text/csv'
    export_headers = {
          "Content-Disposition": "attachment; filename={file_name}-annotations.csv".format(file_name=directory["name"])
    }
    return StreamingResponse(
        to_csv_stream(image_cursor),
        headers=export_headers,
        media_type=export_media_type
    )