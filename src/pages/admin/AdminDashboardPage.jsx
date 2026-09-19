import { useState } from 'react';
import { LayoutDashboard, CalendarDays, Ticket, Users, BarChart2, ShieldCheck, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import OverviewSection from './sections/OverviewSection';
import EventsSection from './sections/EventsSection';
import TicketsSection from './sections/TicketsSection';
import AttendeesSection from './sections/AttendeesSection';
import AnalyticsSection from './sections/AnalyticsSection';
import OrganizersSection from './sections/OrganizersSection';

const NAV = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'events',      label: 'Events',      icon: CalendarDays },
  { id: 'tickets',     label: 'Tickets',     icon: Ticket },
  { id: 'attendees',   label: 'Attendees',   icon: Users },
  { id: 'analytics',  label: 'Analytics',   icon: BarChart2 },
  { id: 'organizers',  label: 'Organizers',  icon: ShieldCheck },
];

const SECTIONS = {
  overview:   OverviewSection,
  events:     EventsSection,
  tickets:    TicketsSection,
  attendees:  AttendeesSection,
  analytics:  AnalyticsSection,
  organizers: OrganizersSection,
};

function Sidebar({ section, setSection, setSidebarOpen, user, onLogout }) {
  return (
    <aside className="w-52 flex-none flex flex-col min-h-full border-r border-gray-200 bg-card">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-brand to-navy flex items-center justify-center text-white font-black text-sm">k</div>
          <span className="font-heading font-black text-sm">kulunu<span className="block text-xs text-brand font-bold tracking-widest leading-none">ORGANIZER</span></span>
        </div>
      </div>
      <div className="p-3 border-b border-gray-200">
        <div className="text-xs font-bold text-gray-700 truncate">{user?.name || user?.email}</div>
        <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
      </div>
      <nav className="flex-1 py-2">
        {NAV.filter(n => n.id !== 'organizers' || user?.role === 'admin').map(({ id, label, icon: Icon }) => (
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

export default function AdminDashboardPage() {
  const [section, setSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() { logout(); navigate('/'); }

  const Section = SECTIONS[section];

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar section={section} setSection={setSection} user={user} onLogout={handleLogout}/>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <Sidebar section={section} setSection={setSection} setSidebarOpen={setSidebarOpen} user={user} onLogout={handleLogout}/>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)}/>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)}><Menu size={20}/></button>
          <span className="font-heading font-black text-sm">KULUNU ORGANIZER</span>
        </div>
        <main className="flex-1 p-4 md:p-7 overflow-auto">
          {Section ? <Section/> : null}
        </main>
      </div>
    </div>
  );
}
