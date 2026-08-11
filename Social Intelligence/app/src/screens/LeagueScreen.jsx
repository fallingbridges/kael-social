import { motion } from 'framer-motion'
import { useStore } from '../state/store.jsx'
import { leagueBoard, LEAGUE_NAME, PROMOTE_ZONE, DEMOTE_ZONE } from '../content/league.js'

export default function LeagueScreen() {
  const { state } = useStore()
  const rows = leagueBoard(state.leagueJoinedAt || Date.now(), state.xp, state.profile?.name)
  const myRank = rows.findIndex((r) => r.me) + 1

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px 20px 14px', textAlign: 'center', background: 'linear-gradient(160deg, var(--violet-soft), var(--paper) 80%)' }}>
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          style={{ fontSize: 52, marginBottom: 2 }}>
          🏆
        </motion.div>
        <h1 style={{ fontSize: 22, color: 'var(--violet-deep)' }}>{LEAGUE_NAME}</h1>
        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)' }}>
          Top {PROMOTE_ZONE} advance at week’s end · You’re #{myRank}
        </p>
      </header>

      <div className="grow scroll-y" style={{ padding: '6px 16px 30px' }}>
        {rows.map((r, i) => {
          const promote = i < PROMOTE_ZONE
          const demote = i >= rows.length - DEMOTE_ZONE
          return (
            <div key={r.name}>
              {i === PROMOTE_ZONE && <ZoneDivider label="⬆︎ Promotion zone above" color="var(--teal-deep)" />}
              {i === rows.length - DEMOTE_ZONE && <ZoneDivider label="⬇︎ Danger zone below" color="var(--red-deep)" />}
              <motion.div
                initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="row"
                style={{
                  gap: 12, padding: '11px 14px', borderRadius: 16, marginBottom: 6,
                  background: r.me ? 'var(--violet-soft)' : 'var(--card)',
                  border: r.me ? '2.5px solid var(--violet)' : '2px solid var(--line)',
                  boxShadow: r.me ? '0 3px 0 var(--violet-deep)' : 'var(--pop-card)',
                }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, width: 26, textAlign: 'center', fontSize: 15,
                  color: promote ? 'var(--teal-deep)' : demote ? 'var(--red-deep)' : 'var(--ink-faint)',
                }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <span style={{ fontSize: 24 }}>{r.emoji}</span>
                <p className="grow" style={{ fontSize: 15, fontWeight: 800 }}>
                  {r.name} {r.me && <span style={{ fontSize: 11, color: 'var(--violet-deep)' }}>· YOU</span>}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--sun-deep)' }}>{r.xp} XP</p>
              </motion.div>
            </div>
          )
        })}
        <p style={{ textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', marginTop: 14 }}>
          XP from lessons and quests counts toward your league.
        </p>
      </div>
    </div>
  )
}

function ZoneDivider({ label, color }) {
  return (
    <div className="row" style={{ gap: 10, margin: '10px 4px' }}>
      <div className="grow" style={{ height: 2, background: 'var(--line-strong)' }} />
      <span style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      <div className="grow" style={{ height: 2, background: 'var(--line-strong)' }} />
    </div>
  )
}
