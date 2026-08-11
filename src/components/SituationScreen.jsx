import React, { useEffect, useRef, useState } from 'react'
import { Blob } from './bits.jsx'
import KaelBlock from './blocks.jsx'
import { FLOWS } from '../data.js'

export default function SituationScreen({ situation, onBack, onChip, onFree, onWrap }) {
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)
  const flow = FLOWS[situation.flowId]
  const node = flow.nodes[situation.nodeId]

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })

  const quiet = situation.typing
  const options = !quiet ? node.options || [] : []
  const chips = !quiet ? node.chips || [] : []
  const showWrap =
    !quiet && !situation.wrapped && situation.kind !== 'drill' && situation.nodeId !== 'start' && situation.messages.length > 2

  function submit(e) {
    e.preventDefault()
    if (!input.trim() || situation.typing) return
    onFree(situation.id, input.trim())
    setInput('')
  }

  return (
    <div className="tab-pane">
      <div className="sit-head">
        <button className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.5 3.5L6 9l5.5 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="sit-head-title">
          <h2>{situation.title}</h2>
          <span className="sit-when">{situation.when}</span>
        </div>
        <Blob size={36} />
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {situation.messages.map((m, i) =>
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
        {situation.typing && (
          <div className="msg-row kael">
            <Blob />
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {options.length > 0 && (
          <div className="opt-chips">
            {options.map((o) => (
              <button className="opt-chip" key={o.label} onClick={() => onChip(situation.id, o)}>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-bottom">
        {(chips.length > 0 || showWrap) && (
          <div className="chips">
            {chips.map((c) => (
              <button className="chip" key={c.label} onClick={() => onChip(situation.id, c)}>
                {c.label}
              </button>
            ))}
            {showWrap && (
              <button className="chip wrap-chip" onClick={() => onWrap(situation.id)}>
                🙏 That helps
              </button>
            )}
          </div>
        )}
        <form className="composer" onSubmit={submit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add details, or just vent…"
          />
          <button className="send-btn" type="submit" disabled={!input.trim()}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M8.5 14V3M8.5 3L3.5 8M8.5 3l5 5" stroke="#fff6ec" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
