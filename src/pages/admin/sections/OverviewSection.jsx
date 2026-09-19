import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../contexts/AuthContext';
import { BASE_URL } from '../../../config';

const BRAND = 'oklch(0.58 0.19 258)';
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

export default function OverviewSection() {
  const { token } = useAuth();
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setRefreshing(true);
    setError(null);
    fetch(`${BASE_URL}/admin/stats?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => {
        const d = await r.json().catch(() => null);
        if (!r.ok || !d?.success) {
          throw new Error(d?.message || `Request failed (${r.status})`);
        }
        return d;
      })
      .then(d => { setStats(d.data); setLoading(false); setRefreshing(false); })
      .catch(err => {
        console.error('[OverviewSection] /admin/stats failed:', err);
        setError(err.message || 'Failed to load stats');
        setLoading(false);
        setRefreshing(false);
      });
  }, [token, days]);

  if (loading) return <div className="text-gray-400 text-sm py-10 text-center">Loading stats…</div>;
  if (error) return <div className="text-red-400 text-sm py-10 text-center">{error}</div>;

  const totalTickets = stats?.daily?.reduce((sum, d) => sum + (Number(d.tickets) || 0), 0) ?? 0;
  const totalRevenue = stats?.daily?.reduce((sum, d) => sum + (Number(d.revenue) || 0), 0) ?? 0;
  const maxSold = Math.max(1, ...(stats?.top_events?.map(e => e.tickets_sold) || [1]));

  const tiles = [
    { label: `Tickets Sold (${days}d)`, value: totalTickets },
    { label: `Gross Revenue (${days}d)`, value: `₦${totalRevenue.toLocaleString()}` },
    { label: 'Top Events Tracked', value: stats?.top_events?.length ?? '—' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-heading font-black text-xl">OVERVIEW</h2>
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
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map(({ label, value }) => (
          <div key={label} className="blueprint p-5">
            <span className="text-xs uppercase tracking-widest text-brand font-bold">{label}</span>
            <h3 className="font-heading font-black text-2xl mt-1">{value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity ${refreshing ? 'opacity-50' : ''}`}>
        <div className="blueprint p-5">
          <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Revenue — last {days} days</h6>
          {stats?.daily?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.daily} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e1e0d9" strokeOpacity={0.7}/>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#898781' }} tickFormatter={fmtDate} tickLine={false} axisLine={{ stroke: '#e5e7eb' }}/>
                <YAxis tick={{ fontSize: 10, fill: '#898781' }} tickFormatter={v => `₦${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} tickLine={false} axisLine={false} width={44}/>
                <Tooltip
                  cursor={{ stroke: '#c3c2b7', strokeWidth: 1 }}
                  content={<ChartTooltip formatValue={v => `₦${Number(v).toLocaleString()}`} seriesLabel="Revenue"/>}
                />
                <Area type="monotone" dataKey="revenue" stroke={BRAND} strokeWidth={2} fill={BRAND} fillOpacity={0.12}
                  dot={false} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-10">No data yet</p>}
        </div>
        <div className="blueprint p-5">
          <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Tickets — last {days} days</h6>
          {stats?.daily?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.daily} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e1e0d9" strokeOpacity={0.7}/>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#898781' }} tickFormatter={fmtDate} tickLine={false} axisLine={{ stroke: '#e5e7eb' }}/>
                <YAxis tick={{ fontSize: 10, fill: '#898781' }} tickLine={false} axisLine={false} width={32} allowDecimals={false}/>
                <Tooltip
                  cursor={{ fill: 'rgba(11,11,11,0.04)' }}
                  content={<ChartTooltip formatValue={v => `${v} sold`} seriesLabel="Tickets"/>}
                />
                <Bar dataKey="tickets" fill={BRAND} radius={[4,4,0,0]} maxBarSize={24}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-10">No data yet</p>}
        </div>
      </div>

      {/* Top events */}
      {stats?.top_events?.length > 0 && (
        <div className="blueprint mt-6">
          <div className="p-4 border-b border-gray-200">
            <h6 className="font-heading font-bold text-xs uppercase tracking-widest text-gray-400">Top Events (all-time)</h6>
          </div>
          {stats.top_events.map((e, i) => (
            <div key={e.id || i} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0 text-sm">
              <span className="text-gray-300 font-mono text-xs w-4 flex-none">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{e.title}</div>
                <div className="h-1 rounded-full bg-gray-100 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(e.tickets_sold / maxSold) * 100}%`, background: BRAND }}/>
                </div>
              </div>
              <span className="tag tag-accent flex-none">{e.tickets_sold} sold</span>
              <span className="font-bold text-sm flex-none w-24 text-right">₦{Number(e.revenue || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
