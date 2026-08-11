import React from 'react'
import { Blob } from './bits.jsx'
import { PROFILE, SKILL_SCORES, YOU_STATS } from '../data.js'

// area chart of the weekly social score, plain SVG
function GrowthChart() {
  const data = PROFILE.weekly
  const W = 300
  const H = 74
  const min = Math.min(...data) - 4
  const max = Math.max(...data) + 4
  const pt = (v, i) => [
    (i / (data.length - 1)) * (W - 8) + 4,
    H - 6 - ((v - min) / (max - min)) * (H - 16),
  ]
  const pts = data.map(pt)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`
  const [lx, ly] = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="growth-chart">
      <defs>
        <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5c39" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ff5c39" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gfill)" />
      <path d={line} fill="none" stroke="#ff5c39" strokeWidth="2.5" strokeLinecap="round" className="growth-line" />
      <circle cx={lx} cy={ly} r="4" fill="#ffc978" stroke="#241b16" strokeWidth="1.5" />
    </svg>
  )
}

export default function YouScreen() {
  const delta = PROFILE.score - PROFILE.baseline
  return (
    <div className="page-scroll">
      <div className="you-head">
        <Blob size={52} variant="you" />
        <div>
          <h1 className="page-title">You</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>Day {PROFILE.day} with Kael. Look at the line.</p>
        </div>
      </div>

      <div className="score-hero">
        <div className="score-top">
          <div>
            <div className="score-label">social score</div>
            <div className="score-num">
              {PROFILE.score}
              <span className="score-delta">▲ {delta} since onboarding</span>
            </div>
          </div>
        </div>
        <GrowthChart />
        <div className="score-foot">
          <span>onboarding · {PROFILE.baseline}</span>
          <span>this week · {PROFILE.score}</span>
        </div>
      </div>

      <div className="sect-label">Skills</div>
      {SKILL_SCORES.map((s, i) => {
        const d = s.now - s.baseline
        return (
          <div className="score-row" key={s.key} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="score-row-top">
              <b>{s.key}</b>
              <span className="score-vals">
                {s.baseline} <em>→</em> {s.now}
                <span className="score-up">+{d}</span>
              </span>
            </div>
            <div className="score-bar">
              <div className="score-base" style={{ left: `${s.baseline}%` }} />
              <div className="score-fill" style={{ width: `${s.now}%` }} />
            </div>
            <span className="score-note">{s.note}</span>
          </div>
        )
      })}

      <div className="sect-label">The numbers</div>
      <div className="you-stats">
        {YOU_STATS.map((s) => (
          <div className="stat" key={s.label}>
            <b>{s.num}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <p className="you-privacy">🔒 Your profile stays between us. Delete any of it, anytime.</p>
    </div>
  )
}
