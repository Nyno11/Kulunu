import { useState, useEffect } from 'react';
import { Plus, Edit2, Ban, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../config';
import { useToast } from '../../../components/Toast';
import ImageUpload from '../../../components/ImageUpload';
import { uploadImage } from '../../../utils/uploadImage';

const EMPTY_FORM = {
  title: '', category: 'Conference', date: '', time: '', venue: '',
  description: '', capacity: '', banner_url: '', status: 'active',
};

const EVENT_TYPES = ['Concert','Conference','Community','Sports','Nightlife','Religious','Workshop','Festival','Other'];

function EventModal({ event, onClose, onSaved, token }) {
  const [form, setForm] = useState(event ? {
    title: event.title || '',
    category: event.type || event.category || 'Conference',
    date: event.date || '',
    time: event.time || '',
    venue: event.venue || '',
    description: event.description || '',
    capacity: event.capacity || '',
    banner_url: event.banner_url || '',
    status: event.status || 'active',
  } : { ...EMPTY_FORM });
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let bannerUrl = form.banner_url;
      if (bannerFile) {
        try {
          bannerUrl = await uploadImage(bannerFile, token);
        } catch (err) {
          showToast(err.message || 'Banner upload failed', 'error');
          setSaving(false);
          return;
        }
      }

      const url = event ? `${BASE_URL}/events/${event.id_event || event.id}` : `${BASE_URL}/create-event`;
      const method = event ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, banner_url: bannerUrl, max_capacity: form.capacity ? Number(form.capacity) : undefined }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        showToast(event ? 'Event updated!' : 'Event created!', 'success');
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
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="font-heading font-black text-lg">{event ? 'Edit Event' : 'Create Event'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required className="ds-input" placeholder="Event name"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="ds-input">
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className="ds-input">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} required className="ds-input"/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))} className="ds-input"/>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Venue *</label>
            <input value={form.venue} onChange={e => setForm(f => ({...f, venue: e.target.value}))} required className="ds-input" placeholder="Venue name, city"/>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Capacity</label>
            <input type="number" value={form.capacity} onChange={e => setForm(f => ({...f, capacity: e.target.value}))} className="ds-input" placeholder="Leave blank for unlimited"/>
          </div>
          <ImageUpload initialUrl={form.banner_url} onFileSelect={file => { setBannerFile(file); if (!file) setForm(f => ({...f, banner_url: ''})); }}/>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="ds-input resize-none"/>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="ds-btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="ds-btn-primary disabled:opacity-50">
              {saving ? 'Saving…' : event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const { token } = useAuth();
  const showToast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // null | 'create' | event object
  const [deleting, setDeleting] = useState(null);

  function loadEvents() {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/admin/events`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async r => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !d?.success) {
          throw new Error(d?.message || `Request failed (${r.status})`);
        }
        return d;
      })
      .then(d => { setEvents(d.data || []); setLoading(false); })
      .catch(err => { console.error('[EventsSection] /admin/events failed:', err); setError(err.message || 'Failed to load events'); setLoading(false); });
  }

  useEffect(() => { loadEvents(); }, [token]);

  async function cancelEvent(ev) {
    if (!confirm(`Cancel "${ev.title}"? Attendees who already bought tickets will still be able to see them, but the event will be marked cancelled.`)) return;
    setDeleting(ev.id_event || ev.id);
    try {
      const res = await fetch(`${BASE_URL}/events/${ev.id_event || ev.id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Event cancelled', 'success');
        loadEvents();
      } else {
        showToast(data.message || 'Failed to cancel', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDeleting(null);
    }
  }

  const statusColor = { active: 'bg-green-100 text-green-700', draft: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div>
      {modal && (
        <EventModal
          event={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={loadEvents}
          token={token}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-black text-xl">EVENTS</h2>
        <button onClick={() => setModal('create')} className="ds-btn-primary">
          <Plus size={15}/>Create Event
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">Loading events…</div>
      ) : error ? (
        <div className="blueprint p-16 text-center text-red-400">{error}</div>
      ) : events.length === 0 ? (
        <div className="blueprint p-16 text-center text-gray-400">
          <p className="mb-4">No events yet.</p>
          <button onClick={() => setModal('create')} className="ds-btn-primary"><Plus size={15}/>Create Event</button>
        </div>
      ) : (
        <div className="blueprint overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Event','Date','Venue','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id_event || ev.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {ev.banner_url ? (
                        <img src={ev.banner_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-none border border-gray-100"/>
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex-none bg-gradient-to-br from-brand/20 to-navy/20"/>
                      )}
                      <div>
                        <div className="font-medium">{ev.title}</div>
                        <div className="text-xs text-gray-400">{ev.type || ev.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{ev.date}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{ev.venue}</td>
                  <td className="px-4 py-3">
                    <span className={`tag ${statusColor[ev.status] || 'tag-neutral'}`}>
                      {ev.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(ev)} className="ds-btn-ghost text-xs py-1 px-2">
                        <Edit2 size={13}/>Edit
                      </button>
                      {ev.status !== 'cancelled' && (
                        <button onClick={() => cancelEvent(ev)} disabled={deleting === (ev.id_event || ev.id)}
                          className="text-xs px-2 py-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1">
                          <Ban size={13}/>Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
