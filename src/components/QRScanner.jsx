import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertTriangle, KeyRound, Check } from 'lucide-react';

export default function QRScanner({ onScanSuccess, onClose }) {
  const [cameraError, setCameraError] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const scannerId = 'qr-reader-view';

    async function initScanner() {
      // Delay slightly to ensure modal DOM container is painted
      await new Promise((r) => setTimeout(r, 150));
      if (!isMounted) return;

      const container = document.getElementById(scannerId);
      if (!container) {
        console.warn('Scanner DOM container not found');
        return;
      }

      try {
        setCameraError(null);
        const html5Qrcode = new Html5Qrcode(scannerId);
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (decodedText && isMounted) {
              onScanSuccess(decodedText.trim());
            }
          },
          () => {
            // Frame parse error fallback
          }
        );
      } catch (err) {
        console.error('Camera Scanner Error:', err);
        if (!isMounted) return;

        const errStr = String(err);
        if (
          err.name === 'NotAllowedError' ||
          errStr.includes('Permission') ||
          errStr.includes('NotAllowedError') ||
          errStr.includes('denied')
        ) {
          setCameraError('Camera permission is required to scan the QR code.');
        } else if (
          err.name === 'NotFoundError' ||
          errStr.includes('DevicesNotFoundError') ||
          errStr.includes('No camera') ||
          errStr.includes('NotFoundError')
        ) {
          setCameraError('No camera was detected on this device.');
        } else {
          setCameraError('Camera permission is required to scan the QR code.');
        }
      }
    }

    initScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current
              .stop()
              .then(() => {
                try { scannerRef.current.clear(); } catch(e){}
              })
              .catch(() => {});
          } else {
            try { scannerRef.current.clear(); } catch(e){}
          }
        } catch (e) {}
      }
    };
  }, []);

  async function handleStopScanner() {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Scanner stop notice:', e);
      }
    }
    onClose();
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualToken.trim()) return;
    onScanSuccess(manualToken.trim());
    setManualToken('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Live QR Ticket Scanner</h3>
          </div>

          <button
            type="button"
            onClick={handleStopScanner}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Close Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Feed Container */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[260px] flex items-center justify-center">
          <div id="qr-reader-view" className="w-full" />

          {cameraError && (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-rose-300">{cameraError}</p>
              <p className="text-xs text-slate-500">
                Ensure camera permissions are allowed in your browser settings or use manual token entry below.
              </p>
            </div>
          )}
        </div>

        {/* Manual Token Entry Fallback */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <label className="block text-xs font-semibold text-slate-400">
            Manual QR Token Entry (Fallback)
          </label>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter 12-char QR Token..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-100 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!manualToken.trim()}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40 rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Submit
            </button>
          </form>
        </div>

        {/* Stop Scanner Button */}
        <button
          type="button"
          onClick={handleStopScanner}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors border border-slate-700 flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" /> Stop Scanner
        </button>
      </div>
    </div>
  );
}
