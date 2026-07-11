from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth, users, exercises, templates, workouts, readiness, ai, voice, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup (dev only — use Alembic migrations in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="Fitness MVP API",
    description="Fitness application MVP for tracking workout progress with AI assistance",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(exercises.router)
app.include_router(templates.router)
app.include_router(workouts.router)
app.include_router(readiness.router)
app.include_router(ai.router)
app.include_router(voice.router)
app.include_router(stats.router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Fitness MVP API",
        "docs": "/docs",
        "version": "1.0.0",
    }
