import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsAPI } from '../api/apiService';
import { useWorkout } from '../context/WorkoutContext';

export default function PostWorkoutSummary() {
  const navigate = useNavigate();
  const { session, logs, completeWorkout, reset } = useWorkout();
  const [feedback, setFeedback] = useState({
    perceived_difficulty: 5,
    metrics_photo_url: '',
    voice_transcription_text: '',
  });
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const totalVolume = logs.reduce((sum, log) => sum + log.reps * log.weight, 0);
  const totalSets = logs.length;
  const uniqueExercises = new Set(logs.map((l) => l.exercise_id)).size;

  const handleSubmit = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const apiLogs = logs.map((log) => ({
        exercise_id: log.exercise_id,
        set_number: log.set_number,
        reps: log.reps,
        weight: log.weight,
        rpe: log.rpe,
      }));

      const res = await workoutsAPI.complete(session.id, {
        logs: apiLogs,
        feedback: {
          perceived_difficulty: feedback.perceived_difficulty,
          metrics_photo_url: feedback.metrics_photo_url || null,
          voice_transcription_text: feedback.voice_transcription_text || null,
        },
      });

      completeWorkout(res.data);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to complete workout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    reset();
    navigate('/dashboard');
  };

  if (!session && !completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-white mb-2">No Workout to Summarize</h2>
        <p className="text-slate-400 mb-6">Complete a workout first.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-gradient">
          <span>Go to Dashboard</span>
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-500/30">
          ✅
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Workout Complete!</h1>
        <p className="text-slate-400 mb-8">Great job! Here's your session summary.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5">
            <p className="text-xs text-slate-500 uppercase font-medium">Volume</p>
            <p className="text-2xl font-bold text-white mt-1">{totalVolume.toLocaleString()}</p>
            <p className="text-xs text-slate-400">kg</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-slate-500 uppercase font-medium">Sets</p>
            <p className="text-2xl font-bold text-white mt-1">{totalSets}</p>
            <p className="text-xs text-slate-400">completed</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-xs text-slate-500 uppercase font-medium">Exercises</p>
            <p className="text-2xl font-bold text-white mt-1">{uniqueExercises}</p>
            <p className="text-xs text-slate-400">performed</p>
          </div>
        </div>

        <button onClick={handleDone} className="btn-gradient text-lg py-3 px-8">
          <span>Back to Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Workout Summary</h1>
        <p className="text-slate-400">Review your workout and provide feedback</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-1">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium">Volume</p>
          <p className="text-xl font-bold gradient-text mt-1">{totalVolume.toLocaleString()} kg</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium">Sets</p>
          <p className="text-xl font-bold text-white mt-1">{totalSets}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium">Exercises</p>
          <p className="text-xl font-bold text-white mt-1">{uniqueExercises}</p>
        </div>
      </div>

      {/* Perceived Difficulty */}
      <div className="glass-card p-5 animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <span>🎯</span> Perceived Difficulty
          </label>
          <span className="text-2xl font-bold gradient-text">{feedback.perceived_difficulty}</span>
        </div>
        <input
          id="summary-difficulty"
          type="range"
          min="1"
          max="10"
          value={feedback.perceived_difficulty}
          onChange={(e) =>
            setFeedback({ ...feedback, perceived_difficulty: parseInt(e.target.value) })
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Very Easy</span>
          <span>Maximum Effort</span>
        </div>
      </div>

      {/* Photo URL */}
      <div className="glass-card p-5 animate-fade-in-up stagger-3">
        <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>📸</span> Progress Photo URL
        </label>
        <input
          id="summary-photo"
          type="url"
          className="input-field"
          placeholder="https://example.com/photo.jpg"
          value={feedback.metrics_photo_url}
          onChange={(e) => setFeedback({ ...feedback, metrics_photo_url: e.target.value })}
        />
      </div>

      {/* Notes */}
      <div className="glass-card p-5 animate-fade-in-up stagger-4">
        <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>📝</span> Session Notes
        </label>
        <textarea
          id="summary-notes"
          rows={3}
          className="input-field resize-none"
          placeholder="How did it go? Any notable PRs or issues?"
          value={feedback.voice_transcription_text}
          onChange={(e) =>
            setFeedback({ ...feedback, voice_transcription_text: e.target.value })
          }
        />
      </div>

      {/* Submit */}
      <button
        id="summary-submit"
        onClick={handleSubmit}
        disabled={loading}
        className="btn-gradient w-full text-center text-lg py-4 disabled:opacity-50"
      >
        <span>{loading ? 'Saving...' : '💾 Save & Complete'}</span>
      </button>
    </div>
  );
}
