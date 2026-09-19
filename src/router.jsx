import { createBrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ViewEventPage from './pages/ViewEventPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import BecomeOrganiserPage from './pages/BecomeOrganiserPage';
import ScanPage from './pages/ScanPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import SettingsPage from './pages/SettingsPage';
import ConfirmPage from './pages/ConfirmPage';
import CreateEventPage from './pages/CreateEventPage';
import CheckInPage from './pages/CheckInPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 text-center p-6">
      <div className="text-7xl font-heading font-black text-brand">404</div>
      <h1 className="font-heading font-black text-2xl">Page not found</h1>
      <p className="text-gray-500 text-sm max-w-xs">That page doesn't exist. Check the URL or go back home.</p>
      <Link to="/" className="ds-btn-primary mt-2">Go Home</Link>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/discover', element: <HomePage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/event/:id', element: <ViewEventPage /> },
  { path: '/scan/:code', element: <ScanPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/dashboard', element: <PrivateRoute><DashboardPage /></PrivateRoute> },
  { path: '/become-organiser', element: <PrivateRoute><BecomeOrganiserPage /></PrivateRoute> },
  { path: '/tickets', element: <PrivateRoute><TicketsPage /></PrivateRoute> },
  { path: '/settings', element: <PrivateRoute><SettingsPage /></PrivateRoute> },
  { path: '/confirm', element: <PrivateRoute><ConfirmPage /></PrivateRoute> },
  { path: '/create-event', element: <AdminRoute><CreateEventPage /></AdminRoute> },
  { path: '/checkin', element: <AdminRoute><CheckInPage /></AdminRoute> },
  { path: '/admin', element: <AdminRoute><AdminDashboardPage /></AdminRoute> },
  { path: '*', element: <NotFoundPage /> },
]);
