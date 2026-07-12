import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { exercisesAPI } from '../api/apiService';
import AppIcon from '../components/AppIcon';
import MotionPage from '../components/MotionPage';
import { useWorkout } from '../context/WorkoutContext';

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const secondsText = String(remainingSeconds).padStart(2, '0');
  const minutesText = String(minutes).padStart(2, '0');
  return hours > 0 ? String(hours) + ':' + minutesText + ':' + secondsText : String(minutes) + ':' + secondsText;
}

function WorkoutMetric({ icon, label, value, detail, tone }) {
  return (
    <div className="app-panel-soft p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-black tracking-[-0.05em] text-white sm:text-2xl">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={['grid size-9 place-items-center rounded-xl border', tone].join(' ')}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" />
        </span>
      </div>
    </div>
  );
}

function EmptyWorkout({ onStart }) {
  return (
    <MotionPage className="app-page">
      <motion.section
        className="app-panel mx-auto max-w-xl p-7 text-center sm:p-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100">
            <AppIcon name="dumbbell" className="h-8 w-8" strokeWidth={1.8} />
          </span>
          <p className="app-kicker mt-7">No active session</p>
          <h1 className="mt-4 text-2xl font-black tracking-[-0.05em] text-white">Start with a readiness check-in.</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            It takes a moment and gives the workout a direction before you begin logging.
          </p>
          <button type="button" onClick={onStart} className="app-button-primary mt-7">
            Go to check-in
            <AppIcon name="arrowRight" className="h-4 w-4" strokeWidth={2.3} />
          </button>
        </div>
      </motion.section>
    </MotionPage>
  );
}

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const { session, template, logs, addLog, removeLog, setExercises } = useWorkout();
  const [availableExercises, setAvailableExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [currentSet, setCurrentSet] = useState({ reps: '', weight: '', rpe: '' });
  const [newExerciseName, setNewExerciseName] = useState('');
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState('');
  const [setError, setSetError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  const loadExercises = useCallback(async () => {
    try {
      const response = await exercisesAPI.list();
      const nextExercises = response.data || [];
      setAvailableExercises(nextExercises);
      setExercises(nextExercises);
      setCurrentExercise((current) => current || String(nextExercises[0]?.id || ''));
    } catch (err) {
      console.error('Failed to load exercises:', err);
      setExerciseError('Your exercise library could not load. You can retry without losing this session.');
    }
  }, [setExercises]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  useEffect(() => {
    if (!session?.start_time) return undefined;

    const updateElapsedTime = () => {
      const start = new Date(session.start_time).getTime();
      setElapsedTime(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    };

    updateElapsedTime();
    const interval = window.setInterval(updateElapsedTime, 1000);
    return () => window.clearInterval(interval);
  }, [session]);

  const currentVolume = useMemo(
    () => logs.reduce((sum, log) => sum + Number(log.reps) * Number(log.weight), 0),
    [logs],
  );

  const groupedLogs = useMemo(() => {
    return logs.reduce((groups, log, index) => {
      const key = log.exercise_id;
      if (!groups[key]) groups[key] = { name: log.exercise_name, sets: [] };
      groups[key].sets.push({ ...log, index });
      return groups;
    }, {});
  }, [logs]);

  const selectedExercise = availableExercises.find((exercise) => exercise.id === Number(currentExercise));

  const handleAddSet = () => {
    const reps = Number(currentSet.reps);
    const weight = Number(currentSet.weight);
    const rpe = currentSet.rpe === '' ? null : Number(currentSet.rpe);

    if (!currentExercise || !Number.isFinite(reps) || reps <= 0 || !Number.isFinite(weight) || weight < 0) {
      setSetError('Choose an exercise and enter valid reps and load before adding a set.');
      return;
    }

    if (rpe !== null && (!Number.isFinite(rpe) || rpe < 1 || rpe > 10)) {
      setSetError('RPE should be a number from 1 to 10.');
      return;
    }

    const exerciseLogs = logs.filter((log) => log.exercise_id === Number(currentExercise));
    addLog({
      exercise_id: Number(currentExercise),
      exercise_name: selectedExercise?.name || 'Custom exercise',
      set_number: exerciseLogs.length + 1,
      reps,
      weight,
      rpe,
    });

    setCurrentSet((current) => ({ ...current, reps: '', rpe: '' }));
    setSetError('');
  };

  const handleCreateExercise = async () => {
    const name = newExerciseName.trim();
    if (!name) return;

    setCreatingExercise(true);
    setExerciseError('');
    try {
      const response = await exercisesAPI.create({
        name,
        description: null,
        target_muscle_groups: [],
      });
      const nextExercises = [...availableExercises, response.data];
      setAvailableExercises(nextExercises);
      setExercises(nextExercises);
      setCurrentExercise(String(response.data.id));
      setNewExerciseName('');
    } catch (err) {
      console.error('Failed to create exercise:', err);
      setExerciseError('Could not add that exercise. Please try again.');
    } finally {
      setCreatingExercise(false);
    }
  };

  if (!session) return <EmptyWorkout onStart={() => navigate('/checkin')} />;

  return (
    <MotionPage className="app-page space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="app-kicker">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-200" />
            </span>
            Workout in progress
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
            Stay present. Log the work.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
            {template?.name ? template.name + ' is selected for this session.' : 'Free-form session — build it set by set.'}
          </p>
        </div>
        <div className="app-panel-soft flex items-center gap-3 px-4 py-3">
          <span className="grid size-9 place-items-center rounded-xl bg-cyan-300/[0.08] text-cyan-100">
            <AppIcon name="clock" className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-[0.63rem] font-bold uppercase tracking-[0.14em] text-slate-500">Session time</p>
            <p className="font-mono text-lg font-black tracking-[-0.05em] text-white">{formatTime(elapsedTime)}</p>
          </div>
        </div>
      </header>

      <section className="app-panel p-4 sm:p-5">
        <div className="relative grid gap-3 sm:grid-cols-3">
          <WorkoutMetric
            icon="barChart"
            label="Volume"
            value={Math.round(currentVolume).toLocaleString() + ' kg'}
            detail="so far"
            tone="border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100"
          />
          <WorkoutMetric
            icon="layers"
            label="Completed sets"
            value={logs.length}
            detail="logged in this session"
            tone="border-violet-300/15 bg-violet-300/[0.08] text-violet-100"
          />
          <WorkoutMetric
            icon="target"
            label="Exercises"
            value={Object.keys(groupedLogs).length}
            detail="movement patterns"
            tone="border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100"
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.64fr)] lg:items-start">
        <motion.section
          className="app-panel p-5 sm:p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <div className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Set logger</p>
                <h2 className="mt-2 text-xl font-bold text-white">Add the next working set</h2>
              </div>
              <span className="app-kicker">
                <AppIcon name="dumbbell" className="h-3.5 w-3.5" />
                {selectedExercise?.name || 'Choose movement'}
              </span>
            </div>

            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleAddSet();
              }}
            >
              <div>
                <label htmlFor="workout-exercise-select" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  Exercise
                </label>
                <select
                  id="workout-exercise-select"
                  value={currentExercise}
                  onChange={(event) => {
                    setCurrentExercise(event.target.value);
                    setSetError('');
                  }}
                  className="input-field h-12 appearance-none py-0 text-sm font-semibold"
                >
                  <option value="">Select an exercise</option>
                  {availableExercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="workout-reps" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                    Reps
                  </label>
                  <input
                    id="workout-reps"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    className="input-field h-12 text-center font-bold"
                    placeholder="8"
                    value={currentSet.reps}
                    onChange={(event) => setCurrentSet((current) => ({ ...current, reps: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="workout-weight" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                    Load (kg)
                  </label>
                  <input
                    id="workout-weight"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    className="input-field h-12 text-center font-bold"
                    placeholder="60"
                    value={currentSet.weight}
                    onChange={(event) => setCurrentSet((current) => ({ ...current, weight: event.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="workout-rpe" className="mb-2 block text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                    RPE <span className="normal-case tracking-normal text-slate-600">optional</span>
                  </label>
                  <input
                    id="workout-rpe"
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    inputMode="decimal"
                    className="input-field h-12 text-center font-bold"
                    placeholder="7"
                    value={currentSet.rpe}
                    onChange={(event) => setCurrentSet((current) => ({ ...current, rpe: event.target.value }))}
                  />
                </div>
              </div>

              {setError ? (
                <p role="alert" className="rounded-xl border border-rose-300/15 bg-rose-400/[0.07] px-3 py-2.5 text-sm text-rose-100">
                  {setError}
                </p>
              ) : null}

              <motion.button
                id="workout-add-set"
                type="submit"
                className="app-button-primary w-full"
                whileTap={{ scale: 0.985 }}
              >
                <AppIcon name="plus" className="h-5 w-5" strokeWidth={2.4} />
                Add set
              </motion.button>
            </form>

            <div className="mt-5 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => setExerciseError('')}
                className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span>
                  <span className="block text-sm font-bold text-slate-200">Need another movement?</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">Add it to your personal exercise library below.</span>
                </span>
                <AppIcon name="plus" className="h-5 w-5 shrink-0 text-cyan-200" />
              </button>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  id="workout-new-exercise"
                  type="text"
                  className="input-field h-11 flex-1 text-sm"
                  placeholder="Example: Goblet squat"
                  value={newExerciseName}
                  onChange={(event) => setNewExerciseName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleCreateExercise();
                    }
                  }}
                />
                <button
                  id="workout-create-exercise"
                  type="button"
                  onClick={handleCreateExercise}
                  disabled={creatingExercise || !newExerciseName.trim()}
                  className="app-button-secondary min-h-11 shrink-0 px-4 text-sm"
                >
                  {creatingExercise ? 'Adding…' : 'Add exercise'}
                </button>
              </div>
              {exerciseError ? (
                <div role="alert" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-rose-100">
                  <span>{exerciseError}</span>
                  <button type="button" onClick={loadExercises} className="font-bold text-rose-200 underline underline-offset-4">
                    Retry library
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </motion.section>

        <motion.aside
          className="app-panel sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-5 sm:p-6 app-scrollbar"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.38 }}
        >
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Session log</p>
                <h2 className="mt-2 text-xl font-bold text-white">Sets recorded</h2>
              </div>
              <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-black text-slate-200">
                {logs.length}
              </span>
            </div>

            {logs.length ? (
              <div className="mt-6 space-y-5">
                {Object.entries(groupedLogs).map(([exerciseId, group]) => (
                  <section key={exerciseId}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-200">{group.name}</h3>
                      <span className="text-xs font-semibold text-slate-600">{group.sets.length} sets</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <AnimatePresence initial={false}>
                        {group.sets.map((set) => (
                          <motion.div
                            key={String(exerciseId) + '-' + set.index}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-3"
                            initial={{ opacity: 0, x: 12, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.98 }}
                            transition={{ duration: 0.22 }}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Set {set.set_number}</p>
                              <p className="mt-1 text-sm font-bold text-slate-200">
                                {set.reps} reps <span className="px-1 text-slate-600">×</span> {set.weight} kg
                              </p>
                              {set.rpe ? <p className="mt-1 text-xs text-slate-500">RPE {set.rpe}</p> : null}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLog(set.index)}
                              aria-label={'Remove set ' + set.set_number + ' of ' + group.name}
                              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-rose-300/25 hover:bg-rose-400/[0.08] hover:text-rose-100"
                            >
                              <AppIcon name="trash" className="h-4 w-4" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-6 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-white/[0.05] text-slate-400">
                  <AppIcon name="layers" className="h-5 w-5" />
                </span>
                <p className="mt-4 text-sm font-bold text-slate-300">Your first set goes here.</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Log one set at a time and keep the session moving.</p>
              </div>
            )}
          </div>
        </motion.aside>
      </div>

      {logs.length ? (
        <motion.button
          id="workout-finish"
          type="button"
          onClick={() => navigate('/summary')}
          className="app-button-primary w-full border-emerald-200/45 bg-[linear-gradient(135deg,#bbf7d0,#86efac_45%,#a5f3fc)] text-base sm:text-lg"
          whileTap={{ scale: 0.985 }}
        >
          Review and complete workout
          <AppIcon name="arrowRight" className="h-5 w-5" strokeWidth={2.3} />
        </motion.button>
      ) : null}
    </MotionPage>
  );
}
