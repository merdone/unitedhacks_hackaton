import datetime

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, Date, ForeignKey
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    weight_current = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    medical_conditions = Column(JSONB, default=list)
    photo_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    templates = relationship("WorkoutTemplate", back_populates="user")
    sessions = relationship("WorkoutSession", back_populates="user")
    questionnaires = relationship("ReadinessQuestionnaire", back_populates="user")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    target_muscle_groups = Column(ARRAY(String), default=list)
    is_custom = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    logs = relationship("WorkoutLog", back_populates="exercise")


class WorkoutTemplate(Base):
    __tablename__ = "workout_templates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    exercises = Column(JSONB, default=list)  # [{exercise_id, sets, reps}]

    user = relationship("User", back_populates="templates")
    sessions = relationship("WorkoutSession", back_populates="template")


class ReadinessQuestionnaire(Base):
    __tablename__ = "readiness_questionnaires"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=datetime.date.today)
    sleep_quality = Column(Integer, nullable=False)
    mood = Column(Integer, nullable=False)
    motivation = Column(Integer, nullable=False)
    fatigue_level = Column(Integer, nullable=False)
    additional_notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="questionnaires")


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    template_id = Column(Integer, ForeignKey("workout_templates.id"), nullable=True)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_volume = Column(Float, default=0.0)
    ai_recommendation_given = Column(Text, nullable=True)

    user = relationship("User", back_populates="sessions")
    template = relationship("WorkoutTemplate", back_populates="sessions")
    logs = relationship("WorkoutLog", back_populates="session", cascade="all, delete-orphan")
    feedback = relationship("PostWorkoutFeedback", back_populates="session", uselist=False)


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    set_number = Column(Integer, nullable=False, default=1)
    reps = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    rpe = Column(Float, nullable=True)

    session = relationship("WorkoutSession", back_populates="logs")
    exercise = relationship("Exercise", back_populates="logs")


class PostWorkoutFeedback(Base):
    __tablename__ = "post_workout_feedback"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"), unique=True, nullable=False)
    perceived_difficulty = Column(Integer, nullable=False)
    metrics_photo_url = Column(String(500), nullable=True)
    voice_transcription_text = Column(Text, nullable=True)

    session = relationship("WorkoutSession", back_populates="feedback")
