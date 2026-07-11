from fastapi import APIRouter, Depends
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import Exercise, User
from ..schemas import ExerciseCreate, ExerciseResponse
from ..auth import get_current_user

router = APIRouter(prefix="/exercises", tags=["Exercises"])


@router.get("/", response_model=list[ExerciseResponse])
async def list_exercises(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all base exercises and user's custom exercises."""
    result = await db.execute(
        select(Exercise).where(
            or_(Exercise.is_custom == False, Exercise.user_id == current_user.id)  # noqa: E712
        )
    )
    return result.scalars().all()


@router.post("/", response_model=ExerciseResponse, status_code=201)
async def create_exercise(
    data: ExerciseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a custom exercise."""
    exercise = Exercise(
        name=data.name,
        description=data.description,
        target_muscle_groups=data.target_muscle_groups,
        is_custom=True,
        user_id=current_user.id,
    )
    db.add(exercise)
    await db.flush()
    await db.refresh(exercise)
    return exercise
