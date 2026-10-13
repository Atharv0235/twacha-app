import React from 'react';
import { Camera, Wind } from 'lucide-react';
import { useAppData } from '../../state/AppData';
import { THEMES, cardStyle, primaryBtn, scoreColor, scoreWord } from './ui';
import { WAQI_CREDIT } from '../../config';

const t = THEMES.light;

function Mini({ label, value }) {
  return (
    <div style={{ flex: 1, backgroundColor: t.soft, borderRadius: '14px', padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: '800', color: scoreColor(value) }}>{value.toFixed(1)}</div>
      <div style={{ fontSize: '11px', color: t.muted }}>{label}</div>
      <div style={{ fontSize: '10px', color: t.faint }}>{scoreWord(value)}</div>
    </div>
  );
}

export default function HomeTab({ go }) {
  const { profile, lastScan, history, historyError, refreshHistory } = useAppData();
  const program = history?.program;
  const day = program ? Math.min(program.current_day, program.total_days) : null;
  const pct = program ? Math.round((day / program.total_days) * 100) : 0;
  const env = lastScan?.environment;
  const showAqi = env && env.source !== 'unavailable';

  return (
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', color: t.text }}>
      <div>
        <div style={{ fontSize: '12px', color: t.faint }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div className="font-serif" style={{ fontSize: '26px', fontWeight: '700' }}>Hello, {profile?.name}</div>
      </div>

      {historyError && (
        <div style={{ ...cardStyle(t), fontSize: '13px', lineHeight: 1.5 }}>
          Could not load your history: {historyError}{' '}
          <button onClick={refreshHistory} style={{ background: 'none', border: 'none', color: t.accent, fontWeight: '700', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {program?.is_demo && (
        <div style={{ ...cardStyle(t), borderColor: '#d97706', fontSize: '12px', color: '#92400e' }}>
          Demo data: part of this history is synthetic and was added for a presentation.
        </div>
      )}

      <div style={cardStyle(t)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
          <span>30-day program</span>
          <span>{program ? `Day ${day} of ${program.total_days}` : 'Starts with your first scan'}</span>
        </div>
        <div style={{ height: '8px', borderRadius: '9999px', backgroundColor: t.track, overflow: 'hidden', marginTop: '10px' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: t.accent }} />
        </div>
      </div>

      {lastScan ? (
        <div style={cardStyle(t)}>
          <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '10px' }}>Latest scan</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Mini label="Acne" value={lastScan.scan.acne_score} />
            <Mini label="Redness*" value={lastScan.scan.redness_score} />
            <Mini label="Dryness*" value={lastScan.scan.dryness_score} />
          </div>
          <div style={{ fontSize: '11px', color: t.faint, marginTop: '8px' }}>*rough estimates. Lower is better.</div>
          <button onClick={() => go('scan')} style={{ ...primaryBtn(t), marginTop: '12px', padding: '10px 18px', fontSize: '13px' }}>See full result</button>
        </div>
      ) : (
        <div style={{ ...cardStyle(t), textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.55, marginBottom: '12px' }}>
            No scans yet. Take a photo in daylight to get your first result and food ideas.
          </p>
          <button onClick={() => go('scan')} style={primaryBtn(t)}><Camera size={16} /> Scan now</button>
        </div>
      )}

      {showAqi && (
        <div style={{ ...cardStyle(t), display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Wind size={22} color={t.accent} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>
              Air quality {env.local_aqi} · {env.aqi_band.replace('_', ' ')}{env.source === 'demo' ? ' (demo value)' : ''}
            </div>
            <div style={{ fontSize: '10px', color: t.faint }}>{WAQI_CREDIT}</div>
          </div>
        </div>
      )}
    </div>
  );
}
