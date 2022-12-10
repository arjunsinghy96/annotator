# Annotator Backend

### Development Setup

1. Make sure you have `python3.8` or above installed on your system.
2. Change the directory to `backend`. (Use `cd backend` from project root)
3. Create a virtual environment using `python3.8 -m venv venv`
4. Activate the virtual environment using `source venv/bin/activate`
5. Install the backend dependencies using `pip install -r requirements.txt`
6. Start the development server using `uvicorn main:app`. This will start the application on port `8000`.
7. Visit http://localhost:8000/docs to view the API documentation.

### Building docker image

Run `docker build -t <image_name>:<image_tag> .` from backend directory to create a new image.
