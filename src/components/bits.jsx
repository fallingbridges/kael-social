import React, { useEffect, useState } from 'react'

// Kael's face — a squishy coral blob with blinking eyes
export function Blob({ size }) {
  return (
    <div className="blob" style={size ? { width: size, height: size } : undefined}>
      <div className="face">
        <div className="eyes">
          <span className="eye" />
          <span className="eye" />
        </div>
        <span className="smile" />
      </div>
    </div>
  )
}

export function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <div className="icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="5" y="5" width="3" height="7" rx="1" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM8 5c-1.9 0-3.6.75-4.9 1.95l1.5 1.55A4.94 4.94 0 0 1 8 7.1c1.3 0 2.5.5 3.4 1.4l1.5-1.55A6.93 6.93 0 0 0 8 5zM8 .5C5 .5 2.3 1.7.3 3.6l1.5 1.55A9.4 9.4 0 0 1 8 2.6c2.4 0 4.6.95 6.2 2.55l1.5-1.55A11.4 11.4 0 0 0 8 .5z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" />
          <path d="M23 4v4c1-.3 1.7-1 1.7-2S24 4.3 23 4z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

export function Splash() {
  return (
    <div className="splash">
      <div className="mark">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 2c2 12 6 20 12 24 6-4 10-12 12-24 2 12-2 22-8 28 6 6 10 16 8 28-2-12-6-20-12-24-6 4-10 12-12 24-2-12 2-22 8-28-6-6-10-16-8-28z"
            fill="#fff6ec"
            transform="rotate(45 32 32)"
          />
        </svg>
      </div>
      <h1>KAEL</h1>
      <p>ai for your social life</p>
    </div>
  )
}

// Animated arc gauge used in "vibe check" cards
export function VibeGauge({ value }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setV(value), 80)
    return () => clearTimeout(t)
  }, [value])
  const r = 38
  const circ = Math.PI * r // half circle
  return (
    <div className="vibe-gauge">
      <svg viewBox="0 0 92 54">
        <path d="M 8 50 A 38 38 0 0 1 84 50" className="track" fill="none" strokeWidth="9" />
        <path
          d="M 8 50 A 38 38 0 0 1 84 50"
          className="fill"
          fill="none"
          strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * v) / 100}
        />
      </svg>
      <div className="vibe-num">
        <div>
          {v}
          <small>%</small>
        </div>
      </div>
    </div>
  )
}

export function LevelRing({ pct }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setV(pct), 150)
    return () => clearTimeout(t)
  }, [pct])
  const r = 48
  const circ = 2 * Math.PI * r
  return (
    <div className="ring">
      <svg width="108" height="108" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={r} className="track" fill="none" strokeWidth="9" />
        <circle
          cx="54"
          cy="54"
          r={r}
          className="fill"
          fill="none"
          strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={circ - (circ * v) / 100}
        />
      </svg>
      <div className="ring-inner">
        <b>7</b>
        <span>level</span>
      </div>
    </div>
  )
}
