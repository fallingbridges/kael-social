// ——— Kael onboarding v2: the coach intake ———
// Self-report for direction (pain, context, pattern, cost, aspiration).
// Ability is never claimed here — the gym measures that through play.

export const INTERVIEW = [
  {
    id: 'name',
    lines: ["hey, I'm kael 🦊 your coach.", "quick intake before we train — what should I call you?"],
    input: true,
  },
  {
    id: 'pain',
    lines: ['good to meet you, {name}.', 'so — what made you walk into a social gym? be honest 😄'],
    options: [
      { tag: 'steamrolled', label: '😤 I keep getting steamrolled — work, friends, everywhere' },
      { tag: 'overthink', label: '🌀 I replay conversations and overthink everything' },
      { tag: 'invisible', label: '🫥 I hold back — in groups I basically go invisible' },
      { tag: 'wall', label: '💔 my relationships keep hitting the same wall' },
    ],
  },
  {
    id: 'context',
    lines: ['ok. and where does it sting the most right now?'],
    options: [
      { tag: 'work', label: '💼 work — meetings, bosses, asks' },
      { tag: 'dating', label: '❤️ dating & relationships' },
      { tag: 'friends', label: '👥 friends & the group chat' },
      { tag: 'family', label: '🏠 family. it\'s a whole thing' },
    ],
  },
  {
    id: 'pattern',
    lines: ['got it. now the important one —', 'when the moment actually comes… which one is most you?'],
    caption: 'no judgment. this decides where we start',
    options: [
      { tag: 'fold', label: '🫠 I fold the second they push back' },
      { tag: 'freeze', label: '🤐 I freeze — the right words show up an hour later' },
      { tag: 'story', label: '🔍 I read too much into everything, then react to the story' },
      { tag: 'volcano', label: '🌋 I either explode or bury it. no middle setting' },
    ],
  },
  {
    id: 'cost',
    lines: ['and what is this actually costing you?', 'be honest — this goes on the training plan.'],
    options: [
      { tag: 'opportunities', label: '🚪 opportunities I never went for' },
      { tag: 'relationships', label: '💔 relationships that drifted or blew up' },
      { tag: 'selfrespect', label: '🪞 self-respect. I fold and I hate it' },
      { tag: 'peace', label: '🌀 peace — I replay conversations at 2am' },
    ],
  },
  {
    id: 'aspiration',
    lines: ['last one. three months from now —', 'what do you want to be true?'],
    options: [
      { tag: 'sayit', label: '🎤 I say what I mean, when it matters' },
      { tag: 'time', label: '🛡️ I protect my time without guilt' },
      { tag: 'closer', label: '💞 closer friendships, better dates, less drama' },
      { tag: 'calm', label: '😌 I stop replaying and start living' },
    ],
  },
]

// pattern → the mirror + the program (framed as reflection, never measurement)
export const PATTERNS = {
  fold: {
    archetype: 'The Charming Pushover',
    blurb: 'Everyone loves you — that\'s half the problem. Your first no is usually fine. It\'s the pushback, the sigh, the disappointed face that empties your pockets.',
    program: { name: 'Boundary Builder', emoji: '🛡️', skillName: 'Boundary Setting', focus: 'holding your no when they push back' },
    tier: 'Recovering Yes-Sayer',
    tomorrow: 'holding your no when they get disappointed',
  },
  freeze: {
    archetype: 'The Vault',
    blurb: 'It\'s all in there — the wit, the comeback, the honest sentence. It just clears security about an hour after the moment ends. We\'re moving you closer to the door.',
    program: { name: 'Say It Right', emoji: '🎙️', skillName: 'Speaking Up', focus: 'finding the words while the moment is still alive' },
    tier: 'Finding the Voice',
    tomorrow: 'the 5-second opener — speaking before the window closes',
  },
  story: {
    archetype: 'The Fan-Fiction Author',
    blurb: 'One "k" and you\'ve written three chapters by midnight. Your imagination is elite — it\'s just been assigned to the wrong job. We\'re retraining it to read what\'s actually there.',
    program: { name: 'Signal Reader', emoji: '🔮', skillName: 'Reading People', focus: 'reacting to what\'s real, not the story' },
    tier: 'Recovering Novelist',
    tomorrow: 'one ambiguous text, three readings — picking the real one',
  },
  volcano: {
    archetype: 'The Pressure Cooker',
    blurb: 'You bury it and bury it and bury it — and then it\'s Vesuvius over a dishwasher. There\'s a middle setting between silence and eruption. We\'re installing it.',
    program: { name: 'Cool Head', emoji: '🧯', skillName: 'Cool Conflict', focus: 'saying the hard thing at low temperature' },
    tier: 'Defusing in Progress',
    tomorrow: 'raising the issue BEFORE it becomes the eruption',
  },
}

export const CONTEXT_LABELS = {
  work: 'work — bosses, coworkers, meetings',
  dating: 'dating & relationships',
  friends: 'friends & the group chat',
  family: 'family',
}

export const COST_LINES = {
  opportunities: 'stop leaving opportunities on the table',
  relationships: 'stop letting the good ones drift',
  selfrespect: "stop paying for other people's comfort",
  peace: 'stop replaying conversations at 2am',
}

export const SKILL_KEYS = ['Reading people', 'Expression', 'Assertiveness', 'Conflict', 'Connection']

export const ANALYZE_LINES = ['listening…', 'matching scenarios to your life…', 'building your program…']
