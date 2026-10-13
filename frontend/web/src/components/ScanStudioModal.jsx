import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AppDataProvider, useAppData } from '../state/AppData';
import ScanCapture from './app/ScanCapture';
import ScanResult from './app/ScanResult';
import { DISCLAIMER } from '../config';

function Body({ onClose }) {
  const { profile, setProfile } = useAppData();
  const [result, setResult] = useState(null);
  const [city, setCity] = useState(profile?.city || '');
  const [consent, setConsent] = useState(!!profile?.consent);

  const start = () => setProfile({ name: profile?.name || 'Guest', city: city.trim(), keepThumbnails: true, consent: true });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(5, 16, 9, 0.88)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }} role="dialog" aria-modal="true" aria-label="Try a scan">
      <div style={{
        backgroundColor: '#0c2217', color: '#fff', borderRadius: '28px', width: '100%', maxWidth: '720px', maxHeight: '92vh',
        overflowY: 'auto', border: '1px solid rgba(255,255,255,0.16)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div className="font-serif" style={{ fontSize: '22px', fontWeight: '700' }}>Try a scan</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>{DISCLAIMER}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px 28px 32px' }}>
          {!profile?.consent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', lineHeight: 1.6 }}>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                Your photo is sent to the Twacha server for analysis and is not saved there. Your scores are stored under an anonymous ID.
              </p>
              <label style={{ fontSize: '12px' }}>
                City for air quality (optional)
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Delhi"
                  style={{ display: 'block', width: '100%', marginTop: '6px', padding: '11px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.06)', color: '#fff' }} />
              </label>
              <label style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: '3px' }} />
                <span>I understand and agree. This is not medical advice.</span>
              </label>
              <button className="btn-lime-pill" disabled={!consent} onClick={start} style={{ opacity: consent ? 1 : 0.5, alignSelf: 'flex-start' }}>Continue</button>
            </div>
          ) : result ? (
            <>
              <ScanResult result={result} theme="dark" />
              <button className="btn-white-pill" onClick={() => setResult(null)} style={{ marginTop: '16px' }}>Scan another photo</button>
            </>
          ) : (
            <ScanCapture theme="dark" onResult={setResult} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ScanStudioModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <AppDataProvider>
      <Body onClose={onClose} />
    </AppDataProvider>
  );
}
