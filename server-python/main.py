# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from datetime import datetime
import bcrypt
import requests

app = FastAPI()

# --- Database connection ---
client = MongoClient("mongodb+srv://shafircohen6:Sc315995589@cluster0.zloe96j.mongodb.net/?appName=Cluster0")
db = client["registration_db"]
users_collection = db["users"]

# --- Request model ---
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

# --- Routes ---
@app.post("/register")
def register_user(user: UserRegister):
    # בדוק אם המשתמש כבר קיים
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    # הצפן סיסמה
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # צור מסמך חדש
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_pw.decode('utf-8'),
        "created_at": datetime.utcnow()
    }

    # שמור בבסיס הנתונים
    users_collection.insert_one(user_doc)

    # --- קרא לשרת Node.js כדי להביא הודעת AI ---
    try:
        response = requests.get("http://localhost:4000/random-message")
        ai_data = response.json()
        ai_message = ai_data.get("quote", "")
    except Exception as e:
        print("⚠️ Error fetching AI message:", e)
        ai_message = "ברוך הבא! (לא ניתן היה להביא הודעת השראה)"

    return {
        "success": True,
        "message": "User registered successfully",
        "ai_message": ai_message
    }
