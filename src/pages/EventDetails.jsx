import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { Calendar, Clock, MapPin, MessageSquare, ArrowLeft, CheckCircle2, UserCheck, ShieldAlert, Award } from 'lucide-react';

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60';
  const whatsappChannelUrl = 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y';

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        if (!data) {
          setError('Event not found.');
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 px-4 text-center space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <p className="text-rose-400 font-semibold">{error || 'Event unavailable'}</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event List
        </Link>

        {/* Poster & Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6">
          <div className="relative h-64 sm:h-80 w-full bg-slate-800">
            <img
              src={event.posterUrl || defaultImage}
              alt={event.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                Event Overview
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {event.name}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Date</div>
                  <div className="font-semibold text-slate-200">{event.date}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Time</div>
                  <div className="font-semibold text-slate-200">{event.startTime} - {event.endTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Venue</div>
                  <div className="font-semibold text-slate-200 truncate">{event.venue}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-100">About the Event</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Eligibility & Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {event.eligibility && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Award className="w-4 h-4" /> Eligibility Criteria
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{event.eligibility}</p>
                </div>
              )}

              {event.rules && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldAlert className="w-4 h-4" /> Rules & Guidelines
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{event.rules}</p>
                </div>
              )}
            </div>

            {/* Event Roles Section */}
            {event.roles && event.roles.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" /> Event Team & Committee
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {event.roles.map((r, idx) => (
                    <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                        {r.roleName}
                      </div>
                      <div className="text-sm font-bold text-slate-100">{r.assignedPerson}</div>
                      {r.contact && <div className="text-xs text-slate-500">{r.contact}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons Section */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
              
              {/* Mandatory WhatsApp Channel Button */}
              <a
                href={whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 text-center"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>Stay connected for event updates</span>
              </a>

              {/* Register Now Button */}
              <button
                onClick={() => navigate(`/events/${eventId}/register`)}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-center"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Register Now</span>
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
