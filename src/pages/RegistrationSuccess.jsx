import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import QRDisplay from '../components/QRDisplay';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function RegistrationSuccess() {
  const location = useLocation();
  const ticketData = location.state;

  if (!ticketData || !ticketData.qrToken) {
    return <Navigate to="/events" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-6">
      
      {/* Top Banner */}
      <div className="text-center space-y-2 max-w-md">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          Event Ticket Ready
        </div>
        <h1 className="text-3xl font-black text-white">Registration Complete</h1>
        <p className="text-xs text-slate-400">
          Your attendance ticket has been generated below.
        </p>
      </div>

      {/* QR Ticket Component */}
      <QRDisplay
        qrToken={ticketData.qrToken}
        participantName={ticketData.participantName}
        eventName={ticketData.eventName}
        date={ticketData.date}
        venue={ticketData.venue}
      />

      {/* Back to Events Button */}
      <div className="pt-2">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Explore More Events
        </Link>
      </div>
    </div>
  );
}
