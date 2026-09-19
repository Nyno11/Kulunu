import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../config';
import { useToast } from '../../../components/Toast';

const EMPTY_TIER = { name: '', price: '', quantity: '', description: '', for_sale: true };

function TierModal({ tier, eventId, onClose, onSaved, token }) {
  const [form, setForm] = useState(tier ? {
    name: tier.name || '',
    price: tier.price ?? '',
    quantity: tier.quantity ?? '',
    description: tier.description || '',
    for_sale: !!tier.for_sale,
  } : { ...EMPTY_TIER });
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = tier ? `${BASE_URL}/admin/tickets/${tier.id}` : `${BASE_URL}/admin/events/${eventId}/tickets`;
      const method = tier ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price) || 0, quantity: Number(form.quantity) || 0 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(tier ? 'Ticket tier updated!' : 'Ticket tier added!', 'success');
        onSaved();
        onClose();
      } else {
        showToast(data.message || 'Failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="font-heading font-black text-lg">{tier ? 'Edit Ticket Tier' : 'Add Ticket Tier'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="ds-input" placeholder="e.g. VIP"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Price (₦)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} className="ds-input" placeholder="0 for free"/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Quantity *</label>
              <input type="number" value={form.quantity} onChange={e => setForm(f => ({...f, quantity: e.target.value}))} required className="ds-input"/>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2} className="ds-input resize-none"/>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.for_sale} onChange={e => setForm(f => ({...f, for_sale: e.target.checked}))}/>
            On sale
          </label>
          <button type="submit" disabled={saving} className="ds-btn-primary w-full py-3 disabled:opacity-50">
            {saving ? 'Saving…' : tier ? 'Save Changes' : 'Add Tier'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TicketsSection() {
  const { token } = useAuth();
  const showToast = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null = closed, 'new' = add, tier obj = edit
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/admin/events`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        const evs = d.data || d.events || [];
        setEvents(evs);
        if (evs.length > 0) setSelectedEvent(evs[0].id_event || evs[0].id);
      })
      .catch(() => {});
  }, [token]);

  function loadTiers() {
    if (!selectedEvent) return;
    setLoading(true);
    fetch(`${BASE_URL}/admin/events/${selectedEvent}/tickets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setTiers(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadTiers(); }, [selectedEvent, token]);

  async function deleteTier(tier) {
    if (!confirm(`Delete ticket tier "${tier.name}"?`)) return;
    setDeleting(tier.id);
    try {
      const res = await fetch(`${BASE_URL}/admin/tickets/${tier.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Ticket tier deleted', 'success');
        loadTiers();
      } else {
        showToast(data.message || 'Failed to delete', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {modal && (
        <TierModal
          tier={modal === 'new' ? null : modal}
          eventId={selectedEvent}
          token={token}
          onClose={() => setModal(null)}
          onSaved={loadTiers}
        />
      )}

      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h1 className="font-heading font-black text-xl">Tickets</h1>
        <div className="flex gap-3">
          <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="ds-input w-auto">
            {events.map(ev => (
              <option key={ev.id_event || ev.id} value={ev.id_event || ev.id}>{ev.title}</option>
            ))}
          </select>
          <button onClick={() => setModal('new')} disabled={!selectedEvent} className="ds-btn-primary disabled:opacity-50">
            <Plus size={14}/>Add Tier
          </button>
        </div>
      </div>

      <div className="blueprint overflow-x-auto">
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-10">Loading…</p>
        ) : tiers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No ticket tiers for this event yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-widest">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Sold / Qty</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tiers.map(t => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3">{Number(t.price) === 0 ? 'Free' : `₦${Number(t.price).toLocaleString()}`}</td>
                  <td className="px-4 py-3 text-gray-500">{t.sold} / {t.quantity}</td>
                  <td className="px-4 py-3 text-gray-500">{t.available}</td>
                  <td className="px-4 py-3">
                    <span className={`tag ${t.for_sale ? 'tag-accent' : 'tag-neutral'}`}>{t.for_sale ? 'On sale' : 'Paused'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setModal(t)} className="ds-btn-ghost text-xs py-1 px-2">
                        <Edit2 size={13}/>Edit
                      </button>
                      <button onClick={() => deleteTier(t)} disabled={deleting === t.id}
                        className="text-xs px-2 py-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1">
                        <Trash2 size={13}/>Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
