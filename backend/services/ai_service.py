import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import User, ReadinessQuestionnaire, WorkoutSession
from ..schemas import AIRecommendationResponse


async def get_ai_recommendation(user: User, db: AsyncSession) -> AIRecommendationResponse:
    """
    Build context from user data and generate AI recommendation.

    Context includes:
    1. User's medical conditions
    2. Today's readiness questionnaire
    3. Last 3 workout session volumes

    Currently returns a mock response. In production, the context string
    would be sent to OpenAI/Anthropic API.
    """

    # 1. Get today's readiness questionnaire
    today = datetime.date.today()
    result = await db.execute(
        select(ReadinessQuestionnaire)
        .where(
            ReadinessQuestionnaire.user_id == user.id,
            ReadinessQuestionnaire.date == today,
        )
        .order_by(ReadinessQuestionnaire.id.desc())
        .limit(1)
    )
    readiness = result.scalar_one_or_none()

    # 2. Get last 3 completed workout sessions
    result = await db.execute(
        select(WorkoutSession)
        .where(
            WorkoutSession.user_id == user.id,
            WorkoutSession.end_time.isnot(None),
        )
        .order_by(WorkoutSession.start_time.desc())
        .limit(3)
    )
    recent_sessions = result.scalars().all()

    # 3. Build context string (would be sent to LLM in production)
    context = _build_context(user, readiness, recent_sessions)

    # 4. Generate mock response based on readiness data
    recommendation, modifications = _generate_mock_recommendation(readiness, recent_sessions)

    return AIRecommendationResponse(
        recommendation=recommendation,
        modifications=modifications,
    )


def _build_context(
    user: User,
    readiness: ReadinessQuestionnaire | None,
    sessions: list[WorkoutSession],
) -> str:
    """
    Format user data into a prompt for the LLM.

    In production, this string would be sent as part of the system/user
    message to the AI API.
    """
    parts = [
        f"User Profile: {user.name}, age {user.age}, weight {user.weight_current}kg, height {user.height}cm",
        f"Medical Conditions: {', '.join(user.medical_conditions) if user.medical_conditions else 'None'}",
    ]

    if readiness:
        parts.append(
            f"Today's Readiness: Sleep={readiness.sleep_quality}/10, "
            f"Mood={readiness.mood}/10, Motivation={readiness.motivation}/10, "
            f"Fatigue={readiness.fatigue_level}/10"
        )
        if readiness.additional_notes:
            parts.append(f"Additional Notes: {readiness.additional_notes}")

    if sessions:
        volumes = [s.total_volume or 0 for s in sessions]
        avg_volume = sum(volumes) / len(volumes) if volumes else 0
        parts.append(f"Last {len(sessions)} sessions average volume: {avg_volume:.0f}kg")

    return "\n".join(parts)


def _generate_mock_recommendation(
    readiness: ReadinessQuestionnaire | None,
    sessions: list[WorkoutSession],
) -> tuple[str, dict]:
    """Generate a mock AI recommendation based on readiness scores."""

    if not readiness:
        return (
            "No readiness data for today. Please complete the pre-workout check-in first. "
            "Proceeding with standard workout plan.",
            {"volume_adjustment": 0, "intensity": "normal"},
        )

    # Calculate composite readiness score
    avg_score = (
        readiness.sleep_quality
        + readiness.mood
        + readiness.motivation
        + (10 - readiness.fatigue_level)  # Invert fatigue: high fatigue → low score
    ) / 4

    if avg_score >= 8:
        return (
            "🔥 You're feeling great today! Consider pushing yourself with increased volume "
            "or adding an extra set to compound movements. Your recovery and motivation are optimal.",
            {
                "volume_adjustment": 15,
                "intensity": "high",
                "extra_sets": True,
                "focus": "progressive overload",
            },
        )
    elif avg_score >= 6:
        return (
            "✅ Solid readiness scores. Stick with your planned workout. "
            "Focus on maintaining good form and progressive overload.",
            {
                "volume_adjustment": 0,
                "intensity": "normal",
                "extra_sets": False,
                "focus": "consistency",
            },
        )
    elif avg_score >= 4:
        return (
            "⚠️ Moderate readiness detected. Consider reducing volume by 15-20% today. "
            "Focus on technique and don't chase PRs. Listen to your body.",
            {
                "volume_adjustment": -20,
                "intensity": "moderate",
                "reduce_weight": True,
                "focus": "technique",
            },
        )
    else:
        return (
            "🛑 Low readiness scores. Strongly recommend a light session or active recovery. "
            "Reduce volume by 40% and focus on mobility work. Rest is productive too!",
            {
                "volume_adjustment": -40,
                "intensity": "low",
                "active_recovery": True,
                "focus": "recovery",
            },
        )
