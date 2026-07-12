import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    weight_current: '',
    height: '',
  });
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const nameError = touched.name && !form.name.trim() ? 'Enter the name you want us to use.' : '';
  const emailError =
    touched.email && !form.email
      ? 'Enter your email address.'
      : touched.email && !emailPattern.test(form.email)
        ? 'Enter a valid email address.'
        : '';
  const passwordError =
    touched.password && !form.password
      ? 'Create a password.'
      : touched.password && form.password.length < 6
        ? 'Use at least 6 characters.'
        : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        weight_current: form.weight_current ? parseFloat(form.weight_current) : null,
        height: form.height ? parseFloat(form.height) : null,
        medical_conditions: [],
      };
      await authAPI.register(payload);
      // Auto-login after registration
      const loginRes = await authAPI.login({ email: form.email, password: form.password });
      localStorage.setItem('token', loginRes.data.access_token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (error) setError('');
  };

  const markTouched = (field) => () => setTouched((current) => ({ ...current, [field]: true }));
  const inputClass = (hasError) =>
    `input-field min-h-12 px-4 ${
      hasError
        ? 'border-rose-400/70 focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]'
        : 'focus:border-cyan-300'
    }`;

  return (
    <div className="relative isolate flex min-h-[calc(100svh-9rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 bottom-0 size-96 rounded-full bg-emerald-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-8 size-[26rem] rounded-full bg-violet-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.13),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.62),transparent_56%)]"
      />

      <motion.section
        aria-labelledby="register-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Start your profile</p>
            <h1 id="register-title" className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
              Train with more context.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              A few details now help FitPulse make a more useful recommendation later.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
            <span className="grid size-7 place-items-center rounded-full bg-violet-400/15 text-xs font-black text-violet-200">1</span>
            <span className="font-semibold text-slate-300">Account setup</span>
          </div>
        </div>

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

        <form onSubmit={handleSubmit} className="mt-7 space-y-7" aria-busy={loading}>
          <fieldset className="space-y-5">
            <legend className="text-sm font-bold text-white">Your account</legend>

            <div className="grid gap-5 sm:grid-cols-[1fr_1.25fr]">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="register-name" className="text-sm font-semibold text-slate-200">
                    Name
                  </label>
                  <span className="text-xs font-medium text-slate-500">Required</span>
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  autoComplete="name"
                  className={inputClass(Boolean(nameError))}
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={updateField('name')}
                  onBlur={markTouched('name')}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? 'register-name-error' : 'register-name-hint'}
                />
                <p id={nameError ? 'register-name-error' : 'register-name-hint'} className={`mt-2 text-xs ${nameError ? 'text-rose-300' : 'text-slate-500'}`}>
                  {nameError || 'This is how your dashboard will greet you.'}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="register-email" className="text-sm font-semibold text-slate-200">
                    Email address
                  </label>
                  <span className="text-xs font-medium text-slate-500">Required</span>
                </div>
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClass(Boolean(emailError))}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField('email')}
                  onBlur={markTouched('email')}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'register-email-error' : 'register-email-hint'}
                />
                <p id={emailError ? 'register-email-error' : 'register-email-hint'} className={`mt-2 text-xs ${emailError ? 'text-rose-300' : 'text-slate-500'}`}>
                  {emailError || 'Use an email you can access for signing in.'}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="register-password" className="text-sm font-semibold text-slate-200">
                  Password
                </label>
                <span className="text-xs font-medium text-slate-500">6+ characters</span>
              </div>
              <input
                id="register-password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass(Boolean(passwordError))}
                placeholder="Create a secure password"
                value={form.password}
                onChange={updateField('password')}
                onBlur={markTouched('password')}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'register-password-error' : 'register-password-hint'}
              />
              <p id={passwordError ? 'register-password-error' : 'register-password-hint'} className={`mt-2 text-xs ${passwordError ? 'text-rose-300' : 'text-slate-500'}`}>
                {passwordError || 'Use at least 6 characters to protect your account.'}
              </p>
            </div>
          </fieldset>

          <fieldset className="border-t border-white/[0.08] pt-6">
            <legend className="text-sm font-bold text-white">Training baseline <span className="ml-1 font-medium text-slate-500">Optional</span></legend>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              You can update these at any time. They help make your future recommendations more personal.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="register-age" className="mb-2 block text-sm font-semibold text-slate-200">Age</label>
                <input
                  id="register-age"
                  type="number"
                  inputMode="numeric"
                  className={inputClass(false)}
                  placeholder="25"
                  value={form.age}
                  onChange={updateField('age')}
                />
              </div>
              <div>
                <label htmlFor="register-weight" className="mb-2 block text-sm font-semibold text-slate-200">Weight <span className="font-medium text-slate-500">kg</span></label>
                <input
                  id="register-weight"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  className={inputClass(false)}
                  placeholder="75"
                  value={form.weight_current}
                  onChange={updateField('weight_current')}
                />
              </div>
              <div>
                <label htmlFor="register-height" className="mb-2 block text-sm font-semibold text-slate-200">Height <span className="font-medium text-slate-500">cm</span></label>
                <input
                  id="register-height"
                  type="number"
                  inputMode="numeric"
                  className={inputClass(false)}
                  placeholder="180"
                  value={form.height}
                  onChange={updateField('height')}
                />
              </div>
            </div>
          </fieldset>

          <motion.button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="group flex min-h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-200 via-white to-violet-200 px-5 py-3.5 text-sm font-black text-slate-950 shadow-[0_16px_38px_rgba(34,211,238,0.14)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={shouldReduceMotion || loading ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion || loading ? undefined : { scale: 0.98 }}
          >
            <span className="inline-flex items-center gap-2">
              {loading ? 'Creating account...' : 'Create your account'}
              {!loading && <span aria-hidden="true">→</span>}
            </span>
          </motion.button>
        </form>

        <p className="mt-7 border-t border-white/[0.08] pt-5 text-center text-sm text-slate-400">
          Already training with FitPulse?{' '}
          <Link
            to="/login"
            className="font-bold text-cyan-300 underline-offset-4 transition hover:text-cyan-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Sign in
          </Link>
        </p>
      </motion.section>
    </div>
  );
}
