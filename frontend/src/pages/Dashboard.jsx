import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { statsAPI, templatesAPI, usersAPI } from '../api/apiService';
import AppIcon from '../components/AppIcon';
import MotionPage from '../components/MotionPage';
import StatChart from '../components/StatChart';

function formatVolume(value) {
  if (!value) return '0 kg';
  if (value >= 1000) return (value / 1000).toFixed(1) + ' t';
  return Math.round(value).toLocaleString() + ' kg';
}

function DashboardSkeleton() {
  return (
    <div className="app-page space-y-6">
      <div className="h-7 w-48 animate-pulse rounded-lg bg-white/[0.07]" />
      <div className="h-12 w-[min(34rem,88vw)] animate-pulse rounded-xl bg-white/[0.08]" />
      <div className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
        <div className="app-panel h-[23rem] animate-pulse" />
        <div className="app-panel h-[23rem] animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="app-panel h-32 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, detail, tone, delay }) {
  return (
    <motion.article
      className="app-panel group min-h-36 p-4 sm:p-5"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.67rem] font-bold uppercase tracking-[0.15em] text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-black tracking-[-0.05em] text-white sm:text-[1.7rem]">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={['grid size-9 place-items-center rounded-xl border', tone].join(' ')}>
          <AppIcon name={icon} className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      </div>
    </motion.article>
  );
}

function QuickAction({ icon, title, text, tone, onClick, delay }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="app-panel group w-full p-5 text-left sm:p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
    >
      <div className="relative flex h-full flex-col">
        <span className={['grid size-12 place-items-center rounded-2xl border', tone].join(' ')}>
          <AppIcon name={icon} className="h-6 w-6" strokeWidth={1.9} />
        </span>
        <h2 className="mt-7 text-xl font-bold text-white transition group-hover:text-cyan-100">{title}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{text}</p>
        <span className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-200">
          Continue
          <AppIcon
            name="arrowRight"
            className="h-4 w-4 transition duration-200 group-hover:translate-x-1 group-hover:text-cyan-200"
            strokeWidth={2.3}
          />
        </span>
      </div>
    </motion.button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [userRes, statsRes, templatesRes] = await Promise.all([
        usersAPI.getProfile(),
        statsAPI.get(30).catch(() => ({ data: null })),
        templatesAPI.list().catch(() => ({ data: [] })),
      ]);

      setUser(userRes.data);
      setStats(statsRes.data);
      setTemplates(templatesRes.data);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setError('We could not sync the latest profile data. You can try again without leaving the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) return <DashboardSkeleton />;

  const name = user?.name?.trim().split(' ')[0] || 'Athlete';
  const metrics = [
    {
      icon: 'calendar',
      label: 'Sessions',
      value: stats?.total_sessions || 0,
      detail: 'in the last 30 days',
      tone: 'border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200',
    },
    {
      icon: 'barChart',
      label: 'Training volume',
      value: formatVolume(stats?.total_volume),
      detail: 'last 30 days',
      tone: 'border-violet-300/20 bg-violet-300/[0.08] text-violet-200',
    },
    {
      icon: 'template',
      label: 'Saved plans',
      value: templates.length,
      detail: 'ready when you are',
      tone: 'border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200',
    },
    {
      icon: 'target',
      label: 'Current weight',
      value: user?.weight_current ? String(user.weight_current) + ' kg' : '—',
      detail: 'from your profile',
      tone: 'border-amber-200/20 bg-amber-200/[0.08] text-amber-100',
    },
  ];

  return (
    <MotionPage className="app-page space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="app-kicker">
            <AppIcon name="pulse" className="h-3.5 w-3.5" strokeWidth={2.3} />
            Training command center
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
            Good to see you, <span className="text-cyan-200">{name}.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Start with how you feel today, then let the session meet you there.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="app-button-secondary w-fit text-xs"
          aria-label="Refresh dashboard data"
        >
          <AppIcon name="refresh" className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {error && (
        <motion.div
          className="flex flex-col gap-3 rounded-2xl border border-amber-300/20 bg-amber-200/[0.07] p-4 text-sm text-amber-50 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="flex items-start gap-2 leading-6">
            <AppIcon name="message" className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
            {error}
          </span>
          <button type="button" onClick={loadDashboard} className="font-bold text-amber-100 hover:text-white">
            Try again
          </button>
        </motion.div>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
        <motion.article
          className="app-panel min-h-[21rem] p-6 sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-cyan-200" />
              </span>
              Today&apos;s signal
            </div>
            <h2 className="mt-7 max-w-xl text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">
              Train the state you&apos;re in, not the plan you made last week.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              A quick readiness check shapes your recommendation before you log the first set.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
              <motion.button
                type="button"
                onClick={() => navigate('/checkin')}
                className="app-button-primary"
                whileTap={{ scale: 0.97 }}
              >
                Start check-in
                <AppIcon name="arrowRight" className="h-4 w-4" strokeWidth={2.3} />
              </motion.button>
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <AppIcon name="clock" className="h-4 w-4 text-slate-400" />
                Takes about 2 minutes
              </span>
            </div>
          </div>
        </motion.article>

        <motion.article
          className="app-panel flex min-h-[21rem] flex-col justify-between p-6 sm:p-7"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Next session</p>
              <h2 className="mt-2 text-xl font-bold text-white">Ready when you are</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                Check in first to reveal a workout direction that reflects today&apos;s energy.
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100">
              <AppIcon name="brain" className="h-5 w-5" />
            </span>
          </div>
          <div className="relative mt-5 flex items-end justify-between gap-4">
            <motion.div
              className="app-orbit size-28 shrink-0"
              style={{ background: 'conic-gradient(#a5f3fc 0deg 236deg, rgba(255,255,255,0.08) 236deg 360deg)' }}
              animate={{ rotate: [0, 3, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-center">
                <strong className="block text-2xl font-black tracking-[-0.08em] text-white">2 min</strong>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-slate-500">check-in</span>
              </div>
            </motion.div>
            <div className="pb-1 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200">Small input</p>
              <p className="mt-2 text-sm font-semibold text-slate-300">Clear direction</p>
            </div>
          </div>
        </motion.article>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.label} {...metric} delay={0.16 + index * 0.05} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
        >
          <StatChart data={stats?.muscle_group_volumes || []} title="Where your volume went" />
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <QuickAction
            icon="dumbbell"
            title="Start a workout"
            text="Get a readiness-led training direction before you start logging."
            tone="border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-100"
            onClick={() => navigate('/checkin')}
            delay={0.38}
          />
          <QuickAction
            icon="edit"
            title="Tune your profile"
            text="Keep your body data and training context up to date."
            tone="border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100"
            onClick={() => navigate('/profile')}
            delay={0.44}
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Your library</p>
            <h2 className="mt-2 text-xl font-bold text-white">Workout templates</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="flex items-center gap-1.5 text-sm font-bold text-cyan-200 transition hover:text-cyan-100"
          >
            View plans
            <AppIcon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
        {templates.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.slice(0, 3).map((template, index) => (
              <motion.article
                key={template.id}
                className="app-panel p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 + index * 0.05, duration: 0.34 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative">
                  <span className="grid size-9 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-100">
                    <AppIcon name="template" className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-white">{template.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{template.exercises?.length || 0} exercises</p>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="app-panel p-6 sm:p-8">
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300">
                  <AppIcon name="layers" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-white">Your library is ready for its first plan.</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    You can still start a free-form workout right now.
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => navigate('/checkin')} className="app-button-secondary shrink-0 text-sm">
                Start free-form
                <AppIcon name="arrowRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </MotionPage>
  );
}
