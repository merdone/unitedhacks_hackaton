from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ── Auth ─────────────────────────────────────────────────────────────────────


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── User ─────────────────────────────────────────────────────────────────────


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=10, le=120)
    weight_current: Optional[float] = Field(None, gt=0)
    height: Optional[float] = Field(None, gt=0)
    medical_conditions: list[str] = []
    photo_url: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    weight_current: Optional[float] = None
    height: Optional[float] = None
    medical_conditions: Optional[list[str]] = None
    photo_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    age: Optional[int] = None
    weight_current: Optional[float] = None
    height: Optional[float] = None
    medical_conditions: list[str] = []
    photo_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Exercise ─────────────────────────────────────────────────────────────────


class ExerciseCreate(BaseModel):
    name: str
    description: Optional[str] = None
    target_muscle_groups: list[str] = []
    is_custom: bool = False


class ExerciseResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    target_muscle_groups: list[str] = []
    is_custom: bool
    user_id: Optional[int] = None

    model_config = {"from_attributes": True}


# ── Workout Template ─────────────────────────────────────────────────────────


class TemplateExercise(BaseModel):
    exercise_id: int
    sets: int = Field(..., ge=1)
    reps: int = Field(..., ge=1)


class TemplateCreate(BaseModel):
    name: str
    exercises: list[TemplateExercise]


class TemplateResponse(BaseModel):
    id: int
    user_id: int
    name: str
    exercises: list[dict] = []

    model_config = {"from_attributes": True}


# ── Readiness ────────────────────────────────────────────────────────────────


class ReadinessCreate(BaseModel):
    sleep_quality: int = Field(..., ge=1, le=10)
    mood: int = Field(..., ge=1, le=10)
    motivation: int = Field(..., ge=1, le=10)
    fatigue_level: int = Field(..., ge=1, le=10)
    additional_notes: Optional[str] = None


class ReadinessResponse(BaseModel):
    id: int
    user_id: int
    date: date
    sleep_quality: int
    mood: int
    motivation: int
    fatigue_level: int
    additional_notes: Optional[str] = None

    model_config = {"from_attributes": True}


# ── Workout Session ──────────────────────────────────────────────────────────


class WorkoutStartRequest(BaseModel):
    template_id: Optional[int] = None


class WorkoutLogCreate(BaseModel):
    exercise_id: int
    set_number: int = 1
    reps: int = Field(..., ge=0)
    weight: float = Field(..., ge=0)
    rpe: Optional[float] = Field(None, ge=1, le=10)


class WorkoutLogResponse(BaseModel):
    id: int
    session_id: int
    exercise_id: int
    set_number: int
    reps: int
    weight: float
    rpe: Optional[float] = None

    model_config = {"from_attributes": True}


class FeedbackCreate(BaseModel):
    perceived_difficulty: int = Field(..., ge=1, le=10)
    metrics_photo_url: Optional[str] = None
    voice_transcription_text: Optional[str] = None


class WorkoutCompleteRequest(BaseModel):
    logs: list[WorkoutLogCreate]
    feedback: Optional[FeedbackCreate] = None


class WorkoutSessionResponse(BaseModel):
    id: int
    user_id: int
    template_id: Optional[int] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    total_volume: Optional[float] = None
    ai_recommendation_given: Optional[str] = None
    logs: list[WorkoutLogResponse] = []

    model_config = {"from_attributes": True}


# ── AI ───────────────────────────────────────────────────────────────────────


class AIRecommendationResponse(BaseModel):
    recommendation: str
    modifications: dict = {}


# ── Stats ────────────────────────────────────────────────────────────────────


class MuscleGroupVolume(BaseModel):
    muscle_group: str
    total_volume: float
    session_count: int


class StatsResponse(BaseModel):
    user_id: int
    period_days: int
    muscle_group_volumes: list[MuscleGroupVolume] = []
    total_sessions: int
    total_volume: float
