import React, { useEffect, useRef, useState } from 'react'
import Fox from './Fox.jsx'
import {
  ANALYZE_LINES,
  INTERVIEW,
  PROGRAMS,
  SKILL_KEYS,
  STAKES_LINES,
  computeBaseline,
} from '../onboarding-data.js'

/* ——— small radar for the reveal ——— */
function Radar({ scores }) {
  const cx = 110, cy = 92, R = 62
  const n = SKILL_KEYS.length
  const pt = (i, r) => {
    const a = ((-90 + (i * 360) / n) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const ring = (f) => SKILL_KEYS.map((_, i) => pt(i, R * f).join(',')).join(' ')
  const shape = SKILL_KEYS.map((k, i) => pt(i, (R * scores[k]) / 100).join(',')).join(' ')
  const LABELS = { 'Reading people': 'READING', Expression: 'EXPRESSION', Assertiveness: 'ASSERT', Conflict: 'CONFLICT', Connection: 'CONNECT' }
  return (
    <svg viewBox="0 0 220 190" className="ob-radar">
      {[1, 0.66, 0.33].map((f) => <polygon key={f} points={ring(f)} className="radar-ring" />)}
      {SKILL_KEYS.map((_, i) => {
        const [x, y] = pt(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />
      })}
      <polygon points={shape} className="radar-shape" />
      {SKILL_KEYS.map((k, i) => {
        const [x, y] = pt(i, (R * scores[k]) / 100)
        return <circle key={k} cx={x} cy={y} r="3.5" className="radar-dot" />
      })}
      {SKILL_KEYS.map((k, i) => {
        const [x, y] = pt(i, R + 20)
        return <text key={k} x={x} y={y + 3.5} textAnchor="middle" className="radar-label">{LABELS[k]}</text>
      })}
    </svg>
  )
}

/* ——— projected growth curve ——— */
function Projection({ from, to }) {
  const W = 300, H = 90
  const pts = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8
    const v = from + (to - from) * (1 - Math.pow(1 - t, 2))
    return [8 + t * (W - 16), H - 14 - ((v - 10) / 80) * (H - 30)]
  })
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[8][0]} ${H} L${pts[0][0]} ${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ob-proj">
      <defs>
        <linearGradient id="pfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00c2a8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00c2a8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pfill)" />
      <path d={line} fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" className="growth-line" />
      <circle cx={pts[0][0]} cy={pts[0][1]} r="4.5" fill="var(--ink)" />
      <circle cx={pts[8][0]} cy={pts[8][1]} r="5" fill="var(--gold)" stroke="var(--ink)" strokeWidth="1.5" />
      <text x={pts[0][0] + 4} y={pts[0][1] - 10} className="proj-tag">you now · {from}</text>
      <text x={pts[8][0] - 4} y={pts[8][1] - 10} textAnchor="end" className="proj-tag strong">week 8 · {to}</text>
    </svg>
  )
}

/* ——— main flow ——— */
export default function OnboardingFlow({ onDone }) {
  const [phase, setPhase] = useState('welcome') // welcome | chat | analyzing | reveal | plan | paywall
  const [name, setName] = useState('')
  const [tags, setTags] = useState({})
  const [result, setResult] = useState(null)

  return (
    <div className="ob">
      {phase === 'welcome' && <Welcome onNext={() => setPhase('chat')} onSkip={onDone} />}
      {phase === 'chat' && (
        <Interview
          name={name}
          setName={setName}
          onDone={(answers, tagMap) => {
            setTags(tagMap)
            setResult(computeBaseline(answers))
            setPhase('analyzing')
          }}
        />
      )}
      {phase === 'analyzing' && <Analyzing onDone={() => setPhase('reveal')} />}
      {phase === 'reveal' && <Reveal name={name} result={result} onNext={() => setPhase('plan')} />}
      {phase === 'plan' && <Plan result={result} onNext={() => setPhase('paywall')} />}
      {phase === 'paywall' && <Paywall name={name} result={result} tags={tags} onDone={onDone} />}
    </div>
  )
}

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
      <p className="ob-sub">charisma isn't a gift. it's reps.</p>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onNext}>let's find my level</button>
        <button className="ob-skip" onClick={onSkip}>skip for now</button>
      </div>
    </div>
  )
}

function Interview({ name, setName, onDone }) {
  const [messages, setMessages] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [typing, setTyping] = useState(false)
  const [ready, setReady] = useState(false)
  const [answers, setAnswers] = useState([])
  const [draft, setDraft] = useState('')
  const tagsRef = useRef({})
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

  function advance(nextAnswers) {
    if (stepIdx + 1 < INTERVIEW.length) setStepIdx(stepIdx + 1)
    else setTimeout(() => onDone(nextAnswers, tagsRef.current), 450)
  }

  function pick(opt) {
    if (opt.tag) tagsRef.current[step.id] = opt.tag
    setMessages((m) => [...m, { who: 'me', text: opt.label }])
    const next = [...answers, opt]
    setAnswers(next)
    advance(next)
  }

  function submitName() {
    const n = draft.trim() || 'Friend'
    setName(n)
    setMessages((m) => [...m, { who: 'me', text: n }])
    setDraft('')
    advance(answers)
  }

  const progress = Math.max(0.05, stepIdx / INTERVIEW.length)

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
        {/* options load inline, below the conversation */}
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

function Analyzing({ onDone }) {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setLine(1), 950)
    const t2 = setTimeout(() => setLine(2), 1900)
    const t3 = setTimeout(onDone, 2900)
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

function Reveal({ name, result, onNext }) {
  const art = /^[aeiou]/i.test(result.name.replace('The ', '')) ? 'an' : 'a'
  return (
    <div className="ob-page ob-scroll">
      <p className="ob-eyebrow">your social profile</p>
      <h2 className="ob-h2">{name}, you're {art}…</h2>
      <div className="ob-arch">{result.name}</div>
      <Radar scores={result.scores} />
      <div className="ob-card">
        <p>{result.blurb}</p>
      </div>
      <div className="ob-duo">
        <div className="ob-card half teal">
          <span className="ob-mini">superpower</span>
          <b>{result.strongest}</b>
        </div>
        <div className="ob-card half coral">
          <span className="ob-mini">we train first</span>
          <b>{result.weakest}</b>
        </div>
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>build my program</button>
    </div>
  )
}

function Plan({ result, onNext }) {
  const prog = PROGRAMS[result.weakest]
  const from = result.scores[result.weakest]
  const to = Math.min(88, from + 33)
  return (
    <div className="ob-page ob-scroll">
      <p className="ob-eyebrow">your program</p>
      <h2 className="ob-h2">
        {prog.emoji} {prog.name}
      </h2>
      <p className="ob-sub2">3 reps a day · {prog.focus}</p>
      <div className="ob-card">
        <span className="ob-mini">projected — {result.weakest}</span>
        <Projection from={from} to={to} />
      </div>
      <div className="ob-promise">
        <div className="ob-card half">
          <span className="ob-mini">in the moment</span>
          <p className="small">bring any real situation — decode it, defuse it, find the words</p>
        </div>
        <div className="ob-card half">
          <span className="ob-mini">over time</span>
          <p className="small">daily reps with rising difficulty until it's automatic</p>
        </div>
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>I want this</button>
    </div>
  )
}

function Paywall({ name, result, tags, onDone }) {
  const [plan, setPlan] = useState('annual')
  const stake = STAKES_LINES[tags.stakes] || 'get good with people'
  return (
    <div className="ob-page ob-scroll">
      <div className="ob-pay-fox">
        <Fox pose="cheer" size={92} />
      </div>
      <h2 className="ob-h2 center">
        {result.name.toLowerCase()}'s plan to {stake}
      </h2>
      <div className="ob-checks">
        <p>✅ unlimited reps across all 5 skills</p>
        <p>✅ NPC roleplays that push back like real people</p>
        <p>✅ your coach on call — bring any real situation</p>
        <p>✅ weakness detection & a program that adapts</p>
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
