import { motion } from 'framer-motion';
import AppIcon from './AppIcon';

const tones = [
  { bar: 'from-cyan-300 via-cyan-400 to-blue-500', badge: 'border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-100' },
  { bar: 'from-violet-300 via-violet-400 to-fuchsia-500', badge: 'border-violet-300/15 bg-violet-300/[0.08] text-violet-100' },
  { bar: 'from-emerald-300 via-emerald-400 to-teal-500', badge: 'border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-100' },
  { bar: 'from-amber-200 via-amber-400 to-orange-500', badge: 'border-amber-200/15 bg-amber-200/[0.08] text-amber-100' },
  { bar: 'from-rose-200 via-rose-400 to-pink-500', badge: 'border-rose-300/15 bg-rose-300/[0.08] text-rose-100' },
];

export default function StatChart({ data = [], title = 'Volume by muscle group' }) {
  if (!data.length) {
    return (
      <div className="app-panel flex min-h-56 items-center justify-center p-6 text-center">
        <div className="relative max-w-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300">
            <AppIcon name="barChart" className="h-6 w-6" />
          </span>
          <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Complete a workout and this space will turn your volume into a quick visual signal.
          </p>
        </div>
      </div>
    );
  }

  const maxVolume = Math.max(...data.map((item) => Number(item.total_volume) || 0), 1);

  return (
    <div className="app-panel p-5 sm:p-6">
      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Training distribution</p>
            <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
          </div>
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="size-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(165,243,252,0.9)]" />
            Last 30 days
          </span>
        </div>

        <div className="mt-7 space-y-5">
          {data.map((item, index) => {
            const volume = Number(item.total_volume) || 0;
            const percentage = Math.max((volume / maxVolume) * 100, volume ? 4 : 0);
            const tone = tones[index % tones.length];

            return (
              <div key={item.muscle_group}>
                <div className="mb-2.5 flex items-end justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={['grid size-7 shrink-0 place-items-center rounded-lg border text-[0.65rem] font-black', tone.badge].join(' ')}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate text-sm font-bold capitalize text-slate-200">{item.muscle_group}</span>
                  </div>
                  <span className="shrink-0 text-right text-xs font-semibold text-slate-500">
                    {Math.round(volume).toLocaleString()} kg <span className="hidden sm:inline">· {item.session_count} sessions</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full border border-white/[0.04] bg-white/[0.055] p-[2px]">
                  <motion.div
                    className={['h-full rounded-full bg-gradient-to-r', tone.bar].join(' ')}
                    initial={{ width: 0 }}
                    animate={{ width: percentage + '%' }}
                    transition={{ delay: 0.12 + index * 0.07, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
