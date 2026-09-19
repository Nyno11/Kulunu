import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

const ORG_TYPES = ['Individual', 'Registered Company', 'Non-profit / NGO'];
const ID_TYPES = ['National ID', 'International Passport', "Driver's License", 'Voter\'s Card'];

const EMPTY_FORM = {
  org_name: '', org_type: ORG_TYPES[0], phone: '', address: '', city: '', state: '',
  website: '', social_instagram: '', social_twitter: '',
  id_type: ID_TYPES[0], id_number: '', id_document_url: '',
};

export default function BecomeOrganiserPage() {
  const { token, user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState(undefined); // undefined = loading, null = no application yet
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function loadStatus() {
    fetch(`${BASE_URL}/organiser/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setStatus(d.data || null);
        if (d.data) {
          setForm(f => ({ ...f, org_name: d.data.org_name || f.org_name, org_type: d.data.org_type || f.org_type }));
        }
      })
      .catch(() => setStatus(null));
  }

  useEffect(() => { loadStatus(); }, [token]);

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/organiser/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Application submitted!', 'success');
        loadStatus();
      } else {
        showToast(data.message || 'Failed to submit application', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (user?.role === 'admin' || user?.role === 'organiser') {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar/>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3"/>
          <h1 className="font-heading font-black text-2xl mb-2">You're already an organiser</h1>
          <p className="text-gray-500 mb-6">You have full access to the organiser dashboard.</p>
          <button onClick={() => navigate('/admin')} className="ds-btn-primary">Go to Organiser Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-2xl mx-auto px-4 pb-16 pt-8">
        <h1 className="font-heading font-black text-2xl mb-2">Become an Organiser</h1>
        <p className="text-gray-500 text-sm mb-6">List events, sell tickets, and manage your own attendee list on Kulunu.</p>

        {status === undefined && <div className="blueprint p-6 text-center text-gray-400 text-sm">Loading…</div>}

        {status === null && (
          <form onSubmit={handleSubmit} className="blueprint p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400">Organisation Details</h2>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Organisation / Brand Name *</label>
              <input value={form.org_name} onChange={e => update('org_name', e.target.value)} required className="ds-input" placeholder="e.g. Lagos Sound Sessions"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Organisation Type *</label>
                <select value={form.org_type} onChange={e => update('org_type', e.target.value)} className="ds-input">
                  {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Phone Number *</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} required className="ds-input" placeholder="+234 800 000 0000"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Address *</label>
              <input value={form.address} onChange={e => update('address', e.target.value)} required className="ds-input" placeholder="Street address"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">City *</label>
                <input value={form.city} onChange={e => update('city', e.target.value)} required className="ds-input" placeholder="Lagos"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">State *</label>
                <input value={form.state} onChange={e => update('state', e.target.value)} required className="ds-input" placeholder="Lagos State"/>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Website</label>
                <input value={form.website} onChange={e => update('website', e.target.value)} className="ds-input" placeholder="https://…"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Instagram</label>
                <input value={form.social_instagram} onChange={e => update('social_instagram', e.target.value)} className="ds-input" placeholder="@handle"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Twitter / X</label>
              <input value={form.social_twitter} onChange={e => update('social_twitter', e.target.value)} className="ds-input" placeholder="@handle"/>
            </div>

            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400 mt-2">Identity Verification</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">ID Type *</label>
                <select value={form.id_type} onChange={e => update('id_type', e.target.value)} className="ds-input">
                  {ID_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">ID Number *</label>
                <input value={form.id_number} onChange={e => update('id_number', e.target.value)} required className="ds-input" placeholder="ID number"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">ID Document URL</label>
              <input value={form.id_document_url} onChange={e => update('id_document_url', e.target.value)} className="ds-input" placeholder="Link to a scan or photo of your ID"/>
            </div>

            <button type="submit" disabled={submitting} className="ds-btn-primary w-full py-3 disabled:opacity-50">
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
            <p className="text-xs text-gray-400 text-center">We typically review applications within 24–48 hours.</p>
          </form>
        )}

        {status?.status === 'pending' && (
          <div className="blueprint p-8 text-center">
            <Clock size={36} className="text-brand mx-auto mb-3"/>
            <h2 className="font-heading font-black text-lg mb-1">Application under review</h2>
            <p className="text-gray-500 text-sm mb-5">
              Thanks for applying{status.org_name ? `, ${status.org_name}` : ''}! We'll email you once a decision has been made.
              In the meantime, you can get a head start setting up your dashboard and drafting events.
            </p>
            <button onClick={() => navigate('/admin')} className="ds-btn-primary">Go to Organiser Dashboard</button>
          </div>
        )}

        {status?.status === 'approved' && (
          <div className="blueprint p-8 text-center">
            <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3"/>
            <h2 className="font-heading font-black text-lg mb-1">You're approved!</h2>
            <p className="text-gray-500 text-sm mb-4">Log out and back in to refresh your account, then head to your dashboard.</p>
            <button onClick={() => navigate('/admin')} className="ds-btn-primary">Go to Organiser Dashboard</button>
          </div>
        )}

        {status?.status === 'rejected' && (
          <>
            <div className="blueprint p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <XCircle size={20} className="text-red-500"/>
                <h2 className="font-heading font-black text-base">Application rejected</h2>
              </div>
              {status.rejection_reason && <p className="text-gray-500 text-sm">{status.rejection_reason}</p>}
            </div>
            <form onSubmit={handleSubmit} className="blueprint p-6 flex flex-col gap-5">
              <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400">Resubmit Application</h2>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Organisation / Brand Name *</label>
                <input value={form.org_name} onChange={e => update('org_name', e.target.value)} required className="ds-input"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Organisation Type *</label>
                  <select value={form.org_type} onChange={e => update('org_type', e.target.value)} className="ds-input">
                    {ORG_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Phone Number *</label>
                  <input value={form.phone} onChange={e => update('phone', e.target.value)} required className="ds-input"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Address *</label>
                <input value={form.address} onChange={e => update('address', e.target.value)} required className="ds-input"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">City *</label>
                  <input value={form.city} onChange={e => update('city', e.target.value)} required className="ds-input"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">State *</label>
                  <input value={form.state} onChange={e => update('state', e.target.value)} required className="ds-input"/>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">ID Type *</label>
                  <select value={form.id_type} onChange={e => update('id_type', e.target.value)} className="ds-input">
                    {ID_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">ID Number *</label>
                  <input value={form.id_number} onChange={e => update('id_number', e.target.value)} required className="ds-input"/>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="ds-btn-primary w-full py-3 disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Resubmit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
