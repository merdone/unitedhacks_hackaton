import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/checkin', label: 'Check-in', icon: '🧠' },
    { to: '/workout', label: 'Workout', icon: '💪' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/10'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="min-h-screen bg-dark-950 relative">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Top navbar */}
      <nav className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-3 flex items-center justify-between"
        style={{ borderRadius: '1rem' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-lg font-bold">
            F
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:inline">FitPulse</span>
        </div>

        {/* Desktop nav */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
              Logout
            </button>
          ) : (
            <NavLink to="/login" className="btn-gradient text-sm py-2 px-4">
              <span>Sign In</span>
            </NavLink>
          )}

          {/* Mobile hamburger */}
          {isLoggedIn && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && isLoggedIn && (
        <div className="md:hidden glass-card mx-4 mt-2 p-3 flex flex-col gap-1 animate-fade-in-up z-50 relative">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Page content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
