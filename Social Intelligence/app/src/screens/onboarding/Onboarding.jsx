import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../state/store.jsx'
import { DIAGNOSIS_STEPS, computeDiagnosis } from '../../content/onboarding.js'
import { UNITS, unitColor } from '../../content/units.js'
import { SKILLS } from '../../content/exercises.js'
import { Kai, Confetti } from '../../components/ui.jsx'
import { RadarChart } from '../../components/charts.jsx'

export default function Onboarding() {
  const [phase, setPhase] = useState('welcome')
  const [name, setName] = useState('')
  const [diagnosis, setDiagnosis] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {phase === 'welcome' && <Welcome key="w" onNext={() => setPhase('chat')} />}
      {phase === 'chat' && (
        <Chat key="c" name={name} setName={setName} onDone={(answers) => { setDiagnosis(computeDiagnosis(answers)); setPhase('analyzing') }} />
      )}
      {phase === 'analyzing' && <Analyzing key="a" onDone={() => setPhase('results')} />}
      {phase === 'results' && <Results key="r" name={name} diagnosis={diagnosis} onNext={() => setPhase('reveal')} />}
      {phase === 'reveal' && <Reveal key="p" name={name} diagnosis={diagnosis} />}
    </AnimatePresence>
  )
}

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
}

/* ================= Welcome ================= */
function Welcome({ onNext }) {
  return (
    <motion.div {...fade} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 28px calc(24px + env(safe-area-inset-bottom))', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
      {/* backdrop blobs */}
      <div style={{ position: 'absolute', top: -80, right: -90, width: 260, height: 260, borderRadius: '50%', background: 'var(--sun-soft)' }} />
      <div style={{ position: 'absolute', top: 140, left: -110, width: 230, height: 230, borderRadius: '50%', background: 'var(--teal-soft)' }} />
      <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'var(--coral-soft)' }} />

      <div className="grow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative' }}>
        <motion.div animate={{ y: [0, -9, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
          <Kai pose="cheer" size={150} />
        </motion.div>
        <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 16 }}
          style={{ fontSize: 42, lineHeight: 1.02, color: 'var(--ink)' }}>
          rapport
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ fontSize: 17.5, fontWeight: 700, color: 'var(--ink-soft)', maxWidth: 270, lineHeight: 1.45 }}>
          3 minutes a day to become the person people love talking to.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="row" style={{ gap: 6, marginTop: 6 }}>
          {['🧊', '👂', '🦁', '🎭', '💗'].map((e, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 300, damping: 12 }}
              style={{ fontSize: 24, background: 'var(--card)', borderRadius: 12, padding: '7px 9px', border: '2px solid var(--line)', boxShadow: 'var(--pop-card)' }}>
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} style={{ position: 'relative' }}>
        <button className="btn btn-coral btn-block" onClick={onNext}>Let’s find my level</button>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', marginTop: 12 }}>2-minute diagnosis · no account needed</p>
      </motion.div>
    </motion.div>
  )
}

/* ================= Diagnosis chat ================= */
const NAME_STEP = { id: 'name', kai: ['Quick intro before I start being nosy —', 'what should I call you?'], input: true }
const SCRIPT = [NAME_STEP, ...DIAGNOSIS_STEPS]

function Chat({ name, setName, onDone }) {
  const [messages, setMessages] = useState([])
  const [stepIdx, setStepIdx] = useState(0)
  const [typing, setTyping] = useState(false)
  const [ready, setReady] = useState(false) // options/input shown
  const [answers, setAnswers] = useState([])
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)
  const timers = useRef([])

  const step = SCRIPT[stepIdx]

  useEffect(() => {
    // reveal kai lines for the current step one by one with typing dots
    setReady(false)
    let delay = 350
    step.kai.forEach((line, i) => {
      timers.current.push(setTimeout(() => setTyping(true), delay - 300))
      timers.current.push(setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { who: 'kai', text: line.replace('{name}', name) }])
        if (i === step.kai.length - 1) timers.current.push(setTimeout(() => setReady(true), 220))
      }, delay + Math.min(700, line.length * 14)))
      delay += Math.min(700, line.length * 14) + 480
    })
    return () => timers.current.forEach(clearTimeout)
  }, [stepIdx])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, ready])

  function answer(opt) {
    setMessages((m) => [...m, { who: 'me', text: opt.text }])
    const nextAnswers = [...answers, opt]
    setAnswers(nextAnswers)
    if (stepIdx + 1 < SCRIPT.length) setStepIdx(stepIdx + 1)
    else setTimeout(() => onDone(nextAnswers), 500)
  }

  function submitName() {
    const n = draft.trim() || 'Friend'
    setName(n)
    setMessages((m) => [...m, { who: 'me', text: n }])
    setDraft('')
    setStepIdx(stepIdx + 1)
  }

  const progress = stepIdx / SCRIPT.length

  return (
    <motion.div {...fade} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* progress header */}
      <div className="row" style={{ padding: '18px 20px 10px', gap: 12 }}>
        <Kai pose="happy" size={40} />
        <div className="grow" style={{ height: 14, background: 'var(--line)', borderRadius: 8, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${Math.max(6, progress * 100)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            style={{ height: '100%', background: 'var(--coral)', borderRadius: 8 }} />
        </div>
      </div>

      <div ref={scrollRef} className="grow scroll-y" style={{ padding: '8px 20px 16px' }}>
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{ display: 'flex', justifyContent: m.who === 'me' ? 'flex-end' : 'flex-start', marginBottom: 9 }}>
            <div style={{
              maxWidth: '80%', padding: '11px 15px', fontSize: 15.5, fontWeight: 700, lineHeight: 1.4,
              borderRadius: m.who === 'me' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
              background: m.who === 'me' ? 'var(--coral)' : 'var(--card)',
              color: m.who === 'me' ? '#fff' : 'var(--ink)',
              border: m.who === 'me' ? 'none' : '2px solid var(--line)',
              boxShadow: m.who === 'me' ? 'var(--pop-coral)' : 'var(--pop-card)',
            }}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="row" style={{ gap: 4, padding: '10px 16px', background: 'var(--card)', border: '2px solid var(--line)', borderRadius: '18px 18px 18px 5px', width: 66, boxShadow: 'var(--pop-card)' }}>
            {[0, 1, 2].map((i) => (
              <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.14 }}
                style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--ink-faint)' }} />
            ))}
          </div>
        )}
      </div>

      {/* answer area */}
      <div style={{ padding: '10px 20px calc(20px + env(safe-area-inset-bottom))', borderTop: '2px solid var(--line)', background: 'var(--paper)' }}>
        <AnimatePresence mode="wait">
          {ready && step.input && (
            <motion.div key="input" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="row" style={{ gap: 10 }}>
              <input
                autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitName()}
                placeholder="Your name…"
                style={{ flex: 1, padding: '14px 16px', borderRadius: 14, border: '2px solid var(--line-strong)', fontSize: 16, fontWeight: 700, outline: 'none', background: 'var(--card)' }}
              />
              <button className="btn btn-coral" style={{ padding: '14px 18px' }} onClick={submitName}>→</button>
            </motion.div>
          )}
          {ready && !step.input && (
            <motion.div key={`opts-${stepIdx}`} initial="hide" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {step.caption && <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{step.caption}</p>}
              {step.options.map((opt, i) => (
                <motion.button key={i} className="chip" onClick={() => answer(opt)}
                  variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
                  {opt.text}
                </motion.button>
              ))}
            </motion.div>
          )}
          {!ready && <motion.div key="wait" style={{ height: 46 }} />}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ================= Analyzing ================= */
const ANALYZE_LINES = ['Reading your instincts…', 'Mapping 5 social skills…', 'Designing your path…']
function Analyzing({ onDone }) {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setLine(1), 900)
    const t2 = setTimeout(() => setLine(2), 1800)
    const t3 = setTimeout(onDone, 2800)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [])
  return (
    <motion.div {...fade} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <motion.div animate={{ rotate: [0, -7, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
        <Kai pose="think" size={130} />
      </motion.div>
      <div style={{ width: 190, height: 14, background: 'var(--line)', borderRadius: 8, overflow: 'hidden' }}>
        <motion.div initial={{ width: '5%' }} animate={{ width: '100%' }} transition={{ duration: 2.7, ease: 'easeInOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--coral), var(--sun))', borderRadius: 8 }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={line} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--ink-soft)' }}>
          {ANALYZE_LINES[line]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

/* ================= Results ================= */
function Results({ name, diagnosis, onNext }) {
  const strong = SKILLS[diagnosis.strongest]
  const weak = SKILLS[diagnosis.weakest]
  return (
    <motion.div {...fade} className="scroll-y" style={{ flex: 1, padding: '26px 22px calc(24px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column' }}>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--coral)' }}>
        Your social profile
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ textAlign: 'center', fontSize: 27, margin: '4px 0 2px' }}>
        {name}, you’re {/^[aeiou]/i.test(diagnosis.archetype.replace('The ', '')) ? 'an' : 'a'}…
      </motion.h2>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 14 }}
        style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--violet)', lineHeight: 1.1 }}>
        {diagnosis.archetype}
      </motion.div>

      <RadarChart scores={diagnosis.scores} size={252} />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ padding: 16, marginBottom: 12 }}>
        <p style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.5, color: 'var(--ink)' }}>{diagnosis.blurb}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }} className="row" style={{ gap: 10, marginBottom: 18 }}>
        <div className="card" style={{ flex: 1, padding: '12px 14px', borderColor: strong.color }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--teal-deep)' }}>Superpower</p>
          <p style={{ fontSize: 15, fontWeight: 800 }}>{strong.emoji} {strong.name}</p>
        </div>
        <div className="card" style={{ flex: 1, padding: '12px 14px' }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--coral)' }}>We start with</p>
          <p style={{ fontSize: 15, fontWeight: 800 }}>{weak.emoji} {weak.name}</p>
        </div>
      </motion.div>

      <motion.button initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
        className="btn btn-coral btn-block" onClick={onNext}>
        Build my path
      </motion.button>
    </motion.div>
  )
}

/* ================= Path reveal ================= */
function Reveal({ name, diagnosis }) {
  const { dispatch } = useStore()
  const order = diagnosis.order

  function start() {
    dispatch({ type: 'COMPLETE_ONBOARDING', name, diagnosis })
    dispatch({ type: 'START_LESSON', nodeId: `${order[0]}-0`, kind: 'lesson', unitId: order[0] })
  }

  return (
    <motion.div {...fade} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '26px 22px calc(24px + env(safe-area-inset-bottom))', position: 'relative', overflow: 'hidden' }}>
      <Confetti count={26} />
      <h2 style={{ textAlign: 'center', fontSize: 25, marginBottom: 4 }}>Your path is ready 🎉</h2>
      <p style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 18 }}>
        Six units, ordered for how <em>you</em> work a room.
      </p>
      <div className="grow scroll-y" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {order.map((uid, i) => {
          const u = UNITS[uid]
          const c = unitColor(u)
          return (
            <motion.div key={uid} initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.14, type: 'spring', stiffness: 200, damping: 20 }}
              className="row" style={{ gap: 13, background: 'var(--card)', border: '2px solid var(--line)', borderLeft: `6px solid ${c.color}`, borderRadius: 16, padding: '12px 14px', boxShadow: 'var(--pop-card)' }}>
              <span style={{ fontSize: 26 }}>{u.emoji}</span>
              <div className="grow">
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{u.title}</p>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)' }}>{u.tagline}</p>
              </div>
              {i === 0 && (
                <span style={{ fontSize: 10.5, fontWeight: 800, background: c.soft, color: c.deep, borderRadius: 8, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Start here
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
      <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
        className="btn btn-coral btn-block" style={{ marginTop: 14 }} onClick={start}>
        Start my first lesson
      </motion.button>
    </motion.div>
  )
}
