import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../state/store.jsx'
import { FIELD_QUESTS, FELT_SCALE } from '../content/quests.js'
import { Kai, Sheet, Confetti } from '../components/ui.jsx'

const ALL_QUESTS = Object.values(FIELD_QUESTS).flat()

export default function QuestsScreen() {
  const { state, dispatch } = useStore()
  const [checkIn, setCheckIn] = useState(false)
  const [felt, setFelt] = useState(null)
  const [note, setNote] = useState('')
  const [justDone, setJustDone] = useState(false)
  const [showWhy, setShowWhy] = useState(false)

  const quest = ALL_QUESTS.find((q) => q.id === state.activeQuest)
  const doneCount = state.questLog.filter((q) => !q.skipped).length

  function submit(skipped) {
    dispatch({ type: 'CHECK_IN_QUEST', felt: felt ?? 3, note, skipped })
    setCheckIn(false)
    setFelt(null)
    setNote('')
    if (!skipped) {
      setJustDone(true)
      setTimeout(() => setJustDone(false), 2600)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {justDone && <Confetti count={36} />}
      <header style={{ padding: '20px 20px 4px' }}>
        <h1 style={{ fontSize: 24 }}>Field Quests</h1>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-soft)' }}>Tiny real-world missions. This is where it gets real.</p>
      </header>

      {/* Real-World Score */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="row" style={{
          margin: '14px 18px 0', borderRadius: 20, padding: '16px 18px', gap: 14,
          background: 'linear-gradient(115deg, var(--teal), var(--sky))', boxShadow: '0 5px 0 var(--teal-deep)',
        }}>
        <div className="grow">
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>Real-World Score</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {state.realWorld.score}
            <span style={{ fontSize: 15, opacity: 0.8 }}> /100</span>
          </p>
        </div>
        <p style={{ fontSize: 11.5, fontWeight: 800, color: 'rgba(255,255,255,0.92)', maxWidth: 130, lineHeight: 1.35, textAlign: 'right' }}>
          Only real-life quests move this. Not lessons. 😉
        </p>
      </motion.div>

      <div className="grow scroll-y" style={{ padding: '16px 18px 30px' }}>
        {quest ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card" style={{ padding: 18, borderColor: 'var(--teal)', borderWidth: 2.5 }}>
            <div className="row" style={{ gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 800, background: 'var(--teal-soft)', color: 'var(--teal-deep)', borderRadius: 9, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Today’s quest
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--sky-deep)' }}>💎 +{quest.gems}</span>
            </div>
            <h2 style={{ fontSize: 21, marginBottom: 6 }}>{quest.title}</h2>
            <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, marginBottom: 10 }}>{quest.mission}</p>
            <p style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--sun-deep)', marginBottom: 12 }}>⏱️ {quest.bar}</p>

            <button onClick={() => setShowWhy(!showWhy)} className="row" style={{ gap: 6, fontSize: 13.5, fontWeight: 800, color: 'var(--sky-deep)', marginBottom: showWhy ? 8 : 14 }}>
              🧠 Why this works {showWhy ? '▾' : '▸'}
            </button>
            {showWhy && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.5, color: 'var(--ink-soft)', background: 'var(--sky-soft)', borderRadius: 12, padding: '10px 13px', marginBottom: 14 }}>
                {quest.why}
              </motion.p>
            )}

            <button className="btn btn-teal btn-block" onClick={() => setCheckIn(true)}>I did it — check in</button>
            <button className="btn btn-quiet btn-block" style={{ marginTop: 4 }} onClick={() => submit(true)}>Couldn’t today (that’s okay)</button>
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 20px' }}>
            <Kai pose="think" size={110} style={{ margin: '0 auto' }} />
            <h3 style={{ fontSize: 18, margin: '8px 0 4px' }}>No quest yet today</h3>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)', maxWidth: 240, margin: '0 auto 16px' }}>
              Finish a lesson and I’ll match a real-world mission to what you practiced.
            </p>
            <button className="btn btn-coral" onClick={() => dispatch({ type: 'SET_TAB', tab: 'learn' })}>Go learn something</button>
          </div>
        )}

        {/* history */}
        {state.questLog.length > 0 && (
          <>
            <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--ink-faint)', margin: '22px 0 10px' }}>
              Quest log · {doneCount} completed
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...state.questLog].reverse().map((entry, i) => {
                const q = ALL_QUESTS.find((x) => x.id === entry.id)
                const scale = FELT_SCALE.find((f) => f.v === entry.felt)
                return (
                  <div key={i} className="card row" style={{ padding: '11px 14px', gap: 11, opacity: entry.skipped ? 0.6 : 1 }}>
                    <span style={{ fontSize: 22 }}>{entry.skipped ? '💤' : scale?.emoji || '🙂'}</span>
                    <div className="grow">
                      <p style={{ fontSize: 14, fontWeight: 800 }}>{q?.title || 'Quest'}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>
                        {entry.skipped ? 'Skipped — no judgment' : scale?.label}{entry.note ? ` · “${entry.note}”` : ''}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-faint)' }}>{entry.day.slice(5)}</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ===== check-in sheet ===== */}
      <Sheet open={checkIn} onClose={() => setCheckIn(false)}>
        <h3 style={{ fontSize: 19, textAlign: 'center', marginBottom: 4 }}>You did the thing! 🎉</h3>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 14 }}>How did it feel out there?</p>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
          {FELT_SCALE.map((f) => (
            <button key={f.v} onClick={() => setFelt(f.v)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 6px', borderRadius: 14, width: 62,
                background: felt === f.v ? 'var(--teal-soft)' : 'transparent',
                border: felt === f.v ? '2px solid var(--teal)' : '2px solid transparent',
                transform: felt === f.v ? 'scale(1.06)' : 'scale(1)', transition: 'all 0.15s var(--spring)',
              }}>
              <span style={{ fontSize: 26 }}>{f.emoji}</span>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.15 }}>{f.label}</span>
            </button>
          ))}
        </div>
        <textarea
          value={note} onChange={(e) => setNote(e.target.value)} rows={2}
          placeholder="What happened? (optional — future you loves these notes)"
          style={{ width: '100%', borderRadius: 14, border: '2px solid var(--line-strong)', padding: '11px 13px', fontSize: 14, fontWeight: 700, resize: 'none', outline: 'none', marginBottom: 12, background: 'var(--paper)' }}
        />
        <button className="btn btn-teal btn-block" disabled={felt === null} onClick={() => submit(false)}>
          Log it · +💎15 · Score up
        </button>
      </Sheet>
    </div>
  )
}
