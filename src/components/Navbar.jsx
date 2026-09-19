import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const displayName = user.full_name || user.email;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-navy flex items-center justify-center text-white font-heading font-black text-xs flex-none">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{displayName}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}/>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
          <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand">
            <User size={15}/>Profile
          </Link>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand">
            <LayoutDashboard size={15}/>Dashboard
          </Link>
          <div className="my-1.5 border-t border-gray-100"/>
          <button onClick={() => { setOpen(false); onLogout(); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
            <LogOut size={15}/>Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-card border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-auto font-heading font-black text-lg">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand to-navy flex items-center justify-center text-white font-black text-sm">k</div>
          <span className="text-gray-900">kulunu</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/discover" className="text-sm text-gray-600 hover:text-brand">Discover</Link>
          <Link to="/search" className="text-sm text-gray-600 hover:text-brand">Search</Link>
          {user && <Link to="/tickets" className="text-sm text-gray-600 hover:text-brand">My Tickets</Link>}
          {user && (user.role === 'admin' || user.role === 'organiser') && (
            <Link to="/admin" className="text-sm text-gray-600 hover:text-brand">Organiser Dashboard</Link>
          )}
          {user && user.role !== 'admin' && user.role !== 'organiser' && (
            <Link to="/become-organiser" className="text-sm text-gray-600 hover:text-brand">Become an Organiser</Link>
          )}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center">
          {user ? (
            <UserMenu user={user} onLogout={handleLogout}/>
          ) : (
            <Link to="/login" className="ds-btn-primary text-sm px-4 py-2 rounded-md font-bold text-white bg-brand hover:bg-brand-dark">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-t border-gray-200 px-4 py-3 flex flex-col gap-3">
          <Link to="/discover" className="text-sm" onClick={() => setOpen(false)}>Discover</Link>
          <Link to="/search" className="text-sm" onClick={() => setOpen(false)}>Search</Link>
          {user && <Link to="/tickets" className="text-sm" onClick={() => setOpen(false)}>My Tickets</Link>}
          {user && <Link to="/dashboard" className="text-sm" onClick={() => setOpen(false)}>Dashboard</Link>}
          {user && <Link to="/settings" className="text-sm" onClick={() => setOpen(false)}>Profile</Link>}
          {user && (user.role === 'admin' || user.role === 'organiser') && (
            <Link to="/admin" className="text-sm" onClick={() => setOpen(false)}>Organiser Dashboard</Link>
          )}
          {user && user.role !== 'admin' && user.role !== 'organiser' && (
            <Link to="/become-organiser" className="text-sm" onClick={() => setOpen(false)}>Become an Organiser</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="text-sm text-left text-red-500">Logout</button>
          ) : (
            <Link to="/login" className="text-sm text-brand font-bold" onClick={() => setOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
}
