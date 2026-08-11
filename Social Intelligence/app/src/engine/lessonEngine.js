import { EXERCISES } from '../content/exercises.js'
import { UNITS } from '../content/units.js'

// Deterministic tiny PRNG so a given node always builds the same lesson (polish > surprise)
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle(arr, rnd) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// Build the exercise sequence for a path node.
// Regular lesson: 5 static exercises + 1 roleplay in the middle.
// Checkpoint: 6 exercises sampled across ALL skills seen so far + hardest roleplay.
export function buildLesson(node, unitOrder) {
  const unit = UNITS[node.unitId]
  const rnd = mulberry32(hashStr(node.id))

  let pool, roleplays
  if (unit.skill === 'mixed' || node.kind === 'checkpoint') {
    const seen = unit.skill === 'mixed'
      ? Object.keys(EXERCISES)
      : [unit.skill]
    pool = seen.flatMap((s) => EXERCISES[s].filter((e) => e.type !== 'roleplay'))
    roleplays = seen.flatMap((s) => EXERCISES[s].filter((e) => e.type === 'roleplay'))
  } else {
    pool = EXERCISES[unit.skill].filter((e) => e.type !== 'roleplay')
    roleplays = EXERCISES[unit.skill].filter((e) => e.type === 'roleplay')
  }

  const statics = seededShuffle(pool, rnd).slice(0, node.kind === 'checkpoint' ? 6 : 5)
  const roleplay = roleplays[Math.floor(rnd() * roleplays.length)]

  const seq = [...statics]
  if (roleplay) seq.splice(Math.min(3, seq.length), 0, roleplay)
  return seq
}

// "Tonight I have…" prep: a quick 6-exercise lesson drawn from the
// situation's skills, roleplay included. Same deterministic assembly.
export function buildSituationLesson(situation) {
  const rnd = mulberry32(hashStr('situ-' + situation.id))
  const pool = situation.skills.flatMap((s) => EXERCISES[s].filter((e) => e.type !== 'roleplay'))
  const roleplays = situation.skills.flatMap((s) => EXERCISES[s].filter((e) => e.type === 'roleplay'))
  const statics = seededShuffle(pool, rnd).slice(0, 5)
  const roleplay = roleplays[Math.floor(rnd() * roleplays.length)]
  const seq = [...statics]
  if (roleplay) seq.splice(Math.min(3, seq.length), 0, roleplay)
  return seq
}

// ===== XP / reward math =====
export const XP_PER_CORRECT = 2
export const PERFECT_BONUS = 6
export const COMBO_BONUS = 5 // at 4+ streak
export const ROLEPLAY_BONUS = 4

export function lessonRewards({ correct, total, bestCombo, roleplayPassed, firstOfDay }) {
  let xp = correct * XP_PER_CORRECT
  const perfect = correct === total
  if (perfect) xp += PERFECT_BONUS
  if (bestCombo >= 4) xp += COMBO_BONUS
  if (roleplayPassed) xp += ROLEPLAY_BONUS
  if (firstOfDay) xp += 5
  const gems = perfect ? 20 : 10
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { xp, gems, accuracy, perfect }
}

// EMA skill update from lesson accuracy (0..1)
export function updateSkillScore(prev, lessonScore) {
  return Math.min(1, Math.max(0, prev * 0.75 + lessonScore * 0.25))
}
