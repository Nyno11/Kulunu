import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { BASE_URL } from '../config';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([{ name: 'All', count: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  function loadEvents() {
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/events?limit=100`)
      .then(r => r.json())
      .then(d => {
        setEvents(d.data?.events || []);
        setCategories(d.data?.categories?.length ? d.data.categories : [{ name: 'All', count: 0 }]);
        setLoading(false);
      })
      .catch(() => { setError('Could not load events'); setLoading(false); });
  }

  useEffect(() => { loadEvents(); }, []);

  const filtered = events.filter(e => {
    const matchCat = category === 'All' ||
      (category === 'Free' ? e.price === 0 : e.category === category);
    const matchSearch = !query ||
      (e.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (e.venue || '').toLowerCase().includes(query.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleSearch(e) {
    e.preventDefault();
    setQuery(search);
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <div style={{background:'linear-gradient(90deg,rgba(12,166,239,.95),rgba(48,43,99,.94))'}}>
        <div className="max-w-6xl mx-auto px-4 py-14 text-center text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-yellow-300">Events · Tickets · Check-in</span>
          <h1 className="font-heading text-3xl md:text-5xl font-black text-white mt-2 mb-3 leading-tight">
            EVERY EVENT IN NIGERIA.<br/>ONE TICKET <span className="text-yellow-300">WALLET.</span>
          </h1>
          <p className="max-w-lg mx-auto text-sm opacity-90 mb-8">
            Concerts, conferences, weddings, match days — find them, book in Naira, and scan in with a QR that never gets lost.
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl p-5 max-w-2xl mx-auto shadow-lg text-left">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Event or venue…"
                className="ds-input flex-1"
              />
              <button type="submit" className="ds-btn-primary rounded-md whitespace-nowrap">
                <Search size={15}/>Find events
              </button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-4 pb-0">
          <div className="bg-white grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 rounded-t-xl overflow-hidden">
            {[
              ['4,200+','events listed'],
              ['₦380M','paid out to organizers'],
              ['180K','tickets scanned'],
              ['3.2s','average gate scan']
            ].map(([n,l]) => (
              <div key={l} className="p-5">
                <h3 className="font-heading text-xl font-black mb-0.5">{n}</h3>
                <span className="text-xs text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-2 flex-wrap">
        {categories.map(c => (
          <button
            key={c.name}
            onClick={() => setCategory(c.name)}
            className={`tag cursor-pointer ${category === c.name ? 'bg-brand text-white' : 'tag-neutral'}`}
          >
            {c.name}<span className="opacity-60 ml-1.5">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="blueprint animate-pulse">
                <div className="h-36 bg-gray-200 rounded-t-md"/>
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"/>
                  <div className="h-4 bg-gray-200 rounded w-3/4"/>
                  <div className="h-3 bg-gray-200 rounded w-1/2"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">{error}</p>
            <button className="ds-btn-primary" onClick={loadEvents}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-between items-baseline mb-4">
              <h4 className="font-heading font-bold text-base uppercase tracking-wide">
                {category === 'All' ? 'All Events' : category}
                <span className="ml-2 tag tag-accent">{filtered.length} EVENTS</span>
              </h4>
            </div>
            {filtered.length === 0 ? (
              <p className="text-gray-400 text-center py-16">No events found. Try a different search or category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(e => <EventCard key={e.id_event || e.id} event={e}/>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
