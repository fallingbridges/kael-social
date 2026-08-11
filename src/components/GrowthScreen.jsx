import React from 'react'
import { LevelRing } from './bits.jsx'
import { NOTICED } from '../data.js'

const NOTES = {
  Conversation: 'your strong suit',
  'Reading people': 'sharp',
  Conflict: 'improving',
  Dating: 'warming up',
  Assertiveness: 'working on it',
  Boundaries: 'leg day, huh',
}

export default function GrowthScreen({ skills, resolvedCount, onTeach }) {
  return (
    <div className="page-scroll">
      <h1 className="page-title">Social Fitness</h1>
      <p className="page-sub">Your life is the curriculum. You've been training.</p>

      <div className="level-card">
        <LevelRing pct={68} />
        <div className="level-info">
          <h3>Smooth Operator</h3>
          <p>
            {resolvedCount} situation{resolvedCount === 1 ? '' : 's'} resolved, 23 texts decoded, 4 hard
            conversations survived.
          </p>
          <div className="xp">340 xp to level 8</div>
        </div>
      </div>

      <button className="noticed" onClick={onTeach}>
        <div className="noticed-head">
          <span className="noticed-spark">✦</span> I noticed something
        </div>
        <p>{NOTICED.text}</p>
        <span className="noticed-cta">{NOTICED.cta} →</span>
      </button>

      <div className="sect-label">Skill tree</div>
      {skills.map((s, i) => (
        <div className="skill-row" key={s.key} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="skill-top">
            <b>{s.key}</b>
            <span>{NOTES[s.key] || 'in progress'}</span>
          </div>
          <div className="skill-bar">
            <div className="skill-fill" style={{ width: `${s.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
