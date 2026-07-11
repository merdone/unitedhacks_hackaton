# Project Definition: Fitness MVP for Hackathon

## 1. Project Goal
Develop a fitness application MVP to track workout progress and manage training volume using subjective readiness questionnaires and an AI assistant context.

## 2. Tech Stack
* **Frontend:** React (SPA, functional components, hooks).
* **Backend:** Python 3.10+, FastAPI.
* **Database:** PostgreSQL.
* **ORM & Migrations:** SQLAlchemy (async), Alembic.
* **External APIs:** OpenAI/Anthropic API (for AI assistant), Speech-to-Text API (Whisper or similar for voice input).

## 3. Database Schema (SQLAlchemy Models)
Generate async SQLAlchemy models for the following entities:

* **User:** `id`, `name`, `age`, `weight_current`, `height`, `medical_conditions` (JSONB or text array, e.g., "diabetes"), `photo_url`, `created_at`.
* **Exercise:** `id`, `name`, `description`, `target_muscle_groups` (array of strings), `is_custom` (boolean).
* **WorkoutTemplate:** `id`, `user_id` (FK), `name`, `exercises` (M2M or JSONB array of exercise IDs with default sets/reps).
* **ReadinessQuestionnaire:** `id`, `user_id` (FK), `date`, `sleep_quality` (1-10), `mood` (1-10), `motivation` (1-10), `fatigue_level` (1-10), `additional_notes` (text).
* **WorkoutSession:** `id`, `user_id` (FK), `template_id` (FK), `start_time`, `end_time`, `total_volume`, `ai_recommendation_given` (text).
* **WorkoutLog (Sets/Reps):** `id`, `session_id` (FK), `exercise_id` (FK), `reps`, `weight`, `rpe` (Rate of Perceived Exertion).
* **PostWorkoutFeedback:** `id`, `session_id` (FK), `perceived_difficulty` (1-10), `metrics_photo_url`, `voice_transcription_text`.

## 4. Backend (FastAPI) Requirements
Implement the following REST API endpoints with Pydantic validation:

### Users & Profiles
* `POST /users/` - Create profile.
* `GET /users/{id}` - Retrieve profile and basic stats.

### Workouts & Templates
* `GET /exercises/` - List base and user-custom exercises.
* `POST /templates/` - Create a workout template.
* `POST /workouts/start` - Initiate a session.

### Readiness & AI Logic
* `POST /readiness/` - Submit pre-workout questionnaire.
* `POST /ai/recommendation` - Send prompt to LLM. 
    * *Context building logic:* Fetch user's medical conditions + today's `ReadinessQuestionnaire` + aggregate data of last 3 `WorkoutSession` volumes. Send to LLM to return a JSON with recommended modifications (e.g., "reduce volume by 20%").
* `POST /voice/transcribe` - Endpoint to receive audio blob, send to STT service, return text string to be added to AI context.

### Post-Workout & Stats
* `POST /workouts/{id}/complete` - Submit sets/reps, calculate total volume, save `PostWorkoutFeedback`.
* `GET /stats/{user_id}` - Aggregate volume per muscle group over time.

## 5. Frontend (React) Requirements
Generate the component structure and API service calls (using Axios or Fetch).

* **Pages:**
    * `ProfileSetup`: Form for user data and medical conditions.
    * `Dashboard`: Recent stats, button to start a workout.
    * `PreWorkoutCheckin`: Form for sleep, mood, motivation + Voice input component (MediaRecorder API).
    * `AiRecommendation`: Display AI output modifying the planned template.
    * `ActiveWorkout`: Interface to log sets, reps, and weight.
    * `PostWorkoutSummary`: Form for feedback, metrics upload, and display of session volume stats.
* **State Management:** React Context or Zustand for current workout session state.

## 6. Execution Steps for Antigravity
1.  Initialize FastAPI project structure with `main.py`, `database.py`, `models.py`, `schemas.py`, and `routers/`.
2.  Provide Alembic configuration `env.py` adapted for async SQLAlchemy.
3.  Implement CRUD operations in backend routes.
4.  Write the prompt engineering function in Python that formats user data for the AI API.
5.  Initialize Vite/React project structure.
6.  Generate the React components listed above with basic Tailwind CSS styling.