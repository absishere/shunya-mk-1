from pydantic import BaseModel
from typing import Dict, List
from datetime import date


class Expense(BaseModel):
    amount: float
    category: str
    date: date
    note: str


class SavedVideo(BaseModel):
    youtube_id: str
    title: str
    custom_title: str
    channel: str
    subject: str


class SkillRoadmap(BaseModel):
    skill_name: str
    duration_weeks: int
    syllabus: Dict[str, List[str]]


class Assignment(BaseModel):
    title: str
    subject: str
    deadline: date
    source: str  # manual / whatsapp
