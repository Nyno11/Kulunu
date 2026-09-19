import { useState } from 'react';
import { User, Shield, Bell, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function ProfileSection({ user, token }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) showToast('Profile updated!', 'success');
      else showToast(data.message || 'Failed to update', 'error');
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <h2 className="font-heading font-black text-lg">Profile Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Full Name</label>
          <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="ds-input" placeholder="Your name"/>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Email</label>
          <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} type="email" className="ds-input" placeholder="you@email.com"/>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Phone</label>
          <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="ds-input" placeholder="+234 800 000 0000"/>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">City</label>
          <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className="ds-input" placeholder="Lagos"/>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="ds-btn-primary disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

function SecuritySection({ token }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) { showToast('Passwords do not match', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: form.current_password, new_password: form.new_password }),
      });
      const data = await res.json();
      if (res.ok) { showToast('Password changed!', 'success'); setForm({ current_password: '', new_password: '', confirm_password: '' }); }
      else showToast(data.message || 'Failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="font-heading font-black text-lg">Change Password</h2>
      {[['current_password','Current Password'],['new_password','New Password'],['confirm_password','Confirm New Password']].map(([k,l]) => (
        <div key={k}>
          <label className="text-xs font-bold text-gray-500 mb-1 block">{l}</label>
          <input type="password" value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} className="ds-input" placeholder="••••••••" required/>
        </div>
      ))}
      <button type="submit" disabled={saving} className="ds-btn-primary w-fit disabled:opacity-50">
        {saving ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({ email_events: true, email_tickets: true, sms_tickets: false, marketing: false });
  const showToast = useToast();

  function toggle(key) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    showToast('Preference saved', 'success');
  }

  const items = [
    { key: 'email_events', label: 'New events near me', sub: 'Get notified when new events match your interests' },
    { key: 'email_tickets', label: 'Ticket confirmations', sub: 'Email receipts and ticket QR codes' },
    { key: 'sms_tickets', label: 'SMS alerts', sub: 'SMS reminders before events you are attending' },
    { key: 'marketing', label: 'Marketing emails', sub: 'Promotions, deals, and featured events' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading font-black text-lg">Notification Preferences</h2>
      {items.map(item => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div>
            <div className="font-medium text-sm">{item.label}</div>
            <div className="text-xs text-gray-400">{item.sub}</div>
          </div>
          <button
            onClick={() => toggle(item.key)}
            className={`w-11 h-6 rounded-full transition-colors relative ${prefs[item.key] ? 'bg-brand' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? 'right-1' : 'left-1'}`}/>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const [section, setSection] = useState('profile');
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const SectionComponent = { profile: () => <ProfileSection user={user} token={token}/>, security: () => <SecuritySection token={token}/>, notifications: NotificationsSection }[section];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-heading font-black text-2xl mb-6">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="blueprint overflow-hidden">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-100 last:border-0 transition-colors
                    ${section === id ? 'bg-blue-50 text-brand font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon size={15}/>{label}
                </button>
              ))}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15}/>Log out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 blueprint p-6">
            <SectionComponent/>
          </div>
        </div>
      </div>
    </div>
  );
}
