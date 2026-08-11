// ——— Kael onboarding v5 ———
// warm like a coach, wide like a real gym, credible like something worth paying for.

export const MUSCLES = [
  { id: 'boundaries', emoji: '🛡️', label: 'Boundaries' },
  { id: 'confidence', emoji: '🦁', label: 'Confidence' },
  { id: 'smalltalk', emoji: '☕', label: 'Small talk' },
  { id: 'reading', emoji: '🔮', label: 'Reading people' },
  { id: 'speakup', emoji: '🎤', label: 'Speaking up' },
  { id: 'storytelling', emoji: '🎭', label: 'Storytelling' },
  { id: 'conflict', emoji: '⚡', label: 'Conflict' },
  { id: 'charisma', emoji: '✨', label: 'Charisma' },
  { id: 'listening', emoji: '👂', label: 'Listening' },
  { id: 'humor', emoji: '😏', label: 'Humor' },
  { id: 'negotiation', emoji: '💰', label: 'Negotiation' },
  { id: 'texting', emoji: '📱', label: 'Texting' },
]

// primary muscle → program (5 programs over the 5 core muscle groups)
const P = {
  boundary: { name: 'Boundary Builder', emoji: '🛡️', skillName: 'Boundary Setting', tomorrow: 'holding your no when they push back' },
  voice: { name: 'Say It Right', emoji: '🎤', skillName: 'Speaking Up', tomorrow: 'speaking up before the window closes' },
  signal: { name: 'Signal Reader', emoji: '🔮', skillName: 'Reading People', tomorrow: 'one vague text, three readings. pick the real one' },
  cool: { name: 'Cool Head', emoji: '⚡', skillName: 'Cool Conflict', tomorrow: 'the hard thing, said calm' },
  warmth: { name: 'Magnetic Warmth', emoji: '💞', skillName: 'Connection', tomorrow: 'the compliment that actually lands' },
}

export const PROGRAM_BY_MUSCLE = {
  boundaries: P.boundary,
  negotiation: P.boundary,
  speakup: P.voice,
  confidence: P.voice,
  storytelling: P.voice,
  humor: P.voice,
  reading: P.signal,
  texting: P.signal,
  conflict: P.cool,
  charisma: P.warmth,
  smalltalk: P.warmth,
  listening: P.warmth,
}

export const MUSCLE_CHEERS = {
  boundaries: 'boundaries. the most requested muscle in the gym.',
  confidence: 'confidence. everything else gets easier after this one.',
  smalltalk: 'small talk. the door every other skill walks through.',
  reading: 'reading people. the quiet superpower.',
  speakup: 'speaking up. your ideas deserve airtime.',
  storytelling: 'storytelling. the difference between heard and remembered.',
  conflict: 'conflict. handled right, it builds trust instead of burning it.',
  charisma: 'charisma. it\'s trainable. that\'s the secret.',
  listening: 'listening. the rarest skill in every room.',
  humor: 'humor. timing is a muscle too.',
  negotiation: 'negotiation. the highest paid sentence you\'ll ever learn.',
  texting: 'texting. where half your social life happens now.',
}

export const ARENAS = [
  { tag: 'work', emoji: '💼', label: 'work' },
  { tag: 'dating', emoji: '❤️', label: 'dating' },
  { tag: 'friends', emoji: '👥', label: 'friends' },
  { tag: 'family', emoji: '🏠', label: 'family' },
]

export const ARENA_CHEERS = {
  work: 'work reps it is. bosses, meetings, asks. real ones.',
  dating: 'dating reps. high stakes, good stories.',
  friends: 'friend reps. group chat politics included.',
  family: 'family reps. the advanced arena. respect.',
}

export const WEIGHT_OPTIONS = [
  { tag: 'new', label: '🌱 just starting' },
  { tag: 'mixed', label: '🌗 hit and miss' },
  { tag: 'solid', label: '💪 solid, want mastery' },
]

export const PACE_OPTIONS = [
  { tag: 'steady', label: '3 a day · steady', reps: 3 },
  { tag: 'serious', label: '5 a day · serious', reps: 5 },
  { tag: 'allin', label: '10 a day · all in', reps: 10 },
]

export const PROOF = {
  title: 'why reps work',
  lines: [
    'advice doesn\'t change behavior. practice does.',
    'kael\'s scenarios are built from thousands of real social situations.',
    'two minutes a day trains the moment, not the theory.',
  ],
}

export const ANALYZE_LINES = ['loading your first set…']
