import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { exercisesAPI } from '../api/apiService';
import { useWorkout } from '../context/WorkoutContext';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const { session, logs, addLog, removeLog, setExercises } = useWorkout();
  const [availableExercises, setAvailableExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '', rpe: '' });
  const [newExerciseName, setNewExerciseName] = useState('');
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  const loadExercises = useCallback(async () => {
    try {
      const res = await exercisesAPI.list();
      setAvailableExercises(res.data);
      setExercises(res.data);
      if (res.data.length > 0) setCurrentExercise(res.data[0].id);
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  }, [setExercises]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.start_time) {
        const start = new Date(session.start_time).getTime();
        setElapsedTime(Math.floor((Date.now() - start) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hrs > 0
      ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleAddSet = () => {
    if (!currentExercise || !currentSet.reps || !currentSet.weight) return;

    const exercise = availableExercises.find((e) => e.id === parseInt(currentExercise));
    const exerciseLogs = logs.filter((l) => l.exercise_id === parseInt(currentExercise));

    addLog({
      exercise_id: parseInt(currentExercise),
      exercise_name: exercise?.name || 'Unknown',
      set_number: exerciseLogs.length + 1,
      reps: parseInt(currentSet.reps),
      weight: parseFloat(currentSet.weight),
      rpe: currentSet.rpe ? parseFloat(currentSet.rpe) : null,
    });

    setCurrentSet({ ...currentSet, reps: '', rpe: '' });
  };

  const handleCreateExercise = async () => {
    const name = newExerciseName.trim();
    if (!name) return;

    setCreatingExercise(true);
    setExerciseError('');
    try {
      const res = await exercisesAPI.create({
        name,
        description: null,
        target_muscle_groups: [],
      });
      const nextExercises = [...availableExercises, res.data];
      setAvailableExercises(nextExercises);
      setExercises(nextExercises);
      setCurrentExercise(res.data.id);
      setNewExerciseName('');
    } catch (err) {
      console.error('Failed to create exercise:', err);
      setExerciseError('Could not create exercise. Please try again.');
    } finally {
      setCreatingExercise(false);
    }
  };

  const handleFinish = () => {
    navigate('/summary');
  };

  const currentVolume = logs.reduce((sum, log) => sum + log.reps * log.weight, 0);

  // Group logs by exercise
  const groupedLogs = {};
  logs.forEach((log, index) => {
    const key = log.exercise_id;
    if (!groupedLogs[key]) {
      groupedLogs[key] = { name: log.exercise_name, sets: [] };
    }
    groupedLogs[key].sets.push({ ...log, index });
  });

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">🏋️</div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Workout</h2>
        <p className="text-slate-400 mb-6">Start a workout from the check-in page first.</p>
        <button onClick={() => navigate('/checkin')} className="btn-gradient">
          <span>Go to Check-in</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header with timer */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-white">Active Workout</h1>
          <p className="text-slate-400 mt-1">Log your sets below</p>
        </div>
        <div className="glass-card px-5 py-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Duration</p>
          <p className="text-2xl font-bold gradient-text font-mono">{formatTime(elapsedTime)}</p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-1">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium">Total Volume</p>
          <p className="text-xl font-bold text-white mt-1">{currentVolume.toLocaleString()} kg</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium">Sets Done</p>
          <p className="text-xl font-bold text-white mt-1">{logs.length}</p>
        </div>
      </div>

      {/* Add Set Form */}
      <div className="glass-card p-6 md:p-8 animate-fade-in-up stagger-2">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm text-cyan-400">+</span>
          Add Set
        </h3>

        <div className="space-y-5">
          <select
            id="workout-exercise-select"
            value={currentExercise}
            onChange={(e) => setCurrentExercise(e.target.value)}
            className="input-field py-3 text-base"
          >
            <option value="">Select exercise...</option>
            {availableExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Add Exercise
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="workout-new-exercise"
                type="text"
                className="input-field flex-1"
                placeholder="e.g. Goblet squat"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateExercise();
                  }
                }}
              />
              <button
                id="workout-create-exercise"
                type="button"
                onClick={handleCreateExercise}
                disabled={creatingExercise || !newExerciseName.trim()}
                className="btn-secondary px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingExercise ? 'Adding...' : 'Add'}
              </button>
            </div>
            {exerciseError && <p className="mt-2 text-sm text-rose-400">{exerciseError}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Reps</label>
              <input
                id="workout-reps"
                type="number"
                className="input-field text-center"
                placeholder="12"
                value={currentSet.reps}
                onChange={(e) => setCurrentSet({ ...currentSet, reps: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSet()}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Weight (kg)</label>
              <input
                id="workout-weight"
                type="number"
                step="0.5"
                className="input-field text-center"
                placeholder="60"
                value={currentSet.weight}
                onChange={(e) => setCurrentSet({ ...currentSet, weight: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSet()}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">RPE</label>
              <input
                id="workout-rpe"
                type="number"
                min="1"
                max="10"
                step="0.5"
                className="input-field text-center"
                placeholder="7"
                value={currentSet.rpe}
                onChange={(e) => setCurrentSet({ ...currentSet, rpe: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSet()}
              />
            </div>
          </div>

          <button
            id="workout-add-set"
            onClick={handleAddSet}
            className="btn-gradient w-full"
          >
            <span>Add Set</span>
          </button>
        </div>
      </div>

      {/* Logged Sets */}
      {Object.keys(groupedLogs).length > 0 && (
        <div className="space-y-4 animate-fade-in-up stagger-3">
          <h3 className="text-base font-semibold text-slate-300">Logged Sets</h3>
          {Object.entries(groupedLogs).map(([exerciseId, group]) => (
            <div key={exerciseId} className="glass-card p-6">
              <h4 className="font-semibold text-white text-base mb-3">{group.name}</h4>
              <div className="space-y-2">
                {group.sets.map((set) => (
                  <div
                    key={set.index}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 text-sm md:text-base group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-xs w-14">Set {set.set_number}</span>
                      <span className="text-white font-medium">{set.reps} reps</span>
                      <span className="text-slate-400">×</span>
                      <span className="text-white font-medium">{set.weight} kg</span>
                      {set.rpe && (
                        <span className="text-slate-400 text-xs">RPE {set.rpe}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeLog(set.index)}
                      className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Finish Button */}
      {logs.length > 0 && (
        <div className="pt-4">
          <button
            id="workout-finish"
            onClick={handleFinish}
            className="btn-gradient w-full text-center text-xl py-5 bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-emerald-400/30"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            <span>✅ Finish Workout</span>
          </button>
        </div>
      )}
    </div>
  );
}
