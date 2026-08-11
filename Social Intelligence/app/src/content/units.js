import { SKILLS } from './exercises.js'

// A unit = themed section of the path. Node kinds: lesson | chest | checkpoint
// The unit ORDER is personalized per user from their diagnosis (weakest skill first).
export const UNITS = {
  icebreaking: {
    id: 'icebreaking', skill: 'icebreaking',
    title: 'Break the Ice',
    tagline: 'Openers, approach windows, graceful exits',
    emoji: '🧊',
  },
  listening: {
    id: 'listening', skill: 'listening',
    title: 'The Art of Listening',
    tagline: 'Follow-ups, mirroring, hearing the subtext',
    emoji: '👂',
  },
  confidence: {
    id: 'confidence', skill: 'confidence',
    title: 'Quiet Confidence',
    tagline: 'Clean asks, clean nos, taking up space',
    emoji: '🦁',
  },
  storytelling: {
    id: 'storytelling', skill: 'storytelling',
    title: 'Tell Better Stories',
    tagline: 'Hooks, tension, landing the punchline',
    emoji: '🎭',
  },
  empathy: {
    id: 'empathy', skill: 'empathy',
    title: 'Read the Room',
    tagline: 'Subtext, soft nos, showing up right',
    emoji: '💗',
  },
  connection: {
    id: 'connection', skill: 'mixed',
    title: 'Deep Connections',
    tagline: 'Everything together — friendships that stick',
    emoji: '🌟',
  },
}

// Node layout inside every unit
export const UNIT_NODES = [
  { kind: 'lesson', n: 1 },
  { kind: 'lesson', n: 2 },
  { kind: 'chest' },
  { kind: 'lesson', n: 3 },
  { kind: 'checkpoint' },
]

export function unitColor(unit) {
  if (unit.skill === 'mixed') return { color: 'var(--sky)', deep: 'var(--sky-deep)', soft: 'var(--sky-soft)' }
  const s = SKILLS[unit.skill]
  return { color: s.color, deep: s.deep, soft: s.soft }
}

export function nodeId(unitId, index) {
  return `${unitId}-${index}`
}

// Flatten a personalized unit order into the full path node list
export function buildPath(unitOrder) {
  return unitOrder.map((uid) => {
    const unit = UNITS[uid]
    return {
      unit,
      nodes: UNIT_NODES.map((n, i) => ({ ...n, id: nodeId(uid, i), unitId: uid, index: i })),
    }
  })
}
