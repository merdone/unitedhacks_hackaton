import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function DashboardIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 13h6v7H4v-7Zm10-9h6v16h-6V4ZM4 4h6v5H4V4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckinIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 7h8M8 12h5M9 17l-2-2m0 0 2-2m-2 2h10"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function WorkoutIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 8v8M18 8v8M3 10v4m18-4v4M6 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5m4 14v-6m4 6V8m4 11v-9m4 9V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TemplatesIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path d="M4 5h16M4 12h16M4 19h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 3v4M17 10v4M10 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RecoveryIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-4.2 7-10.2A4.8 4.8 0 0 0 12 6.6 4.8 4.8 0 0 0 5 10.8C5 16.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12h2l1-2 2 5 1-3h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M4.5 20a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const isHomepage = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setMobileOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { to: '/insights', label: 'Insights', icon: InsightsIcon },
    { to: '/templates', label: 'Templates', icon: TemplatesIcon },
    { to: '/recovery', label: 'Recovery', icon: RecoveryIcon },
    { to: '/checkin', label: 'Check-in', icon: CheckinIcon },
    { to: '/workout', label: 'Workout', icon: WorkoutIcon },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/10'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="relative min-h-screen bg-dark-950">
      <nav
        className="sticky top-0 z-50 mx-4 mt-4 flex items-center justify-between rounded-md border border-white/10 bg-slate-950/80 px-4 py-3 shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-purple-600 text-lg font-bold text-white">
            F
          </span>
          <span className="hidden text-lg font-bold gradient-text sm:inline">FitPulse</span>
        </Link>

        {isLoggedIn && (
          <div className="hidden items-center gap-1 overflow-x-auto md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                <link.icon />
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="hidden items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(34,211,238,0.18)] transition hover:from-cyan-400 hover:to-violet-400 sm:inline-flex"
            >
              <span>Sign In</span>
            </NavLink>
          )}

          <NavLink
            to={isLoggedIn ? '/profile' : '/login'}
            aria-label={isLoggedIn ? 'Open profile' : 'Sign in'}
            title={isLoggedIn ? 'Profile' : 'Sign in'}
            className={({ isActive }) =>
              `grid h-11 w-11 place-items-center rounded-full border transition-all duration-200 ${
                isActive
                  ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/40 hover:bg-white/10'
              }`
            }
          >
            <UserIcon />
          </NavLink>

          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="text-slate-400 transition-colors hover:text-white md:hidden"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </nav>

      {mobileOpen && isLoggedIn && (
        <div className="relative z-50 mx-4 mt-2 flex flex-col gap-1 rounded-md border border-white/10 bg-slate-950/95 p-3 shadow-xl backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon />
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <main className={isHomepage ? 'relative z-10' : 'relative z-10 mx-auto max-w-5xl px-4 py-12'}>
        {children}
      </main>
    </div>
  );
}
