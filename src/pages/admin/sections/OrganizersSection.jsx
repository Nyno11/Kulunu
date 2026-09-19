import { useState, useEffect } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../config';
import { useToast } from '../../../components/Toast';

export default function OrganizersSection() {
  const { token } = useAuth();
  const showToast = useToast();
  const [organisers, setOrganisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  function load() {
    setLoading(true);
    fetch(`${BASE_URL}/admin/organisers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setOrganisers(d.data || d.organisers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, [token]);

  async function handleAction(organiser, action) {
    let reason;
    if (action === 'reject') {
      reason = prompt('Reason for rejecting this organiser application:');
      if (!reason) return;
    }
    const id = organiser.id || organiser.user_id;
    setActionLoading(id + action);
    try {
      const res = await fetch(`${BASE_URL}/admin/organisers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(action === 'reject' ? { action, reason } : { action }),
      });
      const data = await res.json();
      if (res.ok || data.success) {
        showToast(`Organiser ${action}d`, 'success');
        load();
      } else {
        showToast(data.message || `Failed to ${action}`, 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setActionLoading(null);
    }
  }

  const statusColor = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-black text-xl">ORGANIZERS</h2>
        <button onClick={load} className="ds-btn-secondary text-xs flex items-center gap-1.5">
          <RefreshCw size={14}/>Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">Loading organisers…</div>
      ) : organisers.length === 0 ? (
        <div className="blueprint p-16 text-center text-gray-400">No organiser applications</div>
      ) : (
        <div className="blueprint overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Name','Email','Business','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {organisers.map((o, i) => {
                const id = o.id || o.user_id;
                return (
                  <tr key={id || i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{o.name || o.full_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{o.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{o.business_name || o.organisation || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`tag ${statusColor[o.status] || 'tag-neutral'}`}>
                        {o.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {o.status !== 'approved' && (
                          <button
                            onClick={() => handleAction(o, 'approve')}
                            disabled={actionLoading === id + 'approve'}
                            className="flex items-center gap-1 text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 disabled:opacity-50"
                          >
                            <Check size={13}/>Approve
                          </button>
                        )}
                        {o.status !== 'rejected' && (
                          <button
                            onClick={() => handleAction(o, 'reject')}
                            disabled={actionLoading === id + 'reject'}
                            className="flex items-center gap-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50"
                          >
                            <X size={13}/>Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
