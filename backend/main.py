import os
import json
import re
from datetime import date
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from googleapiclient.discovery import build

# --- SETUP ---
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure AI
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-flash-latest')

app = FastAPI()

# FIX: Allow ALL origins to prevent CORS errors if port changes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class VideoRequest(BaseModel):
    title: str
    channel: str

class SkillRequest(BaseModel):
    skill: str

class ExpenseRequest(BaseModel):
    user_id: str
    category: str
    amount: float
    date: str

class AssignmentText(BaseModel):
    text: str

# --- MOCK DATABASE ---
mock_expenses_db = [
    {"user_id": "student1", "category": "Food", "amount": 150, "date": "2026-01-12"},
    {"user_id": "student1", "category": "Travel", "amount": 50, "date": "2026-01-13"},
]

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
            # FIX: Safety check in case YouTube returns a channel/playlist instead of video
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
        return {"videos": []} # Return empty list instead of crashing

# 2. AI VIDEO SUMMARY
@app.post("/api/ai/explain")
def explain_video(request: VideoRequest):
    try:
        prompt = f"""
        I am a student. Summarize this video titled "{request.title}" by "{request.channel}" 
        into 3 bullet points of what I will learn. Keep it encouraging.
        """
        response = model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        return {"summary": "Could not generate summary."}

# 3. SKILL SYLLABUS GENERATOR
@app.post("/api/ai/syllabus")
def generate_syllabus(request: SkillRequest):
    try:
        prompt = f"""
        Create a 4-week study syllabus for "{request.skill}".
        Return ONLY raw JSON with this structure (no markdown):
        {{
            "title": "Mastering {request.skill}",
            "weeks": [
                {{"week": 1, "topic": "Basics", "details": "Focus on..."}},
                {{"week": 2, "topic": "Intermediate", "details": "Learn about..."}},
                {{"week": 3, "topic": "Advanced", "details": "Deep dive into..."}},
                {{"week": 4, "topic": "Project", "details": "Build a..."}}
            ]
        }}
        """
        response = model.generate_content(prompt)
        text = response.text
        
        # FIX: Robust JSON Extraction
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            clean_json = match.group(0)
            return json.loads(clean_json)
        else:
            raise ValueError("No JSON found")
            
    except Exception as e:
        print(f"Syllabus Error: {e}")
        # Return error structure so frontend handles it gracefully
        return {"error": True, "title": "Could not generate plan", "weeks": []}

# 4. FINANCE TRACKER
@app.get("/api/finance/expenses")
def get_expenses(user_id: str):
    user_expenses = [e for e in mock_expenses_db if e['user_id'] == user_id]
    total = sum(e['amount'] for e in user_expenses)
    return {"expenses": user_expenses, "total": total}

@app.post("/api/finance/add")
def add_expense(expense: ExpenseRequest):
    # FIX: Pydantic v2 compatibility (dict() vs model_dump())
    try:
        entry = expense.model_dump()
    except AttributeError:
        entry = expense.dict()
        
    mock_expenses_db.append(entry)
    
    # Sarcastic AI Advice
    try:
        if expense.amount > 500:
            advice = model.generate_content(
                f"I am a student. I just spent {expense.amount} rupess on {expense.category}. Give me a sarcastic 1-sentence financial roast."
            ).text
        else:
            advice = "Expense recorded."
    except:
        advice = "Expense recorded."

    return {"message": "Success", "ai_comment": advice}

# 5. ASSIGNMENT PARSER (WITH DATES)
@app.post("/api/ai/parse-assignment")
def parse_assignment(request: AssignmentText):
    try:
        today_str = date.today().strftime("%Y-%m-%d")
        prompt = f"""
        Extract assignments from this text: "{request.text}"
        Today is {today_str}.
        Convert relative dates like "tomorrow" or "next friday" into YYYY-MM-DD.
        Return ONLY raw JSON:
        [
            {{"subject": "Subject", "task": "Details", "due_date": "YYYY-MM-DD"}}
        ]
        If no tasks, return [].
        """
        response = model.generate_content(prompt)
        text = response.text
        
        # FIX: Robust JSON Extraction
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if match:
            clean_json = match.group(0)
            return {"tasks": json.loads(clean_json)}
        else:
            return {"tasks": []}
            
    except Exception as e:
        print(f"Parser Error: {e}")
        return {"tasks": []}