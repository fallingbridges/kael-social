import React, { useState } from 'react'

export default function SituationsScreen({ situations, onOpen }) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = situations.filter((s) => {
    if (!q) return true
    return s.title.toLowerCase().includes(q) || (s.tags || []).some((t) => t.includes(q))
  })

  return (
    <div className="page-scroll">
      <h1 className="page-title">Situations</h1>
      <p className="page-sub">Everything you've brought me. The story's never really over.</p>

      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.2 3.2" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search situations…"
        />
        {query && (
          <button type="button" className="search-clear" onClick={() => setQuery('')}>
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="empty-note">nothing matches — bring me a new one 👀</p>
      )}
      {filtered.map((s) => (
        <button className="sit-item" key={s.id} onClick={() => onOpen(s.id)}>
          <span className="sit-emoji">{s.emoji}</span>
          <div className="sit-info">
            <b>{s.title}</b>
            <span>
              {s.when}
              {s.followUp ? ' · Kael has a question' : ''}
            </span>
          </div>
          {s.followUp ? <span className="fu-dot" /> : <span className="sit-arrow">→</span>}
        </button>
      ))}
    </div>
  )
}
