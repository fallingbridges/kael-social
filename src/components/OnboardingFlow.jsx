import React, { useEffect, useRef, useState } from 'react'
import Fox from './Fox.jsx'
import RepPlayer from './RepPlayer.jsx'
import { CONTEXT_SETS, REP_BY_ID, noticedLine } from '../rep-data.js'
import {
  ANALYZE_LINES,
  CONTEXT_LABELS,
  COST_LINES,
  INTERVIEW,
  PATTERNS,
  SKILL_KEYS,
} from '../onboarding-data.js'

const strip = (label) => label.replace(/^[^\w"']+\s*/, '') // drop leading emoji for quotes

export default function OnboardingFlow({ onDone }) {
  const [phase, setPhase] = useState('welcome') // welcome | chat | analyzing | plan | workout | earned | paywall
  const [name, setName] = useState('')
  const [tags, setTags] = useState({}) // stepId -> tag
  const [quotes, setQuotes] = useState({}) // stepId -> chosen label text
  const [workout, setWorkout] = useState(null) // {xp, tally}

  const pattern = PATTERNS[tags.pattern] || PATTERNS.fold
  const repSet = (CONTEXT_SETS[tags.context] || CONTEXT_SETS.friends).map((id) => REP_BY_ID[id])

  return (
    <div className="ob">
      {phase === 'welcome' && <Welcome onNext={() => setPhase('chat')} onSkip={onDone} />}
      {phase === 'chat' && (
        <Interview
          name={name}
          setName={setName}
          onDone={(tagMap, quoteMap) => {
            setTags(tagMap)
            setQuotes(quoteMap)
            setPhase('analyzing')
          }}
        />
      )}
      {phase === 'analyzing' && <Analyzing onDone={() => setPhase('plan')} />}
      {phase === 'plan' && (
        <Plan name={name} pattern={pattern} tags={tags} quotes={quotes} onNext={() => setPhase('workout')} />
      )}
      {phase === 'workout' && (
        <div className="ob-workout">
          <RepPlayer
            reps={repSet}
            skillName={pattern.program.skillName}
            skillEmoji={pattern.program.emoji}
            onDone={(res) => {
              setWorkout(res)
              setPhase('earned')
            }}
          />
        </div>
      )}
      {phase === 'earned' && <Earned name={name} pattern={pattern} workout={workout} onNext={() => setPhase('paywall')} />}
      {phase === 'paywall' && <Paywall name={name} pattern={pattern} tags={tags} quotes={quotes} workout={workout} onDone={onDone} />}
    </div>
  )
}

/* ================= Welcome ================= */
function Welcome({ onNext, onSkip }) {
  return (
    <div className="ob-page ob-center">
      <div className="ob-blob a" />
      <div className="ob-blob b" />
      <div className="ob-float">
        <Fox pose="cheer" size={150} />
      </div>
      <h1 className="ob-logo">kael</h1>
      <p className="ob-tag">the gym for your social skills</p>
      <p className="ob-sub">train the moments, not the theory.</p>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onNext}>start my intake</button>
        <button className="ob-skip" onClick={onSkip}>skip for now</button>
      </div>
    </div>
  )
}

/* ================= Interview ================= */
function Interview({ name, setName, onDone }) {
  const [messages, setMessages] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [typing, setTyping] = useState(false)
  const [ready, setReady] = useState(false)
  const [draft, setDraft] = useState('')
  const tagsRef = useRef({})
  const quotesRef = useRef({})
  const scrollRef = useRef(null)
  const timers = useRef([])
  const step = INTERVIEW[stepIdx]

  useEffect(() => {
    setReady(false)
    let delay = 400
    step.lines.forEach((line, i) => {
      const dur = Math.min(750, 260 + line.length * 11)
      timers.current.push(setTimeout(() => setTyping(true), delay - 260))
      timers.current.push(
        setTimeout(() => {
          setTyping(false)
          setMessages((m) => [...m, { who: 'fox', text: line.replace('{name}', name || 'friend') }])
          if (i === step.lines.length - 1) timers.current.push(setTimeout(() => setReady(true), 240))
        }, delay + dur),
      )
      delay += dur + 460
    })
    return () => timers.current.forEach(clearTimeout)
  }, [stepIdx])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, ready])

  function advance() {
    if (stepIdx + 1 < INTERVIEW.length) setStepIdx(stepIdx + 1)
    else setTimeout(() => onDone(tagsRef.current, quotesRef.current), 450)
  }

  function pick(opt) {
    tagsRef.current[step.id] = opt.tag
    quotesRef.current[step.id] = strip(opt.label)
    setMessages((m) => [...m, { who: 'me', text: opt.label }])
    advance()
  }

  function submitName() {
    const n = draft.trim() || 'Friend'
    setName(n)
    setMessages((m) => [...m, { who: 'me', text: n }])
    setDraft('')
    advance()
  }

  const progress = Math.max(0.06, stepIdx / INTERVIEW.length)

  return (
    <div className="ob-page">
      <div className="ob-head">
        <Fox pose={typing ? 'think' : 'happy'} size={42} />
        <div className="ob-progress">
          <div className="ob-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="ob-chat" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={'ob-msg ' + m.who}>
            <div className="ob-bubble">{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="ob-msg fox">
            <div className="ob-bubble ob-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        {ready && !step.input && (
          <div className="ob-opts">
            {step.caption && <p className="ob-caption">{step.caption}</p>}
            {step.options.map((opt, i) => (
              <button className="ob-opt" key={i} style={{ animationDelay: `${i * 0.06}s` }} onClick={() => pick(opt)}>
                {opt.label}
              </button>
            ))}
          </div>
        )}
        {ready && step.input && (
          <form
            className="ob-name-row"
            onSubmit={(e) => {
              e.preventDefault()
              submitName()
            }}
          >
            <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="your name…" />
            <button className="btn btn-coral" type="submit">→</button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ================= Analyzing ================= */
function Analyzing({ onDone }) {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setLine(1), 850)
    const t2 = setTimeout(() => setLine(2), 1700)
    const t3 = setTimeout(onDone, 2600)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])
  return (
    <div className="ob-page ob-center">
      <div className="ob-wiggle">
        <Fox pose="think" size={130} />
      </div>
      <div className="ob-analyze-bar">
        <div className="ob-analyze-fill" />
      </div>
      <p className="ob-analyze-line" key={line}>{ANALYZE_LINES[line]}</p>
    </div>
  )
}

/* ================= The mirror + the plan ================= */
function Plan({ name, pattern, tags, quotes, onNext }) {
  const prog = pattern.program
  return (
    <div className="ob-page ob-scroll">
      <p className="ob-eyebrow">from what you've told me, {name}…</p>
      <h2 className="ob-h2">you sound like</h2>
      <div className="ob-arch">{pattern.archetype}</div>
      <div className="ob-card">
        <p>{pattern.blurb}</p>
      </div>

      <p className="ob-eyebrow" style={{ marginTop: 10 }}>so here's your program</p>
      <h2 className="ob-h2">
        {prog.emoji} {prog.name}
      </h2>
      <div className="ob-card">
        <div className="ob-trace">
          <p>
            <b>starts with:</b> {prog.focus} — because you said <em>“{quotes.pattern}”</em>
          </p>
          <p>
            <b>set in:</b> {CONTEXT_LABELS[tags.context]} — where you said it stings
          </p>
          <p>
            <b>goal on file:</b> <em>“{quotes.aspiration}”</em>
          </p>
        </div>
      </div>

      <div className="ob-card">
        <span className="ob-mini">your skill levels</span>
        {SKILL_KEYS.map((k) => (
          <div className="plan-skill" key={k}>
            <span>{k}</span>
            <div className="plan-skill-bar" />
            <em>not measured yet</em>
          </div>
        ))}
        <p className="plan-skill-note">kael maps your real levels by watching you train — not by quizzing you.</p>
      </div>

      <button className="btn btn-coral btn-block" onClick={onNext}>
        start my first workout — 3 reps, 90 seconds
      </button>
    </div>
  )
}

/* ================= Earned ================= */
function Earned({ name, pattern, workout, onNext }) {
  const total = Object.values(workout?.tally || {}).reduce((a, b) => a + b, 0)
  return (
    <div className="ob-page ob-scroll ob-earned">
      <div className="ob-pay-fox">
        <Fox pose="cheer" size={104} />
      </div>
      <h2 className="ob-h2 center">day 1 — done, {name}.</h2>
      <p className="ob-sub2">that wasn't a demo. your training has started.</p>
      <div className="earned-chips">
        <span className="earned-chip">🔥 day 1 streak lit</span>
        <span className="earned-chip">⚡ {workout?.xp || 0} XP banked</span>
        <span className="earned-chip">🏋️ {total} reps</span>
      </div>
      <div className="ob-card">
        <span className="ob-mini">{pattern.program.emoji} {pattern.program.skillName} · Lv 1</span>
        <b>{pattern.tier}</b>
        <p className="small" style={{ marginTop: 3 }}>everyone starts here. nobody stays here.</p>
      </div>
      <div className="ob-card">
        <span className="ob-mini">✦ early read — one session in</span>
        <p className="small">{noticedLine(workout?.tally || {})}</p>
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>
        keep my program going
      </button>
    </div>
  )
}

/* ================= Paywall ================= */
function Paywall({ name, pattern, tags, quotes, workout, onDone }) {
  const [plan, setPlan] = useState('annual')
  const stake = COST_LINES[tags.cost] || 'get good with people'
  return (
    <div className="ob-page ob-scroll">
      <div className="earned-chips" style={{ justifyContent: 'center' }}>
        <span className="earned-chip">day 1 ✓</span>
        <span className="earned-chip">⚡ {workout?.xp || 0} XP</span>
        <span className="earned-chip">🔥 streak lit</span>
      </div>
      <h2 className="ob-h2 center">
        {pattern.archetype.toLowerCase()}'s plan to {stake}
      </h2>
      <div className="ob-card tmrw">
        <span className="ob-mini">📅 tomorrow's set — ready and waiting</span>
        <p className="small"><b>{pattern.tomorrow}</b> · 3 reps · set in {CONTEXT_LABELS[tags.context]}</p>
      </div>
      <div className="ob-checks">
        <p>✅ your program: {pattern.program.emoji} {pattern.program.name}, adapting as you train</p>
        <p>✅ unlimited reps, difficulty that climbs with you</p>
        <p>✅ roleplays that push back like real people</p>
        <p>✅ your real skill levels, measured from play</p>
      </div>
      <button className={'ob-plan' + (plan === 'annual' ? ' on' : '')} onClick={() => setPlan('annual')}>
        <div>
          <b>Yearly — the year you get good with people</b>
          <span>$59.99/yr · $4.99/mo</span>
        </div>
        <span className="ob-badge">7 days free</span>
      </button>
      <button className={'ob-plan' + (plan === 'monthly' ? ' on' : '')} onClick={() => setPlan('monthly')}>
        <div>
          <b>Monthly</b>
          <span>$11.99/mo</span>
        </div>
      </button>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onDone}>
          start my free week
        </button>
        <p className="ob-fine">no charge until day 7 · cancel anytime, {name}. no hard feelings 🦊</p>
      </div>
    </div>
  )
}
