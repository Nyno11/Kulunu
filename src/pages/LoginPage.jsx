import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { BASE_URL } from '../config';

export default function LoginPage() {
  const [tab, setTab] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.token || data.data?.token) {
        const session = data.data || data;
        login(session);
        showToast('Welcome back!', 'success');
        if (session.role === 'admin' || session.role === 'organiser') {
          navigate('/admin');
        } else {
          navigate('/discover');
        }
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: form.name, email: form.email, password: form.password, role: 'attendee' }),
      });
      const data = await res.json();
      if (data.token || data.data?.token) {
        const session = data.data || data;
        login(session);
        showToast('Account created!', 'success');
        navigate('/discover');
      } else {
        showToast(data.message || 'Sign up failed', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-2xl overflow-hidden">
        {/* Left brand panel */}
        <div className="hidden md:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-brand to-navy">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-black text-lg">k</div>
              <span className="font-heading font-black text-xl">kulunu</span>
            </div>
            <h2 className="font-heading font-black text-2xl leading-tight mb-3">Your ticket to every event in Nigeria.</h2>
            <p className="text-sm opacity-80 leading-relaxed">Book in seconds. Walk in with a QR. Never lose a ticket again.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[['4,200+','Events'],['180K','Tickets'],['98%','Entry rate']].map(([n,l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-4">
                <div className="font-heading font-black text-xl">{n}</div>
                <div className="text-xs opacity-70">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="bg-white p-8 flex flex-col justify-center">
          <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setTab('signin')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === 'signin' ? 'bg-white shadow text-brand' : 'text-gray-400'}`}>Sign In</button>
            <button onClick={() => setTab('signup')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${tab === 'signup' ? 'bg-white shadow text-brand' : 'text-gray-400'}`}>Create Account</button>
          </div>

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <h3 className="font-heading font-black text-lg">Welcome back</h3>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="ds-input" placeholder="you@email.com"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required className="ds-input" placeholder="••••••••"/>
              </div>
              <button type="submit" disabled={loading} className="ds-btn-primary w-full py-3 rounded-md disabled:opacity-50">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <h3 className="font-heading font-black text-lg">Create your account</h3>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required className="ds-input" placeholder="Your name"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="ds-input" placeholder="you@email.com"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} className="ds-input" placeholder="Min. 6 characters"/>
              </div>
              <button type="submit" disabled={loading} className="ds-btn-primary w-full py-3 rounded-md disabled:opacity-50">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-400 text-center mt-4">
            By continuing, you agree to our <a href="#" className="text-brand hover:underline">Terms of Service</a>
          </p>
          <div className="text-center mt-3">
            <Link to="/" className="text-xs text-gray-400 hover:text-brand">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
