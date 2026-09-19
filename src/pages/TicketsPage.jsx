import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { QrCode, Calendar, MapPin, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

function QRModal({ ticket, onClose }) {
  // Encode a real link so scanning with any camera (not just the in-app scanner)
  // opens the scan-resolution page, which routes to check-in or the event page.
  const qrContent = ticket.ticket_code ? `${window.location.origin}/scan/${ticket.ticket_code}` : '';
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    if (!qrContent) return;
    QRCode.toDataURL(qrContent, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrImage).catch(() => setQrImage(null));
  }, [qrContent]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-heading font-black text-lg">{ticket.event_title}</h3>
            <p className="text-sm text-gray-400">{ticket.tier_name} · x{ticket.quantity || 1}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
        </div>
        {qrImage ? (
          <img src={qrImage} alt="Ticket QR code" className="w-full aspect-square rounded-xl border border-gray-100"/>
        ) : (
          <div className="w-full aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-3">
            <QrCode size={64} className="text-gray-300"/>
            <p className="text-xs font-mono text-gray-400 text-center break-all px-4">{qrContent}</p>
          </div>
        )}
        <div className="mt-4 text-center">
          <span className="font-mono text-xs text-gray-400">{ticket.ticket_code}</span>
        </div>
        <div className={`mt-3 text-center text-xs font-bold px-3 py-1.5 rounded-full inline-block ${
          ticket.check_in_status ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-brand'
        }`}>
          {ticket.check_in_status ? 'CHECKED IN' : 'VALID'}
        </div>
      </div>
    </div>
  );
}

function TicketRow({ ticket, onViewQR }) {
  return (
    <div className="blueprint p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl flex-none flex items-center justify-center bg-gradient-to-br from-brand/20 to-navy/20">
        <QrCode size={24} className="text-brand"/>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-heading font-bold text-sm truncate">{ticket.event_title}</div>
        <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1"><Calendar size={11}/>{ticket.event_date}</span>
          {ticket.venue && <span className="flex items-center gap-1"><MapPin size={11}/>{ticket.venue}</span>}
        </div>
        <div className="flex gap-2 mt-1.5">
          <span className="tag tag-neutral">{ticket.tier_name}</span>
          {ticket.quantity > 1 && <span className="tag tag-accent">x{ticket.quantity}</span>}
          <span className={`tag ${ticket.check_in_status ? 'bg-green-100 text-green-700' : 'tag-outline'}`}>
            {ticket.check_in_status ? 'Used' : 'Valid'}
          </span>
        </div>
      </div>
      <button onClick={() => onViewQR(ticket)} className="ds-btn-ghost text-xs flex-none">
        <QrCode size={14}/>View QR
      </button>
    </div>
  );
}

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/my-tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setTickets(d.data || d.tickets || []); setLoading(false); })
      .catch(() => { setError('Could not load tickets'); setLoading(false); });
  }, [token]);

  const now = new Date();
  const upcoming = tickets.filter(t => {
    if (!t.event_date) return true;
    return new Date(t.event_date) >= now;
  });
  const past = tickets.filter(t => {
    if (!t.event_date) return false;
    return new Date(t.event_date) < now;
  });

  const displayed = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      {selectedTicket && <QRModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)}/>}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-heading font-black text-2xl mb-6">My Tickets</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <button onClick={() => setTab('upcoming')} className={`px-5 py-2 text-sm font-bold rounded-md transition-colors ${tab === 'upcoming' ? 'bg-white shadow text-brand' : 'text-gray-400'}`}>
            Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
          </button>
          <button onClick={() => setTab('past')} className={`px-5 py-2 text-sm font-bold rounded-md transition-colors ${tab === 'past' ? 'bg-white shadow text-brand' : 'text-gray-400'}`}>
            Past {past.length > 0 && `(${past.length})`}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="blueprint animate-pulse p-4 flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl"/>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"/>
                  <div className="h-3 bg-gray-200 rounded w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">{error}</p>
            <button className="ds-btn-primary" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20">
            <QrCode size={48} className="text-gray-200 mx-auto mb-4"/>
            <p className="text-gray-500 mb-2">No {tab} tickets</p>
            <p className="text-gray-400 text-sm mb-4">
              {tab === 'upcoming' ? 'Browse events and book your first ticket!' : 'Your past events will appear here.'}
            </p>
            {tab === 'upcoming' && (
              <Link to="/discover" className="ds-btn-primary">Browse events</Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayed.map(t => (
              <TicketRow key={t.id || t.ticket_code} ticket={t} onViewQR={setSelectedTicket}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
