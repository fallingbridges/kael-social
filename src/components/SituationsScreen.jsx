import React from 'react'

export default function SituationsScreen({ situations, onOpen }) {
  return (
    <div className="page-scroll">
      <h1 className="page-title">Situations</h1>
      <p className="page-sub">Everything you've brought me. Reopen any of them — the story's never really over.</p>
      {situations.map((s) => (
        <button className="sit-item" key={s.id} onClick={() => onOpen(s.id)}>
          <span className="sit-emoji">{s.emoji}</span>
          <div className="sit-info">
            <b>{s.title}</b>
            <span>{s.when}{s.followUp ? ' · Kael has a question' : ''}</span>
          </div>
          {s.followUp ? <span className="fu-dot" /> : <span className="sit-arrow">→</span>}
        </button>
      ))}
    </div>
  )
}
