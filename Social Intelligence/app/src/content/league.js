// Simulated weekly league. Competitor XP creeps up deterministically with elapsed
// real time since the user joined, so the board feels alive between visits.
const COMPETITORS = [
  { name: 'Priya', emoji: '🐨', base: 12, rate: 3.1 },
  { name: 'Marcus', emoji: '🐸', base: 30, rate: 2.2 },
  { name: 'Tola', emoji: '🦉', base: 8, rate: 4.0 },
  { name: 'Jess', emoji: '🐙', base: 22, rate: 1.6 },
  { name: 'Hiro', emoji: '🐯', base: 5, rate: 2.8 },
  { name: 'Ana', emoji: '🦋', base: 18, rate: 0.9 },
  { name: 'Sam K.', emoji: '🐢', base: 2, rate: 0.5 },
  { name: 'Noor', emoji: '🦩', base: 26, rate: 1.2 },
  { name: 'Diego', emoji: '🐺', base: 15, rate: 2.0 },
]

export function leagueBoard(joinedAt, userXp, userName) {
  const hours = Math.max(0, (Date.now() - joinedAt) / 36e5)
  const rows = COMPETITORS.map((c) => ({
    name: c.name, emoji: c.emoji, xp: Math.round(c.base + c.rate * Math.min(hours, 168)), me: false,
  }))
  rows.push({ name: userName || 'You', emoji: '🦊', xp: userXp, me: true })
  rows.sort((a, b) => b.xp - a.xp)
  return rows
}

export const LEAGUE_NAME = 'Amber League'
export const PROMOTE_ZONE = 3
export const DEMOTE_ZONE = 3
