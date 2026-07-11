from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import ReadinessQuestionnaire, User
from ..schemas import ReadinessCreate, ReadinessResponse
from ..auth import get_current_user

router = APIRouter(prefix="/readiness", tags=["Readiness"])


@router.post("/", response_model=ReadinessResponse, status_code=201)
async def submit_readiness(
    data: ReadinessCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a pre-workout readiness questionnaire."""
    questionnaire = ReadinessQuestionnaire(
        user_id=current_user.id,
        sleep_quality=data.sleep_quality,
        mood=data.mood,
        motivation=data.motivation,
        fatigue_level=data.fatigue_level,
        additional_notes=data.additional_notes,
    )
    db.add(questionnaire)
    await db.flush()
    await db.refresh(questionnaire)
    return questionnaire


@router.get("/latest", response_model=ReadinessResponse | None)
async def get_latest_readiness(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the most recent readiness questionnaire for the current user."""
    result = await db.execute(
        select(ReadinessQuestionnaire)
        .where(ReadinessQuestionnaire.user_id == current_user.id)
        .order_by(ReadinessQuestionnaire.date.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()
