import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../services/eventService';
import { getRegistrationsByEvent } from '../services/registrationService';
import { scanAndMarkAttendance } from '../services/attendanceService';
import QRScanner from '../components/QRScanner';
import { CheckSquare, Camera, Users, CheckCircle2, AlertTriangle, XCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function Attendance() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventError, setEventError] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Scanner & Result Modal State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setFetchError('');
        const data = await getAllEvents();
        setEvents(data);
        if (data && data.length > 0) {
          setSelectedEventId(data[0].id);
        } else {
          setFetchError('No events found in database.');
        }
      } catch (err) {
        console.error('Error loading events in Attendance page:', err);
        setFetchError(err.message || 'Failed to connect to Firestore.');
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  async function loadRoster(eventId) {
    if (!eventId) return;
    try {
      const regData = await getRegistrationsByEvent(eventId);
      setRegistrations(regData);
    } catch (err) {
      console.error('Error fetching roster for attendance:', err);
    }
  }

  useEffect(() => {
    if (selectedEventId) {
      setEventError('');
      loadRoster(selectedEventId);
    }
  }, [selectedEventId]);

  function handleOpenScanner() {
    if (!selectedEventId) {
      setEventError('Please select an event first.');
      return;
    }
    setEventError('');
    setScannerOpen(true);
  }

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const totalRegistered = registrations.length;
  const totalPresent = registrations.filter(r => r.attendance === 'present').length;
  const totalAbsent = totalRegistered - totalPresent;

  async function handleQRScanSuccess(token) {
    const result = await scanAndMarkAttendance(selectedEventId, token);
    setScanResult(result);

    if (result.success) {
      await loadRoster(selectedEventId);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" /> Live Verification System
          </div>
          <h1 className="text-3xl font-black text-white">QR Attendance Scanner</h1>
          <p className="text-xs text-slate-400">
            Select an event, scan participant QR code tickets, and verify attendance instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenScanner}
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Camera className="w-5 h-5" />
          <span>Scan QR Code</span>
        </button>
      </div>

      {/* Warning Alert if Fetch Error or No Event Selected */}
      {fetchError && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">{fetchError}</span>
        </div>
      )}

      {eventError && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">{eventError}</span>
        </div>
      )}

      {/* Event Selector & Stats Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        
        {/* Event Selector Dropdown */}
        <div className="max-w-xl">
          <label className="block text-xs font-bold text-slate-300 mb-2">Select Active Event *</label>
          {loading ? (
            <div className="py-3 px-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Fetching events from database...</span>
            </div>
          ) : (
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setEventError('');
              }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 text-sm font-semibold rounded-2xl px-4 py-3 outline-none transition-colors"
            >
              {events.length === 0 ? (
                <option value="">No events available</option>
              ) : (
                events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.date})
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
          
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</div>
              <div className="text-3xl font-black text-white mt-1">{totalRegistered}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Present</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">{totalPresent}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Total Absent</div>
              <div className="text-3xl font-black text-rose-400 mt-1">{totalAbsent}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      {/* Participant Roster Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200">Attendance Roster</h2>
          <button
            onClick={() => loadRoster(selectedEventId)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Registrations Yet</h3>
            <p className="text-xs text-slate-500">No student registrations recorded for this event.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Participant Name</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Year</th>
                    <th className="px-6 py-4 text-center">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-100">
                        {reg.participantName}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {reg.department}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {reg.year}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3.5 py-1 text-xs font-semibold rounded-full border ${
                            reg.attendance === 'present'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
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

      {/* Camera QR Scanner Modal Component */}
      {scannerOpen && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* QR Scan Result Feedback Dialog */}
      {scanResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            
            {/* Status Icons */}
            {scanResult.code === 'VALID' && (
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            )}

            {scanResult.code === 'ALREADY_MARKED' && (
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10" />
              </div>
            )}

            {(scanResult.code === 'WRONG_EVENT' || scanResult.code === 'INVALID_TOKEN' || scanResult.code === 'INVALID_INPUT' || scanResult.code === 'SERVER_ERROR') && (
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10" />
              </div>
            )}

            {/* Status Title & Message */}
            <div className="space-y-1">
              <h3 className={`text-xl font-bold ${
                scanResult.code === 'VALID'
                  ? 'text-emerald-400'
                  : scanResult.code === 'ALREADY_MARKED'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {scanResult.code === 'VALID' ? 'Participant Found ✓' : scanResult.message}
              </h3>
              {scanResult.code === 'VALID' && (
                <p className="text-xs text-emerald-300 font-semibold">Attendance Marked Successfully</p>
              )}
            </div>

            {/* Participant Info Card (if available) */}
            {scanResult.participant && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-bold text-slate-100">{scanResult.participant.participantName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Event:</span>
                  <span className="font-semibold text-blue-400">{selectedEvent?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-slate-200">{scanResult.participant.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Year:</span>
                  <span className="text-slate-200">{scanResult.participant.year}</span>
                </div>
              </div>
            )}

            {/* Close / Continue Button */}
            <button
              onClick={() => setScanResult(null)}
              className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs rounded-xl transition-colors border border-slate-700"
            >
              Close & Continue Scanning
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
