import datetime
from collections import defaultdict

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..database import get_db
from ..models import WorkoutSession, WorkoutLog, User
from ..schemas import StatsResponse, MuscleGroupVolume
from ..auth import get_current_user

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("/", response_model=StatsResponse)
async def get_stats(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Aggregate volume per muscle group over a given time period."""
    since = datetime.datetime.utcnow() - datetime.timedelta(days=days)

    result = await db.execute(
        select(WorkoutSession)
        .options(selectinload(WorkoutSession.logs).selectinload(WorkoutLog.exercise))
        .where(
            WorkoutSession.user_id == current_user.id,
            WorkoutSession.start_time >= since,
        )
    )
    sessions = result.scalars().all()

    # Aggregate volume per muscle group
    muscle_volumes: dict = defaultdict(lambda: {"volume": 0.0, "sessions": set()})
    total_volume = 0.0

    for session in sessions:
        for log in session.logs:
            volume = log.reps * log.weight
            total_volume += volume
            if log.exercise and log.exercise.target_muscle_groups:
                for muscle in log.exercise.target_muscle_groups:
                    muscle_volumes[muscle]["volume"] += volume
                    muscle_volumes[muscle]["sessions"].add(session.id)

    muscle_group_list = [
        MuscleGroupVolume(
            muscle_group=muscle,
            total_volume=data["volume"],
            session_count=len(data["sessions"]),
        )
        for muscle, data in sorted(muscle_volumes.items())
    ]

    return StatsResponse(
        user_id=current_user.id,
        period_days=days,
        muscle_group_volumes=muscle_group_list,
        total_sessions=len(sessions),
        total_volume=total_volume,
    )
