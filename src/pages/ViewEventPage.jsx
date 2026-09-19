import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function ViewEventPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/events/${id}`).then(r => r.json()),
      fetch(`${BASE_URL}/events/${id}/tickets`).then(r => r.json()).catch(() => ({ data: [] }))
    ]).then(([evData, tierData]) => {
      const ev = evData.data || evData.event || evData;
      setEvent(ev);
      const ts = tierData.data || tierData.tiers || [];
      setTiers(ts);
      if (ts.length > 0) setSelectedTier(ts[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const total = selectedTier ? selectedTier.price * qty : 0;

  function handleBuy() {
    if (!token) { navigate('/login'); return; }
    navigate('/confirm', { state: { event, tier: selectedTier, qty, total } });
  }

  if (loading) return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Loading event…</div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Event not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="py-3">
          <Link to="/discover" className="text-sm text-gray-400 hover:text-brand flex items-center gap-1">
            <ArrowLeft size={14}/>Back to discover
          </Link>
        </div>

        {/* Banner */}
        {event.banner_url ? (
          <img src={event.banner_url} alt={event.title} className="w-full h-52 md:h-72 object-cover rounded-xl mb-6"/>
        ) : (
          <div className="w-full h-52 md:h-72 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <span className="text-blue-300 font-mono text-sm">event banner</span>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {event.type && <span className="tag tag-accent">{event.type.toUpperCase()}</span>}
              {event.status && <span className="tag tag-neutral">{event.status.toUpperCase()}</span>}
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-black mb-2">{event.title}</h1>
            <p className="text-gray-400 text-sm mb-5 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><Calendar size={13}/>{event.date}{event.time ? ` · ${event.time}` : ''}</span>
              <span className="flex items-center gap-1"><MapPin size={13}/>{event.venue}</span>
            </p>
            {event.description && (
              <p className="text-sm leading-relaxed text-gray-600 mb-6">{event.description}</p>
            )}
          </div>

          {/* Ticket card */}
          <div className="blueprint p-5 self-start sticky top-20">
            <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Tickets</h6>
            {tiers.length === 0 ? (
              <p className="text-sm text-gray-400">No ticket tiers available.</p>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {tiers.map(tier => (
                  <label key={tier.id} className={`flex justify-between items-center p-3 rounded-md border cursor-pointer transition-colors
                    ${selectedTier?.id === tier.id ? 'border-brand bg-blue-50' : 'border-gray-200 hover:border-brand'}`}>
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="tier"
                        className="accent-brand"
                        checked={selectedTier?.id === tier.id}
                        onChange={() => setSelectedTier(tier)}
                      />
                      <span className="text-sm font-medium">{tier.name}</span>
                    </span>
                    <strong className="text-sm">₦{Number(tier.price).toLocaleString()}</strong>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Quantity</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-100">−</button>
                <span className="text-sm font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q+1)} className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-100">+</button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{qty} × {selectedTier?.name}</span>
                <span>₦{(selectedTier ? selectedTier.price * qty : 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-heading font-black text-lg">
                <span>TOTAL</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleBuy}
              disabled={!selectedTier || paying}
              className="ds-btn-primary w-full py-3 rounded-md text-sm disabled:opacity-50"
            >
              {paying ? 'Processing…' : `Pay ₦${total.toLocaleString()}`}
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">Ticket lands in your account instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
