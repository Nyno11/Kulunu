import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { uploadImage } from '../utils/uploadImage';

const STEPS = ['Details', 'Tickets', 'Publish'];

const EMPTY_TIER = { name: '', price: '', available: '' };

const EVENT_TYPES = ['Concert','Conference','Community','Sports','Nightlife','Religious','Workshop','Festival','Other'];

export default function CreateEventPage() {
  const { token } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [details, setDetails] = useState({
    title: '', category: 'Conference', date: '', time: '',
    venue: '', description: '', banner_url: '', capacity: '',
  });

  const [tiers, setTiers] = useState([{ ...EMPTY_TIER }]);
  const [bannerFile, setBannerFile] = useState(null);

  function updateDetails(k, v) { setDetails(d => ({ ...d, [k]: v })); }

  function addTier() { setTiers(t => [...t, { ...EMPTY_TIER }]); }
  function removeTier(i) { setTiers(t => t.filter((_, idx) => idx !== i)); }
  function updateTier(i, k, v) { setTiers(t => t.map((tier, idx) => idx === i ? { ...tier, [k]: v } : tier)); }

  async function handlePublish() {
    setSubmitting(true);
    try {
      let bannerUrl = details.banner_url;
      if (bannerFile) {
        try {
          bannerUrl = await uploadImage(bannerFile, token);
        } catch (err) {
          showToast(err.message || 'Banner upload failed', 'error');
          return;
        }
      }

      const payload = {
        ...details,
        banner_url: bannerUrl,
        max_capacity: details.capacity ? Number(details.capacity) : undefined,
      };
      const res = await fetch(`${BASE_URL}/create-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!(res.ok && data.success)) {
        showToast(data.message || 'Failed to create event', 'error');
        return;
      }

      const eventId = data.data?.id;
      const validTiers = tiers.filter(t => t.name && t.available);
      const tierResults = await Promise.all(validTiers.map(t =>
        fetch(`${BASE_URL}/admin/events/${eventId}/tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: t.name, price: Number(t.price) || 0, quantity: Number(t.available) }),
        }).then(r => r.json()).catch(() => ({ success: false }))
      ));

      const failedTiers = tierResults.filter(r => !r.success).length;
      if (failedTiers > 0) {
        showToast(`Event created, but ${failedTiers} ticket tier(s) failed to save`, 'error');
      } else {
        showToast('Event created!', 'success');
      }
      navigate('/admin');
    } catch {
      showToast('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-8">
        <h1 className="font-heading font-black text-2xl mb-6">Create Event</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-colors
                ${i < step ? 'bg-brand border-brand text-white' : i === step ? 'border-brand text-brand' : 'border-gray-200 text-gray-300'}`}>
                {i < step ? <Check size={14}/> : i + 1}
              </div>
              <span className={`mx-2 text-sm font-bold ${i === step ? 'text-brand' : 'text-gray-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mr-2 ${i < step ? 'bg-brand' : 'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 0 && (
          <div className="blueprint p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400">Event Details</h2>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Event Name *</label>
              <input value={details.title} onChange={e => updateDetails('title', e.target.value)} className="ds-input" placeholder="e.g. Lagos Sound Sessions 2026" required/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Category</label>
                <select value={details.category} onChange={e => updateDetails('category', e.target.value)} className="ds-input">
                  {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Capacity</label>
                <input type="number" value={details.capacity} onChange={e => updateDetails('capacity', e.target.value)} className="ds-input" placeholder="e.g. 500"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Date *</label>
                <input type="date" value={details.date} onChange={e => updateDetails('date', e.target.value)} className="ds-input" required/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Time</label>
                <input type="time" value={details.time} onChange={e => updateDetails('time', e.target.value)} className="ds-input"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Venue *</label>
              <input value={details.venue} onChange={e => updateDetails('venue', e.target.value)} className="ds-input" placeholder="e.g. Eko Hotel, Lagos Island" required/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
              <textarea value={details.description} onChange={e => updateDetails('description', e.target.value)} rows={4} className="ds-input resize-none" placeholder="Tell attendees what this event is about…"/>
            </div>
            <ImageUpload initialUrl={details.banner_url} onFileSelect={file => { setBannerFile(file); if (!file) updateDetails('banner_url', ''); }}/>
            <div className="flex justify-end">
              <button onClick={() => { if (!details.title || !details.date || !details.venue) { showToast('Please fill required fields', 'error'); return; } setStep(1); }} className="ds-btn-primary">
                Next: Tickets <ArrowRight size={15}/>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Tiers */}
        {step === 1 && (
          <div className="blueprint p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400">Ticket Tiers</h2>
            {tiers.map((tier, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 relative">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">Tier {i + 1}</span>
                  {tiers.length > 1 && (
                    <button onClick={() => removeTier(i)} className="text-red-400 hover:text-red-600"><Trash2 size={15}/></button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Name *</label>
                    <input value={tier.name} onChange={e => updateTier(i, 'name', e.target.value)} className="ds-input" placeholder="e.g. Regular"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Price (₦)</label>
                    <input type="number" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} className="ds-input" placeholder="0 for free"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Available Qty</label>
                    <input type="number" value={tier.available} onChange={e => updateTier(i, 'available', e.target.value)} className="ds-input" placeholder="Unlimited"/>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addTier} className="ds-btn-secondary w-fit"><Plus size={14}/>Add tier</button>
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="ds-btn-secondary"><ArrowLeft size={15}/>Back</button>
              <button onClick={() => setStep(2)} className="ds-btn-primary">Review <ArrowRight size={15}/></button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="blueprint p-6 flex flex-col gap-5">
            <h2 className="font-heading font-bold text-sm uppercase tracking-widest text-gray-400">Review & Publish</h2>
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 text-sm">
              <div className="font-heading font-black text-lg">{details.title}</div>
              <div className="text-gray-500">{details.date}{details.time ? ` · ${details.time}` : ''} · {details.venue}</div>
              <div className="text-gray-500">{details.category}{details.capacity ? ` · ${details.capacity} capacity` : ''}</div>
              {details.description && <p className="text-gray-600 text-xs mt-1">{details.description}</p>}
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-2">Ticket Tiers</div>
              {tiers.filter(t => t.name).map((t, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                  <span>{t.name}</span>
                  <span className="font-bold">{Number(t.price) === 0 ? 'Free' : `₦${Number(t.price).toLocaleString()}`}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="ds-btn-secondary"><ArrowLeft size={15}/>Back</button>
              <button onClick={handlePublish} disabled={submitting} className="ds-btn-primary disabled:opacity-50">
                {submitting ? 'Publishing…' : 'Publish Event'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
