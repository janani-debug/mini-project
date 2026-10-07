import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function EventCard({ event }) {
  const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col group">
      
      {/* Event Poster Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={event.posterUrl || defaultImage}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
            Published
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
            {event.name}
          </h3>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{event.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          </div>

          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed pt-1">
            {event.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to={`/events/${event.id}`}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group/btn border border-slate-700 hover:border-blue-500"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
