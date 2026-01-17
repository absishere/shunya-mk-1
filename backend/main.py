import google.generativeai as genai
import os
import json
import re
import googlemaps
from datetime import datetime, date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from googleapiclient.discovery import build

# --- IMPORT DATABASE FUNCTIONS ---
from database.database import (
    add_expense,
    get_user_expenses,
    add_assignment,
    get_assignments
)

# --- SETUP ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
MAPS_API_KEY = os.getenv("MAPS_API_KEY")

gmaps = googlemaps.Client(key=MAPS_API_KEY) if MAPS_API_KEY else None

# --- FASTAPI APP ---
app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ALLOW ALL ORIGINS (Fixes the blocking issue)
    allow_credentials=True,
    allow_methods=["*"],  # ALLOW ALL METHODS (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # ALLOW ALL HEADERS
)

# --- DATA MODELS ---
class VideoRequest(BaseModel):
    title: str
    channel: str

class SkillRequest(BaseModel):
    skill: str
    user_degree: str = "General"
    user_year: str = "Student"

class ExpenseRequest(BaseModel):
    user_id: str
    category: str
    amount: float
    date: str

class AssignmentText(BaseModel):
    text: str
    user_id: str = "student1"

class ScheduleRequest(BaseModel):
    user_id: str
    home_location: str
    college_location: str
    college_start: str
    college_end: str


# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"status": "Student Assistant Backend Running"}


# 1. YOUTUBE SEARCH
@app.get("/api/youtube/search")
def search_videos(query: str):
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YouTube API Key missing")

    try:
        youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
        request = youtube.search().list(
            part="snippet",
            q=query,
            type="video",
            maxResults=5,
            relevanceLanguage="en"
        )
        response = request.execute()

        videos = []
        for item in response.get("items", []):
            if "videoId" in item["id"]:
                videos.append({
                    "id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                    "channel": item["snippet"]["channelTitle"]
                })
        return {"videos": videos}

    except Exception as e:
        print("YouTube Error:", e)
        return {"videos": []}


# 2. AI VIDEO SUMMARY (DISABLED SAFELY)
@app.post("/api/ai/explain")
def explain_video(request: VideoRequest):
    return {"summary": "AI summary temporarily disabled."}


# 3. SKILL SYLLABUS GENERATOR (DISABLED SAFELY)
@app.post("/api/ai/syllabus")
def generate_syllabus(request: SkillRequest):
    if not GEMINI_API_KEY:
        return {"title": "Error", "weeks": [{"week": "0", "topic": "API Key Missing", "details": "Please check backend logs."}]}

    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    Create a 4-week study syllabus for {request.skill}. 
    The student is in {request.user_year} of {request.user_degree}.
    Return ONLY valid JSON in this format:
    {{
        "title": "Study Plan for [Skill]",
        "weeks": [
            {{"week": "Week 1", "topic": "Topic Name", "details": "What to study..."}},
            ...
        ]
    }}
    """
    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown formatting from AI
        clean_text = response.text.replace("```json", "").replace("```", "")
        return json.loads(clean_text)
    except Exception as e:
        print("Gemini Error:", e)
        return {"title": "Error generating plan", "weeks": []}


# 4. FINANCE TRACKER
@app.get("/api/finance/expenses")
def get_expenses_api(user_id: str):
    user_expenses = get_user_expenses(user_id)
    total = sum(e['amount'] for e in user_expenses)
    return {"expenses": user_expenses, "total": total}


@app.post("/api/finance/add")
def add_expense_api(expense: ExpenseRequest):
    add_expense(
        user_id=expense.user_id,
        amount=expense.amount,
        category=expense.category,
        date=expense.date
    )

    # ✅ SAFE FALLBACK (NO AI)
    advice = "Expense recorded successfully."

    return {"message": "Success", "ai_comment": advice}


# 5. ASSIGNMENT PARSER (DISABLED SAFELY)
@app.post("/api/ai/parse-assignment")
def parse_assignment(request: AssignmentText):
    return {"tasks": []}


# 6. GET ASSIGNMENTS
@app.get("/api/assignments")
def get_assignments_api(user_id: str):
    tasks = get_assignments(user_id)
    return {"assignments": tasks}


# 7. STUDY SCHEDULER (MAPS ONLY, NO AI)
@app.post("/api/scheduler/generate")
def generate_schedule(request: ScheduleRequest):
    commute_minutes = 30
    commute_text = "30 mins"

    if gmaps:
        try:
            directions = gmaps.distance_matrix(
                origins=request.home_location,
                destinations=request.college_location,
                mode="driving",
                departure_time=datetime.now()
            )
            element = directions['rows'][0]['elements'][0]
            if element['status'] == 'OK':
                commute_seconds = element['duration']['value']
                commute_minutes = int(commute_seconds / 60)
                commute_text = element['duration']['text']
        except Exception as e:
            print("Maps Error:", e)

    return {
        "commute_summary": f"Your commute is approximately {commute_text}.",
        "routine": []
    }
