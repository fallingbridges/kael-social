import React, { useEffect, useState } from 'react'
import Fox from './Fox.jsx'
import RepPlayer from './RepPlayer.jsx'
import { CONTEXT_SETS, REP_BY_ID, noticedLine } from '../rep-data.js'
import {
  ANALYZE_LINES,
  COMMIT_LINES,
  CONTEXT_LABELS,
  QUESTIONS,
  STRENGTH_LINES,
  TRACKS,
  computeStrength,
} from '../onboarding-data.js'

const strip = (label) => label.replace(/^[^\w"'“]+\s*/, '')

export default function OnboardingFlow({ onDone }) {
  const [phase, setPhase] = useState('welcome') // welcome | questions | analyzing | reveal | workout | earned | paywall
  const [name, setName] = useState('')
  const [tags, setTags] = useState({})
  const [quotes, setQuotes] = useState({})
  const [strength, setStrength] = useState('Reading people')
  const [workout, setWorkout] = useState(null)

  const track = TRACKS[tags.goal] || TRACKS.no
  const repSet = (CONTEXT_SETS[tags.context] || CONTEXT_SETS.friends).map((id) => REP_BY_ID[id])

  return (
    <div className="ob">
      {phase === 'welcome' && <Welcome onNext={() => setPhase('questions')} onSkip={onDone} />}
      {phase === 'questions' && (
        <Questions
          setName={setName}
          onDone={(tagMap, quoteMap, picked) => {
            setTags(tagMap)
            setQuotes(quoteMap)
            setStrength(computeStrength(picked))
            setPhase('analyzing')
          }}
        />
      )}
      {phase === 'analyzing' && <Analyzing onDone={() => setPhase('reveal')} />}
      {phase === 'reveal' && (
        <Reveal name={name} track={track} strength={strength} tags={tags} onNext={() => setPhase('workout')} />
      )}
      {phase === 'workout' && (
        <div className="ob-workout">
          <RepPlayer
            reps={repSet}
            skillName={track.program.skillName}
            skillEmoji={track.program.emoji}
            onDone={(res) => {
              setWorkout(res)
              setPhase('earned')
            }}
          />
        </div>
      )}
      {phase === 'earned' && <Earned name={name} track={track} workout={workout} onNext={() => setPhase('paywall')} />}
      {phase === 'paywall' && <Paywall name={name} track={track} tags={tags} quotes={quotes} workout={workout} onDone={onDone} />}
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
      <p className="ob-sub">charisma is reps. let's get you some.</p>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onNext}>let's go</button>
        <button className="ob-skip" onClick={onSkip}>skip for now</button>
      </div>
    </div>
  )
}

/* ================= Questions: one per screen ================= */
function Questions({ setName, onDone }) {
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
        {q.caption && <p className="q-caption">{q.caption}</p>}
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

/* ================= Reveal: your track ================= */
function Reveal({ name, track, strength, tags, onNext }) {
  return (
    <div className="ob-page ob-scroll">
      <p className="ob-eyebrow">you're in, {name} 🎉</p>
      <h2 className="ob-h2 center">your track:</h2>
      <div className="ob-arch">{track.program.emoji} {track.title}</div>
      <p className="ob-sub2">{track.promise}</p>

      <div className="ob-card">
        <span className="ob-mini">natural strength</span>
        <b>{STRENGTH_LINES[strength]}</b>
      </div>

      <div className="ob-card">
        <span className="ob-mini">your climb</span>
        <div className="path">
          {track.tiers.map((t, i) => (
            <div className={'path-stop' + (i === 0 ? ' now' : '')} key={t}>
              <span className="path-dot" />
              <b>{t}</b>
              {i === 0 && <em>you start here</em>}
            </div>
          ))}
        </div>
      </div>

      <div className="earned-chips">
        <span className="earned-chip">{COMMIT_LINES[tags.commit] || COMMIT_LINES.serious}</span>
        <span className="earned-chip">🎯 set in {CONTEXT_LABELS[tags.context]}</span>
      </div>

      <button className="btn btn-coral btn-block" onClick={onNext}>
        start Lv 1 · 3 reps
      </button>
    </div>
  )
}

/* ================= Earned ================= */
function Earned({ name, track, workout, onNext }) {
  const total = Object.values(workout?.tally || {}).reduce((a, b) => a + b, 0)
  return (
    <div className="ob-page ob-scroll ob-earned">
      <div className="ob-pay-fox">
        <Fox pose="cheer" size={104} />
      </div>
      <h2 className="ob-h2 center">day 1. done. 🎉</h2>
      <p className="ob-sub2">that counted, {name}.</p>
      <div className="earned-chips">
        <span className="earned-chip">🔥 streak lit</span>
        <span className="earned-chip">⚡ {workout?.xp || 0} XP</span>
        <span className="earned-chip">🏋️ {total} reps</span>
      </div>
      <div className="ob-card">
        <span className="ob-mini">{track.program.emoji} {track.program.skillName} · Lv 1</span>
        <b>{track.tiers[0]}</b>
        <p className="small" style={{ marginTop: 3 }}>everyone starts here. nobody stays.</p>
      </div>
      <div className="ob-card">
        <span className="ob-mini">✦ coach's note</span>
        <p className="small">{noticedLine(workout?.tally || {})}</p>
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>
        keep going
      </button>
    </div>
  )
}

/* ================= Paywall ================= */
function Paywall({ name, track, tags, quotes, workout, onDone }) {
  const [plan, setPlan] = useState('annual')
  return (
    <div className="ob-page ob-scroll">
      <div className="earned-chips" style={{ justifyContent: 'center' }}>
        <span className="earned-chip">day 1 ✓</span>
        <span className="earned-chip">⚡ {workout?.xp || 0} XP</span>
        <span className="earned-chip">🔥 streak lit</span>
      </div>
      <h2 className="ob-h2 center">
        3 months from now: “{quotes.aspiration}”
      </h2>
      <p className="ob-sub2">that's the plan, {name}. let's keep it.</p>
      <div className="ob-card tmrw">
        <span className="ob-mini">📅 tomorrow's set, ready</span>
        <p className="small"><b>{track.tomorrow}</b> · 3 reps · {CONTEXT_LABELS[tags.context]}</p>
      </div>
      <div className="ob-checks">
        <p>✅ {track.program.emoji} {track.program.name}, climbing with you</p>
        <p>✅ unlimited reps, all 4 tracks</p>
        <p>✅ roleplays that push back</p>
        <p>✅ levels earned from play</p>
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
