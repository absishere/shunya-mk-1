# backend/database/database.py
import datetime
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
from dotenv import load_dotenv

load_dotenv()

# --- HELPER: Fixes the "Invalid JWT / MalformedFraming" error ---
def repair_and_load_key(file_path):
    """
    Reads a JSON file, fixes the newline characters in the private_key,
    and returns a credential object.
    """
    try:
        with open(file_path, "r") as f:
            creds_dict = json.load(f)
        
        # The Magic Fix: Convert literal "\n" to actual newlines
        if "private_key" in creds_dict:
            creds_dict["private_key"] = creds_dict["private_key"].replace("\\n", "\n")
            
        return credentials.Certificate(creds_dict)
    except Exception as e:
        print(f"⚠️ Failed to repair key at {file_path}: {e}")
        return None

# =========================
# FIREBASE INITIALIZATION
# =========================

if not firebase_admin._apps:
    cred = None
    
    # 1. PRIORITY: Check for Render Secret File (Production)
    if os.path.exists("/etc/secrets/serviceAccountKey.json"):
        print("🔄 Attempting to load Render Secret File...")
        cred = repair_and_load_key("/etc/secrets/serviceAccountKey.json")
        if cred:
            print("✅ Firebase initialized from Render Secret File")

    # 2. FALLBACK: Check for Environment Variable
    if not cred and os.getenv("FIREBASE_CREDENTIALS"):
        try:
            creds_dict = json.loads(os.getenv("FIREBASE_CREDENTIALS"))
            if "private_key" in creds_dict:
                creds_dict["private_key"] = creds_dict["private_key"].replace("\\n", "\n")
            cred = credentials.Certificate(creds_dict)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase initialized from Environment Variable")
        except Exception as e:
            print(f"❌ Error loading Firebase Env Var: {e}")

    # 3. LOCAL: Check for local file (Localhost)
    if not cred and os.path.exists("serviceAccountKey.json"):
        print("🔄 Attempting to load Local File...")
        cred = repair_and_load_key("serviceAccountKey.json")
        if cred:
            print("✅ Firebase initialized from local file")

    # Final Init
    if cred and not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    elif not firebase_admin._apps:
        print("❌ CRITICAL ERROR: No Firebase credentials found!")

db = firestore.client()


# =========================
# AUTH HELPERS
# =========================

def verify_firebase_token(id_token: str) -> str:
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token["uid"]


def create_user_if_not_exists(user_id: str, email: str):
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
    try:
        expenses_ref = (
            db.collection("users")
            .document(user_id)
            .collection("expenses")
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .stream()
        )
        return [doc.to_dict() for doc in expenses_ref]
    except Exception as e:
        print(f"Error fetching expenses: {e}")
        return []


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
    try:
        videos_ref = db.collection("users").document(user_id).collection("saved_videos").stream()
        return [doc.to_dict() for doc in videos_ref]
    except:
        return []


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
    try:
        roadmaps_ref = db.collection("users").document(user_id).collection("skill_roadmaps").stream()
        return [doc.to_dict() for doc in roadmaps_ref]
    except:
        return []


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
    try:
        assignments_ref = (
            db.collection("users")
            .document(user_id)
            .collection("assignments")
            .order_by("deadline")
            .stream()
        )
        return [doc.to_dict() for doc in assignments_ref]
    except:
        return []