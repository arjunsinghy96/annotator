# Annotation Platform

Annotation platform to tag vehicle images with bounding box. Available tags are `bus`, `car`, `autorickshaw` and `bike`.

View `backend/README.md` and `frontend/README.md` for client and server documentations.

### Docker build

To build the application run `docker-compose build` from project root. This will build the `backend` and `frontend` images

### Starting the application

Run `docker-compose up` from project root to start the application. This will start 1 backend, 1 frontend and 1 mongodb database container.

Visit `http://localhost/` to start using the app. Make sure you do not have any other service running on port `80`.

### Application features.

- Create directories to organize the annotation process.
- Upload images to the directories for annotation.
- Annotate images by drawing bounding box by draging on the images.
- Download csv for all the annotated images in a directory.

### Future features

- Authentication and Authorization for managing annotators.
