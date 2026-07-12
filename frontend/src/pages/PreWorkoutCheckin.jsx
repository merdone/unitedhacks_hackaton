import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { readinessAPI } from '../api/apiService';
import AppIcon from '../components/AppIcon';
import MotionPage from '../components/MotionPage';
import VoiceRecorder from '../components/VoiceRecorder';

const signals = [
  {
    key: 'sleep_quality',
    label: 'Sleep quality',
    detail: 'How restorative did last night feel?',
    icon: 'moon',
    color: '#60a5fa',
    tone: 'border-blue-300/15 bg-blue-300/[0.07] text-blue-100',
    lowLabel: 'Rough night',
    highLabel: 'Fully rested',
  },
  {
    key: 'mood',
    label: 'Mood',
    detail: 'Your overall headspace before training.',
    icon: 'spark',
    color: '#fbbf24',
    tone: 'border-amber-200/15 bg-amber-200/[0.07] text-amber-100',
    lowLabel: 'Low',
    highLabel: 'Excellent',
  },
  {
    key: 'motivation',
    label: 'Motivation',
    detail: 'How ready do you feel to start?',
    icon: 'bolt',
    color: '#34d399',
    tone: 'border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-100',
    lowLabel: 'Not feeling it',
    highLabel: 'Let’s go',
  },
  {
    key: 'fatigue_level',
    label: 'Fatigue',
    detail: 'How much fatigue are you carrying today?',
    icon: 'activity',
    color: '#fb7185',
    tone: 'border-rose-300/15 bg-rose-300/[0.07] text-rose-100',
    lowLabel: 'Fresh',
    highLabel: 'Drained',
  },
];

function getReadinessScore(form) {
  const normalizedFatigue = 11 - form.fatigue_level;
  const average = (form.sleep_quality + form.mood + form.motivation + normalizedFatigue) / 4;
  return Math.round(average * 10);
}

function getReadinessLabel(score) {
  if (score >= 78) return 'High readiness';
  if (score >= 58) return 'Balanced readiness';
  return 'Recovery-aware day';
}

function SignalCard({ signal, value, onChange, index }) {
  const progress = ((value - 1) / 9) * 100;

  return (
    <motion.article
      className="app-panel p-5 sm:p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={['grid size-10 shrink-0 place-items-center rounded-xl border', signal.tone].join(' ')}>
              <AppIcon name={signal.icon} className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div>
              <label htmlFor={'checkin-' + signal.key} className="block text-sm font-bold text-white">
                {signal.label}
              </label>
              <p className="mt-1 max-w-[15rem] text-xs leading-5 text-slate-500">{signal.detail}</p>
            </div>
          </div>
          <motion.output
            key={value}
            htmlFor={'checkin-' + signal.key}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-lg font-black text-white"
            initial={{ scale: 0.82, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            {value}
          </motion.output>
        </div>

        <input
          id={'checkin-' + signal.key}
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(event) => onChange(signal.key, Number(event.target.value))}
          className="app-range mt-6 w-full"
          style={{ '--range-progress': progress + '%', '--range-color': signal.color }}
          aria-valuetext={signal.label + ': ' + value + ' out of 10'}
        />
        <div className="mt-3 flex justify-between gap-3 text-[0.7rem] font-semibold text-slate-500">
          <span>{signal.lowLabel}</span>
          <span className="text-right">{signal.highLabel}</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function PreWorkoutCheckin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sleep_quality: 5,
    mood: 5,
    motivation: 5,
    fatigue_level: 5,
    additional_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const readinessScore = useMemo(() => getReadinessScore(form), [form]);
  const readinessLabel = getReadinessLabel(readinessScore);

  const handleSignalChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleVoiceTranscription = (text) => {
    setForm((current) => ({
      ...current,
      additional_notes: current.additional_notes
        ? current.additional_notes + '\n' + text
        : text,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await readinessAPI.submit(form);
      navigate('/recommendation');
    } catch (err) {
      console.error('Failed to submit readiness:', err);
      setError('We could not save this check-in. Your answers are still here — please try once more.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPage className="app-page">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.52fr)] lg:items-start">
        <form onSubmit={handleSubmit} className="space-y-5">
          <header>
            <p className="app-kicker">
              <AppIcon name="checkin" className="h-3.5 w-3.5" strokeWidth={2.1} />
              Pre-workout check-in
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
              Meet today&apos;s energy where it is.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Four quick signals help shape a more realistic session recommendation.
            </p>
          </header>

          {error && (
            <motion.div
              role="alert"
              className="flex gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/[0.08] p-4 text-sm leading-6 text-rose-100"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AppIcon name="message" className="mt-0.5 h-4 w-4 shrink-0 text-rose-200" />
              <span>{error}</span>
            </motion.div>
          )}

          <section className="grid gap-4 sm:grid-cols-2" aria-label="Readiness signals">
            {signals.map((signal, index) => (
              <SignalCard
                key={signal.key}
                signal={signal}
                value={form[signal.key]}
                onChange={handleSignalChange}
                index={index}
              />
            ))}
          </section>

          <motion.section
            className="app-panel p-5 sm:p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.38 }}
          >
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Context, if you need it</p>
                  <h2 className="mt-2 text-lg font-bold text-white">Anything else affecting today?</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Add a note or speak it out — pain, stress, a win, or whatever matters.
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-100">
                  <AppIcon name="message" className="h-5 w-5" />
                </span>
              </div>
              <textarea
                id="checkin-notes"
                rows={4}
                className="input-field mt-5 resize-none p-4 text-sm leading-6"
                placeholder="Example: Lower back feels tight after sitting all day."
                value={form.additional_notes}
                onChange={(event) => setForm((current) => ({ ...current, additional_notes: event.target.value }))}
              />
              <div className="mt-4">
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
              </div>
            </div>
          </motion.section>

          <motion.button
            id="checkin-submit"
            type="submit"
            disabled={loading}
            className="app-button-primary w-full text-base sm:text-lg"
            whileTap={{ scale: 0.985 }}
          >
            {loading ? 'Building your recommendation…' : 'Get my training direction'}
            {!loading && <AppIcon name="arrowRight" className="h-5 w-5" strokeWidth={2.3} />}
          </motion.button>
        </form>

        <motion.aside
          className="app-panel sticky top-24 overflow-visible p-6 sm:p-7"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.14, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Live readiness signal</p>
            <div className="mt-7 flex items-center gap-5">
              <motion.div
                className="app-orbit size-28 shrink-0"
                style={{
                  background:
                    'conic-gradient(#a5f3fc 0deg ' +
                    readinessScore * 3.6 +
                    'deg, rgba(255,255,255,0.08) ' +
                    readinessScore * 3.6 +
                    'deg 360deg)',
                }}
                animate={{ rotate: [0, 2, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-center">
                  <motion.strong
                    key={readinessScore}
                    className="block text-3xl font-black tracking-[-0.08em] text-white"
                    initial={{ opacity: 0.45, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {readinessScore}
                  </motion.strong>
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-slate-500">out of 100</span>
                </div>
              </motion.div>
              <div>
                <p className="text-lg font-bold text-cyan-100">{readinessLabel}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  This updates as you adjust your signals.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-cyan-200">
                  <AppIcon name="brain" className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-slate-400">
                  Your recommendation uses today&apos;s signals, not a fixed routine.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-emerald-200">
                  <AppIcon name="clock" className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-slate-400">
                  Keep this short. Honest, fast input beats perfect input.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </MotionPage>
  );
}
