import React, { useEffect, useState } from 'react';
import { getAllRegistrations } from '../services/registrationService';
import { getAllEvents } from '../services/eventService';
import { Ticket, Search, Filter, Download, UserCheck, Calendar } from 'lucide-react';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedAttendance, setSelectedAttendance] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadRoster() {
      try {
        setLoading(true);
        const [regData, eventData] = await Promise.all([
          getAllRegistrations(),
          getAllEvents()
        ]);
        setRegistrations(regData);
        setEvents(eventData);
      } catch (err) {
        console.error('Failed to load registration roster:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoster();
  }, []);

  const eventMap = events.reduce((acc, ev) => {
    acc[ev.id] = ev.name;
    return acc;
  }, {});

  const departments = Array.from(new Set(registrations.map(r => r.department).filter(Boolean)));
  const years = Array.from(new Set(registrations.map(r => r.year).filter(Boolean)));

  const filteredRegistrations = registrations.filter((r) => {
    if (selectedEventId !== 'All' && r.eventId !== selectedEventId) return false;
    if (selectedDepartment !== 'All' && r.department !== selectedDepartment) return false;
    if (selectedYear !== 'All' && r.year !== selectedYear) return false;
    if (selectedAttendance !== 'All' && r.attendance !== selectedAttendance) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.participantName?.toLowerCase().includes(q);
      const matchEmail = r.email?.toLowerCase().includes(q);
      const matchPhone = r.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" /> Participant Database
          </div>
          <h1 className="text-3xl font-black text-white">Event Registrations</h1>
          <p className="text-xs text-slate-400">
            View registered participants, filter by event/department, and check attendance status.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          Showing <span className="text-white font-bold">{filteredRegistrations.length}</span> of {registrations.length} Registrations
        </div>
      </div>

      {/* Search & Filter Control Panel */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Bar */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Event Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Event Filter</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors"
            >
              <option value="All">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors"
            >
              <option value="All">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Attendance Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Attendance Status</label>
            <select
              value={selectedAttendance}
              onChange={(e) => setSelectedAttendance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 text-slate-100 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="Not Marked">Not Marked Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Roster Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading registrations...</div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Registrations Found</h3>
          <p className="text-xs text-slate-500">Try loosening your filter or search criteria.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Participant Name</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Department & Year</th>
                  <th className="px-6 py-4 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-100">
                      {reg.participantName}
                    </td>
                    <td className="px-6 py-4 text-xs text-blue-400 font-medium max-w-xs truncate">
                      {eventMap[reg.eventId] || 'Selected Event'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>{reg.email}</div>
                      <div className="text-slate-500">{reg.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      <div>{reg.department}</div>
                      <div className="text-slate-500">{reg.year}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                          reg.attendance === 'present'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {reg.attendance === 'present' ? 'Present ✓' : 'Not Marked'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
