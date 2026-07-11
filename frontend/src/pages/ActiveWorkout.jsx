import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exercisesAPI, workoutsAPI } from '../api/apiService';
import { useWorkout } from '../context/WorkoutContext';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const { session, logs, addLog, removeLog, exercises, setExercises } = useWorkout();
  const [availableExercises, setAvailableExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '', rpe: '' });
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    loadExercises();
  }, []);

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

  const loadExercises = async () => {
    try {
      const res = await exercisesAPI.list();
      setAvailableExercises(res.data);
      setExercises(res.data);
      if (res.data.length > 0) setCurrentExercise(res.data[0].id);
    } catch (err) {
      console.error('Failed to load exercises:', err);
    }
  };

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
    <div className="max-w-2xl mx-auto space-y-5">
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
      <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-1">
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
      <div className="glass-card p-5 animate-fade-in-up stagger-2">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center text-xs text-cyan-400">+</span>
          Add Set
        </h3>

        <div className="space-y-3">
          <select
            id="workout-exercise-select"
            value={currentExercise}
            onChange={(e) => setCurrentExercise(e.target.value)}
            className="input-field"
          >
            <option value="">Select exercise...</option>
            {availableExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

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
        <div className="space-y-3 animate-fade-in-up stagger-3">
          <h3 className="text-sm font-semibold text-slate-300">Logged Sets</h3>
          {Object.entries(groupedLogs).map(([exerciseId, group]) => (
            <div key={exerciseId} className="glass-card p-4">
              <h4 className="font-semibold text-white text-sm mb-2">{group.name}</h4>
              <div className="space-y-1.5">
                {group.sets.map((set) => (
                  <div
                    key={set.index}
                    className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2 text-sm group"
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
        <button
          id="workout-finish"
          onClick={handleFinish}
          className="btn-gradient w-full text-center text-lg py-4 bg-gradient-to-r from-emerald-500 to-green-600"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          <span>✅ Finish Workout</span>
        </button>
      )}
    </div>
  );
}
