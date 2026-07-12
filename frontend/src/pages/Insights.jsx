import { motion } from 'framer-motion';
import MotionPage from '../components/MotionPage';
import { fadeUp } from '../components/motionVariants';
import TiltTile from '../components/TiltTile';

const signals = [
  { label: 'Readiness trend', value: '+12%', detail: 'Compared with last week', tone: 'text-emerald-300' },
  { label: 'Average RPE', value: '7.2', detail: 'Last 5 logged sessions', tone: 'text-cyan-300' },
  { label: 'Recovery risk', value: 'Low', detail: 'Fatigue is under control', tone: 'text-amber-300' },
];

const focus = [
  { title: 'Strength blocks', text: 'Keep compound lifts early when readiness is high.' },
  { title: 'Volume control', text: 'Reduce accessory work when fatigue moves above 7.' },
  { title: 'Notes quality', text: 'Add short post-session notes to improve recommendations.' },
];

export default function Insights() {
  return (
    <MotionPage className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Training intelligence</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Insights</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          A frontend dashboard for the signals that should guide the next workout decision.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {signals.map((item, index) => (
          <TiltTile key={item.label} custom={index} className="p-6" glow="rgba(16,185,129,0.18)">
            <motion.p custom={index} variants={fadeUp} initial="initial" animate="animate" className="text-sm text-slate-400">
              {item.label}
            </motion.p>
            <p className={`mt-3 text-4xl font-black ${item.tone}`}>{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
          </TiltTile>
        ))}
      </div>

      <TiltTile className="p-6 md:p-8" glow="rgba(139,92,246,0.18)">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Weekly load map</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              This visual tile gives the MVP a place for future chart data while still being useful in the demo.
            </p>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[42, 68, 54, 81, 35, 72, 49].map((height, index) => (
              <motion.div
                key={height + index}
                className="flex h-44 items-end rounded-md bg-white/[0.04] p-2"
                initial={{ opacity: 0, scaleY: 0.4 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: index * 0.05, duration: 0.38 }}
              >
                <div
                  className="w-full rounded-sm bg-gradient-to-t from-cyan-500 to-emerald-300"
                  style={{ height: `${height}%` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </TiltTile>

      <div className="grid gap-4 md:grid-cols-3">
        {focus.map((item, index) => (
          <motion.article
            key={item.title}
            custom={index}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="rounded-md border border-white/10 bg-white/[0.035] p-5"
          >
            <h3 className="font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </MotionPage>
  );
}
