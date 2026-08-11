import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, pathUnits, unitNodeStatus, recommendedUnit, unitComplete } from '../state/store.jsx'
import { UNITS, UNIT_NODES, unitColor, nodeId } from '../content/units.js'
import { FIELD_QUESTS } from '../content/quests.js'
import { SITUATIONS } from '../content/situations.js'
import { StatPill, GoalRing, Sheet, Kai, Confetti } from '../components/ui.jsx'

const OFFSETS = [0, 1, 1.6, 1, 0] // serpentine curve per unit (sign alternates)

export default function LearnScreen() {
  const { state, dispatch } = useStore()
  const [sheetNode, setSheetNode] = useState(null)
  const [shakeId, setShakeId] = useState(null)
  const [tonightOpen, setTonightOpen] = useState(false)

  const units = pathUnits(state)
  const recUnit = recommendedUnit(state)
  const activeQuest = state.activeQuest
    ? Object.values(FIELD_QUESTS).flat().find((q) => q.id === state.activeQuest)
    : null

  function tapNode(node, status) {
    if (status === 'locked') {
      setShakeId(node.id)
      setTimeout(() => setShakeId(null), 450)
      return
    }
    setSheetNode({ ...node, status })
  }

  function startSituation(situation) {
    setTonightOpen(false)
    dispatch({ type: 'START_LESSON', nodeId: 'situ-' + situation.id, kind: 'situation', unitId: null, situationId: situation.id })
  }

  function startNode(node) {
    setSheetNode(null)
    if (node.kind === 'chest' && node.status !== 'done') {
      dispatch({ type: 'OPEN_CHEST', nodeId: node.id })
    } else {
      dispatch({ type: 'START_LESSON', nodeId: node.id, kind: node.kind, unitId: node.unitId })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* ===== HUD ===== */}
      <header className="row" style={{ padding: '14px 18px 10px', gap: 16, borderBottom: '2px solid var(--line)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 20 }}>
        <StatPill icon="🔥" value={state.streak} color="var(--sun-deep)" />
        <StatPill icon="💎" value={state.gems} color="var(--sky-deep)" />
        <StatPill icon="❤️" value={state.hearts} color="var(--red)" />
        <div className="grow" />
        <div className="row" style={{ gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Daily goal</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--sun-deep)' }}>{Math.min(state.xpToday, state.dailyGoal)}/{state.dailyGoal} XP</p>
          </div>
          <GoalRing value={state.xpToday} goal={state.dailyGoal} />
        </div>
      </header>

      {/* ===== Tonight I have… ===== */}
      <motion.button initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => setTonightOpen(true)}
        className="row" style={{
          margin: '12px 16px 0', gap: 12, textAlign: 'left',
          background: 'linear-gradient(105deg, var(--violet-soft), var(--pink-soft))',
          border: '2px solid var(--violet)', borderRadius: 16, padding: '11px 14px', boxShadow: '0 3px 0 var(--violet-deep)',
        }}>
        <span style={{ fontSize: 24 }}>⚡️</span>
        <div className="grow">
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--violet-deep)' }}>Something coming up?</p>
          <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>Tonight I have… → 3-min prep</p>
        </div>
        <span style={{ fontSize: 18, color: 'var(--violet-deep)' }}>›</span>
      </motion.button>

      {/* ===== Quest banner ===== */}
      {activeQuest && (
        <motion.button initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch({ type: 'SET_TAB', tab: 'quests' })}
          className="row" style={{
            margin: '12px 16px 0', gap: 12, textAlign: 'left', background: 'linear-gradient(100deg, var(--sky-soft), var(--teal-soft))',
            border: '2px solid var(--teal)', borderRadius: 16, padding: '11px 14px', boxShadow: '0 3px 0 var(--teal-deep)',
          }}>
          <span style={{ fontSize: 24 }}>🎯</span>
          <div className="grow">
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--teal-deep)' }}>Today’s field quest</p>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)' }}>{activeQuest.title}</p>
          </div>
          <span style={{ fontSize: 18, color: 'var(--teal-deep)' }}>›</span>
        </motion.button>
      )}

      {/* ===== Path ===== */}
      <div style={{ padding: '18px 0 40px' }}>
        {units.map((uid, ui) => {
          const unit = UNITS[uid]
          const c = unitColor(unit)
          const unitDone = unitComplete(state, uid)
          const isRec = uid === recUnit
          return (
            <section key={uid}>
              <div style={{
                margin: '10px 16px 16px', borderRadius: 18, padding: '14px 18px',
                background: unitDone ? 'var(--card)' : c.color,
                boxShadow: unitDone ? 'var(--pop-card)' : `0 4px 0 ${c.deep}`,
                border: unitDone ? '2px solid var(--line)' : 'none',
                position: 'relative',
              }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: unitDone ? 'var(--ink-faint)' : 'rgba(255,255,255,0.85)' }}>
                  Unit {ui + 1} {unitDone && '· complete ✓'}{!unitDone && isRec && ' · Kai’s pick for you'}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: unitDone ? 'var(--ink)' : '#fff' }}>
                  {unit.emoji} {unit.title}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, marginBottom: 14 }}>
                {UNIT_NODES.map((tpl, ni) => {
                  const nid = nodeId(uid, ni)
                  const node = { ...tpl, id: nid, unitId: uid, index: ni }
                  let status = unitNodeStatus(state, uid, ni)
                  // The recommended unit's next node gets the glowing START treatment
                  if (status === 'available' && isRec) status = 'current'
                  const dx = OFFSETS[ni] * 58 * (ui % 2 === 0 ? -1 : 1)
                  return (
                    <PathNode key={nid} node={node} status={status} color={c} dx={dx}
                      shaking={shakeId === nid} onTap={() => tapNode(node, status)} />
                  )
                })}
              </div>
            </section>
          )
        })}
        <div style={{ textAlign: 'center', padding: '10px 40px 20px' }}>
          <Kai pose="happy" size={70} />
          <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-faint)' }}>More units coming as you grow 🌱</p>
        </div>
      </div>

      {/* ===== Node sheet ===== */}
      <Sheet open={!!sheetNode} onClose={() => setSheetNode(null)}>
        {sheetNode && <NodeSheetBody node={sheetNode} state={state} onStart={() => startNode(sheetNode)} />}
      </Sheet>

      {/* ===== Tonight I have… sheet ===== */}
      <Sheet open={tonightOpen} onClose={() => setTonightOpen(false)}>
        <h3 style={{ fontSize: 20, textAlign: 'center', marginBottom: 2 }}>Tonight I have… ⚡️</h3>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 14 }}>
          A 3-minute prep for the real thing — no path required.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {SITUATIONS.map((s) => (
            <button key={s.id} className="chip row" style={{ gap: 12 }} onClick={() => startSituation(s)}>
              <span style={{ fontSize: 24 }}>{s.emoji}</span>
              <span>
                <span style={{ display: 'block', fontSize: 15 }}>{s.label}</span>
                <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>{s.blurb}</span>
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      {/* ===== Streak celebration ===== */}
      <AnimatePresence>
        {state.celebration === 'streak' && <StreakCelebration streak={state.streak} onClose={() => dispatch({ type: 'SET_TAB', tab: 'learn' })} />}
      </AnimatePresence>
    </div>
  )
}

function PathNode({ node, status, color, dx, shaking, onTap }) {
  const icon = node.kind === 'chest' ? '🎁' : node.kind === 'checkpoint' ? '🏆' : status === 'done' ? '✓' : '★'
  const muted = status === 'locked' || status === 'testout'
  const bg = muted ? 'var(--line-strong)' : status === 'done' ? 'var(--sun)' : color.color
  const pop = muted ? '0 5px 0 #d0c4b2' : status === 'done' ? '0 5px 0 var(--sun-deep)' : `0 5px 0 ${color.deep}`
  return (
    <div style={{ transform: `translateX(${dx}px)`, position: 'relative' }}>
      {status === 'current' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: -38, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--card)', border: `2px solid ${color.color}`, color: color.deep,
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, letterSpacing: 1,
            padding: '5px 14px', borderRadius: 12, whiteSpace: 'nowrap', zIndex: 2,
          }}>
          START
          <span style={{
            position: 'absolute', bottom: -6, left: '50%', marginLeft: -5, width: 10, height: 10,
            background: 'var(--card)', borderRight: `2px solid ${color.color}`, borderBottom: `2px solid ${color.color}`,
            transform: 'rotate(45deg)',
          }} />
        </motion.div>
      )}
      <motion.button
        onClick={onTap}
        whileTap={status !== 'locked' ? { scale: 0.9 } : undefined}
        animate={shaking ? { x: [0, -7, 6, -4, 3, 0] } : {}}
        transition={shaking ? { duration: 0.4 } : {}}
        style={{
          width: 66, height: 66, borderRadius: '50%', display: 'grid', placeItems: 'center',
          background: bg, boxShadow: pop,
          fontSize: node.kind === 'lesson' ? 26 : 28,
          color: '#fff', fontWeight: 900,
          animation: status === 'current' ? 'pulse-ring 1.8s infinite' : 'none',
          filter: status === 'locked' ? 'saturate(0.25)' : status === 'testout' ? 'saturate(0.55)' : 'none',
          outline: status === 'testout' ? `3px dashed ${color.color}` : 'none',
          outlineOffset: 3,
        }}>
        <span style={{ transform: 'translateY(-1px)' }}>{icon}</span>
      </motion.button>
      {status === 'testout' && (
        <span style={{
          position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)',
          fontSize: 9, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase',
          color: color.deep, whiteSpace: 'nowrap',
        }}>
          test out
        </span>
      )}
    </div>
  )
}

function NodeSheetBody({ node, state, onStart }) {
  const unit = UNITS[node.unitId]
  const c = unitColor(unit)
  const done = state.completed[node.id]
  const isTestOut = node.status === 'testout'
  const title = node.kind === 'chest' ? 'Reward chest'
    : isTestOut ? `Test out of ${unit.title}`
    : node.kind === 'checkpoint' ? `${unit.title} — Checkpoint`
    : `${unit.title} · Lesson ${node.n}`
  const desc = node.kind === 'chest'
    ? 'A little something for the grind. Open it!'
    : isTestOut
      ? 'Skip the wait — score 80%+ on mixed challenges and the whole unit (chest included) is yours.'
      : node.kind === 'checkpoint'
        ? 'Prove the unit. Mixed challenges, slightly spicier. Beat it to finish the unit.'
        : unit.tagline
  const btnLabel = node.kind === 'chest' ? (done ? 'Opened' : 'Open chest')
    : isTestOut ? 'Test out · 80%+ to pass'
    : done ? `Practice again · +XP` : 'Start · +10 XP min'
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: 20, display: 'grid', placeItems: 'center', margin: '0 auto 10px',
        background: c.soft, fontSize: 30,
      }}>
        {node.kind === 'chest' ? '🎁' : node.kind === 'checkpoint' ? '🏆' : unit.emoji}
      </div>
      <h3 style={{ fontSize: 20, marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>{desc}</p>
      {done && node.kind !== 'chest' && (
        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--sun-deep)', marginBottom: 4 }}>
          Best: {done.accuracy}% {done.perfect && '· PERFECT ✨'}
        </p>
      )}
      <button className="btn btn-block" onClick={onStart} disabled={node.kind === 'chest' && !!done}
        style={{ marginTop: 12, background: c.color, color: '#fff', boxShadow: `0 4px 0 ${c.deep}` }}>
        {btnLabel}
      </button>
    </div>
  )
}

function StreakCelebration({ streak, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 70, background: 'rgba(61,52,80,0.75)', display: 'grid', placeItems: 'center' }}>
      <Confetti count={40} />
      <motion.div initial={{ scale: 0.6, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        style={{ background: 'var(--card)', borderRadius: 28, padding: '30px 36px', textAlign: 'center', margin: 24 }}>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ fontSize: 64 }}>🔥</motion.div>
        <h2 style={{ fontSize: 34, color: 'var(--sun-deep)' }}>{streak} day{streak > 1 ? 's' : ''}</h2>
        <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-soft)', marginBottom: 16 }}>
          {streak === 1 ? 'Streak started. Same time tomorrow?' : 'Streak extended. You’re building a habit.'}
        </p>
        <button className="btn btn-sun" onClick={onClose}>Keep going</button>
      </motion.div>
    </motion.div>
  )
}
