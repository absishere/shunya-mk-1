# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< Updated upstream
=======
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from googleapiclient.discovery import build
from database.database import save_video, get_saved_videos
from database.database import remove_saved_video


# --- IMPORT DATABASE FUNCTIONS ---
from database.database import add_expense, get_user_expenses, add_assignment, get_assignments

# --- SETUP ---
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MAPS_API_KEY = os.getenv("MAPS_API_KEY") 
gmaps = googlemaps.Client(key=MAPS_API_KEY) if MAPS_API_KEY else None

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-flash-latest')
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
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

class PlaylistVideo(BaseModel):
    user_id: str
    youtube_id: str
    title: str
    channel: str
    subject: str = "General"


# --- ENDPOINTS ---

>>>>>>> Stashed changes
@app.get("/")
def read_root():
    return {"message": "Hello from the Python Backend!"}

<<<<<<< Updated upstream
@app.get("/api/test")
def test_data():
    return {
        "status": "connected",
        "project": "Student Assistant Bot",
        "days_left": 5
    }
=======
# 1. YOUTUBE SEARCH
@app.get("/api/youtube/search")
def search_videos(query: str):
    if not YOUTUBE_API_KEY:
        raise HTTPException(status_code=500, detail="YouTube API Key missing")

    # ✅ FORCE ALL ACADEMIC KEYWORDS
    academic_keywords = [
        "tutorial",
        "lecture",
        "full course",
        "university",
        "college",
        "exam oriented",
        "concept explanation",
        "notes",
        "for students"
    ]

    # Combine EVERYTHING
    grounded_query = query + " " + " ".join(academic_keywords)

    # ❌ BLOCK ENTERTAINMENT
    blocked_keywords = [
        "vlog", "shorts", "reel", "food", "travel",
        "daily life", "prank", "fun", "challenge",
        "reaction", "comedy", "blog"
    ]

    try:
        youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

        request = youtube.search().list(
            part="snippet",
            q=grounded_query,
            type="video",
            maxResults=15,
            videoDuration="medium",   # removes shorts
            safeSearch="strict",
            relevanceLanguage="en"
        )

        response = request.execute()

        videos = []

        for item in response.get("items", []):
            title = item["snippet"]["title"].lower()
            description = item["snippet"]["description"].lower()

            # ❌ FILTER NON-STUDY VIDEOS
            if any(bad in title or bad in description for bad in blocked_keywords):
                continue

            # ✅ ALLOW ONLY ACADEMIC SIGNALS
            if not any(word in title or word in description for word in academic_keywords):
                continue

            videos.append({
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel": item["snippet"]["channelTitle"]
            })

        return {"videos": videos[:5]}

    except Exception as e:
        print("YouTube Error:", e)
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
        if expense.amount > 500:
            advice = model.generate_content(
                f"I just spent {expense.amount} on {expense.category}. Give me a sarcastic 1-sentence financial roast."
            ).text
        else:
            advice = "Expense recorded."
    except:
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
    

@app.get("/api/finance/analysis")
def analyze_spending(user_id: str):
    expenses = get_user_expenses(user_id)

    if not expenses:
        return {
            "summary": "No spending data yet.",
            "suggestions": []
        }

    # Category-wise totals
    category_totals = {}
    total_spent = 0

    for e in expenses:
        category_totals[e["category"]] = category_totals.get(e["category"], 0) + e["amount"]
        total_spent += e["amount"]

    prompt = f"""
    You are a financial awareness assistant for students.

    The student spent a total of ₹{total_spent}.
    Category-wise spending:
    {category_totals}

    TASK:
    1. Identify where the student is overspending.
    2. Suggest where they can realistically save money.
    3. Suggest SAFE and LEGAL saving/investment options suitable for students
       (examples: recurring deposits, savings accounts, government-backed schemes).

    RULES:
    - Do NOT recommend stocks or crypto.
    - Do NOT promise returns.
    - Keep language simple and student-friendly.
    - This is educational advice, not professional financial advice.

    OUTPUT JSON ONLY:
    {{
      "summary": "Overall spending insight",
      "saving_tips": ["tip 1", "tip 2"],
      "safe_options": ["option 1", "option 2"]
    }}
    """

    try:
        response = model.generate_content(prompt).text
        match = re.search(r"\{[\s\S]*\}", response)
        return json.loads(match.group(0)) if match else {"summary": "Could not analyze"}
    except Exception as e:
        print("Finance Analysis Error:", e)
        return {"summary": "Analysis failed"}

@app.post("/api/playlist/add")
def add_to_playlist(video: PlaylistVideo):
    save_video(
        user_id=video.user_id,
        youtube_id=video.youtube_id,
        title=video.title,
        custom_title=video.title,
        channel=video.channel,
        subject=video.subject
    )
    return {"status": "added"}

@app.get("/api/playlist")
def get_playlist(user_id: str):
    videos = get_saved_videos(user_id)
    return {"playlist": videos}

@app.delete("/api/playlist/remove")
def remove_from_playlist(user_id: str, youtube_id: str):
    deleted = remove_saved_video(user_id, youtube_id)

    if not deleted:
        return {"message": "Video not found"}

    return {"message": "Video removed successfully"}
>>>>>>> Stashed changes
