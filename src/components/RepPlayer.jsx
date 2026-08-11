import React, { useEffect, useRef, useState } from 'react'
import Fox from './Fox.jsx'
import { INTERSTITIAL, REPS, SKILL, XP, gradeTyped, noticedLine } from '../rep-data.js'

const FOX_POSE = { strong: 'cheer', almost: 'happy', fold: 'sad', harsh: 'think' }
const SHEET_TONE = { strong: 'strong', almost: 'warn', fold: 'warn', harsh: 'warn' }

export default function RepPlayer({ reps = REPS, skillName = SKILL.name, skillEmoji = SKILL.emoji, onDone }) {
  const [repIdx, setRepIdx] = useState(0)
  const [bubbles, setBubbles] = useState([]) // {who:'npc'|'me', text}
  const [options, setOptions] = useState(null)
  const [typedMode, setTypedMode] = useState(false)
  const [draft, setDraft] = useState('')
  const [npcTyping, setNpcTyping] = useState(false)
  const [sheet, setSheet] = useState(null) // {quality, verdict, why, xp, better, showBetter}
  const [xp, setXp] = useState(0)
  const [xpPop, setXpPop] = useState(null)
  const [tally, setTally] = useState({})
  const [pressureWins, setPressureWins] = useState(0)
  const [pressureTries, setPressureTries] = useState(0)
  const [interstitial, setInterstitial] = useState(false)
  const [shownInterstitial, setShownInterstitial] = useState(false)
  const [phase, setPhase] = useState('play') // play | summary
  const [inBeat2, setInBeat2] = useState(false)
  const scrollRef = useRef(null)
  const timers = useRef([])

  const rep = reps[repIdx]

  // load a rep
  useEffect(() => {
    setBubbles([])
    setOptions(null)
    setTypedMode(false)
    setInBeat2(false)
    setNpcTyping(true)
    timers.current.push(
      setTimeout(() => {
        setNpcTyping(false)
        setBubbles([{ who: 'npc', text: rep.line }])
        timers.current.push(
          setTimeout(() => {
            if (rep.typed) setTypedMode(true)
            else setOptions(rep.options)
          }, 350),
        )
      }, 750),
    )
    return () => timers.current.forEach(clearTimeout)
  }, [repIdx])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [bubbles, options, npcTyping, typedMode])

  function award(quality) {
    const gained = XP[quality]
    setXp((x) => x + gained)
    setXpPop(`+${gained}`)
    setTimeout(() => setXpPop(null), 1200)
    setTally((t) => ({ ...t, [quality]: (t[quality] || 0) + 1 }))
    return gained
  }

  function openSheet(opt, others) {
    const gained = award(opt.quality)
    if (inBeat2) {
      setPressureTries((n) => n + 1)
      if (opt.quality === 'strong') setPressureWins((n) => n + 1)
    }
    setSheet({ ...opt, xp: gained, others, showOthers: false })
  }

  function pick(opt) {
    const others = (options || []).filter((o) => o !== opt)
    setOptions(null)
    setBubbles((b) => [...b, { who: 'me', text: opt.text }])
    if (opt.next) {
      // the scene continues — consequence before coaching
      setInBeat2(true)
      timers.current.push(
        setTimeout(() => {
          setNpcTyping(true)
          timers.current.push(
            setTimeout(() => {
              setNpcTyping(false)
              setBubbles((b) => [...b, { who: 'npc', text: opt.next.line }])
              timers.current.push(setTimeout(() => setOptions(opt.next.options), 380))
            }, 850),
          )
        }, 450),
      )
    } else {
      timers.current.push(setTimeout(() => openSheet(opt, others), 550))
    }
  }

  function submitTyped(e) {
    e.preventDefault()
    if (!draft.trim()) return
    setTypedMode(false)
    setBubbles((b) => [...b, { who: 'me', text: draft.trim() }])
    const graded = gradeTyped(draft.trim())
    setDraft('')
    timers.current.push(setTimeout(() => openSheet(graded), 650))
  }

  function nextRep() {
    setSheet(null)
    const foldCount = tally.fold || 0
    if (!shownInterstitial && foldCount >= 2) {
      setShownInterstitial(true)
      setInterstitial(true)
      return
    }
    advance()
  }

  function advance() {
    if (repIdx + 1 < reps.length) setRepIdx(repIdx + 1)
    else if (onDone) onDone({ xp, tally })
    else setPhase('summary')
  }

  if (phase === 'summary') {
    const strong = tally.strong || 0
    const total = Object.values(tally).reduce((a, b) => a + b, 0)
    const directness = Math.round(30 + 65 * ((strong + 0.5 * (tally.almost || 0)) / Math.max(1, total)))
    const warmth = Math.max(20, 90 - 22 * (tally.harsh || 0))
    const pressure = pressureTries ? Math.round(25 + 65 * (pressureWins / pressureTries)) : 40
    return (
      <div className="rep-summary">
        <Fox pose={strong >= 5 ? 'cheer' : 'happy'} size={110} />
        <h2>session complete</h2>
        <div className="rep-sum-xp">⚡ {xp} XP · {total} reps</div>
        <div className="rep-bars">
          {[
            ['Directness', directness],
            ['Warmth', warmth],
            ['Holding under pressure', pressure],
          ].map(([label, v]) => (
            <div className="rep-bar-row" key={label}>
              <div className="rep-bar-top">
                <b>{label}</b>
                <span>{v}</span>
              </div>
              <div className="rep-bar">
                <div className="rep-bar-fill" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rep-noticed">
          <span className="rep-noticed-label">✦ kael noticed</span>
          <p>{noticedLine(tally)}</p>
        </div>
        <button
          className="btn btn-coral btn-block"
          onClick={() => {
            setRepIdx(0)
            setXp(0)
            setTally({})
            setPressureWins(0)
            setPressureTries(0)
            setShownInterstitial(false)
            setPhase('play')
            setBubbles([])
            setNpcTyping(true)
            timers.current.push(
              setTimeout(() => {
                setNpcTyping(false)
                setBubbles([{ who: 'npc', text: reps[0].line }])
                timers.current.push(setTimeout(() => setOptions(reps[0].options), 350))
              }, 750),
            )
          }}
        >
          run it back
        </button>
      </div>
    )
  }

  return (
    <div className="rep-player">
      {/* HUD */}
      <div className="rep-hud">
        <span className="rep-skill">
          {skillEmoji} {skillName} · <b>Lv {rep.level}</b>
        </span>
        <div className="rep-progress">
          <div className="rep-progress-fill" style={{ width: `${(repIdx / reps.length) * 100}%` }} />
        </div>
        <span className="rep-xp">
          ⚡ {xp}
          {xpPop && <em className="rep-xp-pop">{xpPop}</em>}
        </span>
      </div>

      {/* scene */}
      <div className="rep-scene" ref={scrollRef}>
        <p className="rep-context">🎬 {rep.context}</p>
        <div className="rep-npc-chip">
          <span className="rep-npc-avatar" style={{ borderColor: rep.npc.color }}>{rep.npc.emoji}</span>
          <b>{rep.npc.name}</b>
          <span className="rep-npc-role">· {rep.npc.role}</span>
        </div>
        {bubbles.map((b, i) => (
          <div key={i} className={'rep-msg ' + b.who}>
            <div className="rep-bubble">{b.text}</div>
          </div>
        ))}
        {npcTyping && (
          <div className="rep-msg npc">
            <div className="rep-bubble rep-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {options && (
          <div className="rep-opts">
            <p className="rep-your-move">your move</p>
            {options.map((o, i) => (
              <button key={i} className="rep-opt" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => pick(o)}>
                “{o.text}”
              </button>
            ))}
          </div>
        )}
        {typedMode && (
          <form className="rep-composer" onSubmit={submitTyped}>
            <p className="rep-your-move">your move — no options this time. type it.</p>
            <div className="rep-composer-row">
              <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={rep.placeholder} />
              <button className="send-btn" type="submit" disabled={!draft.trim()}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M8.5 14V3M8.5 3L3.5 8M8.5 3l5 5" stroke="#fff6ec" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* coach sheet */}
      {sheet && (
        <div className="rep-sheet-wrap">
          <div className={'rep-sheet ' + SHEET_TONE[sheet.quality]}>
            <div className="rep-sheet-head">
              <Fox pose={FOX_POSE[sheet.quality]} size={54} />
              <div>
                <h3>{sheet.verdict}</h3>
                <span className="rep-sheet-xp">{skillName} +{sheet.xp} XP</span>
              </div>
            </div>
            <p className="rep-sheet-why">{sheet.why}</p>
            {sheet.better && (
              <div className="rep-better">
                <span>the stronger move</span>
                <p>“{sheet.better}”</p>
              </div>
            )}
            {sheet.showOthers && (
              <div className="rep-others">
                {sheet.others.filter((o) => o.text !== sheet.better).map((o, i) => (
                  <div className="rep-other" key={i}>
                    <span className={'rep-dot ' + o.quality} />
                    <div>
                      <p className="rep-other-text">“{o.text}”</p>
                      <span className="rep-other-verdict">{o.verdict}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="rep-sheet-btns">
              {sheet.others?.length > 0 && !sheet.showOthers && (
                <button className="rep-ghost-btn" onClick={() => setSheet((s) => ({ ...s, showOthers: true }))}>
                  how would the other moves land?
                </button>
              )}
              <button className="btn btn-coral btn-block" onClick={nextRep}>
                next rep →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* pattern interstitial */}
      {interstitial && (
        <div className="rep-interstitial">
          <Fox pose="think" size={104} />
          <span className="rep-int-label">✦ {INTERSTITIAL.title}</span>
          <p>{INTERSTITIAL.text}</p>
          <button
            className="btn btn-coral"
            onClick={() => {
              setInterstitial(false)
              advance()
            }}
          >
            {INTERSTITIAL.cta}
          </button>
        </div>
      )}
    </div>
  )
}
