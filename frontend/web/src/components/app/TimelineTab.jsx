import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Camera, Calendar, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAppData } from '../../state/AppData';
import LineChart from './LineChart';
import { THEMES, cardStyle, ghostBtn, scoreColor, formatDate, formatDateTime } from './ui';
import {
  buildTimeline, comparisonSummary, metricDeltaLabel, reminderMessage, fmtDay, fmtDayFull, drynessToHydration
} from '../../state/ScanTimeline';

const t = THEMES.light;

/* ── Small helpers ── */
function DeltaChip({ diff, unit = '' }) {
  const { text, color } = metricDeltaLabel(diff, unit);
  return (
    <span style={{
      fontSize: '10px', fontWeight: '700', color, backgroundColor: color + '18',
      padding: '2px 7px', borderRadius: '99px', whiteSpace: 'nowrap'
    }}>{text}</span>
  );
}

function MetricMini({ label, curr, prev, unit = '/10', fmt = (v) => v.toFixed(1) }) {
  const diff = prev != null ? prev - curr : null; // positive = improved (lower score)
  return (
    <div style={{ textAlign: 'center', flex: '1 1 0', minWidth: 0 }}>
      <div style={{ fontSize: '9px', color: t.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: '900', color: scoreColor(curr), lineHeight: 1 }}>{fmt(curr)}<span style={{ fontSize: '9px', color: '#88938a' }}>{unit}</span></div>
      {diff != null && <DeltaChip diff={diff} />}
    </div>
  );
}

/* ── Reminder banner ── */
function ReminderBanner({ timeline, go }) {
  const msg = reminderMessage(timeline);
  if (!msg) return null;
  const bg = msg.urgent ? '#fff3cd' : '#f0fdf4';
  const border = msg.urgent ? '#fde68a' : '#bbf7d0';
  const titleColor = msg.urgent ? '#92400e' : '#065f46';
  return (
    <div style={{
      backgroundColor: bg, border: `1.5px solid ${border}`, borderRadius: '16px',
      padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start'
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{msg.urgent ? '📸' : '📅'}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '800', fontSize: '13px', color: titleColor }}>{msg.title}</div>
        <div style={{ fontSize: '11.5px', color: '#5e6d64', marginTop: '2px', lineHeight: 1.45 }}>{msg.body}</div>
        {msg.urgent && (
          <button onClick={() => go('scan')} style={{
            marginTop: '8px', padding: '6px 16px', borderRadius: '99px', border: 'none',
            backgroundColor: '#19231c', color: '#fff', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
          }}>
            Scan now
          </button>
        )}
      </div>
    </div>
  );
}

/* ── 30-day progress bar ── */
function JourneyProgress({ timeline }) {
  const { firstScanDate, journeyEndDate, daysElapsed, daysRemaining, progressPct, milestones, completedScans } = timeline;
  if (!firstScanDate) return null;
  return (
    <div style={cardStyle(t)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div>
          <div style={{ fontWeight: '800', fontSize: '14px' }}>30-Day Skin Journey</div>
          <div style={{ fontSize: '11px', color: t.muted, marginTop: '2px' }}>
            {fmtDay(firstScanDate)} → {fmtDay(journeyEndDate)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '900', fontSize: '22px', color: '#2d5a3e', lineHeight: 1 }}>{progressPct}%</div>
          <div style={{ fontSize: '10px', color: t.muted }}>{daysRemaining} days left</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'relative', height: '10px', borderRadius: '99px', backgroundColor: '#e9e4d8', marginBottom: '12px' }}>
        <div style={{ width: `${progressPct}%`, height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #2d5a3e, #16a34a)', transition: 'width 0.4s' }} />
        {/* Milestone dots on bar */}
        {milestones.map((m) => {
          const pct = ((m.dayN - 1) / 29) * 100;
          return (
            <div key={m.dayN} style={{
              position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)',
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: m.reached ? '#16a34a' : '#ded6c6',
              border: '2px solid #fff', zIndex: 2
            }} title={m.label} />
          );
        })}
      </div>

      {/* Milestone labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        {milestones.map((m) => (
          <div key={m.dayN} style={{ textAlign: 'center', fontSize: '9px', color: m.reached ? '#2d5a3e' : '#88938a', fontWeight: m.reached ? '800' : '600' }}>
            {m.label}
            <div style={{ fontSize: '9px', color: '#b0bdb6' }}>{fmtDay(m.date)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #f0ede6', paddingTop: '10px', marginTop: '4px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', fontSize: '18px', color: '#2d5a3e' }}>{completedScans}</div>
          <div style={{ fontSize: '10px', color: t.muted }}>Scans done</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', fontSize: '18px', color: '#19231c' }}>{daysElapsed}</div>
          <div style={{ fontSize: '10px', color: t.muted }}>Days in</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '900', fontSize: '18px', color: '#ff6b00' }}>{daysRemaining}</div>
          <div style={{ fontSize: '10px', color: t.muted }}>Days left</div>
        </div>
      </div>
    </div>
  );
}

/* ── Single scan card with comparison ── */
function ScanCard({ entry, thumb, isOpen, onToggle }) {
  const { scan, delta, dayNumber, isFirst, comparison, hydration } = entry;
  const { emoji, word, color } = comparisonSummary(comparison);

  return (
    <div style={{
      ...cardStyle(t),
      borderLeft: `4px solid ${color}`,
      padding: '14px 14px 14px 12px'
    }}>
      <button onClick={onToggle} style={{
        width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: t.text,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left'
      }}>
        <span>
          <span style={{ fontWeight: '800', fontSize: '14px' }}>{formatDate(scan.created_at)}</span>
          <span style={{ fontSize: '12px', color: t.faint }}> · Day {dayNumber}</span>
          {isFirst && <span style={{ marginLeft: '6px', fontSize: '9px', backgroundColor: '#0ea5e9', color: '#fff', padding: '1px 6px', borderRadius: '99px', fontWeight: '700' }}>FIRST</span>}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ fontSize: '13px' }}>{emoji}</span>
          <strong style={{ color }}>{word}</strong>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Mini metric row always visible */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f0ede6' }}>
        <MetricMini label="Acne" curr={scan.acne_score} prev={delta?.acne?.prev} />
        <MetricMini label="Redness" curr={scan.redness_score} prev={delta?.redness?.prev} />
        <MetricMini label="Dryness" curr={scan.dryness_score} prev={delta?.dryness?.prev} />
        <MetricMini label="Hydration" curr={hydration} prev={delta ? drynessToHydration(delta.dryness?.prev) : null} unit="%" fmt={(v) => `${v}`} />
      </div>

      {isOpen && (
        <div style={{ marginTop: '12px' }}>
          {thumb && (
            <img src={thumb} alt="Scan preview" style={{ width: '72px', height: '72px', borderRadius: '14px', objectFit: 'cover', marginBottom: '10px' }} />
          )}

          <div style={{ fontSize: '12px', color: t.faint, marginBottom: '8px' }}>{formatDateTime(scan.created_at)}</div>

          {/* Detailed delta breakdown */}
          {delta && (
            <div style={{ backgroundColor: '#f8faf8', borderRadius: '12px', padding: '10px 12px', marginBottom: '8px' }}>
              <div style={{ fontWeight: '800', fontSize: '12px', marginBottom: '8px', color: '#19231c' }}>vs. previous scan</div>
              {[
                { label: 'Acne score', diff: delta.acne.diff, note: delta.acne.diff > 0.05 ? 'fewer/lighter blemishes' : delta.acne.diff < -0.05 ? 'more/heavier blemishes' : 'no notable change' },
                { label: 'Redness', diff: delta.redness.diff, note: delta.redness.diff > 0.05 ? 'less redness detected' : delta.redness.diff < -0.05 ? 'more redness' : 'stable' },
                { label: 'Dryness', diff: delta.dryness.diff, note: delta.dryness.diff > 0.05 ? 'less dryness' : delta.dryness.diff < -0.05 ? 'drier skin' : 'stable' },
                { label: 'Hydration', diff: delta.hydration.diff, note: delta.hydration.diff > 1 ? `+${delta.hydration.diff}% better barrier` : delta.hydration.diff < -1 ? 'reduced moisture' : 'stable' },
              ].map(({ label, diff, note }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: t.muted }}>{label}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
                    <DeltaChip diff={diff} />
                    <span style={{ fontSize: '9px', color: t.faint }}>{note}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          {scan.local_aqi != null && (
            <div style={{ fontSize: '11px', color: t.muted }}>Air quality that day: AQI {scan.local_aqi}</div>
          )}
          <div style={{ fontSize: '10px', color: t.faint, marginTop: '4px' }}>*Redness and dryness are rough colour estimates, not clinical measures.</div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function TimelineTab({ go }) {
  const { history, historyError, thumbs, clearThumbs, refreshHistory } = useAppData();
  const [open, setOpen] = useState(null);
  const scans = history?.scans || [];
  const chrono = useMemo(() => [...scans].reverse(), [scans]);
  const hasThumbs = Object.keys(thumbs).length > 0;
  const timeline = useMemo(() => buildTimeline(scans), [scans]);

  return (
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', color: t.text }}>
      <div className="font-serif" style={{ fontSize: '24px', fontWeight: '700' }}>Your 30-Day Journey</div>

      {historyError && (
        <div style={{ ...cardStyle(t), fontSize: '13px' }}>
          Could not load history: {historyError}{' '}
          <button onClick={refreshHistory} style={{ background: 'none', border: 'none', color: t.accent, fontWeight: '700', cursor: 'pointer' }}>Retry</button>
        </div>
      )}
      {history?.program?.is_demo && (
        <div style={{ ...cardStyle(t), borderColor: '#d97706', fontSize: '12px', color: '#92400e' }}>
          Demo data: part of this history is synthetic.
        </div>
      )}

      {/* Reminder banner */}
      {scans.length > 0 && <ReminderBanner timeline={timeline} go={go} />}

      {/* Journey progress */}
      <JourneyProgress timeline={timeline} />

      {/* No scans yet */}
      {history && scans.length === 0 && (
        <div style={{ ...cardStyle(t), textAlign: 'center', fontSize: '14px', color: t.muted, lineHeight: 1.55 }}>
          Take your first scan to start the 30-day journey.{' '}
          <button onClick={() => go('scan')} style={{ background: 'none', border: 'none', color: t.accent, fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Scan now</button>
        </div>
      )}

      {/* Acne trend chart */}
      {scans.length > 0 && (
        <div style={cardStyle(t)}>
          <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '6px' }}>Acne score trend</div>
          {scans.length < 3 && (
            <p style={{ fontSize: '12px', color: t.muted, marginBottom: '6px' }}>3+ scans needed for a trend line.</p>
          )}
          <LineChart points={timeline.scansWithDelta.map((e) => ({ label: formatDate(e.scan.created_at), value: e.scan.acne_score }))} />
        </div>
      )}

      {/* Scan cards (newest first) */}
      <div style={{ fontSize: '12px', fontWeight: '800', color: t.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {scans.length > 0 ? `${scans.length} scan${scans.length > 1 ? 's' : ''} recorded` : ''}
      </div>
      {[...timeline.scansWithDelta].reverse().map((entry) => (
        <ScanCard
          key={entry.scan.id}
          entry={entry}
          thumb={thumbs[entry.scan.id]}
          isOpen={open === entry.scan.id}
          onToggle={() => setOpen(open === entry.scan.id ? null : entry.scan.id)}
        />
      ))}

      {hasThumbs && (
        <div style={{ ...cardStyle(t), fontSize: '12px', color: t.muted, lineHeight: 1.55 }}>
          Photo previews are stored only on this phone.
          <div style={{ marginTop: '8px' }}>
            <button style={ghostBtn(t)} onClick={clearThumbs}>Delete previews from this phone</button>
          </div>
        </div>
      )}
    </div>
  );
}
