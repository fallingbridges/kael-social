import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../state/store.jsx'
import { RadarChart, TrendChart } from '../components/charts.jsx'
import { Kai } from '../components/ui.jsx'

export default function ProfileScreen() {
  const { state, dispatch } = useStore()
  const [devTaps, setDevTaps] = useState(0)
  const [confirmRestart, setConfirmRestart] = useState(false)
  const d = state.profile?.diagnosis
  const questsDone = state.questLog.filter((q) => !q.skipped).length

  return (
    <div className="grow scroll-y" style={{ padding: '20px 18px 40px' }}>
      {/* identity card */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="row" style={{
          gap: 14, borderRadius: 22, padding: '18px 18px',
          background: 'linear-gradient(120deg, var(--coral), var(--pink))', boxShadow: '0 5px 0 var(--coral-deep)', marginBottom: 14,
        }}>
        <button onClick={() => setDevTaps(devTaps + 1)} style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 18, padding: 6 }}>
          <Kai pose="happy" size={54} />
        </button>
        <div>
          <h1 style={{ fontSize: 22, color: '#fff' }}>{state.profile?.name}</h1>
          <p style={{ fontSize: 13.5, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>{d?.archetype}</p>
        </div>
      </motion.div>

      {/* stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <Stat icon="🔥" label="Day streak" value={state.streak} color="var(--sun-deep)" />
        <Stat icon="⚡️" label="Total XP" value={state.xp} color="var(--violet-deep)" />
        <Stat icon="🎯" label="Quests done IRL" value={questsDone} color="var(--teal-deep)" />
        <Stat icon="💎" label="Gems" value={state.gems} color="var(--sky-deep)" />
      </div>

      {/* Real-world score */}
      <SectionTitle>🌍 Real-World Score</SectionTitle>
      <div className="card" style={{ padding: '14px 10px 6px', marginBottom: 6 }}>
        <div className="row" style={{ padding: '0 8px', marginBottom: 4 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--teal-deep)' }}>
            {state.realWorld.score}<span style={{ fontSize: 14, color: 'var(--ink-faint)' }}> /100</span>
          </p>
          <div className="grow" />
          <p style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--ink-faint)', textAlign: 'right', maxWidth: 150, lineHeight: 1.3 }}>
            grows only when you check in from real life
          </p>
        </div>
        <TrendChart history={state.realWorld.history} />
        {state.realWorld.history.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', padding: '0 20px 10px' }}>
            Flat so far — complete a field quest to plant the first point 🌱
          </p>
        )}
      </div>

      {/* skills radar */}
      <SectionTitle style={{ marginTop: 16 }}>📈 Skills — then vs now</SectionTitle>
      <div className="card" style={{ padding: '6px 0 2px', marginBottom: 6 }}>
        <RadarChart scores={state.skills || {}} baseline={state.baseline} size={280} />
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--ink-faint)', paddingBottom: 12 }}>
          <span style={{ color: 'var(--ink-soft)' }}>▪︎ dashed</span> = your diagnosis · <span style={{ color: 'var(--coral)' }}>▪︎ solid</span> = today
        </p>
      </div>

      {/* restart */}
      {!confirmRestart ? (
        <button className="btn btn-ghost btn-block" style={{ marginTop: 18 }} onClick={() => setConfirmRestart(true)}>
          🔄 Restart from onboarding
        </button>
      ) : (
        <div style={{ marginTop: 18 }}>
          <p style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, color: 'var(--red-deep)', marginBottom: 8 }}>
            Wipes your path, XP and quest history — sure?
          </p>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-coral" style={{ flex: 1 }} onClick={() => dispatch({ type: 'RESET' })}>Yes, restart</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmRestart(false)}>Keep going</button>
          </div>
        </div>
      )}

      {/* dev controls (tap Kai 5x) */}
      {devTaps >= 5 && (
        <div className="card" style={{ padding: 14, marginTop: 16, borderColor: 'var(--violet)' }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--violet-deep)', marginBottom: 10 }}>🛠️ DEMO CONTROLS</p>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-violet" style={{ fontSize: 13, padding: '10px 14px' }} onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
              +1 day (streak demo)
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 14px' }} onClick={() => dispatch({ type: 'RESET' })}>
              Reset app
            </button>
          </div>
        </div>
      )}
      <p style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-faint)', marginTop: 20 }}>
        rapport prototype · made with 🦊
      </p>
    </div>
  )
}

function Stat({ icon, label, value, color }) {
  return (
    <div className="card row" style={{ padding: '13px 15px', gap: 11 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</p>
      </div>
    </div>
  )
}

function SectionTitle({ children, style }) {
  return <p style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--ink-soft)', marginBottom: 8, ...style }}>{children}</p>
}
