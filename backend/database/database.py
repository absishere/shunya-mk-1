# backend/database/database.py
import datetime
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
from dotenv import load_dotenv

load_dotenv()

# =========================
# FIREBASE INITIALIZATION
# =========================

# Check if app is already initialized to prevent double-init errors
if not firebase_admin._apps:
    # 1. Try to get credentials from Environment Variable (Production/Render)
    firebase_creds = os.getenv("FIREBASE_CREDENTIALS")

    if firebase_creds:
        # Load the JSON string
        creds_dict = json.loads(firebase_creds)
        
        # 🚨 CRITICAL FIX for Render: Replace literal \n with actual newlines
        if "private_key" in creds_dict:
            creds_dict["private_key"] = creds_dict["private_key"].replace("\\n", "\n")
        
        cred = credentials.Certificate(creds_dict)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized from Environment Variable")
        
    # 2. Fallback: Try local file (Localhost development)
    elif os.path.exists("serviceAccountKey.json"):
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized from local file")
        
    else:
        print("❌ ERROR: No Firebase credentials found! Check Render Environment Variables.")

db = firestore.client()


# =========================
# AUTH HELPERS
# =========================

def verify_firebase_token(id_token: str) -> str:
    """Verifies Firebase ID token and returns user_id (uid)"""
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token["uid"]


def create_user_if_not_exists(user_id: str, email: str):
    """Creates user document in Firestore if it does not exist"""
    user_ref = db.collection("users").document(user_id)
    if not user_ref.get().exists:
        user_ref.set({
            "email": email,
            "createdAt": datetime.datetime.utcnow()
        })


# =========================
# EXPENSES
# =========================

def add_expense(user_id: str, amount: float, category: str, date: str, note: str = ""):
    data = {
        "amount": amount,
        "category": category,
        "date": date,
        "note": note,
        "createdAt": datetime.datetime.utcnow()
    }
    db.collection("users").document(user_id).collection("expenses").add(data)


def get_user_expenses(user_id: str):
    expenses_ref = (
        db.collection("users")
        .document(user_id)
        .collection("expenses")
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .stream()
    )
    return [doc.to_dict() for doc in expenses_ref]


# =========================
# SAVED YOUTUBE VIDEOS
# =========================

def save_video(user_id: str, youtube_id: str, title: str, custom_title: str, channel: str, subject: str):
    data = {
        "youtube_id": youtube_id,
        "title": title,
        "custom_title": custom_title,
        "channel": channel,
        "subject": subject,
        "savedAt": datetime.datetime.utcnow()
    }
    db.collection("users").document(user_id).collection("saved_videos").add(data)


def get_saved_videos(user_id: str):
    videos_ref = db.collection("users").document(user_id).collection("saved_videos").stream()
    return [doc.to_dict() for doc in videos_ref]


# =========================
# SKILL ROADMAPS
# =========================

def save_roadmap(user_id: str, skill_name: str, syllabus_json: dict):
    data = {
        "skill_name": skill_name,
        "duration_weeks": len(syllabus_json),
        "syllabus": syllabus_json,
        "createdAt": datetime.datetime.utcnow()
    }
    db.collection("users").document(user_id).collection("skill_roadmaps").add(data)


def get_skill_roadmaps(user_id: str):
    roadmaps_ref = db.collection("users").document(user_id).collection("skill_roadmaps").stream()
    return [doc.to_dict() for doc in roadmaps_ref]


# =========================
# ASSIGNMENTS
# =========================

def add_assignment(user_id: str, title: str, subject: str, deadline: str, source: str = "manual"):
    data = {
        "title": title,
        "subject": subject,
        "deadline": deadline,
        "source": source,
        "createdAt": datetime.datetime.utcnow()
    }
    db.collection("users").document(user_id).collection("assignments").add(data)


def get_assignments(user_id: str):
    assignments_ref = (
        db.collection("users")
        .document(user_id)
        .collection("assignments")
        .order_by("deadline")
        .stream()
    )
    return [doc.to_dict() for doc in assignments_ref]