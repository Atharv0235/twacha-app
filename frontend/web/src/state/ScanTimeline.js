/**
 * ScanTimeline.js
 * Pure-function helpers for the 30-day skin journey feature.
 *
 * Scan frequency: every 3-4 days (alternating: 3, 4, 3, 4, …)
 * The gap for scan N (1-based) = 3 if N is odd, 4 if N is even.
 * Example with first scan Oct 24:
 *   Scan 1 — Oct 24
 *   Scan 2 — Oct 27  (+3)
 *   Scan 3 — Oct 31  (+4)
 *   Scan 4 — Nov 3   (+3)
 *   Scan 5 — Nov 7   (+4)
 *   …   (≈8 scans total over 30 days)
 *   Journey ends Nov 23
 */

/** Scan frequency schedule (exported so UI can display it) */
export const SCAN_FREQ_DAYS = [3, 4]; // alternates

/** Gap (days) before the NEXT scan, given N scans already done (0-based idx → gap) */
export function nextGap(completedScans) {
  // completedScans=1 → gap=3, =2 → gap=4, =3 → gap=3 …
  return SCAN_FREQ_DAYS[(completedScans - 1) % SCAN_FREQ_DAYS.length];
}

/** Return a Date at midnight local time */
export function midnight(d) {
  const dt = d instanceof Date ? new Date(d) : new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

/** Days between two dates, positive if b is after a */
export function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((midnight(b) - midnight(a)) / msPerDay);
}

/** Format a Date as "24 Oct" */
export function fmtDay(d) {
  return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/** Format a Date as "Mon, 24 Oct" */
export function fmtDayFull(d) {
  return new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Hydration % derived from dryness score (0-10) */
export function drynessToHydration(dryness) {
  return Math.round(Math.max(10, Math.min(95, 100 - dryness * 9)));
}

/**
 * Build the projected full scan schedule from a start date.
 * Returns an array of { scanNumber, date, gap } for all ~8 scheduled scans.
 */
export function buildSchedule(firstScanDate, journeyEndDate) {
  const schedule = [{ scanNumber: 1, date: midnight(firstScanDate), gap: null }];
  let current = midnight(firstScanDate);
  let scanNum = 1;
  while (true) {
    const gap = nextGap(scanNum);
    const next = new Date(current);
    next.setDate(next.getDate() + gap);
    if (next > journeyEndDate) break;
    scanNum++;
    schedule.push({ scanNumber: scanNum, date: midnight(next), gap });
    current = midnight(next);
  }
  return schedule;
}

/**
 * Build the full 30-day timeline from API scan list (newest first).
 */
export function buildTimeline(scans) {
  const today = midnight(new Date());
  const empty = {
    firstScanDate: null, journeyEndDate: null, totalDays: 30, today,
    daysElapsed: 0, daysRemaining: 30, progressPct: 0,
    nextScanDate: null, daysUntilNextScan: null, isNextScanDue: false,
    nextScanGap: null,
    scansWithDelta: [], milestones: [], schedule: [],
    completedScans: 0, journeyActive: false,
  };

  if (!scans || scans.length === 0) return empty;

  // chronological: oldest first
  const chrono = [...scans].reverse();
  const firstScanDate = midnight(chrono[0].created_at);
  const journeyEndDate = new Date(firstScanDate);
  journeyEndDate.setDate(journeyEndDate.getDate() + 30);
  const daysElapsed = Math.min(30, Math.max(0, daysBetween(firstScanDate, today)));
  const daysRemaining = Math.max(0, 30 - daysElapsed);
  const progressPct = Math.round((daysElapsed / 30) * 100);
  const journeyActive = today <= journeyEndDate;

  // Projected schedule (all scans planned for the 30 days)
  const schedule = buildSchedule(firstScanDate, journeyEndDate);

  // Scans with delta vs previous
  const scansWithDelta = chrono.map((scan, idx) => {
    const prev = idx > 0 ? chrono[idx - 1] : null;
    const dayNumber = daysBetween(firstScanDate, midnight(scan.created_at)) + 1;
    const hydration = drynessToHydration(scan.dryness_score);
    const prevHydration = prev ? drynessToHydration(prev.dryness_score) : null;

    let delta = null;
    let comparison = 'baseline';
    if (prev) {
      const acneDiff = prev.acne_score - scan.acne_score;
      const rednessDiff = prev.redness_score - scan.redness_score;
      const drynessLower = prev.dryness_score - scan.dryness_score;
      const hydrationGain = hydration - prevHydration;
      delta = {
        acne: { diff: acneDiff, prev: prev.acne_score, curr: scan.acne_score },
        redness: { diff: rednessDiff, prev: prev.redness_score, curr: scan.redness_score },
        dryness: { diff: drynessLower, prev: prev.dryness_score, curr: scan.dryness_score },
        hydration: { diff: hydrationGain, prev: prevHydration, curr: hydration },
      };
      if (acneDiff > 0.15) comparison = 'improved';
      else if (acneDiff < -0.15) comparison = 'worsened';
      else comparison = 'stable';
    }
    return { scan, delta, dayNumber, isFirst: idx === 0, comparison, hydration };
  });

  // Next scan date: gap alternates 3/4 based on how many scans done
  const mostRecentScan = chrono[chrono.length - 1];
  let nextScanDate = null;
  let daysUntilNextScan = null;
  let isNextScanDue = false;
  let nextScanGap = null;

  if (journeyActive) {
    const gap = nextGap(scans.length);
    nextScanGap = gap;
    const nextDt = midnight(mostRecentScan.created_at);
    nextDt.setDate(nextDt.getDate() + gap);
    if (nextDt <= journeyEndDate) {
      nextScanDate = nextDt;
      daysUntilNextScan = daysBetween(today, nextDt);
      isNextScanDue = today >= nextDt;
    }
  }

  // Milestones at days 1, 7, 14, 21, 30
  const milestones = [1, 7, 14, 21, 30].map((dayN) => {
    const mDate = new Date(firstScanDate);
    mDate.setDate(mDate.getDate() + (dayN - 1));
    const reached = today >= mDate;
    const hasScan = scansWithDelta.some((s) => Math.abs(s.dayNumber - dayN) <= 2);
    return { dayN, date: mDate, reached, hasScan, label: dayN === 1 ? 'Start' : dayN === 30 ? '30-Day Goal' : `Day ${dayN}` };
  });

  return {
    firstScanDate, journeyEndDate, totalDays: 30, today,
    daysElapsed, daysRemaining, progressPct,
    nextScanDate, daysUntilNextScan, isNextScanDue, nextScanGap,
    scansWithDelta, milestones, schedule,
    completedScans: scans.length, journeyActive,
  };
}

/** Emoji + word summary for comparison */
export function comparisonSummary(comparison) {
  switch (comparison) {
    case 'improved': return { emoji: '📈', word: 'Improved', color: '#10b981' };
    case 'worsened': return { emoji: '📉', word: 'Needs attention', color: '#dc2626' };
    case 'stable':   return { emoji: '➡️', word: 'Stable', color: '#d97706' };
    default:         return { emoji: '🌱', word: 'Baseline', color: '#0ea5e9' };
  }
}

/** Delta label for a metric — positive diff = improved */
export function metricDeltaLabel(diff, unit = '') {
  if (Math.abs(diff) < 0.05) return { text: '→ No change', color: '#88938a' };
  if (diff > 0) return { text: `↓ ${Math.abs(diff).toFixed(1)}${unit} better`, color: '#10b981' };
  return { text: `↑ ${Math.abs(diff).toFixed(1)}${unit} higher`, color: '#dc2626' };
}

/** Smart reminder message — clearly states the 3/4-day frequency */
export function reminderMessage(timeline) {
  const { isNextScanDue, daysUntilNextScan, nextScanDate, daysRemaining, completedScans, nextScanGap } = timeline;
  if (!nextScanDate) return null;
  const freqNote = nextScanGap ? ` (every ${SCAN_FREQ_DAYS.join('-')} days)` : '';
  if (isNextScanDue) {
    return {
      urgent: true,
      title: `Scan ${completedScans + 1} is due now! 📸`,
      body: `Your 3-4 day check-in is ready. ${daysRemaining} days left in your 30-day journey.`,
    };
  }
  if (daysUntilNextScan === 0) {
    return {
      urgent: true,
      title: `Scan ${completedScans + 1} due today! 📸`,
      body: `Your ${nextScanGap}-day check-in window opens today. ${daysRemaining} days left.`,
    };
  }
  if (daysUntilNextScan === 1) {
    return {
      urgent: false,
      title: `Next scan tomorrow (${fmtDay(nextScanDate)})`,
      body: `Scan ${completedScans + 1} in 1 day · scanning every 3-4 days · ${daysRemaining} days left`,
    };
  }
  return {
    urgent: false,
    title: `Next scan in ${daysUntilNextScan} days`,
    body: `Scan ${completedScans + 1} on ${fmtDayFull(nextScanDate)} · every 3-4 days · ${daysRemaining} days left`,
  };
}
