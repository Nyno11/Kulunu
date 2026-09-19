import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../config';

export default function CheckInPage() {
  const { token } = useAuth();
  const scannerRef = useRef(null);
  const lastCodeRef = useRef(null);
  const processingRef = useRef(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ checkedIn: 0, duplicates: 0 });
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    let scanner;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (processingRef.current || decodedText === lastCodeRef.current) return;

          // Accept either a scan link (…/scan/<code>) or the legacy
          // "KULUNU-TICKET|<code>|…" payload from older-generated QR codes.
          let ticketCode = null;
          const scanMatch = decodedText.match(/\/scan\/([^/?#]+)/);
          if (scanMatch) {
            ticketCode = scanMatch[1];
          } else {
            const parts = decodedText.split('|');
            if (parts[0] === 'KULUNU-TICKET' && parts[1]) ticketCode = parts[1];
          }

          if (!ticketCode) {
            lastCodeRef.current = decodedText;
            setResult({ type: 'error', title: 'Invalid QR', data: null });
            return;
          }
          lastCodeRef.current = decodedText;
          processingRef.current = true;
          setResult({ type: 'loading', title: 'Checking ticket…', data: null });
          fetch(`${BASE_URL}/tickets/checkin-by-code`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket_code: ticketCode }),
          })
            .then(r => r.json())
            .then(json => {
              processingRef.current = false;
              if (!json.success) {
                setResult({ type: 'error', title: json.message || 'Not found', data: null });
                return;
              }
              if (json.already_checked_in) {
                setStats(s => ({ ...s, duplicates: s.duplicates + 1 }));
                setResult({ type: 'warning', title: 'Already checked in', data: json.data });
              } else {
                setStats(s => ({ ...s, checkedIn: s.checkedIn + 1 }));
                setResult({ type: 'success', title: 'Checked in!', data: json.data });
              }
            })
            .catch(() => {
              processingRef.current = false;
              setResult({ type: 'error', title: 'Connection error', data: null });
            });
        },
        () => {}
      ).catch(err => {
        setCameraError('Camera not available. ' + (err?.message || ''));
      });
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [token]);

  const typeStyles = {
    success: 'bg-green-900 border-green-500 text-green-100',
    warning: 'bg-yellow-900 border-yellow-500 text-yellow-100',
    error: 'bg-red-900 border-red-500 text-red-100',
    loading: 'bg-gray-800 border-gray-600 text-gray-100',
  };

  function resetScan() {
    lastCodeRef.current = null;
    processingRef.current = false;
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading font-black text-xl">GATE CHECK-IN</h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:'rgba(255,255,255,.15)', color:'#fff'}}>OFFLINE-READY</span>
        </div>

        {/* Scanner */}
        <div className="border-2 border-dashed rounded-xl overflow-hidden mb-4 relative" style={{borderColor:'rgba(12,166,239,.4)', minHeight:260}}>
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm opacity-60 text-center p-4">{cameraError}</div>
          ) : null}
          <div id="qr-reader" className="w-full"/>
          <div className="absolute inset-x-1/4 top-1/2 h-0.5 pointer-events-none" style={{background:'rgba(12,166,239,.8)'}}/>
        </div>

        {/* Result */}
        {result && (
          <div className={`border rounded-xl p-4 mb-4 ${typeStyles[result.type] || typeStyles.loading}`}>
            <div className="font-heading font-bold text-base mb-1">{result.title}</div>
            {result.data && (
              <div className="text-sm opacity-80 space-y-0.5">
                <div>{result.data.buyer_name} · {result.data.tier_name}</div>
                <div>{result.data.event_title}</div>
                <div className="font-mono text-xs mt-1">{result.data.ticket_code}</div>
              </div>
            )}
            {result.type !== 'loading' && (
              <button onClick={resetScan} className="mt-3 text-xs font-bold opacity-70 hover:opacity-100">
                Scan next →
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Checked in', stats.checkedIn, 'text-green-400'],
            ['Duplicates', stats.duplicates, 'text-yellow-400']
          ].map(([l,v,c]) => (
            <div key={l} className="rounded-xl p-4" style={{background:'rgba(255,255,255,.07)'}}>
              <div className="text-xs opacity-60 mb-1">{l}</div>
              <div className={`text-3xl font-black font-heading ${c}`}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
