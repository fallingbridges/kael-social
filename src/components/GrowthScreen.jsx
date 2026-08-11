import React from 'react'
import { LevelRing } from './bits.jsx'
import { QUESTS, SKILLS } from '../data.js'

export default function GrowthScreen() {
  return (
    <div className="page-scroll">
      <h1 className="page-title">Social Fitness</h1>
      <p className="page-sub">Charm is a muscle. You've been training.</p>

      <div className="level-card">
        <LevelRing pct={68} />
        <div className="level-info">
          <h3>Smooth Operator</h3>
          <p>You've decoded 23 texts and survived 4 hard conversations. The glow-up is real.</p>
          <div className="xp">340 xp to level 8</div>
        </div>
      </div>

      <div className="sect-label">Skill tree</div>
      {SKILLS.map((s, i) => (
        <div className="skill-row" key={s.name} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="skill-top">
            <b>{s.name}</b>
            <span>{s.note}</span>
          </div>
          <div className="skill-bar">
            <div className="skill-fill" style={{ width: `${s.value}%` }} />
          </div>
        </div>
      ))}

      <div className="sect-label">This week's quests</div>
      {QUESTS.map((q, i) => (
        <div
          className={'quest' + (q.done >= q.total ? ' done' : '')}
          key={q.id}
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <span className="q-check">✓</span>
          <span className="q-text">{q.text}</span>
          <span className="q-count">
            {q.done}/{q.total}
          </span>
        </div>
      ))}
    </div>
  )
}
