// ——— Kael onboarding v4: Duolingo grammar ———
// desire → context → placement-as-play → commitment → celebration.
// Wants, not wounds. Nobody confesses anything here.

export const SKILL_KEYS = ['Reading people', 'Expression', 'Assertiveness', 'Conflict', 'Connection']

export const QUESTIONS = [
  { id: 'name', title: 'what do I call you?', input: true },
  {
    id: 'goal',
    title: 'pick your superpower',
    caption: 'what do you want to get good at first?',
    options: [
      { tag: 'no', label: "🛡️ saying no like it's easy" },
      { tag: 'speak', label: '🎤 owning the room' },
      { tag: 'read', label: '🔮 reading people instantly' },
      { tag: 'cool', label: '⚡ staying cool when it gets tense' },
    ],
  },
  {
    id: 'context',
    title: 'where will you use it most?',
    options: [
      { tag: 'work', label: '💼 work' },
      { tag: 'dating', label: '❤️ dating' },
      { tag: 'friends', label: '👥 friends' },
      { tag: 'family', label: '🏠 family' },
    ],
  },
  {
    id: 'party',
    title: 'quick vibe check. party, you know one person, they vanish. you…',
    caption: 'no wrong answers 😎 this sets your starting level',
    options: [
      { tag: 'phone', label: '📱 phone out, snack table', w: { Connection: -1 } },
      { tag: 'hover', label: '🫣 hover near a group', w: { Connection: -1, Expression: -1 } },
      { tag: 'solo', label: '👋 find another solo person', w: { Connection: 2 } },
      { tag: 'loud', label: '🗣️ jump into the loudest circle', w: { Connection: 1, Expression: 1 } },
    ],
  },
  {
    id: 'vent',
    title: 'friend calls, mid-rant about their boss. your first move…',
    options: [
      { tag: 'listen', label: '“tell me everything”', w: { 'Reading people': 2, Connection: 1 } },
      { tag: 'fix', label: '“ok here\'s the plan”', w: { Assertiveness: 1 } },
      { tag: 'metoo', label: '“SAME thing happened to me”', w: { Expression: 1 } },
      { tag: 'freeze', label: '😶 I listen but never know what to say', w: { 'Reading people': 1 } },
    ],
  },
  {
    id: 'commit',
    title: 'daily reps. how hard are we going?',
    options: [
      { tag: 'chill', label: '🌱 3 a day · chill', reps: 3 },
      { tag: 'serious', label: '🔥 5 a day · serious', reps: 5 },
      { tag: 'menace', label: '🐺 10 a day · menace', reps: 10 },
    ],
  },
  {
    id: 'aspiration',
    title: "3 months from now, what's true?",
    options: [
      { tag: 'sayit', label: '🎤 I say what I mean' },
      { tag: 'time', label: '🛡️ my time is protected' },
      { tag: 'closer', label: '💞 closer people, less drama' },
      { tag: 'calm', label: '😎 unshakeable' },
    ],
  },
]

// instincts → your natural strength (always framed as a gift)
export function computeStrength(picked) {
  const scores = Object.fromEntries(SKILL_KEYS.map((k) => [k, 0]))
  for (const opt of picked) {
    for (const [k, w] of Object.entries(opt.w || {})) scores[k] += w
  }
  const best = [...SKILL_KEYS].sort((a, b) => scores[b] - scores[a])[0]
  return scores[best] > 0 ? best : 'Reading people'
}

export const STRENGTH_LINES = {
  'Reading people': '✨ you notice what others miss',
  Expression: '✨ you\'ve got natural delivery',
  Assertiveness: '✨ you\'re not afraid to move',
  Conflict: '✨ steady under pressure',
  Connection: '✨ people open up around you',
}

// goal → your track. tiers climb, always upward.
export const TRACKS = {
  no: {
    title: 'The Easy No',
    program: { name: 'Boundary Builder', emoji: '🛡️', skillName: 'Boundary Setting' },
    promise: "in 3 weeks, no's stop feeling like fights",
    tiers: ['Recovering Yes-Sayer', 'Line Drawer', 'The Warm No', 'Fortress with a Door'],
    tomorrow: 'holding your no when they get disappointed',
  },
  speak: {
    title: 'Own the Room',
    program: { name: 'Say It Right', emoji: '🎤', skillName: 'Speaking Up' },
    promise: 'in 3 weeks, the words show up on time',
    tiers: ['Finding the Voice', 'Clear Speaker', 'Airtime Holder', 'Room Owner'],
    tomorrow: 'speaking up before the window closes',
  },
  read: {
    title: 'People X-Ray',
    program: { name: 'Signal Reader', emoji: '🔮', skillName: 'Reading People' },
    promise: 'in 3 weeks, you read the room in seconds',
    tiers: ['Vibe Checker', 'Pattern Spotter', 'Signal Reader', 'People Whisperer'],
    tomorrow: 'one vague text, three readings. pick the real one',
  },
  cool: {
    title: 'Unshakeable',
    program: { name: 'Cool Head', emoji: '⚡', skillName: 'Cool Conflict' },
    promise: 'in 3 weeks, tension stops running the show',
    tiers: ['Defusing in Progress', 'Steady Hand', 'Low-Temp Talker', 'Storm Proof'],
    tomorrow: 'the hard thing, said calm',
  },
}

export const CONTEXT_LABELS = { work: 'work', dating: 'dating', friends: 'friends', family: 'family' }

export const COMMIT_LINES = { chill: '3 reps a day. chill. respect.', serious: '5 reps a day. serious. love it.', menace: '10 reps a day. menace mode 🐺' }

export const ANALYZE_LINES = ['nice picks…', 'setting your starting level…', 'building your track…']
