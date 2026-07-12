import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { aiAPI, templatesAPI, workoutsAPI } from '../api/apiService';
import AppIcon from '../components/AppIcon';
import MotionPage from '../components/MotionPage';
import { useWorkout } from '../context/WorkoutContext';

function RecommendationSkeleton() {
  return (
    <div className="app-page space-y-6">
      <div className="h-4 w-36 animate-pulse rounded-full bg-white/[0.07]" />
      <div className="h-12 w-[min(34rem,88vw)] animate-pulse rounded-xl bg-white/[0.08]" />
      <div className="app-panel h-64 animate-pulse" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="app-panel h-28 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function AdjustmentCard({ icon, label, value, description, tone, delay }) {
  return (
    <motion.article
      className="app-panel p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.34 }}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-3 text-xl font-black tracking-[-0.05em] text-white">{value}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
        <span className={['grid size-9 place-items-center rounded-xl border', tone].join(' ')}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" />
        </span>
      </div>
    </motion.article>
  );
}

export default function AiRecommendation() {
  const navigate = useNavigate();
  const { startWorkout } = useWorkout();
  const [recommendation, setRecommendation] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [startError, setStartError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [aiRes, templatesRes] = await Promise.all([
        aiAPI.getRecommendation(),
        templatesAPI.list().catch(() => ({ data: [] })),
      ]);
      setRecommendation(aiRes.data);
      setTemplates(templatesRes.data);
    } catch (err) {
      console.error('Failed to load recommendation:', err);
      setError('The training recommendation is taking longer than expected. You can retry, or start a free-form workout.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartWorkout = async () => {
    setStarting(true);
    setStartError('');

    try {
      const response = await workoutsAPI.start({
        template_id: selectedTemplate?.id || null,
      });
      startWorkout(response.data, selectedTemplate);
      navigate('/workout');
    } catch (err) {
      console.error('Failed to start workout:', err);
      setStartError('We could not start this session. Please try again — your chosen template is still selected.');
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <RecommendationSkeleton />;

  const modifications = recommendation?.modifications || {};
  const volumeAdjustment = modifications.volume_adjustment;
  const volumeValue =
    volumeAdjustment === undefined
      ? 'Keep steady'
      : volumeAdjustment > 0
        ? '+' + volumeAdjustment + '%'
        : volumeAdjustment + '%';
  const volumeDetail =
    volumeAdjustment === undefined
      ? 'No volume change suggested'
      : volumeAdjustment > 0
        ? 'Add work only if form stays sharp'
        : 'Keep the session intentionally lighter';
  const intensity = modifications.intensity || 'Adaptive';
  const focus = modifications.focus || 'Whole session';

  return (
    <MotionPage className="app-page space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="app-kicker">
            <AppIcon name="brain" className="h-3.5 w-3.5" strokeWidth={2.1} />
            Adaptive training direction
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
            Your session has a point of view.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Use this as a clear starting point, then choose the plan that fits your session.
          </p>
        </div>
        <button type="button" onClick={loadData} className="app-button-secondary w-fit text-xs">
          <AppIcon name="refresh" className="h-4 w-4" />
          Refresh insight
        </button>
      </header>

      {error ? (
        <motion.div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-amber-300/20 bg-amber-200/[0.07] p-4 text-sm leading-6 text-amber-50 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="flex items-start gap-2">
            <AppIcon name="message" className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            {error}
          </span>
          <button type="button" onClick={loadData} className="font-bold text-amber-100 hover:text-white">
            Retry
          </button>
        </motion.div>
      ) : null}

      <motion.section
        className="app-panel overflow-hidden p-6 sm:p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-cyan-200" />
              </span>
              FitPulse analysis
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">
              {recommendation?.title || 'A session shaped around your readiness.'}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {recommendation?.recommendation ||
                'Keep the first few sets intentional, monitor how you feel, and adjust the plan with care.'}
            </p>
          </div>
          <motion.div
            className="app-orbit size-32 shrink-0"
            style={{ background: 'conic-gradient(#c4b5fd 0deg 126deg, #a5f3fc 126deg 250deg, rgba(255,255,255,0.08) 250deg 360deg)' }}
            animate={{ rotate: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="text-center">
              <AppIcon name="spark" className="mx-auto h-6 w-6 text-cyan-100" strokeWidth={1.8} />
              <span className="mt-2 block text-[0.63rem] font-bold uppercase tracking-[0.16em] text-slate-400">AI-guided</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="grid gap-3 sm:grid-cols-3">
        <AdjustmentCard
          icon="barChart"
          label="Volume"
          value={volumeValue}
          description={volumeDetail}
          tone="border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100"
          delay={0.1}
        />
        <AdjustmentCard
          icon="bolt"
          label="Intensity"
          value={String(intensity).replace(/^\w/, (letter) => letter.toUpperCase())}
          description="Let the first working set confirm the pace."
          tone="border-amber-200/15 bg-amber-200/[0.08] text-amber-100"
          delay={0.16}
        />
        <AdjustmentCard
          icon="target"
          label="Focus"
          value={String(focus).replace(/^\w/, (letter) => letter.toUpperCase())}
          description="Keep the main thing the main thing."
          tone="border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100"
          delay={0.22}
        />
      </section>

      <section className="app-panel p-5 sm:p-6">
        <div className="relative">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Session format</p>
              <h2 className="mt-2 text-xl font-bold text-white">Choose your workout canvas</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Pick a saved plan or leave it open and log a free-form session.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {selectedTemplate ? selectedTemplate.exercises?.length || 0 : 0} planned exercises
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <motion.button
              type="button"
              onClick={() => setSelectedTemplate(null)}
              className={[
                'relative overflow-hidden rounded-2xl border p-5 text-left transition',
                selectedTemplate === null
                  ? 'border-cyan-300/35 bg-cyan-300/[0.1] shadow-[0_12px_32px_rgba(34,211,238,0.1)]'
                  : 'border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]',
              ].join(' ')}
              whileTap={{ scale: 0.985 }}
              aria-pressed={selectedTemplate === null}
            >
              <div className="relative flex items-start justify-between gap-4">
                <span className="grid size-10 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100">
                  <AppIcon name="dumbbell" className="h-5 w-5" />
                </span>
                {selectedTemplate === null ? (
                  <span className="grid size-6 place-items-center rounded-full bg-cyan-200 text-slate-950">
                    <AppIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.8} />
                  </span>
                ) : null}
              </div>
              <h3 className="relative mt-6 font-bold text-white">Free-form workout</h3>
              <p className="relative mt-2 text-sm leading-6 text-slate-400">
                Start with a blank slate and add movements as you go.
              </p>
            </motion.button>

            {templates.map((template, index) => {
              const isSelected = selectedTemplate?.id === template.id;
              return (
                <motion.button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplate(template)}
                  className={[
                    'relative overflow-hidden rounded-2xl border p-5 text-left transition',
                    isSelected
                      ? 'border-violet-300/35 bg-violet-300/[0.1] shadow-[0_12px_32px_rgba(196,181,253,0.1)]'
                      : 'border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]',
                  ].join(' ')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 + index * 0.04, duration: 0.3 }}
                  whileTap={{ scale: 0.985 }}
                  aria-pressed={isSelected}
                >
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-100">
                      <AppIcon name="template" className="h-5 w-5" />
                    </span>
                    {isSelected ? (
                      <span className="grid size-6 place-items-center rounded-full bg-violet-200 text-slate-950">
                        <AppIcon name="check" className="h-3.5 w-3.5" strokeWidth={2.8} />
                      </span>
                    ) : null}
                  </div>
                  <h3 className="relative mt-6 font-bold text-white">{template.name}</h3>
                  <p className="relative mt-2 text-sm leading-6 text-slate-400">
                    {template.exercises?.length || 0} exercises ready to guide the session.
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {startError ? (
        <motion.p
          role="alert"
          className="rounded-2xl border border-rose-300/20 bg-rose-400/[0.08] px-4 py-3 text-sm leading-6 text-rose-100"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {startError}
        </motion.p>
      ) : null}

      <motion.button
        id="recommendation-start"
        type="button"
        onClick={handleStartWorkout}
        disabled={starting}
        className="app-button-primary w-full text-base sm:text-lg"
        whileTap={{ scale: 0.985 }}
      >
        {starting ? 'Starting your session…' : selectedTemplate ? 'Start with this plan' : 'Start free-form workout'}
        {!starting ? <AppIcon name="arrowRight" className="h-5 w-5" strokeWidth={2.3} /> : null}
      </motion.button>
    </MotionPage>
  );
}
