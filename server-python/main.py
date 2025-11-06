from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Python server is running"}
