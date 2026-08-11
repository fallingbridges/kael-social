import React, { useState } from 'react'
import { Blob } from './bits.jsx'
import { CATEGORIES } from '../data.js'

export default function HomeScreen({ situations, skills, onNew, onOpen, onSeeSkills }) {
  const [input, setInput] = useState('')
  const top3 = skills.slice(0, 3)

  function submit(e) {
    e.preventDefault()
    if (!input.trim()) return
    onNew(input.trim())
    setInput('')
  }

  return (
    <div className="tab-pane">
      <div className="app-head">
        <Blob size={44} />
        <div className="who">
          <h2>Kael</h2>
          <p>online · judging lovingly</p>
        </div>
        <div className="streak-pill">🔥 12</div>
      </div>

      <div className="page-scroll home-scroll">
        <h1 className="page-title big">What's happening?</h1>
        <p className="page-sub">Bring me any situation involving people.</p>

        <form className="composer home-composer" onSubmit={submit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Kael what happened…"
          />
          <button className="send-btn" type="submit" disabled={!input.trim()}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M8.5 14V3M8.5 3L3.5 8M8.5 3l5 5" stroke="#fff6ec" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <div className="cat-chips">
          {CATEGORIES.map((c) => (
            <button className="chip" key={c.id} onClick={() => onNew(c.send)}>
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        <div className="home-sect">
          <div className="home-sect-head">
            <span className="sect-label">Your social intelligence</span>
            <button className="see-all" onClick={onSeeSkills}>
              See all →
            </button>
          </div>
          {top3.map((s) => (
            <div className="snap-row" key={s.key}>
              <span className="snap-name">{s.key}</span>
              <div className="snap-bar">
                <div className="snap-fill" style={{ width: `${s.value}%` }} />
              </div>
              <b className="snap-num">{s.value}</b>
            </div>
          ))}
        </div>

        <div className="home-sect">
          <span className="sect-label">Situations</span>
          {situations.map((s) => (
            <button className="sit-item" key={s.id} onClick={() => onOpen(s.id)}>
              <span className="sit-emoji">{s.emoji}</span>
              <div className="sit-info">
                <b>{s.title}</b>
                <span>{s.when}</span>
              </div>
              <span className={'status-pill ' + s.status}>{s.status === 'open' ? '● open' : '✓'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
