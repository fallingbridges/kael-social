// "Tonight I have…" — just-in-time prep that bypasses the path entirely.
// Each situation assembles a quick lesson from the relevant skill pools and
// re-targets today's field quest to the thing you're actually walking into.
export const SITUATIONS = [
  {
    id: 'date', emoji: '🌹', label: 'A date',
    blurb: 'Warm openers, real curiosity, listening past nerves',
    skills: ['icebreaking', 'listening'], questSkill: 'listening',
    pep: 'Curiosity beats charm. Ask the second question.',
  },
  {
    id: 'interview', emoji: '💼', label: 'An interview or big meeting',
    blurb: 'Presence, clean asks, owning your wins out loud',
    skills: ['confidence', 'storytelling'], questSkill: 'confidence',
    pep: 'State it straight. No hedges, no shrinking.',
  },
  {
    id: 'party', emoji: '🎉', label: 'A party or event',
    blurb: 'Approach windows, joining groups, graceful exits',
    skills: ['icebreaking', 'storytelling'], questSkill: 'icebreaking',
    pep: 'Find the other solo person. They’re hoping you will.',
  },
  {
    id: 'hard-talk', emoji: '💬', label: 'A hard conversation',
    blurb: 'Hearing the subtext, validating first, holding your ground',
    skills: ['empathy', 'listening'], questSkill: 'empathy',
    pep: 'Let it be heavy before you try to lift it.',
  },
]

export function situationById(id) {
  return SITUATIONS.find((s) => s.id === id)
}
