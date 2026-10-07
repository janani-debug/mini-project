import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents, deleteEvent, updateEvent } from '../services/eventService';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Calendar, Plus, Edit, Trash2, Eye, CheckCircle, Clock, AlertTriangle, Layers } from 'lucide-react';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, eventId: null, eventName: '' });

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    if (statusFilter === 'All') return true;
    return e.status === statusFilter;
  });

  async function handleToggleStatus(event, newStatus) {
    try {
      await updateEvent(event.id, { ...event, status: newStatus });
      await loadEvents();
    } catch (err) {
      console.error('Failed to update event status:', err);
    }
  }

  function openDeleteConfirmation(eventId, eventName) {
    setDeleteDialog({ isOpen: true, eventId, eventName });
  }

  async function handleConfirmDelete() {
    if (!deleteDialog.eventId) return;
    try {
      await deleteEvent(deleteDialog.eventId);
      setDeleteDialog({ isOpen: false, eventId: null, eventName: '' });
      await loadEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" /> Catalog Management
          </div>
          <h1 className="text-3xl font-black text-white">Manage Events</h1>
          <p className="text-xs text-slate-400">
            Publish, edit, update dynamic roles, or remove events.
          </p>
        </div>

        <Link
          to="/admin/events/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {['All', 'Published', 'Draft', 'Closed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st} Events
          </button>
        ))}
      </div>

      {/* Events Table / Roster */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading event catalog...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Events Found</h3>
          <p className="text-xs text-slate-500">There are no events under status "{statusFilter}".</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Venue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Roles</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-100 max-w-xs truncate">
                      {ev.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>{ev.date}</div>
                      <div className="text-slate-500">{ev.startTime} - {ev.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                      {ev.venue}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                          ev.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : ev.status === 'Draft'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {ev.roles ? ev.roles.length : 0} Roles
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      
                      {/* Status Toggle Quick Buttons */}
                      {ev.status !== 'Published' && (
                        <button
                          onClick={() => handleToggleStatus(ev, 'Published')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition-all"
                        >
                          Publish
                        </button>
                      )}

                      {ev.status === 'Published' && (
                        <button
                          onClick={() => handleToggleStatus(ev, 'Closed')}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-all"
                        >
                          Close
                        </button>
                      )}

                      {/* Detail View */}
                      <Link
                        to={`/admin/events/${ev.id}`}
                        className="inline-flex p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="View Details & Roles"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Edit */}
                      <Link
                        to={`/admin/events/${ev.id}/edit`}
                        className="inline-flex p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => openDeleteConfirmation(ev.id, ev.name)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Event?"
        message={`Are you sure you want to delete "${deleteDialog.eventName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, eventId: null, eventName: '' })}
      />

    </div>
  );
}
