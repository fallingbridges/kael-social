import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

/* ===== Kai the fox — SVG mascot with poses ===== */
export function Kai({ pose = 'happy', size = 120, className = '', style }) {
  const eyes = {
    happy: (
      <>
        <path d="M34 44 q5 -7 10 0" stroke="#3d3450" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M56 44 q5 -7 10 0" stroke="#3d3450" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    ),
    cheer: (
      <>
        <text x="31" y="50" fontSize="15">✨</text>
        <text x="54" y="50" fontSize="15">✨</text>
      </>
    ),
    think: (
      <>
        <circle cx="39" cy="41" r="3.4" fill="#3d3450" />
        <circle cx="61" cy="41" r="3.4" fill="#3d3450" />
        <circle cx="40.2" cy="39.8" r="1.1" fill="#fff" />
        <circle cx="62.2" cy="39.8" r="1.1" fill="#fff" />
      </>
    ),
    sad: (
      <>
        <path d="M34 46 q5 5 10 0" stroke="#3d3450" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M56 46 q5 5 10 0" stroke="#3d3450" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    ),
  }
  const mouth = {
    happy: <path d="M44 60 q6 6 12 0" stroke="#3d3450" strokeWidth="3" fill="none" strokeLinecap="round" />,
    cheer: <path d="M42 58 q8 10 16 0 z" fill="#3d3450" />,
    think: <circle cx="50" cy="61" r="3" fill="#3d3450" />,
    sad: <path d="M44 64 q6 -5 12 0" stroke="#3d3450" strokeWidth="3" fill="none" strokeLinecap="round" />,
  }
  return (
    <svg viewBox="0 0 100 90" width={size} height={size * 0.9} className={className} style={style}>
      {/* ears */}
      <path d="M18 34 L12 6 L38 20 Z" fill="#ff8a5c" />
      <path d="M82 34 L88 6 L62 20 Z" fill="#ff8a5c" />
      <path d="M20 30 L17 13 L33 22 Z" fill="#ffd9c4" />
      <path d="M80 30 L83 13 L67 22 Z" fill="#ffd9c4" />
      {/* head */}
      <ellipse cx="50" cy="50" rx="34" ry="32" fill="#ff8a5c" />
      {/* muzzle */}
      <ellipse cx="50" cy="60" rx="20" ry="15" fill="#fff4ec" />
      {/* cheeks */}
      <circle cx="26" cy="54" r="5.5" fill="#ff5864" opacity="0.35" />
      <circle cx="74" cy="54" r="5.5" fill="#ff5864" opacity="0.35" />
      {eyes[pose] || eyes.happy}
      <ellipse cx="50" cy="53" rx="4.4" ry="3.6" fill="#3d3450" />
      {mouth[pose] || mouth.happy}
    </svg>
  )
}

/* ===== Confetti burst (pure CSS particles) ===== */
const CONFETTI_COLORS = ['#ff5864', '#00c2a8', '#ffc233', '#7c5cff', '#29b6f6', '#ff7ab6']
export function Confetti({ count = 34 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        dur: 1.6 + Math.random() * 1.4,
        size: 7 + Math.random() * 7,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rot: Math.random() * 360,
        round: Math.random() > 0.5,
      })),
    [count]
  )
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 50 }}>
      <style>{`@keyframes confetti-fall {
        0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0.7; }
      }`}</style>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', top: -20, left: `${p.left}%`,
            width: p.size, height: p.size * (p.round ? 1 : 0.55),
            background: p.color, borderRadius: p.round ? '50%' : 3,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall ${p.dur}s ${p.delay}s cubic-bezier(0.3,0.4,0.6,1) forwards`,
          }}
        />
      ))}
    </div>
  )
}

/* ===== HUD counters ===== */
export function StatPill({ icon, value, color, onClick }) {
  return (
    <button onClick={onClick} className="row" style={{ gap: 5, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      {value}
    </button>
  )
}

export function Hearts({ n }) {
  return <StatPill icon="❤️" value={n} color="var(--red)" />
}

/* ===== Daily goal ring ===== */
export function GoalRing({ value, goal, size = 46 }) {
  const pct = Math.min(1, value / goal)
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sun-soft)" strokeWidth="7" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sun)" strokeWidth="7"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: size * 0.4 }}>⚡️</div>
    </div>
  )
}

/* ===== Bottom sheet ===== */
export function Sheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(61,52,80,0.45)', zIndex: 40 }}
          />
          <motion.div
            initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41,
              background: 'var(--card)', borderRadius: '28px 28px 0 0',
              padding: '14px 20px calc(22px + env(safe-area-inset-bottom))',
              boxShadow: '0 -12px 40px rgba(61,52,80,0.18)',
            }}
          >
            <div style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--line-strong)', margin: '0 auto 14px' }} />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ===== Tab bar ===== */
const TABS = [
  { id: 'learn', icon: '🗺️', label: 'Learn' },
  { id: 'quests', icon: '🎯', label: 'Quests' },
  { id: 'league', icon: '🏆', label: 'League' },
  { id: 'profile', icon: '🦊', label: 'You' },
]
export function TabBar({ tab, onTab, questBadge }) {
  return (
    <nav
      className="row"
      style={{
        borderTop: '2px solid var(--line)', background: 'var(--card)',
        padding: '6px 8px calc(8px + env(safe-area-inset-bottom))', justifyContent: 'space-around', zIndex: 30,
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onTab(t.id)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 14px', borderRadius: 14, position: 'relative',
            background: tab === t.id ? 'var(--coral-soft)' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          <span style={{ fontSize: 23, filter: tab === t.id ? 'none' : 'grayscale(0.75) opacity(0.55)' }}>{t.icon}</span>
          <span
            style={{
              fontSize: 10.5, fontWeight: 800, letterSpacing: 0.3,
              color: tab === t.id ? 'var(--coral)' : 'var(--ink-faint)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t.label}
          </span>
          {t.id === 'quests' && questBadge && (
            <span
              style={{
                position: 'absolute', top: 2, right: 6, width: 9, height: 9, borderRadius: 5,
                background: 'var(--red)', border: '2px solid var(--card)',
              }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}
