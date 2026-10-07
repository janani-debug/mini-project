import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { getRegistrationsByEvent } from '../services/registrationService';
import { Calendar, Clock, MapPin, Edit, ArrowLeft, UserCheck, Ticket, CheckSquare } from 'lucide-react';

export default function EventManagement() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [evData, regData] = await Promise.all([
          getEventById(eventId),
          getRegistrationsByEvent(eventId)
        ]);
        setEvent(evData);
        setRegistrations(regData);
      } catch (err) {
        console.error('Error fetching event management info:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading event management overview...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <p className="text-rose-400 font-semibold">Event not found.</p>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Manage Events
          </Link>
        </div>
      </div>
    );
  }

  const totalRegistered = registrations.length;
  const totalAttended = registrations.filter(r => r.attendance === 'present').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-5xl mx-auto">
      
      {/* Back Link */}
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Manage Events
      </Link>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {event.status}
              </span>
              <span className="text-xs text-slate-500">{event.date}</span>
            </div>
            <h1 className="text-3xl font-black text-white mt-1">{event.name}</h1>
            <p className="text-xs text-slate-400 mt-1">{event.venue}</p>
          </div>

          <Link
            to={`/admin/events/${eventId}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
          >
            <Edit className="w-4 h-4" /> Edit Details & Roles
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</div>
              <div className="text-2xl font-black text-white mt-1">{totalRegistered}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Ticket className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Present</div>
              <div className="text-2xl font-black text-white mt-1">{totalAttended}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Dynamic Event Roles Display */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" /> Event Specific Roles
          </h2>

          {!event.roles || event.roles.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No custom roles defined for this event.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {event.roles.map((r, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {r.roleName}
                  </div>
                  <div className="text-sm font-bold text-slate-100">{r.assignedPerson}</div>
                  {r.contact && <div className="text-xs text-slate-500">{r.contact}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
