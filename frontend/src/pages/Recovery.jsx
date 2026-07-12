import { motion } from 'framer-motion';
import MotionPage from '../components/MotionPage';
import TiltTile from '../components/TiltTile';

const habits = [
  { label: 'Sleep', value: '7.5h', width: '75%' },
  { label: 'Hydration', value: 'Good', width: '68%' },
  { label: 'Stress', value: 'Moderate', width: '52%' },
  { label: 'Soreness', value: 'Low', width: '36%' },
];

export default function Recovery() {
  return (
    <MotionPage className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Readiness support</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Recovery</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          A quiet page for recovery context, built to support the check-in and recommendation loop.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <TiltTile className="p-6" glow="rgba(245,158,11,0.2)">
          <h2 className="text-xl font-bold text-white">Today&apos;s recovery score</h2>
          <div className="mt-8 flex items-end gap-4">
            <span className="text-7xl font-black text-amber-300">82</span>
            <span className="pb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">ready</span>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-400">
            A higher score suggests the user can train normally, while still watching fatigue and soreness.
          </p>
        </TiltTile>

        <TiltTile className="p-6" glow="rgba(34,211,238,0.18)">
          <h2 className="text-xl font-bold text-white">Recovery inputs</h2>
          <div className="mt-6 space-y-5">
            {habits.map((habit, index) => (
              <div key={habit.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300">{habit.label}</span>
                  <span className="text-slate-500">{habit.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 to-cyan-300"
                    initial={{ width: 0 }}
                    animate={{ width: habit.width }}
                    transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TiltTile>
      </div>
    </MotionPage>
  );
}
