import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../config';

const BRAND = 'oklch(0.58 0.19 258)';
const TIER_COLORS = [BRAND, '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#4a3aa7'];
const RANGES = [7, 14, 30, 90];

function fmtDate(d) {
  const dt = new Date(d);
  return isNaN(dt) ? String(d ?? '') : dt.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
}

function ChartTooltip({ active, payload, label, formatValue, seriesLabel }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <div className="text-gray-400 font-medium mb-1">{fmtDate(label)}</div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-0.5 rounded-full" style={{ background: BRAND }}/>
        <span className="text-gray-500">{seriesLabel}</span>
        <span className="font-heading font-bold text-gray-900 ml-1">{formatValue(payload[0].value)}</span>
      </div>
    </div>
  );
}

function TierTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.payload.fill }}/>
        <span className="text-gray-500">{p.name}</span>
        <span className="font-heading font-bold text-gray-900 ml-1">{p.value} sold</span>
      </div>
    </div>
  );
}

export default function AnalyticsSection() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setStats(null);
    fetch(`${BASE_URL}/admin/events/${selectedEvent}/stats?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { setStats(d.data || d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedEvent, days, token]);

  const summary = stats?.summary || {};
  // Remaining is bounded by ticket-tier inventory (quantity - sold), not the
  // event's max_capacity field — that field is never enforced at purchase time.
  const hasTiers = stats?.by_tier?.length > 0;

  const tiles = stats ? [
    { label: 'Total Sold', value: summary.tickets_sold ?? '—' },
    { label: 'Revenue', value: summary.revenue != null ? `₦${Number(summary.revenue).toLocaleString()}` : '—' },
    { label: 'Checked In', value: summary.checked_in ?? '—' },
    { label: 'Remaining', value: hasTiers ? summary.tickets_remaining : 'No tiers' },
  ] : [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-heading font-black text-xl">ANALYTICS</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setDays(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${days === r ? 'bg-white shadow text-brand' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {r}d
              </button>
            ))}
          </div>
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
        </div>
      </div>

      {!selectedEvent ? (
        <div className="blueprint p-16 text-center text-gray-400">Select an event to see analytics</div>
      ) : loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">Loading analytics…</div>
      ) : !stats ? (
        <div className="blueprint p-10 text-center text-gray-400">No analytics data available</div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {tiles.map(({ label, value }) => (
              <div key={label} className="blueprint p-5">
                <span className="text-xs uppercase tracking-widest text-brand font-bold">{label}</span>
                <h3 className="font-heading font-black text-2xl mt-1">{value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue trend */}
            <div className="blueprint p-5">
              <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Revenue — last {days} days</h6>
              {stats?.daily?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={stats.daily} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#e1e0d9" strokeOpacity={0.7}/>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#898781' }} tickFormatter={fmtDate} tickLine={false} axisLine={{ stroke: '#e5e7eb' }}/>
                    <YAxis tick={{ fontSize: 10, fill: '#898781' }} tickFormatter={v => `₦${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} tickLine={false} axisLine={false} width={44}/>
                    <Tooltip cursor={{ stroke: '#c3c2b7', strokeWidth: 1 }} content={<ChartTooltip formatValue={v => `₦${Number(v).toLocaleString()}`} seriesLabel="Revenue"/>}/>
                    <Area type="monotone" dataKey="revenue" stroke={BRAND} strokeWidth={2} fill={BRAND} fillOpacity={0.12}
                      dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}/>
                  </AreaChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-10">No daily data</p>}
            </div>

            {/* Ticket sales trend */}
            <div className="blueprint p-5">
              <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Tickets sold — last {days} days</h6>
              {stats?.daily?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.daily} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#e1e0d9" strokeOpacity={0.7}/>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#898781' }} tickFormatter={fmtDate} tickLine={false} axisLine={{ stroke: '#e5e7eb' }}/>
                    <YAxis tick={{ fontSize: 10, fill: '#898781' }} tickLine={false} axisLine={false} width={32} allowDecimals={false}/>
                    <Tooltip cursor={{ fill: 'rgba(11,11,11,0.04)' }} content={<ChartTooltip formatValue={v => `${v} sold`} seriesLabel="Tickets"/>}/>
                    <Bar dataKey="tickets" fill={BRAND} radius={[4,4,0,0]} maxBarSize={24}/>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-sm text-center py-10">No daily data</p>}
            </div>
          </div>

          {/* Tier distribution */}
          <div className="blueprint p-5">
            <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Sales by Tier</h6>
            {stats?.by_tier?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats.by_tier} dataKey="sold" nameKey="tier_name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {stats.by_tier.map((_, i) => <Cell key={i} fill={TIER_COLORS[i % TIER_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip content={<TierTooltip/>}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-sm text-center py-10">No tier data</p>}
          </div>
        </>
      )}
    </div>
  );
}
