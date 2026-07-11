export default function StatChart({ data = [], title = 'Volume by Muscle Group' }) {
  if (!data.length) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-slate-500 text-sm">No data yet. Complete a workout to see your stats!</p>
      </div>
    );
  }

  const maxVolume = Math.max(...data.map((d) => d.total_volume));

  const colors = [
    'from-cyan-500 to-cyan-400',
    'from-purple-500 to-purple-400',
    'from-emerald-500 to-emerald-400',
    'from-rose-500 to-rose-400',
    'from-amber-500 to-amber-400',
    'from-blue-500 to-blue-400',
    'from-pink-500 to-pink-400',
    'from-teal-500 to-teal-400',
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = maxVolume > 0 ? (item.total_volume / maxVolume) * 100 : 0;
          const color = colors[index % colors.length];

          return (
            <div key={item.muscle_group} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium capitalize">{item.muscle_group}</span>
                <span className="text-slate-400">
                  {item.total_volume.toLocaleString()}kg · {item.session_count} sessions
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
