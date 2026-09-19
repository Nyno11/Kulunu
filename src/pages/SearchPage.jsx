import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { BASE_URL } from '../config';

export default function SearchPage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([{ name: 'All', count: 0 }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch(`${BASE_URL}/events?limit=100`)
      .then(r => r.json())
      .then(d => {
        setEvents(d.data?.events || []);
        setCategories(d.data?.categories?.length ? d.data.categories : [{ name: 'All', count: 0 }]);
        setLoading(false);
      })
      .catch(() => { setError('Could not load events'); setLoading(false); });
  }, []);

  const filtered = events.filter(e => {
    const matchCat = category === 'All' ||
      (category === 'Free' ? e.price === 0 : e.category === category);
    const matchSearch = !search ||
      (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.venue || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-heading font-black text-2xl mb-6">Search Events</h1>

        {/* Search bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events, venues, artists…"
              className="ds-input pl-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14}/>
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(c => (
            <button
              key={c.name}
              onClick={() => setCategory(c.name)}
              className={`tag cursor-pointer ${category === c.name ? 'bg-brand text-white' : 'tag-neutral hover:bg-gray-200'}`}
            >
              {c.name}<span className="opacity-60 ml-1.5">{c.count}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
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
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">{error}</p>
            <button className="ds-btn-primary" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
              {search ? ` for "${search}"` : ''}
              {category !== 'All' ? ` in ${category}` : ''}
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-2">No events found</p>
                <p className="text-gray-400 text-sm">Try different keywords or a different category</p>
                <button onClick={() => { setSearch(''); setCategory('All'); }} className="ds-btn-secondary mt-4">Clear filters</button>
              </div>
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
