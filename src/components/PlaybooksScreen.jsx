import React from 'react'
import { PLAYBOOKS } from '../data.js'

export default function PlaybooksScreen({ onRun }) {
  return (
    <div className="page-scroll">
      <h1 className="page-title">Playbooks</h1>
      <p className="page-sub">Battle-tested moves for every social situation.</p>
      <div className="pb-grid">
        {PLAYBOOKS.map((p) => (
          <button className={`pb-card ${p.tint}`} key={p.id} onClick={() => onRun(p.send)}>
            <span className="pb-splat" />
            <span className="pb-emoji">{p.emoji}</span>
            <span className="pb-go">→</span>
            <h3>{p.title}</h3>
            <p>{p.sub}</p>
          </button>
        ))}
      </div>
      <button className="sos" onClick={() => onRun("SOS — I'm in a live situation right now and need help fast.")}>
        <span className="sos-dot">🚨</span>
        <div>
          <h3>Live SOS</h3>
          <p>Mid-conversation and panicking? Kael answers in real time.</p>
        </div>
      </button>
    </div>
  )
}
