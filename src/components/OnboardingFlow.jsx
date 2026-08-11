import React, { useEffect, useState } from 'react'
import Fox from './Fox.jsx'
import RepPlayer from './RepPlayer.jsx'
import { CONTEXT_SETS, REP_BY_ID, noticedLine } from '../rep-data.js'
import {
  ARENAS,
  ARENA_CHEERS,
  MUSCLES,
  MUSCLE_CHEERS,
  PACE_OPTIONS,
  PROGRAM_BY_MUSCLE,
  PROOF,
  WEIGHT_OPTIONS,
} from '../onboarding-data.js'

const PHASES = ['splash', 'intro', 'muscles', 'cheer1', 'arena', 'cheer2', 'weight', 'pace', 'cheer3', 'howto', 'workout', 'pump', 'proof', 'floor', 'paywall']

export default function OnboardingFlow({ onDone }) {
  const [phase, setPhase] = useState('splash')
  const [name, setName] = useState('')
  const [muscles, setMuscles] = useState([])
  const [arena, setArena] = useState(null)
  const [pace, setPace] = useState(PACE_OPTIONS[0])
  const [workout, setWorkout] = useState(null)

  const primary = muscles[0] || MUSCLES[0]
  const program = PROGRAM_BY_MUSCLE[primary.id]
  const repSet = (CONTEXT_SETS[arena?.tag] || CONTEXT_SETS.friends).map((id) => REP_BY_ID[id])
  const go = (p) => setPhase(p)
  const progress = Math.max(0.06, PHASES.indexOf(phase) / 10)

  return (
    <div className="ob">
      {phase === 'splash' && <Splash onNext={() => go('intro')} onSkip={onDone} />}

      {phase === 'intro' && (
        <FoxQuestion progress={progress} lines={["hey, I'm kael. I'll be your coach.", "what's your name?"]}>
          <NameInput
            onSubmit={(n) => {
              setName(n)
              go('muscles')
            }}
          />
        </FoxQuestion>
      )}

      {phase === 'muscles' && (
        <FoxQuestion progress={progress} lines={[`good to meet you, ${name}.`, 'what do you want to get good at?']} caption="pick up to 3. you can train everything later.">
          <MuscleGrid
            onDone={(picked) => {
              setMuscles(picked)
              go('cheer1')
            }}
          />
        </FoxQuestion>
      )}

      {phase === 'cheer1' && <Cheer line={MUSCLE_CHEERS[primary.id]} onNext={() => go('arena')} />}

      {phase === 'arena' && (
        <FoxQuestion progress={progress} lines={['where do you want this working?']}>
          <div className="q-opts">
            {ARENAS.map((a) => (
              <button
                key={a.tag}
                className="q-opt"
                onClick={() => {
                  setArena(a)
                  go('cheer2')
                }}
              >
                {a.emoji} {a.label}
              </button>
            ))}
          </div>
        </FoxQuestion>
      )}

      {phase === 'cheer2' && <Cheer line={ARENA_CHEERS[arena?.tag]} onNext={() => go('weight')} />}

      {phase === 'weight' && (
        <FoxQuestion progress={progress} lines={[`and how's your ${primary.label.toLowerCase()} game today?`]} caption="no wrong answers. this sets your starting weight.">
          <div className="q-opts">
            {WEIGHT_OPTIONS.map((w) => (
              <button key={w.tag} className="q-opt" onClick={() => go('pace')}>
                {w.label}
              </button>
            ))}
          </div>
        </FoxQuestion>
      )}

      {phase === 'pace' && (
        <FoxQuestion progress={progress} lines={['daily reps. how hard are we going?']}>
          <div className="q-opts">
            {PACE_OPTIONS.map((p) => (
              <button
                key={p.tag}
                className="q-opt"
                onClick={() => {
                  setPace(p)
                  go('cheer3')
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </FoxQuestion>
      )}

      {phase === 'cheer3' && <Cheer line={`${pace.reps} a day. good contract, ${name}.`} onNext={() => go('howto')} />}

      {phase === 'howto' && (
        <FoxQuestion
          progress={progress}
          lines={[
            'quick, how training works:',
            "I drop you into a real situation. someone says something. you pick what you'd actually say.",
            "I coach your pick. that's one rep.",
          ]}
          caption="no wrong answers. every rep earns XP."
        >
          <button className="btn btn-coral btn-block" onClick={() => go('workout')}>
            first set · 3 reps
          </button>
        </FoxQuestion>
      )}

      {phase === 'workout' && (
        <div className="ob-workout">
          <RepPlayer
            reps={repSet}
            skillName={program.skillName}
            skillEmoji={program.emoji}
            onDone={(res) => {
              setWorkout(res)
              go('pump')
            }}
          />
        </div>
      )}

      {phase === 'pump' && <Pump name={name} program={program} workout={workout} onNext={() => go('proof')} />}
      {phase === 'proof' && <Proof onNext={() => go('floor')} />}
      {phase === 'floor' && <Floor muscles={muscles} onNext={() => go('paywall')} />}
      {phase === 'paywall' && <Paywall name={name} muscles={muscles} program={program} arena={arena} workout={workout} onDone={onDone} />}
    </div>
  )
}

/* ===== splash ===== */
function Splash({ onNext, onSkip }) {
  return (
    <div className="ob-page ob-center">
      <div className="ob-blob a" />
      <div className="ob-blob b" />
      <div className="ob-float">
        <Fox pose="cheer" size={150} />
      </div>
      <h1 className="ob-logo">get good with people.</h1>
      <p className="ob-tag">the fun way to train social skills</p>
      <p className="ob-sub">2 minutes a day</p>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onNext}>start training</button>
        <button className="ob-skip" onClick={onSkip}>skip for now</button>
      </div>
    </div>
  )
}

/* ===== fox-led question screen: the fox types ===== */
function FoxQuestion({ progress, lines, caption, children }) {
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(true)
  const done = shown >= lines.length

  useEffect(() => {
    let delay = 350
    const timers = []
    lines.forEach((line, i) => {
      const dur = Math.min(900, 380 + line.length * 12)
      timers.push(setTimeout(() => setTyping(true), delay))
      timers.push(
        setTimeout(() => {
          setShown(i + 1)
          setTyping(i + 1 < lines.length)
        }, delay + dur),
      )
      delay += dur + 260
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="ob-page q-page">
      <div className="ob-head">
        <div className="ob-progress">
          <div className="ob-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="fq">
        <div className="fq-fox">
          <Fox pose={typing ? 'think' : 'happy'} size={64} />
        </div>
        <div className="fq-col">
          {lines.slice(0, shown).map((l, i) => (
            <div className="fqb" key={i}>{l}</div>
          ))}
          {typing && (
            <div className="fqb fq-dots">
              <span /><span /><span />
            </div>
          )}
        </div>
      </div>
      {done && caption && <p className="fq-caption">{caption}</p>}
      <div className="fq-body">{done && children}</div>
    </div>
  )
}

function NameInput({ onSubmit }) {
  const [draft, setDraft] = useState('')
  return (
    <form
      className="ob-name-row"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(draft.trim() || 'Friend')
      }}
    >
      <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="your name" />
      <button className="btn btn-coral" type="submit">→</button>
    </form>
  )
}

/* ===== wide muscle menu, pick up to 3 ===== */
function MuscleGrid({ onDone }) {
  const [picked, setPicked] = useState([])
  function toggle(m) {
    setPicked((p) => (p.includes(m) ? p.filter((x) => x !== m) : p.length < 3 ? [...p, m] : p))
  }
  return (
    <>
      <div className="m-grid">
        {MUSCLES.map((m) => (
          <button key={m.id} className={'m-chip' + (picked.includes(m) ? ' on' : '')} onClick={() => toggle(m)}>
            <span>{m.emoji}</span> {m.label}
          </button>
        ))}
      </div>
      {picked.length > 0 && (
        <button className="btn btn-coral btn-block" style={{ marginTop: 12 }} onClick={() => onDone(picked)}>
          continue with {picked.length === 1 ? picked[0].label.toLowerCase() : `${picked.length} muscles`}
        </button>
      )}
    </>
  )
}

/* ===== cheer beat ===== */
function Cheer({ line, sub, cta, onNext }) {
  useEffect(() => {
    if (!cta) {
      const t = setTimeout(onNext, 1400)
      return () => clearTimeout(t)
    }
  }, [])
  return (
    <div className="ob-page ob-center">
      <div className="ob-float">
        <Fox pose="cheer" size={120} />
      </div>
      <p className="cheer-line">{line}</p>
      {sub && <p className="ob-sub">{sub}</p>}
      {cta && (
        <div className="ob-bottom">
          <button className="btn btn-coral btn-block" onClick={onNext}>{cta}</button>
        </div>
      )}
    </div>
  )
}

/* ===== pump ===== */
function Pump({ name, program, workout, onNext }) {
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
        <span className="ob-mini">{program.emoji} {program.skillName} · Lv 1</span>
        <p className="small">{noticedLine(workout?.tally || {})}</p>
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>keep going</button>
    </div>
  )
}

/* ===== credibility ===== */
function Proof({ onNext }) {
  return (
    <div className="ob-page ob-center proof">
      <div className="proof-card">
        <span className="proof-label">{PROOF.title}</span>
        {PROOF.lines.map((l, i) => (
          <p key={i} style={{ animationDelay: `${0.15 + i * 0.18}s` }}>{l}</p>
        ))}
      </div>
      <div className="ob-bottom">
        <button className="btn btn-coral btn-block" onClick={onNext}>show me the gym</button>
      </div>
    </div>
  )
}

/* ===== the floor ===== */
function Floor({ muscles, onNext }) {
  const pickedIds = muscles.map((m) => m.id)
  return (
    <div className="ob-page ob-scroll">
      <h2 className="ob-h2 center" style={{ marginTop: 8 }}>this is the whole floor.</h2>
      <p className="ob-sub2">one membership. every muscle.</p>
      <div className="floor-grid">
        {MUSCLES.map((m) => (
          <div key={m.id} className={'floor-cell' + (pickedIds.includes(m.id) ? ' lit' : '')}>
            <span className="floor-emoji">{m.emoji}</span>
            <b>{m.label}</b>
            {pickedIds.includes(m.id) && <em>lv 1</em>}
          </div>
        ))}
      </div>
      <button className="btn btn-coral btn-block" onClick={onNext}>see my membership</button>
    </div>
  )
}

/* ===== membership ===== */
function Paywall({ name, muscles, program, arena, workout, onDone }) {
  const [plan, setPlan] = useState('annual')
  return (
    <div className="ob-page ob-scroll">
      <p className="ob-eyebrow">{name}'s membership</p>
      <h2 className="ob-h2 center">your program is live.</h2>
      <div className="earned-chips" style={{ justifyContent: 'center' }}>
        {muscles.map((m) => (
          <span key={m.id} className="earned-chip">{m.emoji} {m.label}</span>
        ))}
      </div>
      <div className="ob-card tmrw">
        <span className="ob-mini">📅 tomorrow's set, ready</span>
        <p className="small"><b>{program.tomorrow}</b> · 3 reps · {arena?.label}</p>
      </div>
      <div className="ob-checks">
        <p>✅ every muscle on the floor, unlimited reps</p>
        <p>✅ difficulty that climbs as you do</p>
        <p>✅ roleplays that push back like real people</p>
        <p>✅ levels earned from how you play</p>
      </div>
      <button className={'ob-plan' + (plan === 'annual' ? ' on' : '')} onClick={() => setPlan('annual')}>
        <div>
          <b>Yearly membership</b>
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
        <button className="btn btn-coral btn-block" onClick={onDone}>start my free week</button>
        <p className="ob-fine">no charge until day 7 · cancel anytime · day 1 and your {workout?.xp || 0} XP stay yours</p>
      </div>
    </div>
  )
}
