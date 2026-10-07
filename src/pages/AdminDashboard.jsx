import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../services/eventService';
import { getAllRegistrations } from '../services/registrationService';
import { Calendar, Ticket, CheckSquare, PlusCircle, LayoutDashboard, ArrowRight, Sparkles, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const [eventData, regData] = await Promise.all([
          getAllEvents(),
          getAllRegistrations()
        ]);
        setEvents(eventData);
        setRegistrations(regData);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'Published').length;
  const totalRegistrations = registrations.length;
  const totalPresent = registrations.filter(r => r.attendance === 'present').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" /> Admin Control Center
          </div>
          <h1 className="text-3xl font-black text-white">Event Management Dashboard</h1>
          <p className="text-xs text-slate-400">
            Overview of system performance, events, registrations, and attendance metrics.
          </p>
        </div>

        <Link
          to="/admin/events/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Events</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{loading ? '...' : totalEvents}</div>
          <p className="text-xs text-slate-500">Events in system</p>
        </div>

        {/* Published Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Published Events</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{loading ? '...' : upcomingEvents}</div>
          <p className="text-xs text-slate-500">Live & active for student registration</p>
        </div>

        {/* Total Registrations */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registrations</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{loading ? '...' : totalRegistrations}</div>
          <p className="text-xs text-slate-500">Student tickets issued</p>
        </div>

        {/* Total Present */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Present</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{loading ? '...' : totalPresent}</div>
          <p className="text-xs text-slate-500">QR scanned & attendance verified</p>
        </div>

      </div>

      {/* Navigation Quick Access Grid */}
      <div className="max-w-7xl mx-auto space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-200">Management Shortcuts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/admin/events"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                Event Catalog & Roles
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Create, edit, publish events and configure custom event-specific team roles.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-400 gap-1 pt-2">
              <span>Manage Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/registrations"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/50 hover:shadow-xl transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                Student Registrations
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Filter participant records by event, department, year, or attendance status.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-400 gap-1 pt-2">
              <span>View Roster</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/attendance"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 hover:shadow-xl transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                Live QR Attendance Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Open webcam QR scanner to instantly verify participant tickets on event day.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-400 gap-1 pt-2">
              <span>Open Scanner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}
