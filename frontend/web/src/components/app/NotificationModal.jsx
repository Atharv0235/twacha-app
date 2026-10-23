import React from 'react';
import { X, Calendar, Bell, Sparkles, CheckCircle2, Clock, Camera } from 'lucide-react';
import { useAppData } from '../../state/AppData';
import { buildTimeline, fmtDay, fmtDayFull, reminderMessage } from '../../state/ScanTimeline';
import { CartoonBush, CartoonFlower, CartoonPetal, CartoonSprout } from './BotanicalDoodles';

export default function NotificationModal({ isOpen, onClose, go }) {
  const { history, lastScan } = useAppData();
  const scans = history?.scans || [];
  const timeline = buildTimeline(scans);
  const msg = reminderMessage(timeline);

  if (!isOpen) return null;

  const handleAction = (tab) => {
    onClose();
    if (go) go(tab);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(9, 26, 17, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FAF6EE',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '20px 18px 28px',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          borderTop: '3px solid #2d5a3e',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar indicator */}
        <div
          style={{
            width: '40px',
            height: '4px',
            borderRadius: '99px',
            backgroundColor: '#d8d3c5',
            margin: '0 auto 14px',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Bell size={18} color="#d97706" />
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  border: '1.5px solid #fff',
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#19231c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Notifications
                <CartoonFlower size={16} />
              </div>
              <div style={{ fontSize: '11px', color: '#738075' }}>30-Day Skin Journey & Scan Cadence</div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid #e2ddd3',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#5e6d64',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* MAIN NOTIFICATION CARD: NEXT SCAN SCHEDULED */}
        {timeline.nextScanDate ? (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              border: '1.5px solid #bbf7d0',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 4px 14px rgba(45, 90, 62, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle botanical corner decoration */}
            <div style={{ position: 'absolute', top: '10px', right: '12px', opacity: 0.85, display: 'flex', gap: '2px' }}>
              <CartoonBush size={22} />
              <CartoonPetal size={16} rotate={20} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  color: '#15803d',
                  backgroundColor: '#dcfce7',
                  padding: '3px 9px',
                  borderRadius: '99px',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                }}
              >
                Scan Scheduled
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#b45309',
                  backgroundColor: '#fef3c7',
                  padding: '3px 8px',
                  borderRadius: '99px',
                }}
              >
                ⚡ Every 3–4 Days
              </span>
            </div>

            <div style={{ fontSize: '19px', fontWeight: '900', color: '#19231c', marginBottom: '4px', lineHeight: 1.2 }}>
              {fmtDayFull(timeline.nextScanDate)}
            </div>

            <div style={{ fontSize: '12px', color: '#5e6d64', lineHeight: 1.5, marginBottom: '12px' }}>
              {timeline.isNextScanDue
                ? 'Your scheduled scan window is open! Complete your scan now to see if your skin markers improved.'
                : timeline.daysUntilNextScan === 0
                ? 'Your scheduled scan is due today! We will analyze skin changes vs your baseline.'
                : `Your next scan is in ${timeline.daysUntilNextScan} day${timeline.daysUntilNextScan > 1 ? 's' : ''}. Day ${timeline.daysElapsed} of your 30-day journey (${timeline.daysRemaining} days remaining).`}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleAction('scan')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#19231c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Camera size={15} />
                <span>{timeline.isNextScanDue ? 'Take Scan Now' : 'Scan Early'}</span>
              </button>

              <button
                onClick={() => handleAction('timeline')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#2d5a3e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Calendar size={15} />
                <span>View Timeline</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              border: '1.5px solid #fde68a',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <CartoonSprout size={20} />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase' }}>
                Start 30-Day Plan
              </span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#19231c', marginBottom: '4px' }}>
              No scans completed yet
            </div>
            <p style={{ fontSize: '12px', color: '#5e6d64', lineHeight: 1.5, margin: '0 0 12px' }}>
              Your 30-day timeline begins with your Day 1 baseline scan. Once completed, your reminders will automatically schedule every 3 to 4 days!
            </p>
            <button
              onClick={() => handleAction('scan')}
              style={{
                width: '100%',
                backgroundColor: '#19231c',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Camera size={15} />
              <span>Start Day 1 Scan</span>
            </button>
          </div>
        )}

        {/* 30-DAY JOURNEY RECAP NOTIFICATION */}
        <div
          style={{
            backgroundColor: '#f7f4ec',
            borderRadius: '16px',
            border: '1px solid #e6e0d3',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '20px' }}>🌿</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#19231c' }}>
              How 3/4-Day Frequency Works
            </div>
            <div style={{ fontSize: '11px', color: '#6d7b71', marginTop: '2px', lineHeight: 1.4 }}>
              Scans alternate every 3 and 4 days (~8 scans across 30 days) to allow your cellular epidermal barrier time to respond.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
