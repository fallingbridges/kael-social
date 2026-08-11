import React from 'react'
import { ARCHETYPE, RECEIPTS, SKILL_JOURNEYS } from '../data.js'

function StageDots({ step, of }) {
  return (
    <div className="j-dots">
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={'j-dot' + (i < step ? ' on' : '')} />
      ))}
    </div>
  )
}

export default function YouScreen({ onWorkOn }) {
  return (
    <div className="page-scroll">
      <h1 className="page-title">You, according to Kael</h1>
      <p className="page-sub">Proof you're getting better with people. Receipts included.</p>

      <div className="arch-card">
        <div className="arch-label">your current form</div>
        <h2 className="arch-name">{ARCHETYPE.name}</h2>
        <p className="arch-desc">{ARCHETYPE.desc}</p>
        <div className="arch-next">
          <div className="arch-next-top">
            <span>
              evolving into <b>{ARCHETYPE.next}</b>
            </span>
            <span className="arch-pct">{ARCHETYPE.progress}%</span>
          </div>
          <div className="arch-bar">
            <div className="arch-fill" style={{ width: `${ARCHETYPE.progress}%` }} />
          </div>
          <p className="arch-note">{ARCHETYPE.nextNote}</p>
        </div>
      </div>

      <div className="sect-label">Skill journeys</div>
      {SKILL_JOURNEYS.map((s, i) => (
        <div className="j-row" key={s.key} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="j-top">
            <b>{s.key}</b>
            <StageDots step={s.step} of={s.of} />
          </div>
          <div className="j-stage">{s.stage}</div>
          <p className="j-evidence">“{s.evidence}”</p>
          {s.cta && (
            <button className="you-cta" onClick={() => onWorkOn(s)}>
              {s.cta}
            </button>
          )}
        </div>
      ))}

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
