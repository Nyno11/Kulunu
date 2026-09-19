import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function ScanPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { token, initialized } = useAuth();
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    if (!initialized) return;

    if (!token) {
      // Not logged in — we can't check ownership, so just route to the event page.
      fetch(`${BASE_URL}/tickets/resolve/${code}`)
        .then(r => r.json())
        .then(d => {
          if (d.success && d.data?.event_id) {
            navigate(`/event/${d.data.event_id}`, { replace: true });
          } else {
            setState({ status: 'error', message: d.message || 'Ticket not found' });
          }
        })
        .catch(() => setState({ status: 'error', message: 'Network error. Please try again.' }));
      return;
    }

    fetch(`${BASE_URL}/tickets/checkin-by-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ticket_code: code }),
    })
      .then(async r => {
        const d = await r.json().catch(() => null);
        if (r.status === 403) {
          if (d?.event_id) {
            navigate(`/event/${d.event_id}`, { replace: true });
          } else {
            setState({ status: 'forbidden', message: d?.message || 'Not authorised for this event' });
          }
          return;
        }
        if (!d?.success) {
          setState({ status: 'error', message: d?.message || 'Ticket not found' });
          return;
        }
        setState({ status: d.already_checked_in ? 'already' : 'checked_in', data: d.data });
      })
      .catch(() => setState({ status: 'error', message: 'Network error. Please try again.' }));
  }, [token, initialized, code]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        {state.status === 'loading' && (
          <p className="text-gray-400 text-sm">Checking ticket…</p>
        )}

        {(state.status === 'checked_in' || state.status === 'already') && (
          <div className="blueprint p-8">
            {state.status === 'checked_in' ? (
              <CheckCircle2 size={44} className="text-green-500 mx-auto mb-3"/>
            ) : (
              <AlertTriangle size={44} className="text-yellow-500 mx-auto mb-3"/>
            )}
            <h1 className="font-heading font-black text-xl mb-1">
              {state.status === 'checked_in' ? 'Checked in!' : 'Already checked in'}
            </h1>
            <div className="text-sm text-gray-500 mt-3 space-y-1">
              <div className="font-bold text-gray-900">{state.data?.buyer_name} · {state.data?.tier_name}</div>
              <div>{state.data?.event_title}</div>
              <div>{state.data?.event_date} · {state.data?.event_venue}</div>
              <div className="font-mono text-xs text-gray-400 mt-2">{state.data?.ticket_code}</div>
            </div>
          </div>
        )}

        {state.status === 'forbidden' && (
          <div className="blueprint p-8">
            <XCircle size={44} className="text-red-500 mx-auto mb-3"/>
            <h1 className="font-heading font-black text-xl mb-1">Not authorised</h1>
            <p className="text-sm text-gray-500">{state.message}</p>
            <Link to="/discover" className="ds-btn-primary mt-5 inline-block">Browse events</Link>
          </div>
        )}

        {state.status === 'error' && (
          <div className="blueprint p-8">
            <XCircle size={44} className="text-red-500 mx-auto mb-3"/>
            <h1 className="font-heading font-black text-xl mb-1">Invalid ticket</h1>
            <p className="text-sm text-gray-500">{state.message}</p>
            <Link to="/discover" className="ds-btn-primary mt-5 inline-block">Browse events</Link>
          </div>
        )}
      </div>
    </div>
  );
}
