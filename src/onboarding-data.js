// ——— Kael onboarding: the fox interview ———
// Each option can carry weights on the 5 core skills.
// One instinct question per skill = full baseline coverage.

export const INTERVIEW = [
  {
    id: 'name',
    lines: ["hey, I'm kael 🦊 your coach.", 'quick intro before I start being nosy — what should I call you?'],
    input: true,
  },
  {
    id: 'motive',
    lines: ['nice to meet you, {name}.', 'what brought you into the gym?'],
    caption: 'pick what fits most',
    options: [
      { label: '💼 I want presence at work — meetings, asks, pushback', tag: 'work' },
      { label: '❤️ Dating & relationships — I overthink everything', tag: 'love' },
      { label: '🫥 I disappear in groups', tag: 'groups' },
      { label: '🧊 Small talk feels like a job interview', tag: 'smalltalk' },
    ],
  },
  {
    id: 'party',
    lines: ["got it. now let's see your instincts — no wrong answers... yet 😏", "you walk into a party where you know exactly ONE person. they're in the bathroom. your real move?"],
    options: [
      { label: 'Phone out. I live by the snacks now', weights: { Connection: -2, Assertiveness: -1 } },
      { label: 'Hover near a group, wait for an opening that never comes', weights: { Connection: -1, Expression: -1 } },
      { label: 'Find another solo person and say hi', weights: { Connection: 2, Assertiveness: 1 } },
      { label: 'Join the loudest circle and jump in', weights: { Connection: 2, 'Reading people': -1 } },
    ],
  },
  {
    id: 'vent',
    lines: ['a friend calls: "worst day EVER. my boss tore apart my project in front of everyone."', 'what comes out of your mouth first?'],
    options: [
      { label: '"Ugh, brutal. Tell me everything."', weights: { 'Reading people': 2, Connection: 1 } },
      { label: '"Here\'s what you should do about it…"', weights: { 'Reading people': -2, Assertiveness: 1 } },
      { label: '"That happened to me once! So there I was—"', weights: { 'Reading people': -1, Expression: 1, Connection: -1 } },
      { label: 'Honestly? I freeze. Never know what to say', weights: { Connection: -1, Expression: -1 } },
    ],
  },
  {
    id: 'no',
    lines: ['a friend asks for a favor you genuinely don\'t have time for.', 'what actually happens?'],
    options: [
      { label: 'I say yes. I always say yes. help', weights: { Assertiveness: -2 } },
      { label: 'I say no, then apologize for a full minute', weights: { Assertiveness: -1 } },
      { label: 'Clean no, warm delivery — got that one down', weights: { Assertiveness: 2, Connection: 1 } },
      { label: 'I ghost until the favor expires', weights: { Assertiveness: -1, Conflict: -1 } },
    ],
  },
  {
    id: 'snap',
    lines: ['your partner (or roommate, or mom) snaps at you over something tiny.', 'your honest first instinct?'],
    options: [
      { label: 'Snap back. we\'re doing this NOW', weights: { Conflict: -2 } },
      { label: 'Go quiet and stay hurt for the evening', weights: { Conflict: -1, Assertiveness: -1 } },
      { label: '"rough day? I\'ll give you space — I\'m around"', weights: { Conflict: 2, 'Reading people': 1 } },
      { label: 'Apologize immediately, even if it wasn\'t me', weights: { Conflict: -1, Assertiveness: -1 } },
    ],
  },
  {
    id: 'story',
    lines: ['someone at dinner asks about your weekend. something genuinely funny DID happen.', 'how does the telling usually go?'],
    options: [
      { label: 'I rush to the ending and it lands flat', weights: { Expression: -2 } },
      { label: 'Every detail, in order. I lose them at the shuttle bus', weights: { Expression: -1, 'Reading people': -1 } },
      { label: 'People usually laugh — timing\'s my thing', weights: { Expression: 2 } },
      { label: '"it was good" and I pass the mic', weights: { Expression: -1, Connection: -1 } },
    ],
  },
  {
    id: 'cast',
    lines: ['almost done. who\'s the main cast of your life right now?', 'so I know whose texts we\'ll be decoding 👀'],
    caption: 'pick the big one',
    options: [
      { label: '💞 A partner (or a complicated situationship)', tag: 'partner' },
      { label: '💼 A boss / coworkers I have to manage', tag: 'boss' },
      { label: '👥 Friends & a group chat with politics', tag: 'friends' },
      { label: '🏠 Family. it\'s a whole thing', tag: 'family' },
    ],
  },
  {
    id: 'stakes',
    lines: ['last one, and be honest —', 'when these moments go wrong… what\'s it actually costing you?'],
    options: [
      { label: '🚪 Opportunities I never went for', tag: 'opportunities' },
      { label: '💔 Relationships that drifted or blew up', tag: 'relationships' },
      { label: '🪞 Self-respect. I fold and I hate it', tag: 'selfrespect' },
      { label: '🌀 Peace — I replay conversations at 2am', tag: 'peace' },
    ],
  },
]

export const SKILL_KEYS = ['Reading people', 'Expression', 'Assertiveness', 'Conflict', 'Connection']

export function computeBaseline(answers) {
  const scores = Object.fromEntries(SKILL_KEYS.map((k) => [k, 50]))
  for (const a of answers) {
    for (const [k, w] of Object.entries(a.weights || {})) scores[k] += w * 7
  }
  for (const k of SKILL_KEYS) scores[k] = Math.max(18, Math.min(88, scores[k]))
  const sorted = [...SKILL_KEYS].sort((a, b) => scores[a] - scores[b])
  const weakest = sorted[0]
  const strongest = sorted[sorted.length - 1]
  const arch = (ARCHETYPES[strongest] || {})[weakest] || ARCHETYPES.fallback
  return { scores, strongest, weakest, ...arch }
}

// strongest × weakest → archetype
export const ARCHETYPES = {
  'Reading people': {
    Expression: { name: 'The Silent Analyst', blurb: 'You see everything and say ten percent of it. The room never finds out how sharp you are — yet.' },
    Assertiveness: { name: 'The Mind Reader Doormat', blurb: 'You know exactly what everyone needs — including when it costs you. Time to charge for the service.' },
    Conflict: { name: 'The Seismograph', blurb: 'You feel the tremor before anyone else — then stand in the doorway instead of leaving the building.' },
    Connection: { name: 'The Careful Observer', blurb: 'You read people beautifully from a safe distance. Three steps closer is where your life changes.' },
  },
  Expression: {
    'Reading people': { name: 'The Headliner', blurb: 'You can hold a room — the encore skill is noticing what the room is holding.' },
    Assertiveness: { name: 'The Charming Pushover', blurb: 'Everyone loves you. That\'s partly the problem — "no" is the one word missing from your set.' },
    Conflict: { name: 'The Firework', blurb: 'Brilliant, warm, occasionally explosive. We\'re keeping the light and losing the shrapnel.' },
    Connection: { name: 'The Entertainer', blurb: 'You bring the show. Next: the part where the audience becomes friends.' },
  },
  Assertiveness: {
    'Reading people': { name: 'The Straight Shooter', blurb: 'Direct, clear, unstoppable — and occasionally aimed at the wrong moment. We\'re adding radar.' },
    Expression: { name: 'The Iron Mumbler', blurb: 'A spine of steel and a delivery that undersells it. Your no is strong; your words will catch up.' },
    Conflict: { name: 'The Bulldozer (Affectionate)', blurb: 'You get things DONE. Now let\'s tune how it lands on the humans in the path.' },
    Connection: { name: 'The Fortress', blurb: 'Boundaries: elite. Drawbridge: rarely lowered. We\'re installing a door.' },
  },
  Conflict: {
    'Reading people': { name: 'The Peacekeeper', blurb: 'You can cool any room — sometimes before checking what the heat was about.' },
    Expression: { name: 'The Diplomat', blurb: 'Calm under fire, quiet everywhere else. Your composure deserves a bigger stage.' },
    Assertiveness: { name: 'The Shock Absorber', blurb: 'You keep the peace by paying for it. New policy: peace, but not at your expense.' },
    Connection: { name: 'The Steady Hand', blurb: 'Unshakeable in a storm, reserved in the sunshine. Warmth is your next weight class.' },
  },
  Connection: {
    'Reading people': { name: 'The Golden Retriever', blurb: 'Instant warmth, endless benefit of the doubt. We\'re adding the fine print radar.' },
    Expression: { name: 'The Warm Wallflower', blurb: 'People feel safe with you the moment they meet you. Now we make sure they remember what you said.' },
    Assertiveness: { name: 'The Everybody\'s Favorite', blurb: 'Beloved by all, protected by none — least of all yourself. That changes here.' },
    Conflict: { name: 'The Fair-Weather Friend Magnet', blurb: 'Magic when it\'s easy, gone when it\'s tense. We\'re building your storm rating.' },
  },
  fallback: { name: 'The Balanced Operator', blurb: 'Solid across the board — we\'ll sharpen every edge, one rep at a time.' },
}

// program by weakest skill
export const PROGRAMS = {
  'Reading people': { name: 'Signal Reader', emoji: '🔮', focus: 'decode people before you react to them' },
  Expression: { name: 'Say It Right', emoji: '🎙️', focus: 'land the story, the joke, and the hard sentence' },
  Assertiveness: { name: 'Boundary Builder', emoji: '🛑', focus: 'ask directly, say no cleanly, hold under pressure' },
  Conflict: { name: 'Cool Head', emoji: '🧯', focus: 'de-escalate without folding' },
  Connection: { name: 'Magnetic Warmth', emoji: '💞', focus: 'approach, listen, and make people feel met' },
}

export const STAKES_LINES = {
  opportunities: 'stop leaving opportunities on the table',
  relationships: 'stop letting the good ones drift',
  selfrespect: "stop paying for other people's comfort",
  peace: 'stop replaying conversations at 2am',
}

export const ANALYZE_LINES = ['reading your instincts…', 'mapping your 5 social muscles…', 'building your program…']
