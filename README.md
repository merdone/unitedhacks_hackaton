# FitPulse

Readiness-first fitness MVP for United Hacks. Users can register, complete a pre-workout check-in, receive a training recommendation, log a workout, save post-workout feedback, and review progress stats.

## Quick Start

1. Copy `.env.example` to `.env` and adjust `DATABASE_URL` / `SECRET_KEY`.
2. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Start the FastAPI backend:

```bash
uvicorn backend.main:app --reload
```

4. Seed base exercises:

```bash
python seed_exercises.py
```

5. Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:8000` for the API. Set `VITE_API_BASE_URL` when the backend runs elsewhere.
