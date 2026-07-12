import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import AppBackdrop from './AppBackdrop';
import AppIcon from './AppIcon';
import BrandMark from './BrandMark';

const appLinks = [
  { to: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { to: '/checkin', label: 'Check-in', icon: 'checkin' },
  { to: '/workout', label: 'Workout', icon: 'dumbbell' },
  { to: '/insights', label: 'Insights', icon: 'barChart' },
  { to: '/templates', label: 'Plans', icon: 'template' },
  { to: '/recovery', label: 'Recovery', icon: 'recovery' },
];

const publicLinks = [
  { to: '/', label: 'Overview', icon: 'pulse', end: true },
  { to: '/how-it-works', label: 'How it works', icon: 'layers' },
  { to: '/features', label: 'Features', icon: 'spark' },
  { to: '/plans', label: 'Plans', icon: 'template' },
  { to: '/faq', label: 'FAQ', icon: 'message' },
];

function NavItem({ item, mobile = false, onClick }) {
  const className = mobile
    ? ({ isActive }) =>
        [
          'group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-sm font-semibold transition',
          isActive
            ? 'bg-white/[0.09] text-white'
            : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100',
        ].join(' ')
    : ({ isActive }) =>
        [
          'group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
          isActive
            ? 'text-white'
            : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-100',
        ].join(' ');

  return (
    <NavLink to={item.to} end={item.end} className={className} onClick={onClick}>
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId={mobile ? 'mobile-navigation-indicator' : 'desktop-navigation-indicator'}
              className={
                mobile
                  ? 'absolute inset-0 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.08]'
                  : 'absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent'
              }
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            />
          )}
          <AppIcon
            name={item.icon}
            className="relative h-4 w-4 shrink-0 text-cyan-200 transition group-hover:text-cyan-100"
            strokeWidth={2}
          />
          <span className="relative">{item.label}</span>
          {mobile && (
            <AppIcon
              name="chevronRight"
              className="relative ml-auto h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-200"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const links = isLoggedIn ? appLinks : publicLinks;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMobileOpen(false);
    navigate('/login');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell min-h-screen overflow-x-clip bg-[#05070b] text-slate-100">
        <AppBackdrop />
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-xl transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
          <div className="app-topbar mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 sm:px-4">
            <Link
              to="/"
              aria-label="FitPulse home"
              className="shrink-0 rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-200"
            >
              <BrandMark />
            </Link>

            <nav aria-label="Primary navigation" className="hidden min-w-0 items-center gap-1 lg:flex">
              {links.map((item) => (
                <NavItem key={item.to} item={item} />
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/profile"
                    aria-label="Open profile"
                    className={({ isActive }) =>
                      [
                        'grid size-10 place-items-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200',
                        isActive
                          ? 'border-cyan-300/35 bg-cyan-300/[0.12] text-cyan-100'
                          : 'border-white/10 bg-white/[0.045] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
                      ].join(' ')
                    }
                  >
                    <AppIcon name="user" className="h-[18px] w-[18px]" strokeWidth={2} />
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-rose-300/25 hover:bg-rose-400/[0.08] hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:inline-flex"
                  >
                    <AppIcon name="arrowUpRight" className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:inline-flex"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="hidden items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:inline-flex"
                  >
                    Start free
                    <AppIcon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                  </Link>
                </>
              )}

              <button
                type="button"
                aria-controls="mobile-navigation"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                onClick={() => setMobileOpen((open) => !open)}
                className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.045] text-slate-200 transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 lg:hidden"
              >
                <AppIcon name={mobileOpen ? 'x' : 'menu'} className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/55 px-3 pb-6 pt-24 backdrop-blur-lg lg:hidden"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              <button
                type="button"
                aria-label="Close navigation menu"
                className="absolute inset-0 cursor-default"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                className="app-mobile-menu relative mx-auto max-w-xl rounded-[1.5rem] p-3"
                initial={reduceMotion ? false : { opacity: 0, y: -12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.985 }}
                transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <nav aria-label="Mobile navigation" className="grid gap-1">
                  {links.map((item) => (
                    <NavItem key={item.to} item={item} mobile onClick={() => setMobileOpen(false)} />
                  ))}
                </nav>

                <div className="mt-3 border-t border-white/10 pt-3">
                  {isLoggedIn ? (
                    <div className="grid grid-cols-2 gap-2">
                      <NavLink
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 text-sm font-semibold text-slate-200"
                      >
                        <AppIcon name="user" className="h-4 w-4" />
                        Profile
                      </NavLink>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 rounded-xl border border-rose-300/15 bg-rose-400/[0.07] px-3 py-3 text-sm font-semibold text-rose-100"
                      >
                        Sign out
                        <AppIcon name="arrowUpRight" className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-slate-950"
                    >
                      Create your account
                      <AppIcon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main
          id="main-content"
          tabIndex={-1}
          className="relative z-10 min-h-[calc(100vh-80px)] outline-none"
        >
          {children}
        </main>
      </div>
    </MotionConfig>
  );
}
