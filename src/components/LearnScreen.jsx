import React from 'react'
import { CORE_SKILLS, DRILLS, RECOMMENDED } from '../data.js'

const TINTS = Object.fromEntries(CORE_SKILLS.map((c) => [c.key, c.tint]))

export default function LearnScreen({ onDrill }) {
  const rec = DRILLS.find((d) => d.id === RECOMMENDED.drillId)
  const totalReps = DRILLS.reduce((n, d) => n + d.reps, 0)
  return (
    <div className="page-scroll">
      <h1 className="page-title">Learn</h1>
      <p className="page-sub">Every social skill is trainable. Pick a drill, get your reps in.</p>

      <div className="stat-chips">
        <span className="stat-chip">🏋️ {totalReps} reps total</span>
        <span className="stat-chip">🔥 3-day streak</span>
      </div>

      <button className="rec-hero" onClick={() => onDrill(rec)}>
        <div className="rec-hero-label">up next for you · from “{RECOMMENDED.because}”</div>
        <div className="rec-hero-body">
          <span className="rec-hero-emoji">{rec.emoji}</span>
          <div className="rec-hero-info">
            <h3>{rec.name}</h3>
            <p>{rec.sub.toLowerCase()}</p>
          </div>
          <span className="rec-hero-go">Start →</span>
        </div>
      </button>

      <div className="sect-label">All drills</div>
      <div className="sk-grid">
        {DRILLS.map((d, i) => (
          <button
            className={`sk-card ${TINTS[d.core] || 'coral'}`}
            key={d.id}
            onClick={() => onDrill(d)}
            style={{ animationDelay: `${(i % 4) * 0.05}s` }}
          >
            <div className="sk-top">
              <span className={`sk-badge ${TINTS[d.core] || 'coral'}`}>{d.emoji}</span>
              {d.reps > 0 ? (
                <span className="sk-reps">🏋️ {d.reps} {d.reps === 1 ? 'rep' : 'reps'}</span>
              ) : (
                <span className="sk-reps new">new</span>
              )}
            </div>
            <b>{d.name}</b>
            <span className="sk-sub">{d.sub}</span>
            <span className="sk-drill">▶ 2 min drill</span>
          </button>
        ))}
      </div>

      <p className="you-privacy">Every drill is 60–120 seconds. Reps beat theory.</p>
    </div>
  )
}
