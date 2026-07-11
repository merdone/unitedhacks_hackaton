from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import WorkoutTemplate, User
from ..schemas import TemplateCreate, TemplateResponse
from ..auth import get_current_user

router = APIRouter(prefix="/templates", tags=["Workout Templates"])


@router.get("/", response_model=list[TemplateResponse])
async def list_templates(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all workout templates for the current user."""
    result = await db.execute(
        select(WorkoutTemplate).where(WorkoutTemplate.user_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/", response_model=TemplateResponse, status_code=201)
async def create_template(
    data: TemplateCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new workout template."""
    template = WorkoutTemplate(
        user_id=current_user.id,
        name=data.name,
        exercises=[ex.model_dump() for ex in data.exercises],
    )
    db.add(template)
    await db.flush()
    await db.refresh(template)
    return template
