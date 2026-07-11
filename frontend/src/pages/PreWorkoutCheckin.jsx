import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readinessAPI } from '../api/apiService';
import VoiceRecorder from '../components/VoiceRecorder';

const sliderConfig = [
  {
    key: 'sleep_quality',
    label: 'Sleep Quality',
    icon: '😴',
    color: 'from-blue-500 to-indigo-500',
    lowLabel: 'Terrible',
    highLabel: 'Amazing',
  },
  {
    key: 'mood',
    label: 'Mood',
    icon: '😊',
    color: 'from-amber-500 to-orange-500',
    lowLabel: 'Very low',
    highLabel: 'Excellent',
  },
  {
    key: 'motivation',
    label: 'Motivation',
    icon: '🔥',
    color: 'from-emerald-500 to-green-500',
    lowLabel: 'None',
    highLabel: 'Maximum',
  },
  {
    key: 'fatigue_level',
    label: 'Fatigue Level',
    icon: '🥱',
    color: 'from-rose-500 to-red-500',
    lowLabel: 'Fresh',
    highLabel: 'Exhausted',
  },
];

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

  const handleSliderChange = (key, value) => {
    setForm({ ...form, [key]: parseInt(value) });
  };

  const handleVoiceTranscription = (text) => {
    setForm({
      ...form,
      additional_notes: form.additional_notes
        ? `${form.additional_notes}\n${text}`
        : text,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await readinessAPI.submit(form);
      navigate('/recommendation');
    } catch (err) {
      console.error('Failed to submit readiness:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Pre-Workout Check-in</h1>
        <p className="text-slate-400 mb-8">How are you feeling today? This helps our AI tailor your workout.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sliders */}
        {sliderConfig.map((slider, index) => (
          <div
            key={slider.key}
            className={`glass-card p-6 md:p-8 animate-fade-in-up stagger-${index + 1}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{slider.icon}</span>
                <label className="text-base font-semibold text-white">{slider.label}</label>
              </div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${slider.color} bg-clip-text text-transparent`}>
                {form[slider.key]}
              </div>
            </div>
            <input
              id={`checkin-${slider.key}`}
              type="range"
              min="1"
              max="10"
              value={form[slider.key]}
              onChange={(e) => handleSliderChange(slider.key, e.target.value)}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm text-slate-500 mt-2 font-medium">
              <span>{slider.lowLabel}</span>
              <span>{slider.highLabel}</span>
            </div>
          </div>
        ))}

        {/* Voice Input */}
        <div className="animate-fade-in-up stagger-5 py-2">
          <VoiceRecorder onTranscription={handleVoiceTranscription} />
        </div>

        {/* Additional Notes */}
        <div className="glass-card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <label className="block text-base font-semibold text-white mb-3 flex items-center gap-2">
            <span>📝</span> Additional Notes
          </label>
          <textarea
            id="checkin-notes"
            rows={4}
            className="input-field resize-none text-base p-4"
            placeholder="Any pain, discomfort, or things to note..."
            value={form.additional_notes}
            onChange={(e) => setForm({ ...form, additional_notes: e.target.value })}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            id="checkin-submit"
            type="submit"
            disabled={loading}
            className="btn-gradient w-full text-center text-lg py-4 disabled:opacity-50"
          >
            <span>{loading ? 'Submitting...' : 'Get AI Recommendation →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
