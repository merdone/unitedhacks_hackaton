from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import User
from ..schemas import AIRecommendationResponse
from ..auth import get_current_user
from ..services.ai_service import get_ai_recommendation

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/recommendation", response_model=AIRecommendationResponse)
async def get_recommendation(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get AI-powered workout recommendation based on:
    - User's medical conditions
    - Today's readiness questionnaire
    - Last 3 workout session volumes
    """
    return await get_ai_recommendation(current_user, db)
