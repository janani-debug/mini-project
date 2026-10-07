import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QRDisplay({ qrToken, participantName, eventName, date, venue }) {
  function handleDownloadQR() {
    const svgElement = document.getElementById('ticket-qr-code');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${participantName.replace(/\s+/g, '_')}_QR_Ticket.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full mx-auto text-center space-y-6 shadow-2xl">
      
      {/* Success Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
        <CheckCircle2 className="w-4 h-4" />
        <span>Registration Successful!</span>
      </div>

      {/* Ticket Details */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-100">{eventName}</h2>
        <p className="text-sm font-medium text-blue-400">Attendee: {participantName}</p>
        <p className="text-xs text-slate-400">{date} • {venue}</p>
      </div>

      {/* QR Box */}
      <div className="bg-white p-6 rounded-2xl inline-block shadow-inner border border-slate-200">
        <QRCodeSVG
          id="ticket-qr-code"
          value={qrToken}
          size={190}
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Notice Message */}
      <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300 flex items-start gap-2 text-left">
        <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <span>Please save this QR code and show it on the event day for attendance.</span>
      </div>

      {/* Save Button */}
      <button
        onClick={handleDownloadQR}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Download className="w-4 h-4" />
        Save Ticket QR Code
      </button>
    </div>
  );
}
