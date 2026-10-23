import React, { useState, useEffect, useMemo } from 'react';
import { Bell, Wind, ArrowUpRight, Activity, Calendar } from 'lucide-react';
import { useAppData } from '../../state/AppData';
import { THEMES, cardStyle, scoreColor, scoreWord, GOOD, WARN } from './ui';
import { WAQI_CREDIT } from '../../config';
import { TodayCard, PlanButton } from './Plan';
import { CITIES_AQI } from '../../data/mockData';
import { buildTimeline, reminderMessage, fmtDay, fmtDayFull } from '../../state/ScanTimeline';
import {
  CartoonBush,
  CartoonPetal,
  CartoonFlower,
  CartoonSprout,
  CartoonAvocado,
  CartoonStrawberry,
  CartoonCitrus,
  CartoonTeaCup,
  CartoonSaladBowl,
  CartoonBannerDecor,
  FloatingPetalBadge,
} from './BotanicalDoodles';

const t = THEMES.light;

function aqiColor(band) {
  if (!band) return GOOD;
  const b = band.toLowerCase();
  if (b.includes('good') || b.includes('satisfactory')) return '#f59e0b';
  if (b.includes('moderate')) return WARN;
  return '#DC2626';
}

const REMEDY_CARDS = [
  { id: 'clay-mask', title: 'Homemade Clay Mask', condition: '(Oily & Acne-Prone Skin)', ingredients: 'Oats & Honey', category: 'Face', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80' },
  { id: 'herbal-balm', title: 'Herbal Nourishing Balm', condition: '(Sensitized & Redness-Prone Skin)', ingredients: 'Calendula & Aloe', category: 'Remedies', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80' },
  { id: 'turmeric-paste', title: 'Turmeric & Besan Glow Paste', condition: '(Dull Skin & Post-Blemish Marks)', ingredients: 'Curcuma & Gram Flour', category: 'Remedies', image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80' },
  { id: 'aloe-gel', title: 'Aloe & Cucumber Cryo-Gel', condition: '(Dehydrated & Sun-Exposed Skin)', ingredients: 'Pure Botanical Active', category: 'Face', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80' },
  { id: 'anti-acne-bowl', title: 'Anti-Inflammatory Bowl', condition: '(Low Glycemic · Sebum Control)', ingredients: 'Foxtail Millet · Moong · Greens', category: 'Diet', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { id: 'spearmint-tea', title: 'Spearmint Infusion', condition: '(Anti-Androgenic · Follicular Balance)', ingredients: 'Mentha spicata · Green Tea', category: 'Ingredients', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
];

function RemedyDoodle({ id, size = 18 }) {
  switch (id) {
    case 'clay-mask': return <CartoonBush size={size} />;
    case 'herbal-balm': return <CartoonFlower size={size} />;
    case 'turmeric-paste': return <CartoonPetal size={size} rotate={20} />;
    case 'aloe-gel': return <CartoonSprout size={size} />;
    case 'anti-acne-bowl': return <CartoonSaladBowl size={size} />;
    case 'spearmint-tea': return <CartoonTeaCup size={size} />;
    default: return <CartoonFlower size={size} />;
  }
}

const FILTER_TABS = ['All', 'Face', 'Remedies', 'Ingredients', 'Diet'];

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: '700',
      border: 'none', backgroundColor: active ? '#19231c' : '#f0ede6',
      color: active ? '#ffffff' : '#5e6d64', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', gap: '4px'
    }}>
      <span>{label}</span>
      {label === 'Diet' && <CartoonAvocado size={14} />}
      {label === 'Remedies' && <CartoonTeaCup size={14} />}
      {label === 'Face' && <CartoonFlower size={13} />}
    </button>
  );
}

function RemedyCard({ card }) {
  return (
    <div style={{
      borderRadius: '18px', overflow: 'hidden', backgroundColor: '#fff',
      border: '1px solid #e9e4d8', flex: '1 1 46%', minWidth: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative'
    }}>
      <div style={{ position: 'relative', height: '148px', overflow: 'hidden', backgroundColor: '#f5f0ea' }}>
        <img src={card.image} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px',
          borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.94)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#19231c', boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          <ArrowUpRight size={14} color="#19231c" strokeWidth={2.4} />
        </div>
        {/* Subtle cute cartoonish doodle pill on remedy photo */}
        <div style={{
          position: 'absolute', bottom: '8px', left: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(4px)',
          borderRadius: '99px', padding: '2px 7px', display: 'flex', alignItems: 'center', gap: '3px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <RemedyDoodle id={card.id} size={13} />
          <span style={{ fontSize: '9px', fontWeight: '800', color: '#2d5a3e' }}>{card.category}</span>
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px', marginBottom: '2px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#19231c', lineHeight: 1.3 }}>{card.title}</div>
          <RemedyDoodle id={card.id} size={16} />
        </div>
        <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#5e6d64', marginBottom: '3px', lineHeight: 1.3 }}>{card.condition}</div>
        <div style={{ fontSize: '11px', color: '#88938a' }}>{card.ingredients}</div>
      </div>
    </div>
  );
}

function UnifiedHeroScheduleBlock({ hasScan, timeline, go, onOpenNotif }) {
  const { nextScanDate, daysUntilNextScan, isNextScanDue, daysElapsed, daysRemaining, completedScans, nextScanGap } = timeline;
  const isDue = isNextScanDue || daysUntilNextScan === 0;
  const isTomorrow = daysUntilNextScan === 1;

  return (
    <div style={{
      margin: '0 12px 14px',
      borderRadius: '22px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f0e8 0%, #ede8da 100%)',
      border: '1.5px solid #ded8cb',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ── TOP PART (HERO BANNER) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '128px',
        position: 'relative'
      }}>
        <div style={{ flex: 1, padding: '16px 14px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="font-serif" style={{ fontSize: '18px', fontWeight: '800', color: '#19231c', lineHeight: 1.25, marginBottom: '4px' }}>
              {hasScan ? 'Glowing skin deserves natural care' : 'Discover your personalized skin care'}
            </div>
            <div style={{ fontSize: '11.5px', color: '#5e6d64', lineHeight: 1.4, marginBottom: '10px' }}>
              {hasScan ? 'Analyze your skin for a custom homemade remedy.' : 'Take your first face scan to unlock clinical biomarker analysis.'}
            </div>
          </div>
          <button onClick={() => go('scan')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#19231c', color: '#ffffff',
            border: 'none', borderRadius: '99px', padding: '7px 16px', fontSize: '11.5px', fontWeight: '700',
            cursor: 'pointer', alignSelf: 'flex-start', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(25, 35, 28, 0.2)'
          }}>
            {hasScan ? 'Check Your Skin →' : 'Start First Scan →'}
          </button>
        </div>
        <div style={{ width: '124px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
            alt="skin care"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)',
            borderRadius: '99px', padding: '2px 7px', display: 'flex', alignItems: 'center', gap: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <CartoonBush size={16} />
            <CartoonPetal size={13} rotate={20} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM PART (NEXT SCAN SCHEDULED) - IN SAME UPPER THEME BG ── */}
      {nextScanDate ? (
        <div style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '14px 16px 14px',
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.28)'
        }}>
          {/* Subtle cartoon flower & petal in corner */}
          <div style={{ position: 'absolute', top: '12px', right: '14px', display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
            <CartoonFlower size={18} />
            <CartoonPetal size={14} rotate={18} />
          </div>

          {/* Top Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', paddingRight: '48px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px',
              color: '#15803d', backgroundColor: '#fff',
              padding: '3px 9px', borderRadius: '99px', border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <Calendar size={11} /> Next Scan Scheduled
            </span>
            <span style={{
              fontSize: '10px', fontWeight: '700', color: '#854d0e',
              backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: '99px',
              border: '1px solid #fde68a'
            }}>
              ⚡ Every 3–4 Days
            </span>
          </div>

          {/* Scheduled Date Main */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#19231c', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                {fmtDayFull(nextScanDate)}
              </div>
              <div style={{ fontSize: '11.5px', color: '#5e6d64', marginTop: '3px' }}>
                {isDue
                  ? '📸 Your 3-4 day check-in window is open today!'
                  : isTomorrow
                  ? `Tomorrow (in 1 day) · Scan ${completedScans + 1} of ~8`
                  : `In ${daysUntilNextScan} days · Scan ${completedScans + 1} of ~8 (${nextScanGap || 3}-day cadence)`}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          padding: '14px 16px',
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.28)'
        }}>
          <div style={{ position: 'absolute', top: '12px', right: '14px', display: 'flex', gap: '4px' }}>
            <CartoonSprout size={18} />
            <CartoonPetal size={14} rotate={15} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Calendar size={11} /> 30-Day Scan Schedule
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#19231c', marginBottom: '3px' }}>
            Scan scheduled every 3–4 days
          </div>
          <div style={{ fontSize: '11.5px', color: '#6d7b71', lineHeight: 1.45 }}>
            Complete your baseline scan above to start your 30-day journey. Your next check-in will automatically schedule in 3 days!
          </div>
        </div>
      )}
    </div>
  );
}




export default function HomeTab({ go, onOpenNotif }) {
  const { user, profile, lastScan, history, historyError, refreshHistory, plan, refreshPlan } = useAppData();
  const [filter, setFilter] = useState('All');
  const scans = useMemo(() => history?.scans || [], [history]);
  const timeline = useMemo(() => buildTimeline(scans), [scans]);

  // Keep dashboard data synchronized with backend on mount
  useEffect(() => {
    refreshHistory();
    refreshPlan();
  }, [refreshHistory, refreshPlan]);

  // Program & day tracking from backend
  const program = history?.program;
  const currentProgramDay = program ? Math.min(program.current_day, program.total_days) : null;

  // Data strictly from backend API (GET /api/history/ and POST /api/scan/)
  const backendScans = history?.scans || [];
  const hasHistoryLoaded = history !== null;

  // The recent scan is taken strictly from backend:
  // If backend history has returned, use the latest scan from the database.
  // If user just completed a scan in this session, use the backend scan response.
  const recentScan = backendScans.length > 0
    ? backendScans[0]
    : (lastScan?.scan && typeof lastScan.scan.id === 'number' ? lastScan.scan : null);

  // If backend has confirmed 0 scans in history, strictly false
  const hasScan = Boolean(
    recentScan &&
    typeof recentScan.acne_score === 'number' &&
    (!hasHistoryLoaded || backendScans.length > 0 || lastScan?.scan?.id === recentScan.id)
  );

  // Environment / AQI strictly from backend
  const env = lastScan?.environment;
  const userCity = profile?.city || user?.city || '';
  const cityMatch = userCity ? CITIES_AQI.find(c => c.city.toLowerCase() === userCity.toLowerCase()) : null;
  const showAqi = env ? env.source !== 'unavailable' : Boolean(cityMatch || recentScan?.local_aqi);

  const aqiData = env && env.source !== 'unavailable'
    ? {
        city: env.city || userCity || 'Local',
        aqi: env.local_aqi,
        band: (env.aqi_band || '').replace('_', ' '),
        dominant: env.dominant_pollutant,
        advice: ''
      }
    : recentScan?.local_aqi
      ? {
          city: userCity || 'Local',
          aqi: recentScan.local_aqi,
          band: recentScan.local_aqi <= 50 ? 'good' : recentScan.local_aqi <= 100 ? 'satisfactory' : 'moderate',
          dominant: 'pm25',
          advice: ''
        }
      : (cityMatch || CITIES_AQI[1]);

  const aqiHighlightColor = aqiColor(aqiData.band);

  // User details strictly from backend
  const userName = profile?.name || user?.name || user?.email?.split('@')[0] || 'Friend';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  // Biomarker metrics strictly from backend: only populated when real backend scan exists
  const acneScore = hasScan && typeof recentScan.acne_score === 'number' ? recentScan.acne_score : null;
  const rednessScore = hasScan && typeof recentScan.redness_score === 'number' ? recentScan.redness_score : null;
  const drynessScore = hasScan && typeof recentScan.dryness_score === 'number' ? recentScan.dryness_score : null;
  const hydration = hasScan && drynessScore !== null
    ? Math.round(Math.max(10, Math.min(95, 100 - drynessScore * 9)))
    : null;
  const itaValue = hasScan && recentScan.ita_value !== null && recentScan.ita_value !== undefined
    ? `${recentScan.ita_value > 0 ? '+' : ''}${Math.round(recentScan.ita_value)}°`
    : null;

  const itaBand = hasScan
    ? (recentScan.ita_value !== null && recentScan.ita_value !== undefined
        ? (recentScan.ita_value > 45 ? 'ITA Light' : recentScan.ita_value > 28 ? 'ITA Medium' : recentScan.ita_value > 10 ? 'ITA Warm' : 'ITA Deep')
        : (acneScore < 3 ? 'ITA Medium' : 'ITA Warm'))
    : null;

  // Real delta computed strictly from backend history:
  let acneDeltaText = 'No scan yet';
  let acneDeltaColor = '#88938a';
  if (hasScan) {
    if (backendScans.length >= 2 && typeof backendScans[1].acne_score === 'number') {
      const prevAcne = backendScans[1].acne_score;
      const diff = prevAcne - acneScore;
      if (diff > 0.05) {
        acneDeltaText = `↓${diff.toFixed(1)} ${scoreWord(acneScore)}`;
        acneDeltaColor = GOOD;
      } else if (diff < -0.05) {
        acneDeltaText = `↑${Math.abs(diff).toFixed(1)} ${scoreWord(acneScore)}`;
        acneDeltaColor = WARN;
      } else {
        acneDeltaText = `→ ${scoreWord(acneScore)}`;
        acneDeltaColor = '#88938a';
      }
    } else {
      acneDeltaText = `${scoreWord(acneScore)} · Baseline`;
      acneDeltaColor = GOOD;
    }
  }

  const scanDay = hasScan ? (recentScan.day_number ?? currentProgramDay ?? 1) : null;
  const scanDate = hasScan && recentScan.created_at ? new Date(recentScan.created_at) : null;
  const scanDateText = scanDate
    ? (Math.abs(Date.now() - scanDate.getTime()) < 24 * 3600 * 1000 ? 'Today' : scanDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
    : 'Recently';

  const statusBadge = hasScan
    ? (acneScore < 3 ? 'Optimal Balance' : acneScore < 6 ? 'Improving' : 'Needs Care')
    : 'Awaiting First Scan';
  const statusBadgeColor = hasScan
    ? (acneScore < 3 ? '#16a34a' : acneScore < 6 ? '#d97706' : '#dc2626')
    : '#b45309';
  const statusBadgeBg = hasScan
    ? (acneScore < 3 ? '#f0fdf4' : acneScore < 6 ? '#fffbeb' : '#fef2f2')
    : '#fffbeb';
  const statusBadgeBorder = hasScan
    ? (acneScore < 3 ? '#bbf7d0' : acneScore < 6 ? '#fde68a' : '#fecaca')
    : '#fde68a';
  const statusDotColor = hasScan
    ? (acneScore < 3 ? '#22c55e' : acneScore < 6 ? '#f59e0b' : '#ef4444')
    : '#f59e0b';

  // Real assessment from backend recent scan analyst output:
  let assessmentText = '';
  if (hasScan) {
    const topRec = lastScan?.recommendations?.[0];
    const recExplanation = topRec?.nutrient_explanation || topRec?.body;
    if (recExplanation) {
      assessmentText = `Acne severity scored ${acneScore.toFixed(1)}/10 (${scoreWord(acneScore)}) with ${scoreWord(rednessScore).toLowerCase()} redness. ${showAqi ? `Ambient air in ${aqiData.city} is AQI ${aqiData.aqi} (${aqiData.band}). ` : ''}${recExplanation}`;
    } else {
      assessmentText = `Acne severity scored ${acneScore.toFixed(1)}/10 (${scoreWord(acneScore)}) with ${scoreWord(rednessScore).toLowerCase()} redness. ${showAqi ? `Ambient air in ${aqiData.city} is AQI ${aqiData.aqi} (${aqiData.band}). ` : ''}Targeted botanical formulations and Indian dietary foods below are prioritized to restore your skin barrier.`;
    }
  } else {
    assessmentText = `Welcome to Twacha! Complete your first clinical face scan to analyze facial biomarkers (acne severity, erythema redness, hydration barrier, and skin tone). Your personalized Ayurvedic botanical remedies and dietary recommendations will automatically appear here.`;
  }

  const filteredCards = filter === 'All' ? REMEDY_CARDS : REMEDY_CARDS.filter(c => c.category === filter);

  const nextScanMsg = reminderMessage(timeline);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', color: t.text }}>

      {/* HEADER WITH CUTE BOTANICAL ACCENTS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px 10px', position: 'relative' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
          border: '2px solid #e9e4d8', background: 'linear-gradient(135deg, #4a7c59, #2d5a3e)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#d9fb48' }}>{initials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-serif" style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>Hello {userName}!</span>
            <CartoonFlower size={16} />
            <CartoonPetal size={13} rotate={15} />
          </div>
          <div style={{ fontSize: '12px', color: t.faint }}>
            {hasScan ? `Day ${scanDay} of 30 · Let's take care of your skin` : `Let's start your skin journey`}
          </div>
        </div>
        <button
          onClick={() => onOpenNotif && onOpenNotif()}
          aria-label="Scan Notifications"
          title="Scan Notifications"
          style={{
            width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #e9e4d8',
            backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}
        >
          <Bell size={17} color={t.muted} />
          {timeline.nextScanDate && (
            <span style={{
              position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px',
              borderRadius: '50%', backgroundColor: timeline.isNextScanDue ? '#dc2626' : '#ff6b00',
              border: '1.5px solid #fff', boxShadow: '0 0 4px #ff6b00'
            }} />
          )}
        </button>
      </div>

      {/* UNIFIED HERO (TOP) & NEXT SCAN SCHEDULE (BOTTOM) BLOCK */}
      <UnifiedHeroScheduleBlock hasScan={hasScan} timeline={timeline} go={go} onOpenNotif={onOpenNotif} />

      {/* YOUR CURRENT SKIN */}
      <div style={{
        margin: '0 12px 12px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        border: '1px solid #e9e4d8',
        borderTop: '3.5px solid #2d5a3e',
        padding: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        position: 'relative'
      }}>
        {/* Subtle watermark flower in background */}
        <div style={{ position: 'absolute', top: '14px', right: '120px', opacity: 0.35, pointerEvents: 'none' }}>
          <CartoonFlower size={18} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={14} color={GOOD} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#19231c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Your Current Skin</span>
                <CartoonSprout size={15} />
              </div>
              <div style={{ fontSize: '10px', color: '#88938a' }}>
                {hasScan ? `AI Biomarker Analysis • Scanned ${scanDateText} (Day ${scanDay})` : 'AI Biomarker Analysis • No scan completed yet'}
              </div>
            </div>
          </div>
          <div style={{
            backgroundColor: statusBadgeBg,
            border: `1px solid ${statusBadgeBorder}`,
            borderRadius: '99px',
            padding: '5px 10px',
            fontSize: '10px',
            fontWeight: '800',
            color: statusBadgeColor,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusDotColor, display: 'inline-block' }} />
            {statusBadge}
          </div>
        </div>


        {/* 4 SCORES: REAL FROM SCAN ANALYST OR EMPTY PLACEHOLDER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '14px' }}>
          {/* ACNE SCORE */}
          <div style={{ textAlign: 'center', backgroundColor: '#faf7f2', border: '1px solid #ece5d8', borderRadius: '12px', padding: '10px 4px 8px' }}>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#88938a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>ACNE SCORE</div>
            {hasScan ? (
              <>
                <div style={{ fontSize: '17px', fontWeight: '900', color: scoreColor(acneScore), lineHeight: 1 }}>
                  {acneScore.toFixed(1)}<span style={{ fontSize: '9px', color: '#88938a', fontWeight: '600' }}>/10</span>
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: acneDeltaColor, marginTop: '3px' }}>
                  {acneDeltaText}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#88938a', lineHeight: 1 }}>--</div>
                <div style={{ fontSize: '9px', fontWeight: '600', color: '#88938a', marginTop: '3px' }}>Scan to evaluate</div>
              </>
            )}
          </div>

          {/* HYDRATION */}
          <div style={{ textAlign: 'center', backgroundColor: '#faf7f2', border: '1px solid #ece5d8', borderRadius: '12px', padding: '10px 4px 8px' }}>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#88938a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>HYDRATION</div>
            {hasScan ? (
              <>
                <div style={{ fontSize: '17px', fontWeight: '900', color: '#0ea5e9', lineHeight: 1 }}>
                  {hydration}%
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: '#0ea5e9', marginTop: '3px' }}>
                  {hydration >= 70 ? 'High Barrier' : hydration >= 50 ? 'Moderate' : 'Low Barrier'}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#88938a', lineHeight: 1 }}>--</div>
                <div style={{ fontSize: '9px', fontWeight: '600', color: '#88938a', marginTop: '3px' }}>Scan to measure</div>
              </>
            )}
          </div>

          {/* REDNESS */}
          <div style={{ textAlign: 'center', backgroundColor: '#faf7f2', border: '1px solid #ece5d8', borderRadius: '12px', padding: '10px 4px 8px' }}>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#88938a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>REDNESS</div>
            {hasScan ? (
              <>
                <div style={{ fontSize: '17px', fontWeight: '900', color: '#0d9488', lineHeight: 1 }}>
                  {rednessScore.toFixed(1)}<span style={{ fontSize: '9px', color: '#88938a', fontWeight: '600' }}>/10</span>
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: '#0d9488', marginTop: '3px' }}>
                  {rednessScore < 2.5 ? 'Calm' : scoreWord(rednessScore)}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#88938a', lineHeight: 1 }}>--</div>
                <div style={{ fontSize: '9px', fontWeight: '600', color: '#88938a', marginTop: '3px' }}>Scan to detect</div>
              </>
            )}
          </div>

          {/* SKIN TONE */}
          <div style={{ textAlign: 'center', backgroundColor: '#faf7f2', border: '1px solid #ece5d8', borderRadius: '12px', padding: '10px 4px 8px' }}>
            <div style={{ fontSize: '9px', fontWeight: '700', color: '#88938a', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>SKIN TONE</div>
            {hasScan ? (
              <>
                <div style={{ fontSize: '17px', fontWeight: '900', color: '#d97706', lineHeight: 1 }}>
                  {itaValue}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '700', color: '#d97706', marginTop: '3px' }}>
                  {itaBand}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#88938a', lineHeight: 1 }}>--</div>
                <div style={{ fontSize: '9px', fontWeight: '600', color: '#88938a', marginTop: '3px' }}>Scan for ITA°</div>
              </>
            )}
          </div>
        </div>

        {/* ANALYST ASSESSMENT BLOCK */}
        <div style={{ backgroundColor: '#fffbeb', borderRadius: '14px', padding: '12px', border: '1px solid #fde68a', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>✦</span>
            <p style={{ fontSize: '11.5px', color: '#5e6d64', lineHeight: 1.55, margin: 0 }}>
              <span style={{ fontWeight: '800', color: '#19231c' }}>Current Analyst Assessment: </span>
              {assessmentText}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => go('scan')} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '11px 8px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            backgroundColor: '#19231c', color: '#ffffff',
            fontSize: '12.5px', fontWeight: '700', fontFamily: 'inherit',
            whiteSpace: 'nowrap', letterSpacing: '0.1px',
            boxShadow: '0 2px 6px rgba(25,35,28,0.2)'
          }}>
            {hasScan ? 'New Face Scan' : 'Start First Scan'}
          </button>
          <button onClick={() => go('timeline')} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '11px 8px', borderRadius: '12px',
            border: '1.5px solid #2d5a3e', cursor: 'pointer',
            backgroundColor: '#2d5a3e', color: '#ffffff',
            fontSize: '12.5px', fontWeight: '700', fontFamily: 'inherit',
            whiteSpace: 'nowrap', letterSpacing: '0.1px',
            boxShadow: '0 2px 6px rgba(45,90,62,0.18)'
          }}>
            30-Day Journey
          </button>
        </div>
      </div>

      {/* SCAN ANALYST FOOD TARGETS (WHEN RECOMMENDATIONS EXIST FROM BACKEND) */}
      {hasScan && lastScan?.recommendations?.length > 0 && (
        <div style={{ margin: '0 12px 12px', ...cardStyle(t), position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CartoonSaladBowl size={18} />
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#19231c' }}>Scan analyst food targets</div>
            </div>
            <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: '700', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '99px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <CartoonSprout size={12} /> Active recommendations
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lastScan.recommendations.slice(0, 2).map((rec) => (
              <div key={rec.nutrient_key} style={{ backgroundColor: '#faf7f2', padding: '10px 12px', borderRadius: '12px', border: '1px solid #ece5d8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#19231c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CartoonAvocado size={14} />
                    <span>{rec.title}</span>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', padding: '2px 7px', borderRadius: '99px', backgroundColor: '#e9e4d8', color: '#5e6d64' }}>
                    {rec.evidence_tier}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#5e6d64', marginTop: '3px', lineHeight: 1.4 }}>
                  {rec.nutrient_explanation || rec.body}
                </div>
                {rec.foods_to_add?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '7px' }}>
                    {rec.foods_to_add.slice(0, 3).map((f) => (
                      <span key={f.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', backgroundColor: '#fff', border: '1px solid #ded6c6', borderRadius: '99px', padding: '2px 8px', color: '#19231c' }}>
                        <CartoonStrawberry size={12} />
                        <span>+ {f.name}</span>
                        <PlanButton food={f.name} kind="try" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <div style={{ padding: '0 12px 10px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          {FILTER_TABS.map(f => <FilterPill key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />)}
        </div>
      </div>

      {/* 2-COLUMN REMEDY GRID */}
      <div style={{ padding: '0 12px 12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {filteredCards.map(card => <RemedyCard key={card.id} card={card} />)}
        </div>
      </div>

      {historyError && (
        <div style={{ margin: '0 12px 12px', ...cardStyle(t), fontSize: '13px' }}>
          Could not load history: {historyError} <button onClick={refreshHistory} style={{ background: 'none', border: 'none', color: t.accent, fontWeight: '700', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      <div style={{ padding: '0 12px 12px' }}><TodayCard go={go} /></div>

      <div style={{ margin: '0 12px 12px', ...cardStyle(t), display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <Wind size={20} color={aqiHighlightColor} style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ position: 'absolute', top: '-6px', right: '-8px' }}>
            <CartoonPetal size={12} rotate={25} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '800' }}>Air quality <span style={{ color: aqiHighlightColor }}>{aqiData.aqi} · {aqiData.band}</span>{!showAqi && <span style={{ marginLeft: '6px', fontSize: '9px', padding: '1px 6px', borderRadius: '99px', backgroundColor: WARN, color: '#fff', fontWeight: '700' }}>DEMO</span>}</div>
          <div style={{ fontSize: '11px', color: t.muted, marginTop: '2px' }}>{aqiData.city && `${aqiData.city} · `}Dominant: {aqiData.dominant}</div>
          {aqiData.advice && <div style={{ fontSize: '10px', color: t.faint, marginTop: '4px', lineHeight: 1.4 }}>{aqiData.advice}</div>}
          <div style={{ fontSize: '9px', color: t.faint, marginTop: '4px' }}>{WAQI_CREDIT}</div>
        </div>
      </div>

    </div>
  );
}


