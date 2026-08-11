import { motion } from 'framer-motion'
import { SKILLS } from '../content/exercises.js'

const ORDER = ['icebreaking', 'listening', 'confidence', 'storytelling', 'empathy']

function polygonPoints(scores, cx, cy, R) {
  return ORDER.map((k, i) => {
    const ang = (Math.PI * 2 * i) / ORDER.length - Math.PI / 2
    const r = R * (scores[k] ?? 0.5)
    return `${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`
  }).join(' ')
}

/* 5-axis radar. Pass `baseline` to overlay "then vs now". */
export function RadarChart({ scores, baseline, size = 250 }) {
  const cx = size / 2, cy = size / 2 + 4, R = size / 2 - 54
  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={ORDER.map((_, i) => {
            const ang = (Math.PI * 2 * i) / ORDER.length - Math.PI / 2
            return `${cx + R * f * Math.cos(ang)},${cy + R * f * Math.sin(ang)}`
          }).join(' ')}
          fill="none" stroke="var(--line)" strokeWidth={f === 1 ? 2 : 1.2}
        />
      ))}
      {ORDER.map((_, i) => {
        const ang = (Math.PI * 2 * i) / ORDER.length - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(ang)} y2={cy + R * Math.sin(ang)} stroke="var(--line)" strokeWidth="1.2" />
      })}
      {baseline && (
        <polygon points={polygonPoints(baseline, cx, cy, R)} fill="rgba(181,174,198,0.18)" stroke="var(--ink-faint)" strokeWidth="1.8" strokeDasharray="5 4" />
      )}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.25 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        points={polygonPoints(scores, cx, cy, R)}
        fill="rgba(255,88,100,0.22)" stroke="var(--coral)" strokeWidth="3" strokeLinejoin="round"
      />
      {ORDER.map((k, i) => {
        const ang = (Math.PI * 2 * i) / ORDER.length - Math.PI / 2
        const lx = Math.min(size - 36, Math.max(36, cx + (R + 28) * Math.cos(ang)))
        const ly = cy + (R + 26) * Math.sin(ang)
        return (
          <text key={k} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 10.5, fontWeight: 800, fill: 'var(--ink-soft)', fontFamily: 'var(--font-body)' }}>
            {SKILLS[k].emoji} {SKILLS[k].name}
          </text>
        )
      })}
    </svg>
  )
}

/* Real-World Score trend line */
export function TrendChart({ history, width = 310, height = 130 }) {
  const pad = { l: 8, r: 8, t: 12, b: 8 }
  const points = history.length ? history : [{ day: '', score: 0 }]
  const max = Math.max(30, ...points.map((p) => p.score))
  const xs = (i) => pad.l + (i / Math.max(1, points.length - 1)) * (width - pad.l - pad.r)
  const ys = (v) => height - pad.b - (v / max) * (height - pad.t - pad.b)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xs(i)},${ys(p.score)}`).join(' ')
  const area = `${d} L${xs(points.length - 1)},${height - pad.b} L${xs(0)},${height - pad.b} Z`
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {points.length > 1 && <path d={area} fill="url(#trend-fill)" />}
      <motion.path
        d={d} fill="none" stroke="var(--teal)" strokeWidth="3.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      {points.map((p, i) => (
        <circle key={i} cx={xs(i)} cy={ys(p.score)} r={i === points.length - 1 ? 5.5 : 3.5}
          fill={i === points.length - 1 ? 'var(--teal)' : 'var(--card)'} stroke="var(--teal)" strokeWidth="2.5" />
      ))}
    </svg>
  )
}
