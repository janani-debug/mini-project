import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createEvent, getEventById, updateEvent } from '../services/eventService';
import RoleManager from '../components/RoleManager';
import { Calendar, ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react';

export default function CreateEvent() {
  const { eventId } = useParams();
  const isEditMode = Boolean(eventId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    posterUrl: '',
    date: '',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: '',
    description: '',
    eligibility: '',
    rules: '',
    whatsappLink: 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
    status: 'Published',
    roles: []
  });

  useEffect(() => {
    if (isEditMode) {
      async function fetchEvent() {
        try {
          setLoading(true);
          const data = await getEventById(eventId);
          if (data) {
            setFormData({
              name: data.name || '',
              posterUrl: data.posterUrl || '',
              date: data.date || '',
              startTime: data.startTime || '10:00 AM',
              endTime: data.endTime || '01:00 PM',
              venue: data.venue || '',
              description: data.description || '',
              eligibility: data.eligibility || '',
              rules: data.rules || '',
              whatsappLink: data.whatsappLink || 'https://whatsapp.com/channel/0029VbDhWgG8PgsDZP4I6G1Y',
              status: data.status || 'Published',
              roles: data.roles || []
            });
          }
        } catch (err) {
          console.error('Error fetching event for edit:', err);
          setError('Failed to load event data for editing.');
        } finally {
          setLoading(false);
        }
      }
      fetchEvent();
    }
  }, [eventId, isEditMode]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleRolesChange(newRoles) {
    setFormData({ ...formData, roles: newRoles });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.date || !formData.venue.trim()) {
      setError('Please fill in required fields: Event Name, Date, and Venue.');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await updateEvent(eventId, formData);
      } else {
        await createEvent(formData);
      }
      navigate('/admin/events');
    } catch (err) {
      console.error('Save Event Error:', err);
      setError(err.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-6 max-w-4xl mx-auto">
      
      {/* Back Link */}
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Manage Events
      </Link>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            {isEditMode ? 'Edit Existing Event' : 'New Event Scaffolding'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {isEditMode ? 'Edit Event & Roles' : 'Create Event'}
          </h1>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basic Event Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. AI & Robotics Hackathon"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Poster Image URL (Optional)
              </label>
              <input
                type="url"
                name="posterUrl"
                placeholder="https://images.unsplash.com/..."
                value={formData.posterUrl}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              >
                <option value="Published">Published (Live for students)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Time *
              </label>
              <input
                type="text"
                name="startTime"
                placeholder="10:00 AM"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                End Time *
              </label>
              <input
                type="text"
                name="endTime"
                placeholder="01:00 PM"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Venue / Location *
              </label>
              <input
                type="text"
                name="venue"
                required
                placeholder="e.g. Main Auditorium, Block A"
                value={formData.venue}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Detailed description of the event..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl p-4 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Eligibility Criteria
              </label>
              <input
                type="text"
                name="eligibility"
                placeholder="e.g. Open to all students"
                value={formData.eligibility}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Rules & Guidelines
              </label>
              <input
                type="text"
                name="rules"
                placeholder="e.g. Teams of 2. Carry student ID."
                value={formData.rules}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp Update Channel Link
              </label>
              <input
                type="url"
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>

          </div>

          {/* Dynamic Event-Specific Role Manager Component */}
          <div className="pt-4">
            <RoleManager
              roles={formData.roles}
              onChange={handleRolesChange}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="py-3.5 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving Event...' : isEditMode ? 'Update Event' : 'Publish & Save Event'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
