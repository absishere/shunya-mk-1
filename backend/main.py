import os
import google.generativeai as genai
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Loading API key from .env
load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')

# DATA MODEL
class VideoRequest(BaseModel):
    title: str
    channel: str

app = FastAPI()

# Allow React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Student Assistant Backend is Running"}

# --- NEW: YouTube Search Endpoint ---
@app.get("/api/youtube/search")
def search_videos(query: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key not found")

    try:
        # Build the YouTube Service
        youtube = build('youtube', 'v3', developerKey=API_KEY)

        # Search for videos matching the query
        request = youtube.search().list(
            part="snippet",
            q=query,
            type="video",
            maxResults=5,
            relevanceLanguage="en"
        )
        response = request.execute()

        # Clean up the data to send to Frontend
        videos = []
        for item in response.get("items", []):
            videos.append({
                "id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel": item["snippet"]["channelTitle"]
            })

        return {"videos": videos}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/api/ai/explain")
def explain_video(request: VideoRequest):
    try:
        # We prompt Gemini to act like a teacher
        prompt = f"""
        I am a student looking for study resources. 
        I found a video titled "{request.title}" by the channel "{request.channel}".
        
        Please provide a 3-bullet-point summary of what concepts I will likely learn from this video.
        Keep it short, encouraging, and easy to understand.
        """
        
        response = model.generate_content(prompt)
        return {"summary": response.text}
        
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))