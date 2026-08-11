// ——— Kael's canned brain: keyword-matched scripted replies for the prototype ———

export const GREETING = [
  { type: 'text', text: "hey, it's kael 👋 your social life, decoded." },
  {
    type: 'text',
    text: "who are we overanalyzing today? paste a text, describe a situation, or hit a shortcut below.",
  },
]

export const CHIPS = [
  { id: 'decode', emoji: '🔍', label: 'Decode a text', send: 'Decode this text: "lol ok cool cool"' },
  { id: 'flirt', emoji: '💘', label: 'Flirt assist', send: 'Help me flirt — what do I text back?' },
  { id: 'fight', emoji: '🧯', label: 'Fight going bad', send: "We're mid-fight and it's spiraling. Help." },
  { id: 'raise', emoji: '💰', label: 'Ask for more', send: 'I want to negotiate my salary tomorrow.' },
  { id: 'speak', emoji: '🎤', label: 'Speak up', send: 'I never speak up in meetings. Fix me.' },
]

const DECODE_REPLY = [
  {
    type: 'text',
    text: "ok. “lol ok cool cool” — four words, zero punctuation, maximum vibes withheld. let's run it through the lab 🧪",
  },
  {
    type: 'vibe',
    value: 34,
    label: 'interest reading',
    verdict: 'guarded, not gone',
    note: "double “cool” = filling silence, not enthusiasm. the “lol” is doing damage control.",
  },
  {
    type: 'flags',
    red: ['No question back', 'Mirror-energy: low effort in, low effort out'],
    green: ['Still replying fast', "Didn't leave you on read"],
  },
  {
    type: 'text',
    text: "verdict: they're lukewarm on the topic, not on you. change the channel — don't reheat this thread. try one of these:",
  },
  {
    type: 'says',
    options: [
      { tone: 'Playful', text: "ok that was my worst pitch. new topic: rate your week 1–10, no 7s allowed" },
      { tone: 'Direct', text: "you sound half-in. wanna just call for 5 min instead?" },
      { tone: 'Chill', text: "haha fair. what are you actually up to this weekend?" },
    ],
  },
]

const FLIRT_REPLY = [
  { type: 'text', text: "say less. flirting is just confidence + specificity + a little mischief 😏" },
  {
    type: 'text',
    text: "rule of thumb: compliment the choice, not the body. tease the thing they're clearly proud of. and always end on a hook they *want* to answer.",
  },
  {
    type: 'says',
    options: [
      { tone: 'Bold', text: "I was going to play it cool for 3 more days but you're too interesting for that" },
      { tone: 'Teasing', text: "you have strong “ordered the best thing on the menu” energy. prove me right or wrong Thursday?" },
      { tone: 'Sweet', text: "talking to you is the best part of my scroll. lowering my standards for everyone else accordingly" },
    ],
  },
  {
    type: 'coach',
    title: 'micro-lesson · 20 sec',
    points: [
      'Specific > smooth. Reference a real detail they shared.',
      'One question per text. Interviews are for jobs.',
      'Send it and put the phone down. Marinating kills charm.',
    ],
  },
]

const FIGHT_REPLY = [
  { type: 'text', text: "breathe. you can't win a fight, you can only win the repair 🧯" },
  {
    type: 'coach',
    title: 'de-escalation protocol',
    points: [
      "Drop the scoreboard — stop building your counter-argument while they talk.",
      "Name the feeling, not the crime: “I'm hurt” lands, “you always” detonates.",
      "Ask the magic question: “what do you need from me right now?”",
      "20-min timeout is legal. Leaving forever-energy is not.",
    ],
  },
  {
    type: 'says',
    options: [
      { tone: 'Repair', text: "I care more about us than about winning this. Can we restart?" },
      { tone: 'Boundary', text: "I want to hear you, but not at this volume. 20 minutes, then we finish this properly." },
    ],
  },
  { type: 'text', text: "want me to decode what they said, or rehearse your opener for round two?" },
]

const RAISE_REPLY = [
  { type: 'text', text: "love this for you 💰 negotiation is a script game — and we're writing yours tonight." },
  {
    type: 'vibe',
    value: 78,
    label: 'leverage reading',
    verdict: 'stronger than you think',
    note: 'replacing you costs them 6–9 months of ramp-up. remember that when your voice tries to shrink.',
  },
  {
    type: 'coach',
    title: 'the script',
    points: [
      "Anchor high, with evidence: number first, feelings never.",
      "“Based on my impact on X and market range, I'm targeting ___.”",
      'Then SILENCE. First one to talk after the number loses.',
      "If they say no: “what would need to be true in 90 days?” — get it in writing.",
    ],
  },
  { type: 'text', text: "want to rehearse? I'll play your manager — I'll even do the disappointed sigh." },
]

const SPEAK_REPLY = [
  { type: 'text', text: "you don't need to be louder, you need a lower bar for entry 🎤" },
  {
    type: 'coach',
    title: 'the 3-sentence rule',
    points: [
      'Speak once in the first 10 minutes — it rewires how the room sees you.',
      "Use a frame, not a masterpiece: “I see it differently — here's why.”",
      "Claim interrupted airtime back: “let me land this thought.”",
      'Perfection is a stall tactic. B-minus comments said out loud beat A+ thoughts in your head.',
    ],
  },
  {
    type: 'says',
    options: [
      { tone: 'Opener', text: "Before we move on — one risk I think we're underweighting…" },
      { tone: 'Pushback', text: "I'd push back gently on that. The data we saw last week says otherwise." },
    ],
  },
]

const GHOST_REPLY = [
  { type: 'text', text: "ghosted, huh. first: their silence is information, not a verdict on you 👻" },
  {
    type: 'vibe',
    value: 18,
    label: 'revival odds',
    verdict: 'low — protect your peace',
    note: 'one graceful check-in is allowed. double-texting past that is donating your dignity.',
  },
  {
    type: 'says',
    options: [
      { tone: 'Graceful', text: "no stress if life got loud — door's open this week if you want to grab that drink" },
      { tone: 'Closure', text: "taking the silence as an answer — no hard feelings. good luck out there ✌️" },
    ],
  },
  { type: 'text', text: "either way: send it once, then go be unreachable and thriving. that's the whole move." },
]

const DEFAULT_REPLIES = [
  [
    { type: 'text', text: "interesting… give me the raw material 🧠 paste the actual text, or tell me what happened — messy details welcome, that's where the truth lives." },
  ],
  [
    { type: 'text', text: "I have theories, but I work best with receipts. what did they say word-for-word? screenshots-in-prose totally count." },
  ],
]

const ROUTES = [
  { keys: ['decode', 'mean', 'lol ok', 'read into', 'what does'], reply: DECODE_REPLY },
  { keys: ['flirt', 'crush', 'date', 'cute', 'text back', 'rizz'], reply: FLIRT_REPLY },
  { keys: ['fight', 'argu', 'mad at', 'spiral', 'yelling', 'angry'], reply: FIGHT_REPLY },
  { keys: ['raise', 'salary', 'negotiat', 'offer', 'money', 'paid'], reply: RAISE_REPLY },
  { keys: ['speak', 'meeting', 'shy', 'quiet', 'stand up', 'confiden'], reply: SPEAK_REPLY },
  { keys: ['ghost', 'left on read', 'no reply', 'ignor'], reply: GHOST_REPLY },
]

let defaultIdx = 0
export function kaelReply(input) {
  const t = input.toLowerCase()
  for (const r of ROUTES) {
    if (r.keys.some((k) => t.includes(k))) return r.reply
  }
  const reply = DEFAULT_REPLIES[defaultIdx % DEFAULT_REPLIES.length]
  defaultIdx++
  return reply
}

// ——— Playbooks ———
export const PLAYBOOKS = [
  { id: 'decode', emoji: '🔍', title: 'Decode the Text', sub: 'What did they actually mean?', tint: 'coral', send: 'Decode this text: "lol ok cool cool"' },
  { id: 'fight', emoji: '🧯', title: 'Fight Fixer', sub: 'De-escalate & repair', tint: 'butter', send: "We're mid-fight and it's spiraling. Help." },
  { id: 'shot', emoji: '💘', title: 'Shoot Your Shot', sub: 'Approach & flirt, smoothly', tint: 'sage', send: 'Help me flirt — what do I text back?' },
  { id: 'raise', emoji: '💰', title: 'Get the Raise', sub: 'Scripts that move numbers', tint: 'butter', send: 'I want to negotiate my salary tomorrow.' },
  { id: 'speak', emoji: '🎤', title: 'Speak Up', sub: 'Own the room, kindly', tint: 'coral', send: 'I never speak up in meetings. Fix me.' },
  { id: 'ghost', emoji: '👻', title: 'Ghost Protocol', sub: 'Left on read? Handle it', tint: 'sage', send: "I got ghosted. What now?" },
]

// ——— Growth / Social Fitness ———
export const SKILLS = [
  { name: 'Reading the room', value: 72, note: 'sharp' },
  { name: 'Flirting', value: 63, note: 'warming up' },
  { name: 'Conflict repair', value: 55, note: 'improving' },
  { name: 'Boundaries', value: 41, note: 'leg day, huh' },
]

export const QUESTS = [
  { id: 1, text: 'Send the first message', done: 2, total: 3 },
  { id: 2, text: 'Say no without apologizing', done: 0, total: 1 },
  { id: 3, text: 'Decode before you spiral', done: 1, total: 2 },
  { id: 4, text: 'Give one real compliment', done: 3, total: 3 },
]
