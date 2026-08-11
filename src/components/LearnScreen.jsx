import React from 'react'
import { RECOMMENDED, SKILLS } from '../data.js'

export default function LearnScreen({ onDrill }) {
  const rec = SKILLS.find((s) => s.id === RECOMMENDED.drillId)
  const totalReps = SKILLS.reduce((n, s) => n + s.reps, 0)
  return (
    <div className="page-scroll">
      <h1 className="page-title">Learn</h1>
      <p className="page-sub">Every social skill is trainable. Pick one, get your reps in.</p>

      <div className="stat-chips">
        <span className="stat-chip">🏋️ {totalReps} reps total</span>
        <span className="stat-chip">🔥 3-day streak</span>
      </div>

      <button className="rec-hero" onClick={() => onDrill(rec)}>
        <div className="rec-hero-label">up next for you · from “{RECOMMENDED.because}”</div>
        <div className="rec-hero-body">
          <span className="rec-hero-emoji">{rec.emoji}</span>
          <div className="rec-hero-info">
            <h3>{rec.skill}</h3>
            <p>
              {rec.drillName} — {rec.sub.toLowerCase()}
            </p>
          </div>
          <span className="rec-hero-go">Start →</span>
        </div>
      </button>

      <div className="sect-label">All skills</div>
      <div className="sk-grid">
        {SKILLS.map((s, i) => (
          <button className={`sk-card ${s.tint}`} key={s.id} onClick={() => onDrill(s)} style={{ animationDelay: `${(i % 4) * 0.05}s` }}>
            <div className="sk-top">
              <span className={`sk-badge ${s.tint}`}>{s.emoji}</span>
              {s.reps > 0 ? (
                <span className="sk-reps">🏋️ {s.reps} {s.reps === 1 ? 'rep' : 'reps'}</span>
              ) : (
                <span className="sk-reps new">new</span>
              )}
            </div>
            <b>{s.skill}</b>
            <span className="sk-sub">{s.sub}</span>
            <span className="sk-drill">▶ {s.drillName}</span>
          </button>
        ))}
      </div>

      <p className="you-privacy">Every drill is 60–120 seconds. Reps beat theory.</p>
    </div>
  )
}
