import React from 'react'
import { Blob } from './bits.jsx'
import { ARCHETYPE, BADGES, PLAY_OF_WEEK, RADAR, RECEIPTS, STATS, WEAKEST } from '../data.js'

// RPG-style radar chart, drawn with plain SVG
function Radar() {
  const cx = 110
  const cy = 96
  const R = 66
  const n = RADAR.length
  const pt = (i, r) => {
    const a = ((-90 + (i * 360) / n) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const ring = (f) =>
    Array.from({ length: n }, (_, i) => pt(i, R * f).map((v) => v.toFixed(1)).join(',')).join(' ')
  const shape = RADAR.map((s, i) => pt(i, R * s.value).map((v) => v.toFixed(1)).join(',')).join(' ')

  return (
    <svg viewBox="0 0 220 196" className="radar">
      {[1, 0.66, 0.33].map((f) => (
        <polygon key={f} points={ring(f)} className="radar-ring" />
      ))}
      {RADAR.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />
      })}
      <polygon points={shape} className="radar-shape" />
      {RADAR.map((s, i) => {
        const [x, y] = pt(i, R * s.value)
        return <circle key={i} cx={x} cy={y} r="3.5" className="radar-dot" />
      })}
      {RADAR.map((s, i) => {
        const [x, y] = pt(i, R + 19)
        return (
          <text key={i} x={x} y={y + 3.5} textAnchor="middle" className="radar-label">
            {s.label.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}

export default function YouScreen({ onWorkOn }) {
  return (
    <div className="page-scroll">
      <div className="you-hero">
        <Blob size={64} variant="you" />
        <div className="you-hero-info">
          <div className="arch-label">your current form</div>
          <h1 className="you-arch">{ARCHETYPE.name}</h1>
        </div>
      </div>

      <div className="arch-evolve">
        <div className="arch-next-top">
          <span>
            evolving into <b>{ARCHETYPE.next}</b>
          </span>
          <span className="arch-pct">{ARCHETYPE.progress}%</span>
        </div>
        <div className="arch-bar">
          <div className="arch-fill" style={{ width: `${ARCHETYPE.progress}%` }} />
        </div>
      </div>

      <div className="radar-card">
        <Radar />
        <button className="weakest" onClick={() => onWorkOn(WEAKEST)}>
          weakest stat: <b>{WEAKEST.label}</b> · <span>{WEAKEST.cta}</span>
        </button>
      </div>

      <div className="stat-strip">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <b>{s.num}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="play-card">
        <span className="play-trophy">🏆</span>
        <div>
          <div className="play-label">play of the week</div>
          <h3>{PLAY_OF_WEEK.title}</h3>
          <p>{PLAY_OF_WEEK.text}</p>
        </div>
      </div>

      <div className="sect-label">Badges</div>
      <div className="badge-grid">
        {BADGES.map((b, i) => (
          <div className={'badge' + (b.earned ? ' earned' : '')} key={i} style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="badge-emoji">{b.earned ? b.emoji : '🔒'}</span>
            <span className="badge-name">{b.name}</span>
          </div>
        ))}
      </div>

      <div className="sect-label">Growth receipts</div>
      {RECEIPTS.map((r, i) => (
        <div className="receipt" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="r-line then">
            <span className="r-tag">then</span>
            <p>{r.then}</p>
            <span className="r-when">{r.thenWhen}</span>
          </div>
          <div className="r-line now">
            <span className="r-tag">now</span>
            <p>{r.now}</p>
            <span className="r-when">{r.nowWhen}</span>
          </div>
        </div>
      ))}

      <p className="you-privacy">🔒 All of this stays between us. Delete any of it, anytime.</p>
    </div>
  )
}
