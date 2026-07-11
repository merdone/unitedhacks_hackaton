import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsAPI, templatesAPI, usersAPI } from '../api/apiService';
import StatChart from '../components/StatChart';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name || 'Athlete'}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's your fitness overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Sessions</p>
          <p className="text-2xl font-bold text-white mt-1">{stats?.total_sessions || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Volume</p>
          <p className="text-2xl font-bold text-white mt-1">
            {stats?.total_volume ? `${(stats.total_volume / 1000).toFixed(1)}t` : '0'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Templates</p>
          <p className="text-2xl font-bold text-white mt-1">{templates.length}</p>
          <p className="text-xs text-slate-400 mt-1">Workout plans</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Body Weight</p>
          <p className="text-2xl font-bold text-white mt-1">{user?.weight_current || '—'}</p>
          <p className="text-xs text-slate-400 mt-1">kg</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up stagger-2">
        <button
          id="dashboard-start-workout"
          onClick={() => navigate('/checkin')}
          className="glass-card p-6 text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🏋️
              </div>
              <h3 className="text-lg font-semibold text-white">Start Workout</h3>
              <p className="text-sm text-slate-400 mt-1">Begin with a readiness check-in</p>
            </div>
            <svg className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button
          id="dashboard-view-stats"
          onClick={() => navigate('/profile')}
          className="glass-card p-6 text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
              <p className="text-sm text-slate-400 mt-1">Update your stats and conditions</p>
            </div>
            <svg className="w-6 h-6 text-slate-500 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Volume Chart */}
      <div className="animate-fade-in-up stagger-3">
        <StatChart
          data={stats?.muscle_group_volumes || []}
          title="Volume by Muscle Group (30 Days)"
        />
      </div>

      {/* Templates */}
      <div className="animate-fade-in-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Templates</h2>
        </div>
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((t) => (
              <div key={t.id} className="glass-card p-4">
                <h3 className="font-semibold text-white">{t.name}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {t.exercises?.length || 0} exercises
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-slate-500 text-sm">No templates yet. Create one during your first workout!</p>
          </div>
        )}
      </div>
    </div>
  );
}
