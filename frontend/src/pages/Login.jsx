import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailError =
    touched.email && !form.email
      ? 'Enter your email address.'
      : touched.email && !emailPattern.test(form.email)
        ? 'Enter a valid email address.'
        : '';
  const passwordError = touched.password && !form.password ? 'Enter your password.' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (error) setError('');
  };

  const markTouched = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  return (
    <div className="relative isolate flex min-h-[calc(100svh-9rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 top-8 size-80 rounded-full bg-cyan-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-violet-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.58),transparent_55%)]"
      />

      <motion.section
        aria-labelledby="login-title"
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">FitPulse account</p>
            <h1 id="login-title" className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
              Welcome back.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Pick up your training plan exactly where you left it.
            </p>
          </div>
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-lg font-black text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.14)]">
            F
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

        <form onSubmit={handleSubmit} className="mt-7 space-y-5" aria-busy={loading}>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="login-email" className="text-sm font-semibold text-slate-200">
                Email address
              </label>
              <span className="text-xs font-medium text-slate-500">Required</span>
            </div>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              className={`input-field min-h-12 px-4 ${emailError ? 'border-rose-400/70 focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]' : 'focus:border-cyan-300'}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField('email')}
              onBlur={markTouched('email')}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'login-email-error' : 'login-email-hint'}
            />
            <p id={emailError ? 'login-email-error' : 'login-email-hint'} className={`mt-2 text-xs ${emailError ? 'text-rose-300' : 'text-slate-500'}`}>
              {emailError || 'Use the email connected to your FitPulse account.'}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="login-password" className="text-sm font-semibold text-slate-200">
                Password
              </label>
              <span className="text-xs font-medium text-slate-500">Required</span>
            </div>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              className={`input-field min-h-12 px-4 ${passwordError ? 'border-rose-400/70 focus:border-rose-300 focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]' : 'focus:border-cyan-300'}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={updateField('password')}
              onBlur={markTouched('password')}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? 'login-password-error' : 'login-password-hint'}
            />
            <p id={passwordError ? 'login-password-error' : 'login-password-hint'} className={`mt-2 text-xs ${passwordError ? 'text-rose-300' : 'text-slate-500'}`}>
              {passwordError || 'Your password stays private and is never shown on this screen.'}
            </p>
          </div>

          <motion.button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="group relative mt-2 flex min-h-13 w-full items-center justify-center overflow-hidden rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-slate-950 shadow-[0_16px_36px_rgba(255,255,255,0.12)] transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            whileHover={shouldReduceMotion || loading ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion || loading ? undefined : { scale: 0.98 }}
          >
            <span className="relative inline-flex items-center gap-2">
              {loading ? 'Signing in...' : 'Sign in to FitPulse'}
              {!loading && <span aria-hidden="true">→</span>}
            </span>
          </motion.button>
        </form>

        <p className="mt-7 border-t border-white/[0.08] pt-5 text-center text-sm text-slate-400">
          New to FitPulse?{' '}
          <Link
            to="/register"
            className="font-bold text-cyan-300 underline-offset-4 transition hover:text-cyan-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Create an account
          </Link>
        </p>
      </motion.section>
    </div>
  );
}
