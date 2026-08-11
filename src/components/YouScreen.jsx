import React from 'react'
import { READ_ON_YOU, STILL_FORMING } from '../data.js'

export default function YouScreen({ onWorkOn }) {
  return (
    <div className="page-scroll">
      <h1 className="page-title">Kael's read on you</h1>
      <p className="page-sub">Patterns, not scores. This sharpens every time you bring me a situation.</p>

      {READ_ON_YOU.map((o, i) => (
        <div className="you-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
          <p className="you-text">{o.text}</p>
          <div className="you-foot">
            <span className="you-from">{o.from}</span>
            {o.cta && (
              <button className="you-cta" onClick={() => onWorkOn(o)}>
                {o.cta}
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="you-card forming">
        <p className="you-text">
          <b>Still forming:</b> {STILL_FORMING.text}
        </p>
        <div className="you-foot">
          <span className="you-from">{STILL_FORMING.note}</span>
        </div>
      </div>

      <p className="you-privacy">🔒 All of this stays between us. Delete any of it, anytime.</p>
    </div>
  )
}
