import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../api/apiService';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [conditionError, setConditionError] = useState('');
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
      setError('We could not load your current profile. You can still update the details below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        weight_current: form.weight_current ? parseFloat(form.weight_current) : null,
        height: form.height ? parseFloat(form.height) : null,
      };
      await usersAPI.updateProfile(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('We could not save your profile. Check your details and try again.');
    } finally {
      setSaving(false);
    }
  };

  const addCondition = () => {
    const trimmed = conditionInput.trim();
    if (!trimmed) {
      setConditionError('Enter a condition before adding it.');
      return;
    }
    if (form.medical_conditions.includes(trimmed)) {
      setConditionError('This condition is already listed.');
      return;
    }

    setForm({ ...form, medical_conditions: [...form.medical_conditions, trimmed] });
    setConditionInput('');
    setConditionError('');
  };

  const removeCondition = (index) => {
    setForm({
      ...form,
      medical_conditions: form.medical_conditions.filter((_, i) => i !== index),
    });
  };

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (error) setError('');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium text-slate-300">
          <div className="size-5 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
          Loading your profile
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative isolate mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8 lg:p-10"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-36 size-[28rem] rounded-full bg-cyan-400/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-40 size-[28rem] rounded-full bg-violet-500/10 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative">
        <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Athlete profile</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">Make the plan yours.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Keep the details FitPulse uses for more personal training context in one calm, editable place.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] px-4 py-3 text-sm">
            <span className="grid size-7 place-items-center rounded-full bg-cyan-300/15 text-xs font-black text-cyan-100">2</span>
            <span className="font-semibold text-cyan-50">Profile details</span>
          </div>
        </header>

        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              role="alert"
              aria-live="assertive"
              className="mt-6 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSave} className="mt-8 space-y-8" aria-busy={saving}>
          <fieldset className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-6">
            <legend className="px-2 text-sm font-bold text-white">Your baseline</legend>
            <p id="profile-baseline-help" className="mt-1 text-xs leading-5 text-slate-500">
              These optional details can make training recommendations more relevant. Update them whenever they change.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-slate-200">Full name</label>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  className="input-field min-h-12 px-4 focus:border-cyan-300"
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="Your name"
                  aria-describedby="profile-baseline-help"
                />
              </div>
              <div>
                <label htmlFor="profile-age" className="mb-2 block text-sm font-semibold text-slate-200">Age</label>
                <input
                  id="profile-age"
                  type="number"
                  inputMode="numeric"
                  className="input-field min-h-12 px-4 focus:border-cyan-300"
                  value={form.age}
                  onChange={updateField('age')}
                  placeholder="25"
                  aria-describedby="profile-baseline-help"
                />
              </div>
              <div>
                <label htmlFor="profile-weight" className="mb-2 block text-sm font-semibold text-slate-200">Weight <span className="font-medium text-slate-500">kg</span></label>
                <input
                  id="profile-weight"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  className="input-field min-h-12 px-4 focus:border-cyan-300"
                  value={form.weight_current}
                  onChange={updateField('weight_current')}
                  placeholder="75"
                  aria-describedby="profile-baseline-help"
                />
              </div>
              <div>
                <label htmlFor="profile-height" className="mb-2 block text-sm font-semibold text-slate-200">Height <span className="font-medium text-slate-500">cm</span></label>
                <input
                  id="profile-height"
                  type="number"
                  inputMode="numeric"
                  className="input-field min-h-12 px-4 focus:border-cyan-300"
                  value={form.height}
                  onChange={updateField('height')}
                  placeholder="180"
                  aria-describedby="profile-baseline-help"
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="profile-photo-url" className="mb-2 block text-sm font-semibold text-slate-200">Profile image URL <span className="font-medium text-slate-500">Optional</span></label>
              <input
                id="profile-photo-url"
                type="url"
                inputMode="url"
                className="input-field min-h-12 px-4 focus:border-cyan-300"
                value={form.photo_url}
                onChange={updateField('photo_url')}
                placeholder="https://example.com/your-photo.jpg"
                aria-describedby="profile-photo-help"
              />
              <p id="profile-photo-help" className="mt-2 text-xs text-slate-500">A public image link is optional and can be changed later.</p>
            </div>
          </fieldset>

          <fieldset className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-6">
            <legend className="px-2 text-sm font-bold text-white">Training considerations <span className="ml-1 font-medium text-slate-500">Optional</span></legend>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              List anything that should be remembered when thinking about your training context.
            </p>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-slate-950/50 p-3 sm:p-4">
              <label htmlFor="profile-condition-input" className="block text-sm font-semibold text-slate-200">
                Add a consideration
              </label>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  id="profile-condition-input"
                  type="text"
                  className={`input-field min-h-12 flex-1 px-4 ${conditionError ? 'border-rose-400/70 focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]' : 'focus:border-cyan-300'}`}
                  placeholder="For example, lower-back sensitivity"
                  value={conditionInput}
                  onChange={(event) => {
                    setConditionInput(event.target.value);
                    if (conditionError) setConditionError('');
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addCondition();
                    }
                  }}
                  aria-invalid={Boolean(conditionError)}
                  aria-describedby={conditionError ? 'profile-condition-error' : 'profile-condition-help'}
                />
                <motion.button
                  type="button"
                  onClick={addCondition}
                  className="min-h-12 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  Add
                </motion.button>
              </div>
              <p id={conditionError ? 'profile-condition-error' : 'profile-condition-help'} className={`mt-2 text-xs ${conditionError ? 'text-rose-300' : 'text-slate-500'}`}>
                {conditionError || 'This is optional; leave it blank if there is nothing to add.'}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2" aria-live="polite">
              {form.medical_conditions.map((condition, index) => (
                <motion.button
                  key={`${condition}-${index}`}
                  type="button"
                  onClick={() => removeCondition(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-2 text-sm font-semibold text-cyan-50 transition hover:border-rose-300/35 hover:bg-rose-400/10 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  aria-label={`Remove ${condition}`}
                >
                  {condition}
                  <span aria-hidden="true" className="text-base leading-none">×</span>
                </motion.button>
              ))}
              {form.medical_conditions.length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-slate-500">Nothing added yet.</p>
              )}
            </div>
          </fieldset>

          <motion.button
            id="profile-save"
            type="submit"
            disabled={saving}
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-200 via-white to-violet-200 px-6 py-4 text-sm font-black text-slate-950 shadow-[0_18px_42px_rgba(34,211,238,0.16)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={shouldReduceMotion || saving ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion || saving ? undefined : { scale: 0.985 }}
          >
            <span className="inline-flex items-center gap-2">
              {saving ? 'Saving profile...' : 'Save profile and continue'}
              {!saving && <span aria-hidden="true">→</span>}
            </span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
