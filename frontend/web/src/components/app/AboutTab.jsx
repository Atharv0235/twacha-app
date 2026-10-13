import React, { useState } from 'react';
import { useAppData } from '../../state/AppData';
import { THEMES, cardStyle, primaryBtn, ghostBtn, BAD } from './ui';
import { DISCLAIMER, WAQI_CREDIT, CONTACT_EMAIL, TEAM } from '../../config';

const t = THEMES.light;

const LIMITS = [
  'The acne score comes from a small model (macro-F1 about 0.60 on 56 test images), so it makes mistakes.',
  'It was trained on clinic photos, mostly of East Asian patients. Selfies, darker skin tones, beards and moles can give wrong results. We have not validated it on any skin tone group.',
  'Redness and dryness are rough colour and texture estimates, not calibrated measurements.',
  'The link between a score and a food uses weights chosen by the team, and research on diet and acne is mixed.'
];

export default function AboutTab({ onOpenLegal }) {
  const { profile, setProfile, history, deleteEverything } = useAppData();
  const [name, setName] = useState(profile?.name || '');
  const [city, setCity] = useState(profile?.city || '');
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const scans = history?.scans || [];

  const save = () => {
    if (!name.trim()) return;
    setProfile({ ...profile, name: name.trim(), city: city.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const wipe = async () => {
    setBusy(true); setError(null);
    try { await deleteEverything(); } catch (e) { setError(e.message); setBusy(false); }
  };

  const field = { padding: '11px 14px', borderRadius: '14px', border: '1px solid #ded6c6', fontSize: '14px', backgroundColor: '#fff', width: '100%' };

  return (
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', color: t.text }}>
      <div className="font-serif" style={{ fontSize: '24px', fontWeight: '700' }}>About you and Twacha</div>

      <div style={cardStyle(t)}>
        <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '10px' }}>Your details</div>
        <label style={{ fontSize: '12px', color: t.muted }} htmlFor="ab-name">First name</label>
        <input id="ab-name" style={{ ...field, margin: '4px 0 10px' }} value={name} onChange={(e) => setName(e.target.value)} />
        <label style={{ fontSize: '12px', color: t.muted }} htmlFor="ab-city">City (for air quality)</label>
        <input id="ab-city" style={{ ...field, margin: '4px 0 12px' }} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Delhi" />
        <button style={primaryBtn(t, !name.trim())} disabled={!name.trim()} onClick={save}>{saved ? 'Saved' : 'Save'}</button>
        <div style={{ fontSize: '12px', color: t.muted, marginTop: '12px' }}>Scans so far: {scans.length}</div>
      </div>

      <div style={cardStyle(t)}>
        <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>What Twacha cannot do</div>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.65, color: t.muted }}>
          {LIMITS.map((l) => <li key={l}>{l}</li>)}
        </ul>
        <p style={{ fontSize: '12px', color: t.faint, marginTop: '10px' }}>{DISCLAIMER}</p>
      </div>

      <div style={{ ...cardStyle(t), fontSize: '12px', lineHeight: 1.65, color: t.muted }}>
        <div style={{ fontWeight: '800', fontSize: '14px', color: t.text, marginBottom: '6px' }}>Data and credits</div>
        <div>{WAQI_CREDIT}.</div>
        <div>Food values: Indian Nutrient Databank (INDB).</div>
        <div>Acne model trained on the ACNE04 dataset.</div>
        {TEAM.length > 0 && <div>Built by {TEAM.map((m) => m.name).join(' and ')}.</div>}
        {CONTACT_EMAIL && <div>Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div>}
        <div style={{ marginTop: '8px' }}>
          <button onClick={() => onOpenLegal('privacy')} style={{ background: 'none', border: 'none', padding: 0, color: t.accent, textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}>Privacy policy</button>
          {' · '}
          <button onClick={() => onOpenLegal('terms')} style={{ background: 'none', border: 'none', padding: 0, color: t.accent, textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}>Terms</button>
        </div>
      </div>

      <div style={cardStyle(t)}>
        <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '6px' }}>Delete my data</div>
        <p style={{ fontSize: '12px', color: t.muted, lineHeight: 1.55, marginBottom: '10px' }}>
          Removes your scores and food log from the server and everything stored on this phone, then returns you to the start.
        </p>
        {!confirm ? (
          <button style={ghostBtn(t)} onClick={() => setConfirm(true)}>Delete all my data</button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ ...primaryBtn(t, busy), backgroundColor: BAD, color: '#fff' }} disabled={busy} onClick={wipe}>{busy ? 'Deleting...' : 'Yes, delete everything'}</button>
            <button style={ghostBtn(t)} disabled={busy} onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        )}
        {error && <p role="alert" style={{ fontSize: '12px', color: BAD, marginTop: '8px' }}>{error}</p>}
      </div>
    </div>
  );
}
