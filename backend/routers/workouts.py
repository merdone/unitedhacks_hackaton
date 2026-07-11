import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_db
from ..models import WorkoutSession, WorkoutLog, PostWorkoutFeedback, User
from ..schemas import (
    WorkoutStartRequest,
    WorkoutCompleteRequest,
    WorkoutSessionResponse,
    WorkoutLogCreate,
)
from ..auth import get_current_user

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.post("/start", response_model=WorkoutSessionResponse, status_code=201)
async def start_workout(
    data: WorkoutStartRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Initiate a new workout session."""
    session = WorkoutSession(
        user_id=current_user.id,
        template_id=data.template_id,
    )
    db.add(session)
    await db.flush()
    
    # Query it back with eager loading to satisfy Pydantic
    result = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.logs))
        .where(WorkoutSession.id == session.id)
    )
    loaded_session = result.scalar_one()
    
    return loaded_session


@router.post("/{session_id}/log", status_code=201)
async def add_log(
    session_id: int,
    log_data: WorkoutLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Add a single set/rep log to an active workout session."""
    result = await db.execute(
        select(WorkoutSession).where(
            WorkoutSession.id == session_id,
            WorkoutSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Workout session not found")

    log = WorkoutLog(
        session_id=session_id,
        exercise_id=log_data.exercise_id,
        set_number=log_data.set_number,
        reps=log_data.reps,
        weight=log_data.weight,
        rpe=log_data.rpe,
    )
    db.add(log)
    await db.flush()
    return {"message": "Log added", "log_id": log.id}


@router.post("/{session_id}/complete", response_model=WorkoutSessionResponse)
async def complete_workout(
    session_id: int,
    data: WorkoutCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Complete a workout session: submit remaining logs, calculate volume, save feedback."""
    result = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.logs))
        .where(
            WorkoutSession.id == session_id,
            WorkoutSession.user_id == current_user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Workout session not found")

    # Add submitted logs
    for log_data in data.logs:
        log = WorkoutLog(
            session_id=session_id,
            exercise_id=log_data.exercise_id,
            set_number=log_data.set_number,
            reps=log_data.reps,
            weight=log_data.weight,
            rpe=log_data.rpe,
        )
        session.logs.append(log)

    await db.flush()

    # Calculate total volume from relationship
    total_volume = sum(log.reps * log.weight for log in session.logs)

    # Finalize session
    session.end_time = datetime.datetime.utcnow()
    session.total_volume = total_volume

    # Save post-workout feedback if provided
    if data.feedback:
        feedback = PostWorkoutFeedback(
            session_id=session_id,
            perceived_difficulty=data.feedback.perceived_difficulty,
            metrics_photo_url=data.feedback.metrics_photo_url,
            voice_transcription_text=data.feedback.voice_transcription_text,
        )
        db.add(feedback)

    await db.flush()
    return session
