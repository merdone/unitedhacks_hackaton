import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    weight_current: '',
    height: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            F
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-1 text-sm">Start your fitness journey today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
            <input
              id="register-name"
              type="text"
              required
              className="input-field"
              placeholder="John Doe"
              value={form.name}
              onChange={updateField('name')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
            <input
              id="register-email"
              type="email"
              required
              className="input-field"
              placeholder="your@email.com"
              value={form.email}
              onChange={updateField('email')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
            <input
              id="register-password"
              type="password"
              required
              minLength={6}
              className="input-field"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={updateField('password')}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Age</label>
              <input
                id="register-age"
                type="number"
                className="input-field"
                placeholder="25"
                value={form.age}
                onChange={updateField('age')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Weight (kg)</label>
              <input
                id="register-weight"
                type="number"
                step="0.1"
                className="input-field"
                placeholder="75"
                value={form.weight_current}
                onChange={updateField('weight_current')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Height (cm)</label>
              <input
                id="register-height"
                type="number"
                className="input-field"
                placeholder="180"
                value={form.height}
                onChange={updateField('height')}
              />
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn-gradient w-full text-center disabled:opacity-50"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
