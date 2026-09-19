import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export default function ConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const showToast = useToast();
  const qty = state?.qty || 1;
  const [attendees, setAttendees] = useState(() =>
    Array.from({ length: qty }, (_, i) => i === 0
      ? {
          name: user?.full_name || user?.name || '',
          email: user?.email || '',
          phone: user?.phone_number || user?.phone || '',
        }
      : { name: '', email: '', phone: '' }
    )
  );
  const [processing, setProcessing] = useState(false);

  if (!state?.event) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar/>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 mb-4">No booking details found.</p>
          <Link to="/discover" className="ds-btn-primary">Browse Events</Link>
        </div>
      </div>
    );
  }

  const { event, tier, total } = state;

  function updateAttendee(i, field, value) {
    setAttendees(a => a.map((att, idx) => idx === i ? { ...att, [field]: value } : att));
  }

  async function handleConfirm(e) {
    e.preventDefault();
    setProcessing(true);
    try {
      const primary = attendees[0];
      const res = await fetch(`${BASE_URL}/tickets/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          event_id: event.id_event || event.id,
          tier_id: tier?.id,
          quantity: qty,
          buyer_name: primary.name,
          buyer_email: primary.email,
          buyer_phone: primary.phone,
          attendees,
        }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        showToast('Tickets booked! Check your tickets.', 'success');
        navigate('/tickets');
      } else {
        showToast(data.message || 'Booking failed. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="py-3">
          <Link to={`/event/${event.id_event || event.id}`} className="text-sm text-gray-400 hover:text-brand flex items-center gap-1">
            <ArrowLeft size={14}/>Back to event
          </Link>
        </div>

        <h1 className="font-heading font-black text-2xl mb-6">Confirm Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-3">
            {/* Event summary */}
            <div className="blueprint p-5 mb-5">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">Event Details</h3>
              <div className="font-heading font-black text-lg mb-2">{event.title}</div>
              <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-2"><Calendar size={13}/>{event.date}{event.time ? ` · ${event.time}` : ''}</span>
                <span className="flex items-center gap-2"><MapPin size={13}/>{event.venue}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="tag tag-accent">{tier?.name}</span>
                <span className="tag tag-neutral">x{qty}</span>
              </div>
            </div>

            <form onSubmit={handleConfirm} className="flex flex-col gap-5">
              {attendees.map((att, i) => (
                <div key={i} className="blueprint p-5 flex flex-col gap-4">
                  <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400">
                    {qty === 1 ? 'Your Details' : i === 0 ? 'Ticket 1 · Your Details' : `Ticket ${i + 1} Details`}
                  </h3>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><User size={12}/>Full Name</label>
                    <input value={att.name} onChange={e => updateAttendee(i, 'name', e.target.value)} required className="ds-input" placeholder="As it should appear on ticket"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><Mail size={12}/>Email</label>
                    <input value={att.email} onChange={e => updateAttendee(i, 'email', e.target.value)} required type="email" className="ds-input" placeholder="Ticket sent here"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block flex items-center gap-1"><Phone size={12}/>Phone</label>
                    <input value={att.phone} onChange={e => updateAttendee(i, 'phone', e.target.value)} className="ds-input" placeholder="+234 800 000 0000"/>
                  </div>
                </div>
              ))}

              <div className="blueprint p-5">
                <button type="submit" disabled={processing} className="ds-btn-primary w-full py-3 rounded-md text-sm disabled:opacity-50">
                  {processing ? 'Processing…' : `Confirm & Pay ₦${total.toLocaleString()}`}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">Tickets will be sent to your email and available in My Tickets instantly.</p>
              </div>
            </form>
          </div>

          {/* Right: Price summary */}
          <div className="lg:col-span-2">
            <div className="blueprint p-5 sticky top-20">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Price Summary</h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{tier?.name}</span>
                  <span>₦{Number(tier?.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span>× {qty}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Service fee</span>
                  <span>₦0</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-heading font-black text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
