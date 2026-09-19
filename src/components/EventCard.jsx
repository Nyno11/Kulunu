import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

export default function EventCard({ event }) {
  return (
    <Link to={`/event/${event.id_event || event.id}`} className="blueprint hover:shadow-md transition-shadow block">
      {event.banner_url ? (
        <img src={event.banner_url} alt={event.title} className="w-full h-36 object-cover rounded-t-md"/>
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-md flex items-center justify-center">
          <span className="text-xs text-blue-400 font-mono">event photo</span>
        </div>
      )}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex justify-between items-start gap-2">
          <span className="tag tag-neutral">{event.type || event.category || 'Event'}</span>
          <span className="text-xs text-gray-400">{event.date}</span>
        </div>
        <div className="font-heading font-bold text-sm leading-snug">{event.title}</div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11}/>{event.venue}
          </span>
          <strong className="text-sm text-navy font-heading">
            {event.price ? `₦${Number(event.price).toLocaleString()}` : 'Free'}
          </strong>
        </div>
      </div>
    </Link>
  );
}
