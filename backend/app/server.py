from fastapi import FastAPI
from .api.directories import router as directories_router
from .api.annotations import router as annotation_router
from .api.images import router as image_router
from fastapi.middleware.cors import CORSMiddleware

def create_application():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/ping")
    def pong():
        return {"ping": "pong"}
    
    app.include_router(directories_router)
    app.include_router(annotation_router)
    app.include_router(image_router)

    return app
