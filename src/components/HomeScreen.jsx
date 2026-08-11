import React, { useRef, useState } from 'react'
import { Blob } from './bits.jsx'
import { CORE_SKILLS, DRILLS, HOME_CHIPS } from '../data.js'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return "up late, huh. what's happening?"
  if (h < 12) return "morning. what's happening?"
  if (h < 18) return "hey. what's happening?"
  return "evening. what's happening?"
}

export default function HomeScreen({ situations, onNew, onOpen, onFollowUp, onSeeAll, onDrill, onLearn, onPhoto }) {
  const [input, setInput] = useState('')
  const fileRef = useRef(null)
  const photoKind = useRef('photo-decode')
  const followUps = situations.filter((s) => s.followUp)
  const recent = situations.slice(0, 3)

  function submit(e) {
    e.preventDefault()
    if (!input.trim()) return
    onNew(input.trim())
    setInput('')
  }

  function pickPhoto(kind) {
    photoKind.current = kind
    fileRef.current?.click()
  }

  function fileChosen(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onPhoto(photoKind.current, reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="tab-pane">
      <div className="app-head">
        <Blob size={44} />
        <div className="who">
          <h2>Kael</h2>
          <p>always in your corner</p>
        </div>
      </div>

      <div className="page-scroll home-scroll">
        <h1 className="page-title big">{greeting()}</h1>
        <p className="page-sub">Any situation with people — online or offline. Bring it.</p>

        <form className="composer home-composer" onSubmit={submit}>
          <button type="button" className="plus-btn" onClick={() => pickPhoto('photo-decode')} title="Add a photo">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1.5" y="3.5" width="15" height="12" rx="3" />
              <circle cx="9" cy="9.5" r="3" />
              <path d="M5.5 3.5L6.8 1.8h4.4l1.3 1.7" />
            </svg>
          </button>
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
        <input ref={fileRef} type="file" accept="image/*" onChange={fileChosen} style={{ display: 'none' }} />

        <div className="cat-chips">
          {HOME_CHIPS.map((c) => (
            <button
              className="chip"
              key={c.id}
              onClick={() => (c.action ? pickPhoto(c.action) : onNew(c.send))}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>

        {followUps.length > 0 && (
          <div className="home-sect">
            <span className="sect-label">Kael's been wondering</span>
            {followUps.map((s) => (
              <div className="fu-card" key={s.id}>
                <p className="fu-q">
                  <span className="fu-ctx">{s.emoji} {s.title} · </span>
                  {s.followUp.question}
                </p>
                <div className="fu-opts">
                  {s.followUp.options.map((o) => (
                    <button className="fu-btn" key={o.label} onClick={() => onFollowUp(s.id, o)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="home-sect">
          <div className="home-sect-head">
            <span className="sect-label">Practice a skill</span>
            <button className="see-all" onClick={onLearn}>
              All skills →
            </button>
          </div>
          <div className="learn-strip">
            {CORE_SKILLS.map((c) => {
              const drills = DRILLS.filter((d) => d.core === c.key)
              const reps = drills.reduce((n, d) => n + d.reps, 0)
              return (
                <button className="mini-sk" key={c.key} onClick={() => onDrill(drills[0])}>
                  <span className={`mini-sk-badge ${c.tint}`}>{c.emoji}</span>
                  <b>{c.key}</b>
                  <span className="mini-sk-sub">
                    {reps > 0 ? `🏋️ ${reps} rep${reps === 1 ? '' : 's'}` : `${drills.length} drills`}
                  </span>
                </button>
              )
            })}
            <button className="mini-sk more" onClick={onLearn}>
              <span className="mini-sk-badge">✨</span>
              <b>All drills</b>
              <span className="mini-sk-sub">{DRILLS.length} to train</span>
            </button>
          </div>
        </div>

        <div className="home-sect">
          <div className="home-sect-head">
            <span className="sect-label">Recent</span>
            <button className="see-all" onClick={onSeeAll}>
              All situations →
            </button>
          </div>
          {recent.map((s) => (
            <button className="sit-item" key={s.id} onClick={() => onOpen(s.id)}>
              <span className="sit-emoji">{s.emoji}</span>
              <div className="sit-info">
                <b>{s.title}</b>
                <span>{s.when}</span>
              </div>
              <span className="sit-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
