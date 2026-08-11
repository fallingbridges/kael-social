import React from 'react'
import { CORE_SKILLS, DRILLS, RECOMMENDED } from '../data.js'

export default function LearnScreen({ onDrill }) {
  const rec = DRILLS.find((d) => d.id === RECOMMENDED.drillId)
  const totalReps = DRILLS.reduce((n, d) => n + d.reps, 0)
  return (
    <div className="page-scroll">
      <h1 className="page-title">Learn</h1>
      <p className="page-sub">Five core skills. Every one trainable, right now.</p>

      <div className="stat-chips">
        <span className="stat-chip">🏋️ {totalReps} reps total</span>
        <span className="stat-chip">🔥 3-day streak</span>
      </div>

      <button className="rec-hero" onClick={() => onDrill(rec)}>
        <div className="rec-hero-label">up next for you · from “{RECOMMENDED.because}”</div>
        <div className="rec-hero-body">
          <span className="rec-hero-emoji">{rec.emoji}</span>
          <div className="rec-hero-info">
            <h3>{RECOMMENDED.core}</h3>
            <p>
              {rec.name} — {rec.sub.toLowerCase()}
            </p>
          </div>
          <span className="rec-hero-go">Start →</span>
        </div>
      </button>

      {CORE_SKILLS.map((c) => {
        const drills = DRILLS.filter((d) => d.core === c.key)
        const reps = drills.reduce((n, d) => n + d.reps, 0)
        return (
          <div className="core-sect" key={c.key}>
            <div className="core-head">
              <span className={`sk-badge ${c.tint}`}>{c.emoji}</span>
              <div className="core-head-info">
                <b>{c.key}</b>
                <span>{c.tagline}</span>
              </div>
              <span className={'sk-reps' + (reps === 0 ? ' new' : '')}>
                {reps > 0 ? `🏋️ ${reps} rep${reps === 1 ? '' : 's'}` : 'new'}
              </span>
            </div>
            <div className="learn-strip">
              {drills.map((d) => (
                <button className="mini-sk" key={d.id} onClick={() => onDrill(d)}>
                  <span className={`mini-sk-badge ${c.tint}`}>{d.emoji}</span>
                  <b>{d.name}</b>
                  <span className="mini-sk-sub">{d.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <p className="you-privacy">Every drill is 60–120 seconds. Reps beat theory.</p>
    </div>
  )
}
