import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Search, Settings, Calendar, TrendingUp, User, Receipt, LogOut, Menu } from 'lucide-react';
import Navbar from '../components/Navbar';
import { BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="blueprint p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} className="text-white"/>
      </div>
      <div className="font-heading font-black text-2xl">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function ProfileSection({ user, tickets, loading }) {
  const now = new Date();
  const upcoming = tickets.filter(t => t.event_date && new Date(t.event_date) >= now);
  const attended = tickets.filter(t => t.check_in_status).length;
  const recentTickets = tickets.slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-black text-2xl">
          Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your event activity at a glance.</p>
      </div>

      {/* Profile summary */}
      <div className="blueprint p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-navy flex items-center justify-center text-white font-heading font-black flex-none">
            {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-heading font-bold text-sm">{user?.full_name || 'Kulunu user'}</div>
            <div className="text-xs text-gray-400 mt-0.5">{user?.email}{user?.phone_number ? ` · ${user.phone_number}` : ''}</div>
          </div>
        </div>
        <Link to="/settings" className="ds-btn-secondary text-xs">Edit Profile</Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { to: '/discover', label: 'Browse Events', icon: Search, bg: 'bg-brand' },
          { to: '/tickets', label: 'My Tickets', icon: QrCode, bg: 'bg-navy' },
          { to: '/settings', label: 'Settings', icon: Settings, bg: 'bg-gray-600' },
        ].map(a => (
          <Link key={a.label} to={a.to} className="blueprint p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow text-center">
            <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
              <a.icon size={18} className="text-white"/>
            </div>
            <span className="text-xs font-bold text-gray-600">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={QrCode} label="Total Tickets" value={loading ? '—' : tickets.length} color="bg-brand"/>
        <StatCard icon={Calendar} label="Upcoming Events" value={loading ? '—' : upcoming.length} color="bg-navy"/>
        <StatCard icon={TrendingUp} label="Events Attended" value={loading ? '—' : attended} color="bg-green-600"/>
      </div>

      {/* Recent tickets */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading font-bold text-base uppercase tracking-wide">Recent Tickets</h2>
          <Link to="/tickets" className="text-xs text-brand hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="blueprint animate-pulse p-4 h-16"/>
            ))}
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="blueprint p-8 text-center">
            <QrCode size={36} className="text-gray-200 mx-auto mb-3"/>
            <p className="text-gray-400 text-sm">No tickets yet</p>
            <Link to="/discover" className="ds-btn-primary mt-3 text-xs">Browse events</Link>
          </div>
        ) : (
          <div className="blueprint divide-y divide-gray-100">
            {recentTickets.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-none">
                  <QrCode size={18} className="text-brand"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.event_title}</div>
                  <div className="text-xs text-gray-400">{t.event_date} · {t.tier_name}</div>
                </div>
                <span className={`tag text-xs ${t.check_in_status ? 'bg-green-100 text-green-700' : 'tag-outline'}`}>
                  {t.check_in_status ? 'Used' : 'Valid'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TicketsSection({ tickets, loading }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-black text-xl">My Tickets</h2>
        <Link to="/tickets" className="text-xs text-brand hover:underline">Open full ticket view →</Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_,i) => <div key={i} className="blueprint animate-pulse p-4 h-20"/>)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="blueprint p-16 text-center text-gray-400">
          <QrCode size={36} className="text-gray-200 mx-auto mb-3"/>
          <p className="mb-4">No tickets yet.</p>
          <Link to="/discover" className="ds-btn-primary">Browse events</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tickets.map(t => (
            <div key={t.id} className="blueprint p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex-none flex items-center justify-center bg-gradient-to-br from-brand/20 to-navy/20">
                <QrCode size={20} className="text-brand"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-sm truncate">{t.event_title}</div>
                <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar size={11}/>{t.event_date}</span>
                  {t.event_venue && <span>{t.event_venue}</span>}
                </div>
                <div className="flex gap-2 mt-1.5">
                  <span className="tag tag-neutral">{t.tier_name}</span>
                  <span className={`tag ${t.check_in_status ? 'bg-green-100 text-green-700' : 'tag-outline'}`}>
                    {t.check_in_status ? 'Used' : 'Valid'}
                  </span>
                </div>
              </div>
              <div className="text-sm font-bold flex-none">
                {Number(t.total_price) === 0 ? 'Free' : `₦${Number(t.total_price).toLocaleString()}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentHistorySection({ tickets, loading }) {
  return (
    <div>
      <h2 className="font-heading font-black text-xl mb-6">Payment History</h2>

      {loading ? (
        <div className="text-gray-400 text-sm py-10 text-center">Loading…</div>
      ) : tickets.length === 0 ? (
        <div className="blueprint p-16 text-center text-gray-400">
          <Receipt size={36} className="text-gray-200 mx-auto mb-3"/>
          <p>No payments yet.</p>
        </div>
      ) : (
        <div className="blueprint overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Event','Tier','Date','Amount','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{t.event_title}</td>
                  <td className="px-4 py-3 text-gray-500">{t.tier_name}</td>
                  <td className="px-4 py-3 text-gray-500">{t.purchased_at ? new Date(t.purchased_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 font-bold">
                    {Number(t.total_price) === 0 ? 'Free' : `₦${Number(t.total_price).toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`tag ${t.payment_status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.payment_status ? 'Paid' : 'Pending'}
                    </span>
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

const NAV = [
  { id: 'profile',  label: 'Profile',         icon: User },
  { id: 'tickets',  label: 'My Tickets',      icon: QrCode },
  { id: 'payments', label: 'Payment History', icon: Receipt },
];

function Sidebar({ section, setSection, setSidebarOpen, onLogout }) {
  return (
    <aside className="w-52 flex-none flex flex-col min-h-full border-r border-gray-200 bg-card">
      <div className="p-5 border-b border-gray-200 font-heading font-black text-sm">My Dashboard</div>
      <nav className="flex-1 py-2">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setSection(id); if (setSidebarOpen) setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors
              ${section === id ? 'bg-blue-50 text-brand font-bold border-r-2 border-brand' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Icon size={16}/>{label}
          </button>
        ))}
      </nav>
      <button onClick={onLogout} className="flex items-center gap-2 p-5 text-sm text-gray-400 hover:text-red-500 border-t border-gray-200">
        <LogOut size={15}/>Logout
      </button>
    </aside>
  );
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/my-tickets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setTickets(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const SECTIONS = {
    profile:  <ProfileSection user={user} tickets={tickets} loading={loading}/>,
    tickets:  <TicketsSection tickets={tickets} loading={loading}/>,
    payments: <PaymentHistorySection tickets={tickets} loading={loading}/>,
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar/>
      <div className="flex-1 flex max-w-6xl w-full mx-auto">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <Sidebar section={section} setSection={setSection} onLogout={handleLogout}/>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <Sidebar section={section} setSection={setSection} setSidebarOpen={setSidebarOpen} onLogout={handleLogout}/>
            <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}/>
          </div>
        )}

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-gray-200">
            <button onClick={() => setSidebarOpen(true)}><Menu size={20}/></button>
            <span className="font-heading font-black text-sm">My Dashboard</span>
          </div>
          <div className="p-4 md:p-8">
            {SECTIONS[section]}
          </div>
        </div>
      </div>
    </div>
  );
}
