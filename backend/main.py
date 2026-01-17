import os
import json
import re
import googlemaps 
from datetime import datetime
from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from googleapiclient.discovery import build

# --- IMPORT DATABASE FUNCTIONS ---
from database.database import add_expense, get_user_expenses, add_assignment, get_assignments

from fastapi.middleware.cors import CORSMiddleware

# --- SETUP ---
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MAPS_API_KEY = os.getenv("MAPS_API_KEY") 
gmaps = googlemaps.Client(key=MAPS_API_KEY) if MAPS_API_KEY else None

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-flash-latest')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://shunya-mk-1.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class VideoRequest(BaseModel):
    title: str
    channel: str

# UPDATED: Now accepts academic context
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
    user_id: str = "student1" # Default if not provided

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
            part="snippet", q=query, type="video", maxResults=5, relevanceLanguage="en"
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
        print(f"YouTube Error: {e}")
        return {"videos": []}

# 2. AI VIDEO SUMMARY
@app.post("/api/ai/explain")
def explain_video(request: VideoRequest):
    try:
        prompt = f"""
        I am a university student. Summarize this video titled "{request.title}" by "{request.channel}" 
        into 3 bullet points of what I will learn. Keep it educational and concise.
        """
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        return {"summary": "Could not generate summary."}

# 3. SKILL SYLLABUS GENERATOR (ACADEMIC AWARE)
@app.post("/api/ai/syllabus")
def generate_syllabus(request: SkillRequest):
    try:
        # LOGIC: Adjust difficulty based on Year
        difficulty_note = "Start from basics."
        if "3rd" in request.user_year or "4th" in request.user_year:
            difficulty_note = "Skip basics. Focus on advanced concepts, industry applications, and complex projects."
        
        prompt = f"""
        Act as a Professor for {request.user_degree} students.
        Create a 4-week study syllabus for "{request.skill}".
        
        CONTEXT: The student is in {request.user_year}. {difficulty_note}
        
        Return ONLY raw JSON with this structure (no markdown):
        {{
            "title": "Mastering {request.skill} ({request.user_degree} Edition)",
            "weeks": [
                {{"week": 1, "topic": "...", "details": "..."}},
                {{"week": 2, "topic": "...", "details": "..."}},
                {{"week": 3, "topic": "...", "details": "..."}},
                {{"week": 4, "topic": "...", "details": "..."}}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text
        
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON found")
            
    except Exception as e:
        print(f"Syllabus Error: {e}")
        return {"error": True, "title": "Could not generate plan", "weeks": []}

# 4. FINANCE TRACKER (CONNECTED TO DB)
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
    
    try:
        if expense.amount > 500 and model:
            response = model.generate_content(
                f"I just spent {expense.amount} on {expense.category}. Give me a sarcastic 1-sentence financial roast.",
                generation_config={"max_output_tokens": 40},
            )
            advice = response.text
        else:
            advice = "Expense recorded."
    except Exception as e:
        print("Gemini error:", e)
        advice = "Expense recorded."

    return {"message": "Success", "ai_comment": advice}

# 5. ASSIGNMENT PARSER (CONNECTED TO DB)
@app.post("/api/ai/parse-assignment")
def parse_assignment(request: AssignmentText):
    try:
        today_str = date.today().strftime("%Y-%m-%d")
        prompt = f"""
        Extract assignments from: "{request.text}"
        Today is {today_str}.
        Convert relative dates (tomorrow, next friday) into YYYY-MM-DD.
        Return ONLY raw JSON:
        [
            {{"subject": "Subject", "task": "Details", "due_date": "YYYY-MM-DD"}}
        ]
        If no tasks, return [].
        """
        response = model.generate_content(prompt)
        text = response.text
        
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if match:
            tasks = json.loads(match.group(0))
            
            # Save to DB using the user_id sent from frontend
            for t in tasks:
                add_assignment(
                    user_id=request.user_id, 
                    title=t['task'],
                    subject=t['subject'],
                    deadline=t['due_date'],
                    source="whatsapp_parser"
                )
            
            return {"tasks": tasks}
        else:
            return {"tasks": []}
            
    except Exception as e:
        print(f"Parser Error: {e}")
        return {"tasks": []}

# 6. GET ASSIGNMENTS
@app.get("/api/assignments")
def get_assignments_api(user_id: str):
    tasks = get_assignments(user_id)
    return {"assignments": tasks}

# --- FEATURE 4: STUDY SCHEDULER (WITH MAPS) ---

class ScheduleRequest(BaseModel):
    user_id: str
    home_location: str
    college_location: str
    college_start: str # e.g. "09:00"
    college_end: str   # e.g. "17:00"

@app.post("/api/scheduler/generate")
def generate_schedule(request: ScheduleRequest):
    commute_minutes = 30 # Default fallback
    commute_text = "30 mins"

    # 1. CALCULATE COMMUTE (Real Google Maps Data)
    if gmaps:
        try:
            # We ask Maps: "How long to drive from Home to College now?"
            directions = gmaps.distance_matrix(
                origins=request.home_location,
                destinations=request.college_location,
                mode="driving",
                departure_time=datetime.now()
            )
            # Extract the time (in text, e.g., "45 mins")
            element = directions['rows'][0]['elements'][0]
            if element['status'] == 'OK':
                commute_seconds = element['duration']['value']
                commute_minutes = int(commute_seconds / 60)
                commute_text = element['duration']['text']
        except Exception as e:
            print(f"Maps Error: {e}")

    # 2. GENERATE AI ROUTINE
    try:
        prompt = f"""
        Create a daily routine for a university student.
        
        CONTEXT:
        - College Hours: {request.college_start} to {request.college_end}
        - Commute Time (One way): {commute_text}.
        - Goal: Balance study, skill learning, and health.
        
        INSTRUCTIONS:
        - Suggest specific activities for the commute (e.g., "Listen to podcast").
        - Allocate time for "Deep Work" and "Exercise".
        - Return ONLY raw JSON in this format:
        {{
            "commute_summary": "Your commute is {commute_text}.",
            "routine": [
                {{"time": "07:00 - 08:00", "activity": "Wake up & Exercise", "type": "health"}},
                {{"time": "08:00 - 09:00", "activity": "Commute ({commute_text}) - Listen to Audio Notes", "type": "commute"}},
                {{"time": "...", "activity": "...", "type": "work/study/break"}}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text
        
        # Clean JSON
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON found")
            
    except Exception as e:
        print(f"Scheduler Error: {e}")
        return {"error": True}