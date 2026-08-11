import React, { useEffect, useRef, useState } from 'react'
import { Blob, VibeGauge } from './bits.jsx'
import { CHIPS, GREETING, kaelReply } from '../data.js'

function KaelBlock({ block, onUse }) {
  const [usedIdx, setUsedIdx] = useState(null)
  switch (block.type) {
    case 'text':
      return <div className="bubble">{block.text}</div>
    case 'vibe':
      return (
        <div className="icard">
          <div className="icard-label">{block.label}</div>
          <div className="vibe">
            <VibeGauge value={block.value} />
            <div className="vibe-info">
              <h4>{block.verdict}</h4>
              <p>{block.note}</p>
            </div>
          </div>
        </div>
      )
    case 'flags':
      return (
        <div className="icard">
          <div className="icard-label">signal check</div>
          <div className="flags">
            {block.red.map((f) => (
              <div className="flag red" key={f}>
                <span className="f">🚩</span> {f}
              </div>
            ))}
            {block.green.map((f) => (
              <div className="flag green" key={f}>
                <span className="f">✅</span> {f}
              </div>
            ))}
          </div>
        </div>
      )
    case 'says':
      return (
        <div className="says">
          {block.options.map((o, i) => (
            <div className="say-card" key={i}>
              <span className="say-tone">{o.tone}</span>
              <p className="say-text">“{o.text}”</p>
              <button
                className={'say-use' + (usedIdx === i ? ' used' : '')}
                onClick={() => {
                  setUsedIdx(i)
                  onUse(o.text)
                }}
              >
                {usedIdx === i ? 'copied ✓' : 'use this'}
              </button>
            </div>
          ))}
        </div>
      )
    case 'coach':
      return (
        <div className="icard">
          <div className="icard-label">{block.title}</div>
          <ul className="coach-points">
            {block.points.map((p, i) => (
              <li key={i}>
                <span className="n">{i + 1}</span> {p}
              </li>
            ))}
          </ul>
        </div>
      )
    default:
      return null
  }
}

export default function ChatScreen({ pending, clearPending }) {
  const [messages, setMessages] = useState(() => [{ from: 'kael', blocks: GREETING }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })

  function send(text) {
    const msg = text.trim()
    if (!msg || typing) return
    setInput('')
    setMessages((m) => [...m, { from: 'user', blocks: [{ type: 'text', text: msg }] }])
    setTyping(true)
    timers.current.push(
      setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { from: 'kael', blocks: kaelReply(msg) }])
      }, 1100 + Math.random() * 500),
    )
  }

  // playbook tapped on another tab → auto-run that scenario
  useEffect(() => {
    if (pending) {
      clearPending()
      send(pending)
    }
  }, [pending])

  return (
    <>
      <div className="chat-scroll" ref={scrollRef}>
        <div className="day-divider">today</div>
        {messages.map((m, i) =>
          m.from === 'user' ? (
            <div className="msg-row user" key={i}>
              <div className="bubble">{m.blocks[0].text}</div>
            </div>
          ) : (
            <div className="msg-row kael" key={i}>
              <Blob />
              <div className="kael-stack">
                {m.blocks.map((b, j) => (
                  <KaelBlock block={b} key={j} onUse={(t) => setInput(t)} />
                ))}
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="msg-row kael">
            <Blob />
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="chat-bottom">
        <div className="chips">
          {CHIPS.map((c) => (
            <button className="chip" key={c.id} onClick={() => send(c.send)}>
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell Kael what happened…"
          />
          <button className="send-btn" type="submit" disabled={!input.trim()}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path
                d="M8.5 14V3M8.5 3L3.5 8M8.5 3l5 5"
                stroke="#fff6ec"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  )
}
