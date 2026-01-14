# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CRITICAL STEP: CORS ---
# This allows your React app (running on a different port) to talk to this Python app.
# Without this, the browser will block the connection.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # React (Vite) usually runs on 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello from the Python Backend!"}

@app.get("/api/test")
def test_data():
    return {
        "status": "connected",
        "project": "Student Assistant Bot",
        "days_left": 5
    }