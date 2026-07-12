import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, Outlet } from 'react-router-dom';
import BrandMark from './BrandMark';

const navigation = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Training loop', href: '#training-loop' },
  { label: 'Exercise library', href: '#library' },
];

const journey = [
  'Readiness check-in',
  'Session recommendation',
  'Focused workout logging',
  'Post-session reflection',
];

export default function MarketingLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const mobileDialogRef = useRef(null);
  const firstMobileLinkRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isLoggedIn =
    typeof window !== 'undefined' && Boolean(window.localStorage.getItem('token'));

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeMenuAtDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopQuery.addEventListener('change', closeMenuAtDesktop);
    return () => desktopQuery.removeEventListener('change', closeMenuAtDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus());

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        const dialog = mobileDialogRef.current;
        if (!dialog) return;

        const focusableElements = Array.from(
          dialog.querySelectorAll(
            'a[href], button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (!firstElement || !lastElement) return;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        } else if (!dialog.contains(document.activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const accountDestination = isLoggedIn ? '/dashboard' : '/login';
  const accountLabel = isLoggedIn ? 'Open dashboard' : 'Sign in';
  const AccountIcon = isLoggedIn ? LayoutDashboard : LogIn;

  return (
    <div id="top" className="min-h-screen overflow-x-clip bg-[#05070b] text-slate-100">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="pointer-events-none absolute inset-x-0 -top-4 h-28 bg-gradient-to-b from-[#05070b] via-[#05070b]/80 to-transparent" />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-950/75 px-4 shadow-[0_16px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-5">
          <Link
            to="/"
            aria-label="FitPulse home"
            className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
            onClick={() => setMenuOpen(false)}
          >
            <BrandMark />
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to={accountDestination}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.12)] transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:inline-flex"
            >
              {accountLabel}
              <AccountIcon aria-hidden="true" className="size-4" strokeWidth={2.3} />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-slate-950/70 px-3 pb-6 pt-24 backdrop-blur-md lg:hidden"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close navigation menu"
              className="absolute inset-0 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              ref={mobileDialogRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="relative mx-auto max-h-[calc(100svh-7rem)] max-w-7xl overflow-y-auto rounded-[1.75rem] border border-white/10 bg-slate-950 p-3 shadow-2xl"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
            >
              <nav aria-label="Mobile navigation">
                {navigation.map((item, index) => (
                  <a
                    key={item.href}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold text-slate-200 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden="true" className="size-4 text-slate-400" />
                  </a>
                ))}
                <Link
                  to={accountDestination}
                  className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <AccountIcon aria-hidden="true" className="size-4" />
                  {accountLabel}
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" tabIndex={-1} className="min-h-screen outline-none">
        {children ?? <Outlet />}
      </main>

      <footer className="border-t border-white/[0.08] bg-[#070a10] px-5 pb-8 pt-16 sm:px-8 lg:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-white/[0.08] pb-14 md:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-20">
            <div className="max-w-md">
              <Link
                to="/"
                aria-label="FitPulse home"
                className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <BrandMark />
              </Link>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                A calmer way to check in, shape the session, log the work, and carry useful
                context into what comes next.
              </p>
              <Link
                to={accountDestination}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                {accountLabel}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <nav aria-label="Footer navigation">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Explore
              </h2>
              <ul className="mt-5 space-y-3">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm font-medium text-slate-300 transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                The training journey
              </h2>
              <ol className="mt-5 space-y-3">
                {journey.map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[0.65rem] font-bold text-cyan-300">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} FitPulse. Built for thoughtful training.</p>
            <a
              href="#top"
              className="inline-flex w-fit items-center gap-1.5 font-semibold text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              Back to top
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
