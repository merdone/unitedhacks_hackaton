import { Activity } from 'lucide-react';

export default function BrandMark({ compact = false, inverse = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-slate-950 text-cyan-300 shadow-[0_10px_30px_rgba(34,211,238,0.18)] ring-1 ring-white/10">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.3),transparent_35%),linear-gradient(135deg,rgba(34,211,238,0.32),rgba(139,92,246,0.32))]" />
        <Activity aria-hidden="true" className="relative size-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span
          className={`text-[1.05rem] font-extrabold tracking-[-0.04em] ${
            inverse ? 'text-slate-950' : 'text-white'
          }`}
        >
          Fit<span className="text-cyan-400">Pulse</span>
        </span>
      )}
    </span>
  );
}
