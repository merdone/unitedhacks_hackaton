import MotionPage from '../components/MotionPage';
import TiltTile from '../components/TiltTile';

const plans = [
  {
    name: 'Balanced Strength',
    level: '3 days',
    exercises: ['Squat', 'Bench press', 'Row', 'Romanian deadlift'],
    accent: 'rgba(34,211,238,0.2)',
  },
  {
    name: 'Recovery Builder',
    level: 'Light day',
    exercises: ['Goblet squat', 'Lat pulldown', 'Cable row', 'Mobility circuit'],
    accent: 'rgba(16,185,129,0.2)',
  },
  {
    name: 'Upper Focus',
    level: 'Push/pull',
    exercises: ['Incline press', 'Pull-up', 'Overhead press', 'Curl'],
    accent: 'rgba(245,158,11,0.18)',
  },
];

export default function Templates() {
  return (
    <MotionPage className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Plan library</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Templates</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Frontend-ready workout templates for the demo flow and future backend sync.
          </p>
        </div>
        <button type="button" className="btn-gradient w-fit px-5 py-3 text-sm">
          <span>New Template</span>
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <TiltTile key={plan.name} className="min-h-80 p-6" glow={plan.accent}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                  {plan.level}
                </span>
                <span className="font-mono text-sm text-slate-500">0{index + 1}</span>
              </div>
              <h2 className="mt-8 text-2xl font-black text-white">{plan.name}</h2>
              <div className="mt-6 space-y-3">
                {plan.exercises.map((exercise) => (
                  <div key={exercise} className="flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-3">
                    <span className="text-sm font-semibold text-slate-200">{exercise}</span>
                    <span className="text-xs text-slate-500">3 x 8</span>
                  </div>
                ))}
              </div>
            </div>
          </TiltTile>
        ))}
      </div>
    </MotionPage>
  );
}
