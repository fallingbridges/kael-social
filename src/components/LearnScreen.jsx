import React from 'react'
import { RECOMMENDED, SKILLS, TRAINING } from '../data.js'

export default function LearnScreen({ onDrill }) {
  const rec = SKILLS.find((s) => s.id === RECOMMENDED.drillId)
  return (
    <div className="page-scroll">
      <h1 className="page-title">Learn</h1>
      <p className="page-sub">Every social skill is trainable. Pick one, get your reps in.</p>

      <div className="streak-line">🏋️ 3 practice days this week — nice cadence</div>

      <button className="rec-card" onClick={() => onDrill(rec)}>
        <div className="rec-label">recommended · because of “{RECOMMENDED.because}”</div>
        <div className="rec-body">
          <span className="rec-emoji">{rec.emoji}</span>
          <div className="rec-info">
            <h3>{rec.skill}</h3>
            <p>{rec.drillName}</p>
          </div>
          <span className="rec-go">Start →</span>
        </div>
      </button>

      <div className="sect-label">All skills</div>
      <div className="sk-grid">
        {SKILLS.map((s) => (
          <button className={`sk-card ${s.tint}`} key={s.id} onClick={() => onDrill(s)}>
            <span className="sk-emoji">{s.emoji}</span>
            <b>{s.skill}</b>
            <span className="sk-drill">▶ {s.drillName}</span>
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
