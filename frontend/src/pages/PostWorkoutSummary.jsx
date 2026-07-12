import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { workoutsAPI } from '../api/apiService';
import AppIcon from '../components/AppIcon';
import MotionPage from '../components/MotionPage';
import { useWorkout } from '../context/WorkoutContext';

function SummaryMetric({ icon, label, value, detail, tone }) {
  return (
    <article className="app-panel p-4 text-center sm:p-5">
      <div className="relative">
        <span className={['mx-auto grid size-9 place-items-center rounded-xl border', tone].join(' ')}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" />
        </span>
        <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="mt-2 text-xl font-black tracking-[-0.05em] text-white sm:text-2xl">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
    </article>
  );
}

function EmptySummary({ onDashboard }) {
  return (
    <MotionPage className="app-page">
      <motion.section
        className="app-panel mx-auto max-w-xl p-7 text-center sm:p-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <span className="mx-auto grid size-16 place-items-center rounded-3xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-100">
            <AppIcon name="barChart" className="h-8 w-8" strokeWidth={1.8} />
          </span>
          <p className="app-kicker mt-7">Nothing to review yet</p>
          <h1 className="mt-4 text-2xl font-black tracking-[-0.05em] text-white">Complete a workout first.</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            The session summary appears after you have logged a workout.
          </p>
          <button type="button" onClick={onDashboard} className="app-button-primary mt-7">
            Back to dashboard
            <AppIcon name="arrowRight" className="h-4 w-4" strokeWidth={2.3} />
          </button>
        </div>
      </motion.section>
    </MotionPage>
  );
}

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
  const [error, setError] = useState('');

  const totalVolume = logs.reduce((sum, log) => sum + Number(log.reps) * Number(log.weight), 0);
  const totalSets = logs.length;
  const uniqueExercises = new Set(logs.map((log) => log.exercise_id)).size;
  const difficultyProgress = ((feedback.perceived_difficulty - 1) / 9) * 100;

  const handleSubmit = async () => {
    if (!session) return;
    setLoading(true);
    setError('');

    try {
      const apiLogs = logs.map((log) => ({
        exercise_id: log.exercise_id,
        set_number: log.set_number,
        reps: log.reps,
        weight: log.weight,
        rpe: log.rpe,
      }));

      const response = await workoutsAPI.complete(session.id, {
        logs: apiLogs,
        feedback: {
          perceived_difficulty: feedback.perceived_difficulty,
          metrics_photo_url: feedback.metrics_photo_url || null,
          voice_transcription_text: feedback.voice_transcription_text || null,
        },
      });

      completeWorkout(response.data);
      setCompleted(true);
    } catch (err) {
      console.error('Failed to complete workout:', err);
      setError('The session could not be saved just yet. Your summary is still here — please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    reset();
    navigate('/dashboard');
  };

  if (!session && !completed) return <EmptySummary onDashboard={() => navigate('/dashboard')} />;

  if (completed) {
    return (
      <MotionPage className="app-page">
        <motion.section
          className="app-panel mx-auto max-w-2xl overflow-hidden p-7 text-center sm:p-12"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 gap-4 text-cyan-100">
              {[0, 1, 2, 3, 4].map((item) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 8, x: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -18 - item * 6, x: (item - 2) * 28, scale: 1 }}
                  transition={{ delay: 0.2 + item * 0.07, duration: 0.6, ease: 'easeOut' }}
                >
                  <AppIcon name="spark" className="h-5 w-5" />
                </motion.span>
              ))}
            </div>
            <span className="mx-auto grid size-20 place-items-center rounded-[1.75rem] border border-emerald-300/25 bg-emerald-300/[0.1] text-emerald-100 shadow-[0_16px_42px_rgba(16,185,129,0.16)]">
              <AppIcon name="check" className="h-10 w-10" strokeWidth={2.2} />
            </span>
            <p className="app-kicker mt-8">Session saved</p>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">Strong work. It&apos;s in the log.</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
              The context from today will make the next check-in more useful.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-left">
              <SummaryMetric
                icon="barChart"
                label="Volume"
                value={Math.round(totalVolume).toLocaleString()}
                detail="kg moved"
                tone="border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100"
              />
              <SummaryMetric
                icon="layers"
                label="Sets"
                value={totalSets}
                detail="completed"
                tone="border-violet-300/15 bg-violet-300/[0.08] text-violet-100"
              />
              <SummaryMetric
                icon="dumbbell"
                label="Exercises"
                value={uniqueExercises}
                detail="trained"
                tone="border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100"
              />
            </div>
            <button type="button" onClick={handleDone} className="app-button-primary mt-8">
              Back to dashboard
              <AppIcon name="arrowRight" className="h-4 w-4" strokeWidth={2.3} />
            </button>
          </div>
        </motion.section>
      </MotionPage>
    );
  }

  return (
    <MotionPage className="app-page space-y-6">
      <header>
        <p className="app-kicker">
          <AppIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.3} />
          Session reflection
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
          Give this session its final context.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          A few seconds of reflection makes the next training direction more useful.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-3">
        <SummaryMetric
          icon="barChart"
          label="Volume"
          value={Math.round(totalVolume).toLocaleString()}
          detail="kg moved"
          tone="border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100"
        />
        <SummaryMetric
          icon="layers"
          label="Sets"
          value={totalSets}
          detail="recorded"
          tone="border-violet-300/15 bg-violet-300/[0.08] text-violet-100"
        />
        <SummaryMetric
          icon="dumbbell"
          label="Exercises"
          value={uniqueExercises}
          detail="trained"
          tone="border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.64fr)] lg:items-start">
        <motion.article
          className="app-panel p-5 sm:p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38 }}
        >
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">How hard was it?</p>
                <h2 className="mt-2 text-xl font-bold text-white">Perceived difficulty</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Honest effort is more useful than a perfect number.
                </p>
              </div>
              <motion.output
                key={feedback.perceived_difficulty}
                htmlFor="summary-difficulty"
                className="grid size-12 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08] text-xl font-black text-cyan-100"
                initial={{ scale: 0.82, opacity: 0.45 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              >
                {feedback.perceived_difficulty}
              </motion.output>
            </div>
            <input
              id="summary-difficulty"
              type="range"
              min="1"
              max="10"
              value={feedback.perceived_difficulty}
              onChange={(event) => setFeedback((current) => ({ ...current, perceived_difficulty: Number(event.target.value) }))}
              className="app-range mt-7 w-full"
              style={{ '--range-progress': difficultyProgress + '%', '--range-color': '#22d3ee' }}
              aria-valuetext={'Perceived difficulty: ' + feedback.perceived_difficulty + ' out of 10'}
            />
            <div className="mt-3 flex justify-between text-xs font-semibold text-slate-500">
              <span>Easy day</span>
              <span>Max effort</span>
            </div>
          </div>
        </motion.article>

        <motion.aside
          className="app-panel p-5 sm:p-6"
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.38 }}
        >
          <div className="relative">
            <span className="grid size-10 place-items-center rounded-xl border border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100">
              <AppIcon name="spark" className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-lg font-bold text-white">Why reflect?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your effort and notes turn raw workout data into useful context for the next day.
            </p>
            <div className="mt-6 border-t border-white/10 pt-5 text-sm leading-6 text-slate-500">
              Short is good: a sentence is enough.
            </div>
          </div>
        </motion.aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <motion.article
          className="app-panel p-5 sm:p-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.36 }}
        >
          <div className="relative">
            <label htmlFor="summary-photo" className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-100">
                <AppIcon name="camera" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white">Progress photo URL</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Optional — save a link to a progress photo.</span>
              </span>
            </label>
            <input
              id="summary-photo"
              type="url"
              inputMode="url"
              className="input-field mt-5 h-12 text-sm"
              placeholder="https://example.com/progress.jpg"
              value={feedback.metrics_photo_url}
              onChange={(event) => setFeedback((current) => ({ ...current, metrics_photo_url: event.target.value }))}
            />
          </div>
        </motion.article>

        <motion.article
          className="app-panel p-5 sm:p-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.36 }}
        >
          <div className="relative">
            <label htmlFor="summary-notes" className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100">
                <AppIcon name="message" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white">Session notes</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">PRs, pain, wins, or a small lesson from today.</span>
              </span>
            </label>
            <textarea
              id="summary-notes"
              rows={4}
              className="input-field mt-5 resize-none p-3.5 text-sm leading-6"
              placeholder="Example: Strong on the first sets, but backed off on accessories."
              value={feedback.voice_transcription_text}
              onChange={(event) => setFeedback((current) => ({ ...current, voice_transcription_text: event.target.value }))}
            />
          </div>
        </motion.article>
      </section>

      {error ? (
        <motion.p
          role="alert"
          className="rounded-2xl border border-rose-300/20 bg-rose-400/[0.08] px-4 py-3 text-sm leading-6 text-rose-100"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      ) : null}

      <motion.button
        id="summary-submit"
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="app-button-primary w-full border-emerald-200/45 bg-[linear-gradient(135deg,#bbf7d0,#86efac_45%,#a5f3fc)] text-base sm:text-lg"
        whileTap={{ scale: 0.985 }}
      >
        {loading ? 'Saving your session…' : 'Save and complete workout'}
        {!loading ? <AppIcon name="check" className="h-5 w-5" strokeWidth={2.3} /> : null}
      </motion.button>
    </MotionPage>
  );
}
