import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Home, Camera, TrendingUp, BookOpen, User, ArrowLeft, Bell } from 'lucide-react';
import { AppDataProvider, useAppData } from '../state/AppData';
import { wake } from '../api/client';
import Splash from './app/Splash';
import AuthScreen from './app/AuthScreen';
import HomeTab from './app/HomeTab';
import ScanTab from './app/ScanTab';
import TimelineTab from './app/TimelineTab';
import DietTab from './app/DietTab';
import AboutTab from './app/AboutTab';
import NotificationModal from './app/NotificationModal';
import { buildTimeline } from '../state/ScanTimeline';
import { CartoonFlower, CartoonPetal } from './app/BotanicalDoodles';

const MIN_SPLASH_MS = 1800;

function useIsMobileScreen() {
  const calc = () => typeof window !== 'undefined' && (
    window.innerWidth <= 820 ||
    !!window.Capacitor ||
    window.location.protocol === 'capacitor:' ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '')
  );
  const [mobile, setMobile] = useState(calc);
  useEffect(() => {
    const h = () => setMobile(calc());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

function NavButton({ active, onClick, title, children, badge = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-current={active ? 'page' : undefined}
      style={{
        background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
        color: active ? '#ff6b00' : 'rgba(255, 255, 255, 0.65)', cursor: 'pointer', padding: '6px', position: 'relative'
      }}
    >
      {children}
      {badge && (
        <span style={{
          position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px',
          borderRadius: '50%', backgroundColor: '#ff6b00', border: '1.5px solid #19231c',
          boxShadow: '0 0 6px rgba(255, 107, 0, 0.8)'
        }} />
      )}
    </button>
  );
}

function AppShell({ onOpenLegal, mobile }) {
  const { user, sessionKey, history } = useAppData();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('Starting up...');
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Compute pending scan reminder from timeline
  const scans = history?.scans || [];
  const timeline = useMemo(() => buildTimeline(scans), [scans]);
  const hasPendingReminder = Boolean(timeline.nextScanDate);

  // The selected tab belongs to one login session, so every new login starts on Home (derived, no effect needed).
  const [tabState, setTabState] = useState({ session: 0, tab: 'home' });
  const tab = tabState.session === sessionKey ? tabState.tab : 'home';
  const scroller = useRef(null);

  // Splash: the progress bar follows the real server wake-up (free hosting sleeps).
  useEffect(() => {
    if (ready) return undefined;
    let cancelled = false;
    setFailed(false); setProgress(0); setPhaseText('Starting up...');
    const started = Date.now();
    const ticker = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 1.5, 90);
        const secs = (Date.now() - started) / 1000;
        setPhaseText(secs > 4 ? 'Waking the server. Free hosting can take up to a minute...' : 'Connecting to the Twacha server...');
        return next;
      });
    }, 75);
    wake(60000).then((ok) => {
      const wait = Math.max(0, MIN_SPLASH_MS - (Date.now() - started));
      setTimeout(() => {
        if (cancelled) return;
        clearInterval(ticker);
        if (ok) {
          setProgress(100); setPhaseText('Ready');
          setTimeout(() => !cancelled && setReady(true), 400);
        } else {
          setFailed(true); setProgress(90);
          setPhaseText('Could not reach the server. Scans need an internet connection.');
        }
      }, wait);
    });
    return () => { cancelled = true; clearInterval(ticker); };
  }, [attempt, ready]);

  const go = useCallback((t) => {
    setTabState({ session: sessionKey, tab: t });
    if (scroller.current) scroller.current.scrollTop = 0;
  }, [sessionKey]);

  let screen;
  if (!ready) {
    screen = <Splash progress={Math.round(progress)} phaseText={phaseText} failed={failed}
      onRetry={() => setAttempt((a) => a + 1)} onContinue={() => setReady(true)} />;
  } else if (!user) {
    screen = <AuthScreen onOpenLegal={onOpenLegal} />;
  } else {
    screen = (
      <div style={{ flex: 1, backgroundColor: '#f6f5f1', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div ref={scroller} style={{ flex: 1, overflowY: 'auto', paddingBottom: '96px' }}>
          {tab === 'home' && <HomeTab go={go} onOpenNotif={() => setIsNotifOpen(true)} />}
          {tab === 'scan' && <ScanTab go={go} />}
          {tab === 'timeline' && <TimelineTab go={go} />}
          {tab === 'diet' && <DietTab go={go} />}
          {tab === 'about' && <AboutTab onOpenLegal={onOpenLegal} />}
        </div>
        <nav aria-label="Main" style={{
          position: 'absolute', bottom: '12px', left: '10px', right: '10px', height: '62px', backgroundColor: '#19231c',
          borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 6px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)', zIndex: 50
        }}>
          <NavButton active={tab === 'home'} onClick={() => go('home')} title="Home"><Home size={19} /></NavButton>
          <NavButton active={tab === 'timeline'} onClick={() => go('timeline')} title="Progress"><TrendingUp size={19} /></NavButton>
          <button
            onClick={() => go('scan')} title="Scan" aria-label="Scan"
            style={{
              width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#ff6b00', color: '#fff', border: '3px solid #19231c',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(255, 107, 0, 0.55)', transform: 'translateY(-8px)'
            }}
          ><Camera size={21} /></button>
          <NavButton active={tab === 'diet'} onClick={() => go('diet')} title="Diet and plan"><BookOpen size={19} /></NavButton>
          <NavButton active={isNotifOpen} onClick={() => setIsNotifOpen(true)} title="Scan Notifications" badge={hasPendingReminder}>
            <Bell size={19} />
          </NavButton>
          <NavButton active={tab === 'about'} onClick={() => go('about')} title="About"><User size={19} /></NavButton>
        </nav>

        {/* Next Scan Notification Modal */}
        <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} go={go} />
      </div>
    );
  }


  return (
    <div style={{
      position: 'relative', width: mobile ? '100%' : '386px', minWidth: mobile ? '100%' : '386px',
      height: mobile ? '100vh' : '804px', borderRadius: mobile ? 0 : '50px', backgroundColor: '#FAF6EE',
      border: mobile ? 'none' : '10px solid #202b24', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      color: '#19231c', boxShadow: mobile ? 'none' : '0 40px 100px rgba(0,0,0,0.9), 0 0 70px rgba(217,251,72,0.15)'
    }}>
      {mobile && <div style={{ height: 'max(4px, env(safe-area-inset-top, 0px))', flexShrink: 0 }} />}
      {screen}
    </div>
  );
}

export default function PhoneSimulator({ onBackToWeb, onOpenLegal }) {
  const mobile = useIsMobileScreen();
  return (
    <AppDataProvider>
      <div style={{
        backgroundColor: mobile ? '#FAF6EE' : '#051009', minHeight: '100vh', width: '100%', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: mobile ? 'flex-start' : 'center',
        padding: mobile ? 0 : '76px 20px 40px', position: 'relative', overflowX: 'hidden'
      }}>
        {!mobile && (
          <header style={{
            position: 'fixed', top: '18px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center',
            gap: '20px', backgroundColor: 'rgba(9, 26, 17, 0.94)', padding: '10px 24px', borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.14)', zIndex: 100
          }}>
            <button onClick={onBackToWeb} className="btn-lime-pill" style={{ padding: '8px 18px', fontSize: '12px', gap: '6px' }}>
              <ArrowLeft size={14} /><span>Back to website</span>
            </button>
            <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.6px', color: '#fff' }}>TWACHA APP VIEW</span>
          </header>
        )}
        <AppShell mobile={mobile} onOpenLegal={onOpenLegal} />
      </div>
    </AppDataProvider>
  );
}
