import React from 'react'
import { DRILLS, RECOMMENDED, TRAINING } from '../data.js'

export default function LearnScreen({ onDrill }) {
  const rec = DRILLS.find((d) => d.id === RECOMMENDED.drillId)
  return (
    <div className="page-scroll">
      <h1 className="page-title">Learn</h1>
      <p className="page-sub">Drills, not lectures. Get the reps in before life tests you.</p>

      <div className="streak-line">🏋️ 3 practice days this week — nice cadence</div>

      <button className="rec-card" onClick={() => onDrill(rec)}>
        <div className="rec-label">recommended · because of “{RECOMMENDED.because}”</div>
        <div className="rec-body">
          <span className="rec-emoji">{rec.emoji}</span>
          <div className="rec-info">
            <h3>{rec.title}</h3>
            <p>{rec.sub}</p>
          </div>
          <span className="rec-go">Start →</span>
        </div>
      </button>

      <div className="sect-label">Drills</div>
      <div className="pb-grid">
        {DRILLS.map((d) => (
          <button
            className={`pb-card ${d.tint}` + (d.locked ? ' locked' : '')}
            key={d.id}
            onClick={() => !d.locked && onDrill(d)}
          >
            <span className="pb-splat" />
            <span className="pb-emoji">{d.locked ? '🔒' : d.emoji}</span>
            {!d.locked && <span className="pb-go">→</span>}
            {!d.locked && d.time && <span className="pb-time">{d.time}</span>}
            <h3>{d.title}</h3>
            <p>{d.sub}</p>
          </button>
        ))}
      </div>

      <div className="sect-label">Your training</div>
      {TRAINING.map((tr) => (
        <div className="train-row" key={tr.skill}>
          <span className={'train-dot' + (tr.hot ? ' hot' : '')} />
          <b>{tr.skill}</b>
          <span className="train-note">{tr.note}</span>
        </div>
      ))}

      <p className="you-privacy">Every drill is 60–120 seconds. Reps beat theory.</p>
    </div>
  )
}
