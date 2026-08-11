import { useMemo, useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, today } from '../state/store.jsx'
import { buildLesson, buildSituationLesson, lessonRewards } from '../engine/lessonEngine.js'
import { UNITS, UNIT_NODES, unitColor, nodeId as makeNodeId } from '../content/units.js'
import { NPCS } from '../content/npcs.js'
import { questForSkill } from '../content/quests.js'
import { situationById } from '../content/situations.js'
import { Kai, Confetti } from '../components/ui.jsx'

export default function LessonScreen() {
  const { state, dispatch } = useStore()
  // Keep the last node while AnimatePresence exit-animates after the store clears it
  const nodeRef = useRef(state.lesson)
  if (state.lesson) nodeRef.current = state.lesson
  const node = nodeRef.current
  const situation = node.kind === 'situation' ? situationById(node.situationId) : null
  const unit = situation
    ? { title: situation.label, emoji: situation.emoji, skill: situation.questSkill }
    : UNITS[node.unitId]
  const c = situation
    ? { color: 'var(--sky)', deep: 'var(--sky-deep)', soft: 'var(--sky-soft)' }
    : unitColor(unit)
  // A checkpoint reached out of order is a test-out attempt: 80%+ completes the unit
  const isTestOut = node.kind === 'checkpoint' &&
    UNIT_NODES.some((tpl, i) => tpl.kind !== 'checkpoint' && !state.completed[makeNodeId(node.unitId, i)])

  const sequence = useMemo(
    () => situation
      ? buildSituationLesson(situation)
      : buildLesson({ id: node.nodeId, kind: node.kind, unitId: node.unitId }),
    [node.nodeId]
  )
  const [queue, setQueue] = useState(() => sequence.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [hearts, setHearts] = useState(state.hearts)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [firstTry, setFirstTry] = useState({}) // exIdx -> true/false (first attempt result)
  const [roleplayPassed, setRoleplayPassed] = useState(false)
  const [banner, setBanner] = useState(null) // { correct, title, why }
  const [phase, setPhase] = useState('play') // play | results | dead
  const [quitConfirm, setQuitConfirm] = useState(false)

  const exIdx = queue[pos]
  const exercise = sequence[exIdx]
  const doneCount = Object.keys(firstTry).length
  const progress = doneCount / sequence.length

  function report(result) {
    // result: { correct, title, why, isRoleplay }
    const first = !(exIdx in firstTry)
    if (first) setFirstTry((f) => ({ ...f, [exIdx]: result.correct }))
    if (result.correct) {
      const nc = combo + 1
      setCombo(nc)
      setBestCombo((b) => Math.max(b, nc))
      if (result.isRoleplay) setRoleplayPassed(true)
    } else {
      setCombo(0)
      const h = hearts - 1
      setHearts(h)
      if (!result.isRoleplay) setQueue((q) => [...q, exIdx]) // re-drill it
      if (h <= 0) {
        setBanner(result)
        setTimeout(() => setPhase('dead'), 900)
        return
      }
    }
    setBanner(result)
  }

  function next() {
    setBanner(null)
    if (pos + 1 < queue.length) setPos(pos + 1)
    else setPhase('results')
  }

  const rewards = useMemo(() => {
    if (phase !== 'results') return null
    const correct = Object.values(firstTry).filter(Boolean).length
    return lessonRewards({
      correct, total: sequence.length, bestCombo, roleplayPassed,
      firstOfDay: state.lastActiveDay !== today(state),
    })
  }, [phase])

  // skill accuracy for EMA update
  function skillScores() {
    const per = {}
    sequence.forEach((ex, i) => {
      const skills = ex.skill === 'mixed' ? [] : [ex.skill]
      for (const s of skills) {
        per[s] = per[s] || { ok: 0, n: 0 }
        per[s].n++
        if (firstTry[i]) per[s].ok++
      }
    })
    const out = {}
    for (const [s, { ok, n }] of Object.entries(per)) out[s] = ok / n
    return out
  }

  const questSkill = situation ? situation.questSkill : unit.skill
  const upcomingQuest = (situation || !state.activeQuest)
    ? questForSkill(questSkill, state.questLog.map((q) => q.id))
    : null
  const testOutResult = phase === 'results' && isTestOut
    ? (rewards.accuracy >= 80 ? 'passed' : 'failed')
    : null

  function finish(goToQuest) {
    dispatch({
      type: 'FINISH_LESSON',
      nodeId: node.nodeId, unitId: node.unitId, kind: node.kind,
      testOut: testOutResult, questSkillOverride: situation ? situation.questSkill : null,
      rewards, heartsLeft: hearts, skillScores: skillScores(),
    })
    if (goToQuest) dispatch({ type: 'SET_TAB', tab: 'quests' })
  }

  if (phase === 'results') {
    return <Results unit={unit} c={c} rewards={rewards} bestCombo={bestCombo} quest={upcomingQuest}
      situation={situation} testOutResult={testOutResult} onFinish={finish} />
  }

  if (phase === 'dead') {
    return <OutOfHearts gems={state.gems} onRefill={() => { dispatch({ type: 'REFILL_HEARTS' }); setHearts(5); setPhase('play'); setBanner(null); next() }} onQuit={() => dispatch({ type: 'QUIT_LESSON' })} />
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ===== Lesson chrome ===== */}
      <div className="row" style={{ padding: '16px 16px 8px', gap: 12 }}>
        <button onClick={() => setQuitConfirm(true)} style={{ fontSize: 20, color: 'var(--ink-faint)', fontWeight: 800, padding: 4 }}>✕</button>
        <div className="grow" style={{ height: 16, background: 'var(--line)', borderRadius: 9, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={{ type: 'spring', stiffness: 130, damping: 20 }}
            style={{ height: '100%', background: c.color, borderRadius: 9, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 3, left: 8, right: 8, height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.35)' }} />
          </motion.div>
        </div>
        <div className="row" style={{ gap: 4, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--red)' }}>
          <motion.span key={hearts} initial={{ scale: 1.5 }} animate={{ scale: 1 }} style={{ fontSize: 19 }}>❤️</motion.span>
          {hearts}
        </div>
      </div>

      {/* combo badge */}
      <div style={{ height: 26, textAlign: 'center' }}>
        <AnimatePresence>
          {combo >= 2 && !banner && (
            <motion.span key={combo} initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              style={{
                display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                background: 'var(--sun-soft)', color: 'var(--sun-deep)', borderRadius: 12, padding: '3px 12px',
              }}>
              ⚡️ {combo} in a row!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Exercise ===== */}
      <div className="grow scroll-y" style={{ padding: '4px 20px 12px', display: 'flex', flexDirection: 'column' }}>
        <motion.div key={`${pos}-${exIdx}`}
          initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {exercise.type === 'roleplay'
            ? <Roleplay ex={exercise} locked={!!banner} onReport={report} />
            : <StaticExercise ex={exercise} locked={!!banner} onReport={report} />}
        </motion.div>
      </div>

      {/* ===== Feedback banner ===== */}
      <AnimatePresence>
        {banner && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            style={{
              background: banner.correct ? 'var(--teal-soft)' : 'var(--red-soft)',
              borderTop: `3px solid ${banner.correct ? 'var(--teal)' : 'var(--red)'}`,
              padding: '16px 20px calc(20px + env(safe-area-inset-bottom))',
            }}>
            <div className="row" style={{ gap: 10, marginBottom: 8 }}>
              <span style={{
                width: 34, height: 34, borderRadius: 17, display: 'grid', placeItems: 'center', fontSize: 19,
                background: banner.correct ? 'var(--teal)' : 'var(--red)', color: '#fff', fontWeight: 900,
              }}>
                {banner.correct ? '✓' : '✕'}
              </span>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: banner.correct ? 'var(--teal-deep)' : 'var(--red-deep)' }}>
                {banner.title}
              </p>
            </div>
            {banner.why && <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45, color: 'var(--ink)', marginBottom: 14 }}>{banner.why}</p>}
            <button className={`btn btn-block ${banner.correct ? 'btn-teal' : 'btn-coral'}`} onClick={next}>Continue</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* quit confirm */}
      <AnimatePresence>
        {quitConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(61,52,80,0.6)', zIndex: 80, display: 'grid', placeItems: 'center', padding: 30 }}>
            <div style={{ background: 'var(--card)', borderRadius: 24, padding: 24, textAlign: 'center' }}>
              <Kai pose="sad" size={80} style={{ margin: '0 auto' }} />
              <h3 style={{ fontSize: 19, margin: '6px 0 4px' }}>Leaving already?</h3>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 16 }}>You’ll lose this lesson’s progress.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-coral btn-block" onClick={() => setQuitConfirm(false)}>Keep learning</button>
                <button className="btn btn-quiet" onClick={() => dispatch({ type: 'QUIT_LESSON' })}>Quit lesson</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =================== Static exercise types =================== */
function StaticExercise({ ex, locked, onReport }) {
  const [sel, setSel] = useState(null)
  const [orderPicked, setOrderPicked] = useState([])
  const [fixPhase, setFixPhase] = useState('find') // fixMessage: find -> repair
  const [foundBad, setFoundBad] = useState(false)

  const shuffledTiles = useMemo(() => {
    if (ex.type !== 'order') return null
    const tiles = ex.tiles.map((t, i) => ({ t, i }))
    // deterministic-ish shuffle that never equals the correct order
    const rot = [...tiles.slice(1), tiles[0]]
    return rot.sort((a, b) => ((a.i * 7 + 3) % 5) - ((b.i * 7 + 3) % 5))
  }, [ex])

  const TITLES_OK = ['Nice!', 'Exactly right!', 'Smooth.', 'You’ve got this!', 'Textbook.']
  const okTitle = TITLES_OK[(ex.id?.length || 0) % TITLES_OK.length]

  function check() {
    if (ex.type === 'order') {
      const correct = orderPicked.length === ex.tiles.length && orderPicked.every((p, i) => p.i === i)
      onReport({ correct, title: correct ? okTitle : 'Not quite', why: ex.why })
      return
    }
    if (ex.type === 'fixMessage') {
      if (fixPhase === 'find') {
        const correct = ex.segments[sel]?.bad
        if (correct) { setFoundBad(true); setFixPhase('repair'); setSel(null); return }
        onReport({ correct: false, title: 'That line was fine', why: ex.segments.find((s) => s.bad)?.why })
        return
      }
      const opt = ex.repair[sel]
      onReport({ correct: !!opt.correct, title: opt.correct ? okTitle : 'Hmm, not that', why: opt.why })
      return
    }
    if (ex.type === 'fillBlank') {
      const opt = ex.tiles[sel]
      onReport({ correct: !!opt.correct, title: opt.correct ? okTitle : 'Not quite', why: ex.why })
      return
    }
    // bestReply / readRoom
    const opt = ex.options[sel]
    onReport({ correct: !!opt.correct, title: opt.correct ? okTitle : 'Not quite', why: opt.why })
  }

  const canCheck = ex.type === 'order' ? orderPicked.length === ex.tiles.length : sel !== null

  return (
    <>
      <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--ink-faint)', marginBottom: 4 }}>
        {ex.prompt}
      </p>

      {/* scene card */}
      {ex.scene && (
        <div className="card" style={{ padding: '12px 15px', marginBottom: 12, background: 'var(--sun-soft)', borderColor: 'var(--sun)' }}>
          <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.45, color: '#7a5200' }}>🎬 {ex.scene}</p>
        </div>
      )}

      {/* ===== per-type body ===== */}
      {(ex.type === 'bestReply' || ex.type === 'readRoom') && (
        <>
          {ex.question && <h3 style={{ fontSize: 18, marginBottom: 12 }}>{ex.question}</h3>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {ex.options.map((o, i) => (
              <button key={i} className={`chip ${sel === i ? 'selected' : ''} ${locked && o.correct ? 'correct' : ''} ${locked && sel === i && !o.correct ? 'wrong' : ''}`}
                disabled={locked} onClick={() => setSel(i)}>
                {o.text}
              </button>
            ))}
          </div>
        </>
      )}

      {ex.type === 'fillBlank' && (
        <>
          <div className="card" style={{ padding: '16px 18px', marginBottom: 14 }}>
            <p style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.6 }}>
              {ex.line[0]}
              <span style={{
                display: 'inline-block', minWidth: 110, borderBottom: '3px dashed var(--ink-faint)',
                color: 'var(--sky-deep)', textAlign: 'center', padding: '0 6px',
              }}>
                {sel !== null ? ex.tiles[sel].text : ' '}
              </span>
              {ex.line[1]}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ex.tiles.map((t, i) => (
              <button key={i} className={`tile ${sel === i ? 'ghosted' : ''}`} disabled={locked} onClick={() => setSel(i)}>
                {t.text}
              </button>
            ))}
          </div>
        </>
      )}

      {ex.type === 'order' && (
        <>
          <div style={{ minHeight: 110, borderRadius: 16, border: '2px dashed var(--line-strong)', padding: 10, marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {orderPicked.map((p, i) => (
              <motion.button key={p.i} layout className="tile" style={{ textAlign: 'left' }}
                disabled={locked}
                onClick={() => setOrderPicked(orderPicked.filter((x) => x.i !== p.i))}>
                <span style={{ color: 'var(--ink-faint)', marginRight: 7, fontWeight: 900 }}>{i + 1}</span>{p.t}
              </motion.button>
            ))}
            {orderPicked.length === 0 && <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-faint)', textAlign: 'center', margin: 'auto' }}>Tap the lines in order 👇</p>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {shuffledTiles.map((p) => (
              <button key={p.i} className={`tile ${orderPicked.some((x) => x.i === p.i) ? 'ghosted' : ''}`}
                style={{ textAlign: 'left' }} disabled={locked}
                onClick={() => setOrderPicked([...orderPicked, p])}>
                {p.t}
              </button>
            ))}
          </div>
        </>
      )}

      {ex.type === 'fixMessage' && (
        <>
          <h3 style={{ fontSize: 16.5, marginBottom: 10 }}>
            {fixPhase === 'find' ? 'Tap the line that kills the vibe 👇' : '✂️ Found it! Now pick the repair:'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {ex.segments.map((s, i) => (
              <button key={i}
                className={`chip ${fixPhase === 'find' && sel === i ? 'selected' : ''} ${foundBad && s.bad ? 'wrong' : ''}`}
                style={{ borderRadius: '16px 16px 16px 5px', textDecoration: foundBad && s.bad ? 'line-through' : 'none' }}
                disabled={locked || fixPhase === 'repair'}
                onClick={() => setSel(i)}>
                {s.text}
              </button>
            ))}
          </div>
          {fixPhase === 'repair' && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ex.repair.map((r, i) => (
                <button key={i} className={`chip ${sel === i ? 'selected' : ''} ${locked && r.correct ? 'correct' : ''}`}
                  disabled={locked} onClick={() => setSel(i)}>
                  {r.text}
                </button>
              ))}
            </motion.div>
          )}
        </>
      )}

      <div className="grow" style={{ minHeight: 14 }} />
      {!locked && (
        <button className="btn btn-teal btn-block" disabled={!canCheck} onClick={check} style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
          Check
        </button>
      )}
    </>
  )
}

/* =================== Roleplay =================== */
function Roleplay({ ex, locked, onReport }) {
  const npc = NPCS[ex.npc]
  const [beat, setBeat] = useState(0)
  const [chat, setChat] = useState([]) // {who, text, feedback?, vibe?}
  const [vibe, setVibe] = useState(0)
  const [typing, setTyping] = useState(true)
  const [showOptions, setShowOptions] = useState(false)
  const scrollRef = useRef(null)
  const vibeMax = ex.beats.length * 2

  useEffect(() => {
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      setChat((c) => [...c, { who: 'npc', text: ex.beats[beat].npcLine }])
      setTimeout(() => setShowOptions(true), 250)
    }, 850)
    return () => clearTimeout(t)
  }, [beat])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat, typing, showOptions])

  function pick(opt) {
    setShowOptions(false)
    const newVibe = vibe + opt.vibe
    setVibe(newVibe)
    setChat((c) => [...c, { who: 'me', text: opt.text, vibe: opt.vibe, feedback: opt.feedback }])
    if (beat + 1 < ex.beats.length) {
      setTimeout(() => setBeat(beat + 1), 1100)
    } else {
      const passed = newVibe >= ex.threshold
      setTimeout(() => onReport({
        correct: passed, isRoleplay: true,
        title: passed ? 'Great conversation! +4 XP bonus' : 'That conversation fizzled',
        why: passed ? ex.whyPass : ex.whyFail,
      }), 1300)
    }
  }

  const vibePct = Math.max(0, Math.min(1, (vibe + 2) / (vibeMax + 2)))
  const vibeEmoji = vibePct > 0.72 ? '😄' : vibePct > 0.45 ? '🙂' : vibePct > 0.25 ? '😐' : '😬'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0 -20px', overflow: 'hidden' }}>
      {/* scene + vibe header */}
      <div style={{ padding: '0 20px 10px' }}>
        <div className="row" style={{ gap: 10, marginBottom: 8 }}>
          <span style={{ width: 44, height: 44, borderRadius: 22, background: npc.soft, display: 'grid', placeItems: 'center', fontSize: 22, border: `2px solid ${npc.color}` }}>{npc.emoji}</span>
          <div className="grow">
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{npc.name} <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--ink-soft)' }}>· {npc.role}</span></p>
            <div className="row" style={{ gap: 7 }}>
              <div style={{ flex: 1, height: 9, background: 'var(--line)', borderRadius: 5, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${vibePct * 100}%`, background: vibePct > 0.45 ? 'var(--teal)' : 'var(--sun)' }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }} style={{ height: '100%', borderRadius: 5 }} />
              </div>
              <motion.span key={vibeEmoji} initial={{ scale: 1.6 }} animate={{ scale: 1 }} style={{ fontSize: 16 }}>{vibeEmoji}</motion.span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', background: 'var(--card)', border: '2px solid var(--line)', borderRadius: 10, padding: '7px 11px' }}>
          🎬 {ex.scene} · <b>Goal: {ex.goal}</b>
        </p>
      </div>

      {/* chat */}
      <div ref={scrollRef} className="grow scroll-y" style={{ padding: '4px 20px 8px' }}>
        {chat.map((m, i) => (
          <div key={i}>
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{ display: 'flex', justifyContent: m.who === 'me' ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
              <div style={{
                maxWidth: '82%', padding: '10px 14px', fontSize: 15, fontWeight: 700, lineHeight: 1.4,
                borderRadius: m.who === 'me' ? '16px 16px 5px 16px' : '16px 16px 16px 5px',
                background: m.who === 'me' ? 'var(--sky)' : npc.soft,
                color: m.who === 'me' ? '#fff' : 'var(--ink)',
                border: m.who === 'me' ? 'none' : `2px solid ${npc.color}`,
              }}>
                {m.text}
              </div>
            </motion.div>
            {m.feedback && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{
                  textAlign: 'right', fontSize: 11.5, fontWeight: 800, marginBottom: 8,
                  color: m.vibe > 1 ? 'var(--teal-deep)' : m.vibe > 0 ? 'var(--sun-deep)' : 'var(--red)',
                }}>
                {m.vibe > 1 ? '++ ' : m.vibe > 0 ? '+ ' : '– '}{m.feedback}
              </motion.p>
            )}
          </div>
        ))}
        {typing && (
          <div className="row" style={{ gap: 4, padding: '10px 14px', background: npc.soft, border: `2px solid ${npc.color}`, borderRadius: '16px 16px 16px 5px', width: 62 }}>
            {[0, 1, 2].map((i) => (
              <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.13 }}
                style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--ink-soft)' }} />
            ))}
          </div>
        )}
      </div>

      {/* options */}
      <div style={{ padding: '8px 20px 4px', minHeight: 60 }}>
        <AnimatePresence>
          {showOptions && !locked && (
            <motion.div initial="hide" animate="show" exit={{ opacity: 0 }}
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ex.beats[beat].options.map((o, i) => (
                <motion.button key={i} className="chip" variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  onClick={() => pick(o)}>
                  {o.text}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* =================== Results =================== */
function Results({ unit, c, rewards, bestCombo, quest, situation, testOutResult, onFinish }) {
  const [shownXp, setShownXp] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 900)
      setShownXp(Math.round(rewards.xp * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px 24px calc(24px + env(safe-area-inset-bottom))', position: 'relative', overflow: 'hidden' }}>
      <Confetti count={38} />
      <div className="grow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
          <Kai pose="cheer" size={130} />
        </motion.div>
        <h2 style={{ fontSize: 27, textAlign: 'center' }}>
          {testOutResult === 'passed' ? 'Tested out! 🏆'
            : situation ? 'You’re ready. Go get it.'
            : rewards.perfect ? 'PERFECT lesson!' : 'Lesson complete!'}
        </h2>
        <p style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink-soft)' }}>{unit.emoji} {unit.title}</p>
        {testOutResult === 'passed' && (
          <p style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--sun-deep)', background: 'var(--sun-soft)', borderRadius: 12, padding: '7px 14px' }}>
            Whole unit complete — chest included 🎁
          </p>
        )}
        {testOutResult === 'failed' && (
          <p style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink-soft)', background: 'var(--card)', border: '2px solid var(--line)', borderRadius: 12, padding: '7px 14px' }}>
            80%+ tests you out — this one counts as practice. Solid reps though!
          </p>
        )}
        {situation && (
          <p style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--sky-deep)', background: 'var(--sky-soft)', borderRadius: 12, padding: '7px 14px', textAlign: 'center' }}>
            💡 {situation.pep}
          </p>
        )}

        <div className="row" style={{ gap: 10, marginTop: 14 }}>
          <StatCard label="XP earned" value={`+${shownXp}`} color="var(--sun-deep)" bg="var(--sun-soft)" delay={0} />
          <StatCard label="Accuracy" value={`${rewards.accuracy}%`} color="var(--teal-deep)" bg="var(--teal-soft)" delay={0.15} />
          <StatCard label="Best combo" value={`⚡️${bestCombo}`} color="var(--violet-deep)" bg="var(--violet-soft)" delay={0.3} />
        </div>

        {quest && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.75, type: 'spring', stiffness: 200, damping: 16 }}
            style={{
              marginTop: 18, width: '100%', borderRadius: 18, padding: '14px 16px',
              background: 'linear-gradient(110deg, var(--sky-soft), var(--teal-soft))',
              border: '2px solid var(--teal)', boxShadow: '0 4px 0 var(--teal-deep)',
            }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--teal-deep)' }}>🎯 Field quest unlocked</p>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{quest.title}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-soft)', lineHeight: 1.4 }}>Take today’s skill into the real world — that’s where your Real-World Score grows.</p>
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quest && <button className="btn btn-teal btn-block" onClick={() => onFinish(true)}>See my quest</button>}
        <button className={`btn btn-block ${quest ? 'btn-ghost' : 'btn-coral'}`} onClick={() => onFinish(false)}>Continue</button>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, bg, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + delay, type: 'spring', stiffness: 240, damping: 18 }}
      style={{ background: bg, borderRadius: 16, padding: '12px 14px', textAlign: 'center', minWidth: 88 }}>
      <p style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color }}>{value}</p>
    </motion.div>
  )
}

/* =================== Out of hearts =================== */
function OutOfHearts({ gems, onRefill, onQuit }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 30 }}>
      <div style={{ textAlign: 'center' }}>
        <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Kai pose="sad" size={120} style={{ margin: '0 auto' }} />
        </motion.div>
        <h2 style={{ fontSize: 24, margin: '10px 0 6px' }}>Out of hearts!</h2>
        <p style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink-soft)', maxWidth: 250, margin: '0 auto 20px', lineHeight: 1.5 }}>
          Even the smoothest talkers fumble. Refill and keep going?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-sky btn-block" disabled={gems < 50} onClick={onRefill}>💎 50 · Refill hearts</button>
          <button className="btn btn-quiet" onClick={onQuit}>End lesson</button>
        </div>
      </div>
    </div>
  )
}
