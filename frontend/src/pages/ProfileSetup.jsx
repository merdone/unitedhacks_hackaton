import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/apiService';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    weight_current: '',
    height: '',
    medical_conditions: [],
    photo_url: '',
  });
  const [conditionInput, setConditionInput] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await usersAPI.getProfile();
      const u = res.data;
      setForm({
        name: u.name || '',
        age: u.age || '',
        weight_current: u.weight_current || '',
        height: u.height || '',
        medical_conditions: u.medical_conditions || [],
        photo_url: u.photo_url || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        weight_current: form.weight_current ? parseFloat(form.weight_current) : null,
        height: form.height ? parseFloat(form.height) : null,
      };
      await usersAPI.updateProfile(payload);
      navigate('/');
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const addCondition = () => {
    const trimmed = conditionInput.trim();
    if (trimmed && !form.medical_conditions.includes(trimmed)) {
      setForm({ ...form, medical_conditions: [...form.medical_conditions, trimmed] });
      setConditionInput('');
    }
  };

  const removeCondition = (index) => {
    setForm({
      ...form,
      medical_conditions: form.medical_conditions.filter((_, i) => i !== index),
    });
  };

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Setup</h1>
        <p className="text-slate-400 mb-8">Complete your profile to get personalized recommendations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 animate-fade-in-up stagger-1">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">
              👤
            </span>
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                id="profile-name"
                type="text"
                className="input-field"
                value={form.name}
                onChange={updateField('name')}
                placeholder="Your name"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Age</label>
                <input
                  id="profile-age"
                  type="number"
                  className="input-field"
                  value={form.age}
                  onChange={updateField('age')}
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Weight (kg)</label>
                <input
                  id="profile-weight"
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={form.weight_current}
                  onChange={updateField('weight_current')}
                  placeholder="75"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Height (cm)</label>
                <input
                  id="profile-height"
                  type="number"
                  className="input-field"
                  value={form.height}
                  onChange={updateField('height')}
                  placeholder="180"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="glass-card p-6 animate-fade-in-up stagger-2">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 text-sm">
              🏥
            </span>
            Medical Conditions
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              id="profile-condition-input"
              type="text"
              className="input-field flex-1"
              placeholder="e.g. Diabetes, Back pain..."
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
            />
            <button type="button" onClick={addCondition} className="btn-secondary px-4">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.medical_conditions.map((cond, i) => (
              <span key={i} className="tag group cursor-pointer" onClick={() => removeCondition(i)}>
                {cond}
                <svg className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            ))}
            {form.medical_conditions.length === 0 && (
              <p className="text-sm text-slate-500">No conditions added</p>
            )}
          </div>
        </div>

        {/* Save */}
        <button
          id="profile-save"
          type="submit"
          disabled={saving}
          className="btn-gradient w-full text-center disabled:opacity-50"
        >
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </form>
    </div>
  );
}
