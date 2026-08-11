import React, { useMemo, useState } from 'react'

export default function SituationsScreen({ situations, onOpen }) {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState(null)

  const allTags = useMemo(() => {
    const counts = {}
    situations.forEach((s) => (s.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)))
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [situations])

  const q = query.trim().toLowerCase()
  const filtered = situations.filter((s) => {
    if (tag && !(s.tags || []).includes(tag)) return false
    if (!q) return true
    return (
      s.title.toLowerCase().includes(q) ||
      (s.tags || []).some((t) => t.includes(q))
    )
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

      <div className="tag-chips">
        <button className={'tag-chip' + (tag === null ? ' on' : '')} onClick={() => setTag(null)}>
          all
        </button>
        {allTags.map(([t, n]) => (
          <button
            key={t}
            className={'tag-chip' + (tag === t ? ' on' : '')}
            onClick={() => setTag(tag === t ? null : t)}
          >
            #{t} <span className="tag-n">{n}</span>
          </button>
        ))}
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
            {(s.tags || []).length > 0 && (
              <span className="sit-tags">
                {s.tags.map((t) => (
                  <em key={t}>#{t}</em>
                ))}
              </span>
            )}
          </div>
          {s.followUp ? <span className="fu-dot" /> : <span className="sit-arrow">→</span>}
        </button>
      ))}
    </div>
  )
}
