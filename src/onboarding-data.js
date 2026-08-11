// ——— Kael onboarding v3: one question per screen, every answer weighted ———
// Weights land on the 5 core skills. Baseline = self-reported starting read,
// sharpened by actual training. Casual copy, no lectures.

export const SKILL_KEYS = ['Reading people', 'Expression', 'Assertiveness', 'Conflict', 'Connection']

// R = Reading people, E = Expression, A = Assertiveness, Cf = Conflict, Cn = Connection
export const QUESTIONS = [
  { id: 'name', title: 'what do I call you?', input: true },
  {
    id: 'pain',
    title: "why'd you come?",
    options: [
      { tag: 'walkover', label: '😤 people walk over me', w: { Assertiveness: -2 } },
      { tag: 'overthink', label: '🌀 I overthink everything', w: { 'Reading people': -2 } },
      { tag: 'invisible', label: '🫥 I go invisible in groups', w: { Connection: -2, Expression: -1 } },
      { tag: 'blowup', label: '💥 my relationships keep blowing up', w: { Conflict: -2 } },
    ],
  },
  {
    id: 'context',
    title: "where's it worst?",
    options: [
      { tag: 'work', label: '💼 work' },
      { tag: 'dating', label: '❤️ dating' },
      { tag: 'friends', label: '👥 friends' },
      { tag: 'family', label: '🏠 family' },
    ],
  },
  {
    id: 'party',
    title: 'party. you know one person. they vanish. you…',
    options: [
      { tag: 'phone', label: '📱 phone out, snack table', w: { Connection: -2 } },
      { tag: 'hover', label: '🫣 hover near a group, wait forever', w: { Connection: -1, Expression: -1 } },
      { tag: 'solo', label: '👋 find another solo person', w: { Connection: 2 } },
      { tag: 'loud', label: '🗣️ jump into the loudest circle', w: { Connection: 1, 'Reading people': -1 } },
    ],
  },
  {
    id: 'vent',
    title: 'friend calls, mid-rant about their boss. you say…',
    options: [
      { tag: 'listen', label: '“tell me everything”', w: { 'Reading people': 2, Connection: 1 } },
      { tag: 'fix', label: '“ok here\'s what you should do”', w: { 'Reading people': -2 } },
      { tag: 'metoo', label: '“same thing happened to me!”', w: { Expression: 1, 'Reading people': -1 } },
      { tag: 'freeze', label: '😶 honestly, I freeze', w: { Expression: -1, Connection: -1 } },
    ],
  },
  {
    id: 'pattern',
    title: 'in the hard moment, you usually…',
    options: [
      { tag: 'fold', label: '🫠 fold when they push', w: { Assertiveness: -2 } },
      { tag: 'freeze', label: '🤐 freeze. words show up later', w: { Expression: -2 } },
      { tag: 'story', label: '🔍 spiral on the story in my head', w: { 'Reading people': -2 } },
      { tag: 'volcano', label: '🌋 explode or bury it', w: { Conflict: -2 } },
    ],
  },
  {
    id: 'cost',
    title: "what's it costing you?",
    options: [
      { tag: 'opportunities', label: '🚪 opportunities' },
      { tag: 'relationships', label: '💔 relationships' },
      { tag: 'selfrespect', label: '🪞 self-respect' },
      { tag: 'peace', label: '🌀 sleep & peace' },
    ],
  },
  {
    id: 'aspiration',
    title: "3 months from now, what's true?",
    options: [
      { tag: 'sayit', label: '🎤 I say what I mean' },
      { tag: 'time', label: '🛡️ my time is protected' },
      { tag: 'closer', label: '💞 closer people, less drama' },
      { tag: 'calm', label: '😌 no more 2am replays' },
    ],
  },
]

export function computeBaseline(picked) {
  const scores = Object.fromEntries(SKILL_KEYS.map((k) => [k, 55]))
  for (const opt of picked) {
    for (const [k, w] of Object.entries(opt.w || {})) scores[k] += w * 6
  }
  for (const k of SKILL_KEYS) scores[k] = Math.max(22, Math.min(84, scores[k]))
  return scores
}

// pattern → mirror + program. short, casual, zero em dashes.
export const PATTERNS = {
  fold: {
    archetype: 'The Charming Pushover',
    blurb: "everyone likes you. that's half the problem. your no is fine until they push. then it folds.",
    program: { name: 'Boundary Builder', emoji: '🛡️', skillName: 'Boundary Setting', focus: 'holding your no when they push' },
    tier: 'Recovering Yes-Sayer',
    tomorrow: 'holding your no when they get disappointed',
  },
  freeze: {
    archetype: 'The Vault',
    blurb: "the perfect line always shows up an hour late. we're fixing the delivery time.",
    program: { name: 'Say It Right', emoji: '🎙️', skillName: 'Speaking Up', focus: 'finding words while the moment is alive' },
    tier: 'Finding the Voice',
    tomorrow: 'speaking up before the window closes',
  },
  story: {
    archetype: 'The Fan-Fiction Author',
    blurb: "one dry text and you've written a whole season finale. let's read what's actually there.",
    program: { name: 'Signal Reader', emoji: '🔮', skillName: 'Reading People', focus: 'reacting to what happened, not the story' },
    tier: 'Recovering Novelist',
    tomorrow: 'one vague text, three readings. pick the real one',
  },
  volcano: {
    archetype: 'The Pressure Cooker',
    blurb: "you bury it, bury it, bury it. then boom. we're installing a middle setting.",
    program: { name: 'Cool Head', emoji: '🧯', skillName: 'Cool Conflict', focus: 'saying the hard thing, calmly' },
    tier: 'Defusing in Progress',
    tomorrow: 'the hard thing, said at low temperature',
  },
}

export const CONTEXT_LABELS = {
  work: 'work',
  dating: 'dating',
  friends: 'friends',
  family: 'family',
}

export const COST_LINES = {
  opportunities: 'stop leaving opportunities on the table',
  relationships: 'stop letting the good ones drift',
  selfrespect: "stop paying for other people's comfort",
  peace: 'stop replaying conversations at 2am',
}

export const ANALYZE_LINES = ['reading your answers…', 'picking your scenarios…', 'building your program…']
