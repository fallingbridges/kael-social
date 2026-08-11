import React, { useState } from 'react'
import { VibeGauge } from './bits.jsx'

// Renders one block of a Kael message. Blocks are the rich-card language
// Kael speaks: text, vibe gauge, flags, say-this options, coach card,
// roleplay line, reflection (the post-situation learning card).
export default function KaelBlock({ block, onUse }) {
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
                  onUse && onUse(o.text)
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
    case 'roleplay':
      return (
        <div className="roleplay">
          <span className="rp-as">kael as {block.as}</span>
          <p>“{block.text}”</p>
        </div>
      )
    case 'observe':
      return (
        <div className="reflect">
          <div className="reflect-label">✦ one thing I noticed</div>
          <p className="reflect-insight">{block.text}</p>
          <div className="reflect-row">
            <span className="reflect-skill">remembering this for next time</span>
          </div>
        </div>
      )
    default:
      return null
  }
}
