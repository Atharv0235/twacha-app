import React from 'react';

/**
 * BotanicalDoodles.jsx
 * Handcrafted subtle cartoonish & animatic illustrations:
 * - Little cartoonish bush
 * - Drifting petals
 * - Little cartoon flowers
 * - Animatic style food icons (avocado, strawberry, citrus, herbal tea, salad bowl)
 * - Decorative corner and banner accents
 */

export function CartoonBush({ size = 28, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Ground shadow */}
      <ellipse cx="24" cy="43" rx="16" ry="3" fill="#2d5a3e" fillOpacity="0.12" />
      {/* Back leaves */}
      <circle cx="16" cy="24" r="11" fill="#4a7c59" />
      <circle cx="32" cy="24" r="11" fill="#4a7c59" />
      {/* Front bush main body */}
      <circle cx="24" cy="20" r="13" fill="#5c9c6f" />
      <circle cx="15" cy="28" r="10" fill="#6cb682" />
      <circle cx="33" cy="28" r="10" fill="#6cb682" />
      <circle cx="24" cy="30" r="11" fill="#7ec994" />
      {/* Cute leaf highlight specs */}
      <ellipse cx="21" cy="18" rx="3" ry="1.5" transform="rotate(-20 21 18)" fill="#bcf0cb" fillOpacity="0.8" />
      <ellipse cx="29" cy="26" rx="2.5" ry="1.2" transform="rotate(15 29 26)" fill="#bcf0cb" fillOpacity="0.7" />
      {/* Tiny baby blossom bud */}
      <circle cx="24" cy="12" r="3" fill="#ffb4a2" />
      <circle cx="24" cy="12" r="1.5" fill="#ffe5d9" />
    </svg>
  );
}

export function CartoonPetal({ size = 20, color = '#fbcfe8', stroke = '#f472b6', rotate = 0, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        transform: `rotate(${rotate}deg)`,
        transition: 'transform 0.3s ease',
        ...style
      }}
    >
      <path
        d="M16 3C10 9 6 17 9 24C12 30 20 30 23 24C26 17 22 9 16 3Z"
        fill={color}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Delicate inner vein */}
      <path
        d="M16 10C16 15 16.5 21 16 26"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      {/* Tiny soft highlight */}
      <ellipse cx="14" cy="14" rx="2" ry="4" transform="rotate(-15 14 14)" fill="#ffffff" fillOpacity="0.6" />
    </svg>
  );
}

export function CartoonFlower({ size = 24, primary = '#fde047', petals = '#fef08a', center = '#f59e0b', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* 5 Petals */}
      <circle cx="20" cy="10" r="7" fill={petals} stroke="#eab308" strokeWidth="1" />
      <circle cx="29.5" cy="17" r="7" fill={petals} stroke="#eab308" strokeWidth="1" />
      <circle cx="26" cy="28.5" r="7" fill={petals} stroke="#eab308" strokeWidth="1" />
      <circle cx="14" cy="28.5" r="7" fill={petals} stroke="#eab308" strokeWidth="1" />
      <circle cx="10.5" cy="17" r="7" fill={petals} stroke="#eab308" strokeWidth="1" />
      {/* Flower center */}
      <circle cx="20" cy="20" r="6.5" fill={center} stroke="#b45309" strokeWidth="1" />
      {/* Tiny friendly eye dots / sparkle shine */}
      <circle cx="18.5" cy="18.5" r="1.5" fill="#ffffff" />
      <circle cx="22" cy="21.5" r="0.8" fill="#ffffff" fillOpacity="0.8" />
    </svg>
  );
}

export function CartoonSprout({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Curved stem */}
      <path d="M18 32C18 24 18 16 18 13" stroke="#2d5a3e" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left Leaf */}
      <path
        d="M18 18C13 18 7 13 8 7C14 7 18 12 18 18Z"
        fill="#86efac"
        stroke="#16a34a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Right Leaf */}
      <path
        d="M18 15C22 15 28 11 28 5C22 5 18 10 18 15Z"
        fill="#4ade80"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Highlight speck */}
      <circle cx="12" cy="10" r="1" fill="#ffffff" fillOpacity="0.8" />
    </svg>
  );
}

/* ── ANIMATIC STYLE FOOD DOODLES ── */

export function CartoonAvocado({ size = 24, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Outer skin */}
      <path
        d="M20 3C13 3 8 13 8 26C8 35 13 41 20 41C27 41 32 35 32 26C32 13 27 3 20 3Z"
        fill="#244428"
        stroke="#142617"
        strokeWidth="1.5"
      />
      {/* Lime inner flesh */}
      <path
        d="M20 5.5C14.5 5.5 10.5 14 10.5 25.5C10.5 33.5 14.5 38.5 20 38.5C25.5 38.5 29.5 33.5 29.5 25.5C29.5 14 25.5 5.5 20 5.5Z"
        fill="#a7f3d0"
      />
      {/* Soft yellow glow */}
      <ellipse cx="20" cy="27" rx="8" ry="10" fill="#fef08a" />
      {/* Pit / Seed */}
      <circle cx="20" cy="28" r="6" fill="#854d0e" stroke="#713f12" strokeWidth="1" />
      {/* Pit shine */}
      <circle cx="18" cy="26" r="1.8" fill="#fde68a" fillOpacity="0.7" />
    </svg>
  );
}

export function CartoonStrawberry({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Berry body */}
      <path
        d="M18 36C22 33 30 26 30 16C30 9 24 8 18 8C12 8 6 9 6 16C6 26 14 33 18 36Z"
        fill="#ef4444"
        stroke="#b91c1c"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Calyx / Leaf hat */}
      <path d="M18 2V8M18 8C15 6 11 6 9 9C12 10 16 11 18 8ZM18 8C21 6 25 6 27 9C24 10 20 11 18 8Z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cute golden seeds */}
      <circle cx="13" cy="16" r="1" fill="#fef08a" />
      <circle cx="23" cy="16" r="1" fill="#fef08a" />
      <circle cx="18" cy="21" r="1" fill="#fef08a" />
      <circle cx="14" cy="26" r="0.9" fill="#fef08a" />
      <circle cx="22" cy="26" r="0.9" fill="#fef08a" />
      {/* Cheek shine */}
      <ellipse cx="11" cy="14" rx="1.5" ry="2.5" transform="rotate(-20 11 14)" fill="#ffffff" fillOpacity="0.5" />
    </svg>
  );
}

export function CartoonCitrus({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Rind */}
      <circle cx="18" cy="18" r="16" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
      {/* Pith white */}
      <circle cx="18" cy="18" r="13.5" fill="#ffedd5" />
      {/* Segments background */}
      <circle cx="18" cy="18" r="11.5" fill="#fb923c" />
      {/* Segment lines */}
      <line x1="18" y1="7" x2="18" y2="29" stroke="#ffedd5" strokeWidth="1.5" />
      <line x1="7" y1="18" x2="29" y2="18" stroke="#ffedd5" strokeWidth="1.5" />
      <line x1="10" y1="10" x2="26" y2="26" stroke="#ffedd5" strokeWidth="1.5" />
      <line x1="10" y1="26" x2="26" y2="10" stroke="#ffedd5" strokeWidth="1.5" />
      {/* Center hub */}
      <circle cx="18" cy="18" r="2.5" fill="#ffedd5" />
    </svg>
  );
}

export function CartoonTeaCup({ size = 22, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Rising steam */}
      <path d="M14 6C14 4 16 3 15 1M21 6C21 4 23 3 22 1" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
      {/* Saucer */}
      <path d="M6 31C13 33 25 33 32 31" stroke="#718096" strokeWidth="2" strokeLinecap="round" />
      {/* Cup handle */}
      <path d="M28 14C33 14 34 23 28 24" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Cup body */}
      <path d="M8 10H30V20C30 26 25 29 19 29C13 29 8 26 8 20V10Z" fill="#e2e8f0" stroke="#4a5568" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Green tea surface */}
      <ellipse cx="19" cy="12" rx="9.5" ry="2.5" fill="#86efac" />
      {/* Floating mint leaf */}
      <ellipse cx="18" cy="12" rx="2.5" ry="1" fill="#15803d" />
    </svg>
  );
}

export function CartoonSaladBowl({ size = 24, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Salad Greens spilling over */}
      <circle cx="16" cy="12" r="6" fill="#4ade80" />
      <circle cx="24" cy="12" r="6.5" fill="#22c55e" />
      <circle cx="20" cy="9" r="5" fill="#86efac" />
      {/* Cute tomato slice */}
      <circle cx="21" cy="12" r="3" fill="#ef4444" />
      <circle cx="20.5" cy="11.5" r="0.8" fill="#ffffff" />
      {/* Wooden Bowl */}
      <path
        d="M6 15H34C34 26 27 32 20 32C13 32 6 26 6 15Z"
        fill="#b45309"
        stroke="#78350f"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Bowl rim highlight */}
      <path d="M7 16H33" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Multi-element decorative cluster for card headers or banners
 */
export function CartoonBannerDecor({ style = {} }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(4px)',
        borderRadius: '99px',
        border: '1px solid rgba(220, 235, 225, 0.9)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        ...style
      }}
    >
      <CartoonBush size={20} />
      <CartoonFlower size={17} />
      <CartoonPetal size={15} rotate={15} />
    </div>
  );
}

/**
 * Animated subtle floating petal accent
 */
export function FloatingPetalBadge({ label = '30-Day Care', style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '10.5px',
        fontWeight: '700',
        color: '#2d5a3e',
        backgroundColor: '#eaf5ee',
        border: '1px solid #bbf7d0',
        borderRadius: '99px',
        padding: '3px 8px',
        ...style
      }}
    >
      <CartoonPetal size={13} rotate={-10} />
      <span>{label}</span>
      <CartoonFlower size={12} />
    </span>
  );
}
