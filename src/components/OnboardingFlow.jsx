import React, { useEffect, useState } from 'react'
import Fox from './Fox.jsx'
import RepPlayer from './RepPlayer.jsx'
import { CONTEXT_SETS, REP_BY_ID, noticedLine } from '../rep-data.js'
import {
  ANALYZE_LINES,
  CONTEXT_LABELS,
  COST_LINES,
  PATTERNS,
  QUESTIONS,
  SKILL_KEYS,
  computeBaseline,
} from '../onboarding-data.js'

const strip = (label) => label.replace(/^[^\w"'“]+\s*/, '')

export default function OnboardingFlow({ onDone }) {
  const [phase, setPhase] = useState('welcome') // welcome | questions | analyzing | plan | workout | earned | paywall
  const [name, setName] = useState('')
  const [tags, setTags] = useState({})
  const [quotes, setQuotes] = useState({})
  const [baseline, setBaseline] = useState(null)
  const [workout, setWorkout] = useState(null)

  const pattern = PATTERNS[tags.pattern] || PATTERNS.fold
  const repSet = (CONTEXT_SETS[tags.context] || CONTEXT_SETS.friends).map((id) => REP_BY_ID[id])

  return (
    <div className="ob">
      {phase === 'welcome' && <Welcome onNext={() => setPhase('questions')} onSkip={onDone} />}
      {phase === 'questions' && (
        <Questions
          name={name}
          setName={setName}
          onDone={(tagMap, quoteMap, picked) => {
            setTags(tagMap)
            setQuotes(quoteMap)
            setBaseline(computeBaseline(picked))
            setPhase('analyzing')
          }}
        />
      )}
      {phase === 'analyzing' && <Analyzing onDone={() => setPhase('plan')} />}
      {phase === 'plan' && (
        <Plan name={name} pattern={pattern} tags={tags} quotes={quotes} baseline={baseline} onNext={() => setPhase('workout')} />
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
      {phase === 'paywall' && <Paywall name={name} pattern={pattern} tags={tags} workout={workout} onDone={onDone} />}
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
      <p className="ob-sub">train moments. not theory.</p>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onNext}>let's go</button>
        <button className="ob-skip" onClick={onSkip}>skip for now</button>
      </div>
    </div>
  )
}

/* ================= Questions: one per screen ================= */
function Questions({ name, setName, onDone }) {
  const [idx, setIdx] = useState(0)
  const [draft, setDraft] = useState('')
  const [tags] = useState({})
  const [quotes] = useState({})
  const [picked] = useState([])
  const q = QUESTIONS[idx]

  function advance() {
    if (idx + 1 < QUESTIONS.length) setIdx(idx + 1)
    else onDone(tags, quotes, picked)
  }

  function pick(opt) {
    tags[q.id] = opt.tag
    quotes[q.id] = strip(opt.label)
    picked.push(opt)
    setTimeout(advance, 160)
  }

  function submitName(e) {
    e.preventDefault()
    setName(draft.trim() || 'Friend')
    setDraft('')
    advance()
  }

  return (
    <div className="ob-page q-page" key={idx}>
      <div className="ob-head">
        <Fox pose="happy" size={42} />
        <div className="ob-progress">
          <div className="ob-progress-fill" style={{ width: `${Math.max(6, (idx / QUESTIONS.length) * 100)}%` }} />
        </div>
        <span className="q-count">{idx + 1}/{QUESTIONS.length}</span>
      </div>
      <div className="q-body">
        <h2 className="q-title">{q.title}</h2>
        {q.input ? (
          <form className="ob-name-row" onSubmit={submitName}>
            <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="your name…" />
            <button className="btn btn-coral" type="submit">→</button>
          </form>
        ) : (
          <div className="q-opts">
            {q.options.map((opt, i) => (
              <button className="q-opt" key={i} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => pick(opt)}>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ================= Analyzing ================= */
function Analyzing({ onDone }) {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setLine(1), 800)
    const t2 = setTimeout(() => setLine(2), 1600)
    const t3 = setTimeout(onDone, 2400)
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

/* ================= Plan ================= */
function Plan({ name, pattern, tags, quotes, baseline, onNext }) {
  const prog = pattern.program
  return (
    <div className="ob-page ob-scroll">
      <p className="ob-eyebrow">ok {name}, here's my read</p>
      <div className="ob-arch">{pattern.archetype}</div>
      <div className="ob-card">
        <p>{pattern.blurb}</p>
      </div>

      <div className="ob-card">
        <span className="ob-mini">your starting read</span>
        {SKILL_KEYS.map((k) => (
          <div className="plan-skill" key={k}>
            <span>{k}</span>
            <div className="ps-track">
              <div className="ps-fill" style={{ width: `${baseline[k]}%` }} />
            </div>
            <b>{baseline[k]}</b>
          </div>
        ))}
        <p className="plan-skill-note">from your answers. gets real as you train.</p>
      </div>

      <div className="ob-card plan-prog">
        <span className="ob-mini">your program</span>
        <b>{prog.emoji} {prog.name}</b>
        <div className="ob-trace">
          <p><b>first target:</b> {prog.focus}</p>
          <p><b>arena:</b> {CONTEXT_LABELS[tags.context]}, where you said it's worst</p>
          <p><b>goal:</b> “{quotes.aspiration}”</p>
        </div>
      </div>

      <button className="btn btn-coral btn-block" onClick={onNext}>
        first workout · 3 reps
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
      <h2 className="ob-h2 center">day 1. done.</h2>
      <p className="ob-sub2">that counted, {name}.</p>
      <div className="earned-chips">
        <span className="earned-chip">🔥 streak lit</span>
        <span className="earned-chip">⚡ {workout?.xp || 0} XP</span>
        <span className="earned-chip">🏋️ {total} reps</span>
      </div>
      <div className="ob-card">
        <span className="ob-mini">{pattern.program.emoji} {pattern.program.skillName} · Lv 1</span>
        <b>{pattern.tier}</b>
        <p className="small" style={{ marginTop: 3 }}>everyone starts here. nobody stays.</p>
      </div>
      <div className="ob-card">
        <span className="ob-mini">✦ early read</span>
        <p className="small">{noticedLine(workout?.tally || {})}</p>
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>
        keep going
      </button>
    </div>
  )
}

/* ================= Paywall ================= */
function Paywall({ name, pattern, tags, workout, onDone }) {
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
        <span className="ob-mini">📅 tomorrow's set, ready</span>
        <p className="small"><b>{pattern.tomorrow}</b> · 3 reps · {CONTEXT_LABELS[tags.context]}</p>
      </div>
      <div className="ob-checks">
        <p>✅ {pattern.program.emoji} {pattern.program.name}, adapting as you train</p>
        <p>✅ unlimited reps, rising difficulty</p>
        <p>✅ roleplays that push back</p>
        <p>✅ real levels, measured from play</p>
      </div>
      <button className={'ob-plan' + (plan === 'annual' ? ' on' : '')} onClick={() => setPlan('annual')}>
        <div>
          <b>Yearly. the year you get good with people</b>
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
