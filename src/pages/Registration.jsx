import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { registerParticipant } from '../services/registrationService';
import { User, Mail, Phone, Building, GraduationCap, ArrowLeft, Send, AlertCircle } from 'lucide-react';

export default function Registration() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    participantName: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: '1st Year'
  });

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
        console.error('Error fetching event for registration:', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!formData.participantName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await registerParticipant({
        eventId,
        participantName: formData.participantName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        year: formData.year.trim()
      });

      // Navigate to Registration Success page with ticket details (NO registration ID)
      navigate('/registration-success', {
        state: {
          qrToken: result.qrToken,
          participantName: result.participantName,
          eventName: event.name,
          date: event.date,
          venue: event.venue
        }
      });
    } catch (err) {
      console.error('Registration submission error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading event information...
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-4">
          <p className="text-rose-400 font-semibold">{error}</p>
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
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back link */}
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event Details
        </Link>

        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 space-y-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Student Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {event.name}
            </h1>
            <p className="text-xs text-slate-400">
              {event.date} • {event.venue}
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="participantName"
                  required
                  placeholder="Enter your full name"
                  value={formData.participantName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your.email@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+1 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Department & Year Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Department / Major *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g. Computer Science"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Year of Study *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Registering...' : 'Submit Registration'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
