import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
import sys
from pathlib import Path

# Make the script runnable from any working directory.
PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.config import settings
from backend.models import Exercise

engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

exercises_data = [
    {
        "name": "Barbell Bench Press",
        "description": "A classic compound exercise for building chest size and strength.",
        "target_muscle_groups": ["Chest", "Triceps", "Shoulders"],
        "is_custom": False,
    },
    {
        "name": "Barbell Squat",
        "description": "The king of all leg exercises, targets the entire lower body.",
        "target_muscle_groups": ["Quads", "Glutes", "Hamstrings"],
        "is_custom": False,
    },
    {
        "name": "Deadlift",
        "description": "A powerful compound movement for the posterior chain.",
        "target_muscle_groups": ["Back", "Glutes", "Hamstrings", "Core"],
        "is_custom": False,
    },
    {
        "name": "Pull-up",
        "description": "A bodyweight exercise that builds a wide and thick back.",
        "target_muscle_groups": ["Back", "Biceps"],
        "is_custom": False,
    },
    {
        "name": "Overhead Press",
        "description": "Standing barbell press for shoulder strength and size.",
        "target_muscle_groups": ["Shoulders", "Triceps"],
        "is_custom": False,
    },
    {
        "name": "Barbell Row",
        "description": "Bent-over row to build back thickness.",
        "target_muscle_groups": ["Back", "Biceps"],
        "is_custom": False,
    },
    {
        "name": "Dumbbell Bicep Curl",
        "description": "Isolation exercise for the biceps.",
        "target_muscle_groups": ["Biceps"],
        "is_custom": False,
    },
    {
        "name": "Tricep Pushdown",
        "description": "Cable exercise targeting the triceps.",
        "target_muscle_groups": ["Triceps"],
        "is_custom": False,
    },
    {
        "name": "Leg Press",
        "description": "Machine exercise for heavy leg pressing.",
        "target_muscle_groups": ["Quads", "Glutes", "Hamstrings"],
        "is_custom": False,
    },
    {
        "name": "Seated Calf Raise",
        "description": "Isolation exercise for the soleus muscle in the calves.",
        "target_muscle_groups": ["Calves"],
        "is_custom": False,
    },
    {
        "name": "Lat Pulldown",
        "description": "Cable machine variation of the pull-up.",
        "target_muscle_groups": ["Back", "Biceps"],
        "is_custom": False,
    },
    {
        "name": "Incline Dumbbell Press",
        "description": "Focuses on the upper portion of the chest.",
        "target_muscle_groups": ["Chest", "Shoulders", "Triceps"],
        "is_custom": False,
    },
    {
        "name": "Romanian Deadlift",
        "description": "A deadlift variation focusing heavily on the hamstrings.",
        "target_muscle_groups": ["Hamstrings", "Glutes", "Lower Back"],
        "is_custom": False,
    },
    {
        "name": "Leg Extension",
        "description": "Isolation exercise for the quadriceps.",
        "target_muscle_groups": ["Quads"],
        "is_custom": False,
    },
    {
        "name": "Leg Curl",
        "description": "Isolation exercise for the hamstrings.",
        "target_muscle_groups": ["Hamstrings"],
        "is_custom": False,
    }
]

async def seed():
    async with async_session() as session:
        result = await session.execute(select(Exercise).where(Exercise.is_custom == False))
        existing = result.scalars().all()
        existing_names = {ex.name for ex in existing}
        
        added_count = 0
        for ex_data in exercises_data:
            if ex_data["name"] not in existing_names:
                ex = Exercise(
                    name=ex_data["name"],
                    description=ex_data["description"],
                    target_muscle_groups=ex_data["target_muscle_groups"],
                    is_custom=ex_data["is_custom"]
                )
                session.add(ex)
                added_count += 1
                
        if added_count > 0:
            await session.commit()
            print(f"Successfully seeded {added_count} exercises.")
        else:
            print("Exercises already exist in the database.")

if __name__ == "__main__":
    asyncio.run(seed())
