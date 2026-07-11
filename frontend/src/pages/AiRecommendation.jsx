import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI, templatesAPI, workoutsAPI } from '../api/apiService';
import { useWorkout } from '../context/WorkoutContext';

export default function AiRecommendation() {
  const navigate = useNavigate();
  const { startWorkout } = useWorkout();
  const [recommendation, setRecommendation] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aiRes, templatesRes] = await Promise.all([
        aiAPI.getRecommendation(),
        templatesAPI.list().catch(() => ({ data: [] })),
      ]);
      setRecommendation(aiRes.data);
      setTemplates(templatesRes.data);
    } catch (err) {
      console.error('Failed to load recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = async () => {
    setStarting(true);
    try {
      const res = await workoutsAPI.start({
        template_id: selectedTemplate?.id || null,
      });
      startWorkout(res.data, selectedTemplate);
      navigate('/workout');
    } catch (err) {
      console.error('Failed to start workout:', err);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">AI is analyzing your data...</p>
        </div>
      </div>
    );
  }

  const mods = recommendation?.modifications || {};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">AI Recommendation</h1>
        <p className="text-slate-400">Based on your check-in and recent workout history</p>
      </div>

      {/* Recommendation Card */}
      <div className="glass-card p-6 animate-fade-in-up stagger-1">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xl shrink-0">
            🤖
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
            <p className="text-slate-300 leading-relaxed">{recommendation?.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Modifications */}
      {Object.keys(mods).length > 0 && (
        <div className="grid grid-cols-2 gap-3 animate-fade-in-up stagger-2">
          {mods.volume_adjustment !== undefined && (
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Volume</p>
              <p className={`text-2xl font-bold mt-1 ${
                mods.volume_adjustment > 0 ? 'text-emerald-400' :
                mods.volume_adjustment < 0 ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {mods.volume_adjustment > 0 ? '+' : ''}{mods.volume_adjustment}%
              </p>
            </div>
          )}
          {mods.intensity && (
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Intensity</p>
              <p className={`text-2xl font-bold mt-1 capitalize ${
                mods.intensity === 'high' ? 'text-emerald-400' :
                mods.intensity === 'low' ? 'text-rose-400' :
                mods.intensity === 'moderate' ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {mods.intensity}
              </p>
            </div>
          )}
          {mods.focus && (
            <div className="glass-card p-4 text-center col-span-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Focus Area</p>
              <p className="text-lg font-semibold text-cyan-400 mt-1 capitalize">{mods.focus}</p>
            </div>
          )}
        </div>
      )}

      {/* Template Selection */}
      <div className="glass-card p-6 animate-fade-in-up stagger-3">
        <h3 className="text-lg font-semibold text-white mb-4">Select Workout Template</h3>
        {templates.length > 0 ? (
          <div className="space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer ${
                  selectedTemplate?.id === t.id
                    ? 'bg-cyan-500/15 border border-cyan-500/30'
                    : 'bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <h4 className="font-medium text-white">{t.name}</h4>
                <p className="text-sm text-slate-400 mt-0.5">
                  {t.exercises?.length || 0} exercises
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">
            No templates yet. You can start a free-form workout without a template.
          </p>
        )}
      </div>

      {/* Start Workout */}
      <button
        id="recommendation-start"
        onClick={handleStartWorkout}
        disabled={starting}
        className="btn-gradient w-full text-center text-lg py-4 disabled:opacity-50"
      >
        <span>{starting ? 'Starting...' : '🏋️ Start Workout'}</span>
      </button>
    </div>
  );
}
