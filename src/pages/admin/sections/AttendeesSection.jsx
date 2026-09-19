import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../config';

export default function AttendeesSection() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    fetch(`${BASE_URL}/events/${selectedEvent}/attendees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setAttendees(d.data || d.attendees || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedEvent, token]);

  const filtered = attendees.filter(a =>
    !search ||
    (a.buyer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.buyer_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.ticket_code || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.tier_name || '').toLowerCase().includes(search.toLowerCase())
  );

  function exportCSV() {
    const headers = ['Name','Email','Phone','Ticket Code','Tier','Checked In','Purchased'];
    const rows = filtered.map(a => [
      a.buyer_name || '',
      a.buyer_email || '',
      a.buyer_phone || '',
      a.ticket_code || '',
      a.tier_name || '',
      a.check_in_status ? 'Yes' : 'No',
      a.purchased_at || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'attendees.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-heading font-black text-xl">ATTENDEES</h2>
        <button onClick={exportCSV} className="ds-btn-secondary text-xs flex items-center gap-1.5">
          <Download size={14}/>Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="ds-input sm:max-w-xs"
        >
          <option value="">Select event…</option>
          {events.map(ev => (
            <option key={ev.id_event || ev.id} value={ev.id_event || ev.id}>{ev.title}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search attendees…" className="ds-input pl-9"/>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">Loading attendees…</div>
      ) : !selectedEvent ? (
        <div className="blueprint p-16 text-center text-gray-400">Select an event to view attendees</div>
      ) : filtered.length === 0 ? (
        <div className="blueprint p-10 text-center text-gray-400">No attendees found</div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-3">{filtered.length} attendee{filtered.length !== 1 ? 's' : ''}</p>
          <div className="blueprint overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Name','Contact','Ticket Code','Tier','Check-in','Purchased'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.ticket_code || i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{a.buyer_name || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-500">{a.buyer_email || '—'}</div>
                      <div className="text-xs text-gray-400">{a.buyer_phone || ''}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.ticket_code || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{a.tier_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`tag ${a.check_in_status ? 'bg-green-100 text-green-700' : 'tag-neutral'}`}>
                        {a.check_in_status ? 'Checked in' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{a.purchased_at ? new Date(a.purchased_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
