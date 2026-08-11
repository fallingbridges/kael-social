// ——— Kael's brain v2: situation flows ———
// A situation walks a flow graph: each node = Kael blocks + chips.
// chip.next → node id, or 'resolve' → reflection card + XP.
// node.onFree → node to advance to on free-typed text (when Kael asked an open question).

const t = (text) => ({ type: 'text', text })

export const CATEGORIES = [
  { id: 'convo', emoji: '💬', label: 'A conversation', send: "I never know how to keep a conversation going past small talk." },
  { id: 'dating', emoji: '❤️', label: 'Dating', send: 'She read my message yesterday and just replied "k".' },
  { id: 'work', emoji: '💼', label: 'Work', send: 'My manager criticized my work in front of everyone and I got defensive.' },
  { id: 'conflict', emoji: '⚡', label: 'Conflict', send: 'My friend made a passive-aggressive comment and I shut down.' },
  { id: 'family', emoji: '👥', label: 'Friends / family', send: "My sister keeps asking me for favors and I can't say no." },
]

export const FLOWS = {
  // ————— public criticism at work —————
  'boss-criticism': {
    title: 'Criticized in front of everyone',
    emoji: '💼',
    keywords: ['boss', 'manager', 'criticiz', 'in front of everyone', 'interrupted'],
    reflection: {
      insight: "You tend to respond fast when your competence is questioned. Speed is the tell — in a status moment, the strongest move is usually the slowest one.",
      skill: 'Handling public criticism',
      skillKey: 'Conflict',
      xp: 8,
    },
    nodes: {
      start: {
        blocks: [
          t("oof. public criticism hits different — your nervous system files it under *attack*, not *feedback*. that defensiveness was biology doing its job."),
          t('before I coach you — what bothered you most?'),
        ],
        options: [
          { label: 'Being embarrassed', next: 'embarrassed' },
          { label: 'Feeling disrespected', next: 'disrespected' },
          { label: 'That he was wrong', next: 'wrong' },
          { label: "I don't know", next: 'unsure' },
        ],
      },
      embarrassed: {
        blocks: [
          t("that tracks. the audience is what turned feedback into threat — the same words 1:1 would've stung a tenth as much."),
          {
            type: 'coach',
            title: 'the trap',
            points: [
              'Defending your competence *in the room* makes the conversation about status, not the work.',
              'The audience remembers your composure far longer than his point.',
              'You want to acknowledge the useful part without accepting the humiliation.',
            ],
          },
        ],
        chips: [
          { label: 'What should I say?', next: 'say' },
          { label: 'Help me read him', next: 'read' },
          { label: 'Practice this with me', next: 'practice' },
        ],
      },
      disrespected: {
        blocks: [
          t("legit. and here's the distinction that changes your next move: disrespect is about *how* it was delivered, not *whether* he had a point. you can concede the point and still address the delivery."),
          {
            type: 'coach',
            title: 'the trap',
            points: [
              'Swallowing it teaches him the delivery is free.',
              'Blowing up in the room hands him the high ground.',
              'The move: address the delivery privately, calmly, once.',
            ],
          },
        ],
        chips: [
          { label: 'What should I say?', next: 'say' },
          { label: 'Help me read him', next: 'read' },
          { label: 'Practice this with me', next: 'practice' },
        ],
      },
      wrong: {
        blocks: [
          t("ah — so it's a *facts* problem wearing a *feelings* costume. careful: being right and being seen as right are two separate battles, and the second one is never won mid-meeting."),
          {
            type: 'coach',
            title: 'the trap',
            points: [
              "Correcting him publicly forces him to defend his status, not evaluate your data.",
              'Let the room cool. Bring receipts 1:1, framed as "help me reconcile this."',
              "If he's wrong, the numbers will humiliate him privately so you don't have to publicly.",
            ],
          },
        ],
        chips: [
          { label: 'What should I say?', next: 'say' },
          { label: 'Help me read him', next: 'read' },
          { label: 'Practice this with me', next: 'practice' },
        ],
      },
      unsure: {
        blocks: [
          t("that's honest — and usually it means all three at once: embarrassed, disrespected, and convinced he missed the point. tangled feelings make people lash out or shut down."),
          {
            type: 'coach',
            title: 'untangling it',
            points: [
              'Name it to tame it: "I got defensive because that felt public and personal."',
              'You only need to solve ONE thread today. The relationship repair can wait a day.',
              'The work question and the respect question need different conversations.',
            ],
          },
        ],
        chips: [
          { label: 'What should I say?', next: 'say' },
          { label: 'Help me read him', next: 'read' },
          { label: 'Practice this with me', next: 'practice' },
        ],
      },
      say: {
        blocks: [
          t("here's your script — pick the flavor that sounds like you, not the one that sounds impressive:"),
          {
            type: 'says',
            options: [
              { tone: 'Composed', text: "You had a point about the deadline. The way it landed in the room though — I'd rather get that feedback 1:1. I take it better and you get a better result." },
              { tone: 'In the moment', text: "Good catch — let's fix it. I'll grab you after this to go deeper." },
              { tone: 'Receipts', text: "I want to make sure we're looking at the same numbers — can we take 15 minutes tomorrow to reconcile?" },
            ],
          },
        ],
        chips: [
          { label: 'Help me read him', next: 'read' },
          { label: 'Practice this with me', next: 'practice' },
        ],
      },
      read: {
        blocks: [
          {
            type: 'vibe',
            value: 62,
            label: 'threat reading',
            verdict: 'insecure, not evil',
            note: 'public criticism is usually a status display for HIS audience — his boss, the room. you were the prop, not the target.',
          },
          {
            type: 'flags',
            red: ['Does it in front of seniors = performing', 'Pattern, not one-off? Then it\'s strategy'],
            green: ['Critique was about work, not you as a person', "Hasn't blocked your actual growth"],
          },
          t("watch ONE thing next meeting: does he critique others publicly too, or just you? that answer changes everything."),
        ],
        chips: [
          { label: 'What should I say?', next: 'say' },
          { label: 'Practice this with me', next: 'practice' },
        ],
      },
      practice: {
        blocks: [
          t("ok, roleplay. I'm your manager. we're in the meeting, everyone's watching. ready?"),
          { type: 'roleplay', as: 'your manager', text: "Honestly, this analysis misses the point entirely. Did you even look at the Q3 numbers?" },
          t('what do you do?'),
        ],
        options: [
          { label: '"I did, and I stand by it — the Q3 data supports exactly this."', next: 'practice-defend' },
          { label: '"Fair challenge — let\'s look at Q3 together after this."', next: 'practice-good' },
          { label: 'Stay quiet, fix it later', next: 'practice-quiet' },
        ],
      },
      'practice-defend': {
        blocks: [
          t("see what happened? you're now litigating Q3 in front of an audience — his frame, his tempo. even if you win the point you look rattled."),
          t('try the version that takes the ball and exits the arena: "fair challenge — let\'s look at Q3 together after this." you concede nothing AND end the public round.'),
        ],
        chips: [{ label: 'Run it again', next: 'practice' }],
      },
      'practice-good': {
        blocks: [
          t("💯 that's the move. you sounded open, not defeated — and you moved the fight to a room where facts beat theater."),
          t("notice what it does: the audience sees composure, he loses his stage, and Q3 gets settled where it can actually be settled."),
        ],
        chips: [{ label: 'Run it again', next: 'practice' }],
      },
      'practice-quiet': {
        blocks: [
          t("safe, but it leaks. silence in the room + fixing it later reads as agreement — he learns the delivery works, and the room learns you absorb hits."),
          t('you need ONE sentence of presence before exiting: "fair challenge — let\'s look at Q3 after this." then go be right in private.'),
        ],
        chips: [{ label: 'Run it again', next: 'practice' }],
      },
    },
  },

  // ————— left on read / one-letter replies —————
  'left-on-read': {
    title: 'She replied "k"',
    emoji: '❤️',
    keywords: ['"k"', "'k'", 'left on read', "hasn't replied", 'hasnt replied', 'read my message', 'ghost', 'distant'],
    reflection: {
      insight: 'You mistake ambiguity for rejection. The silence started a story in your head — and you almost replied to the story instead of the person.',
      skill: 'Sitting with ambiguity',
      skillKey: 'Reading people',
      xp: 6,
    },
    nodes: {
      start: {
        blocks: [
          t('a one-letter reply. the rorschach test of texting — it means everything and nothing, which is why your brain is currently writing fan-fiction.'),
          t('context first: how long has this been going?'),
        ],
        options: [
          { label: 'First couple weeks', next: 'early' },
          { label: 'A few months in', next: 'months' },
          { label: "It's my ex", next: 'ex' },
          { label: 'Long-term partner', next: 'partner' },
        ],
      },
      early: {
        blocks: [
          {
            type: 'vibe',
            value: 41,
            label: 'interest reading',
            verdict: 'cooling, not cold',
            note: 'early stage + effort drop = attention drifting. but "k" after a logistics text means nothing — WHAT she k\'d matters more than the k.',
          },
          t("real talk: what did she 'k' exactly? if it was a plan confirmation, you're fine. if it was a bid for connection, the data's worse."),
        ],
        chips: [
          { label: 'What should I text back?', next: 'say' },
          { label: 'Should I even reply?', next: 'wait' },
        ],
      },
      months: {
        blocks: [
          {
            type: 'vibe',
            value: 55,
            label: 'interest reading',
            verdict: 'a mood, probably not a verdict',
            note: "a few months in, 'k' is more often a bad day than a fading heart. pattern beats datapoint: is effort down across the week, or just tonight?",
          },
          t("one 'k' = noise. three low-effort days = signal. which one are we looking at?"),
        ],
        chips: [
          { label: 'What should I text back?', next: 'say' },
          { label: 'Should I even reply?', next: 'wait' },
        ],
      },
      ex: {
        blocks: [
          t("an ex sending 'k' isn't a puzzle, it's a boundary — theirs or yours, someone's drawing one."),
          {
            type: 'flags',
            red: ["You're decoding an ex's punctuation — that's the actual flag 🚩", 'Re-opening this thread reopens the wound'],
            green: ['You noticed and came here instead of triple-texting. growth.'],
          },
        ],
        chips: [
          { label: 'Help me let this go', next: 'letgo' },
          { label: 'What should I text back?', next: 'say' },
        ],
      },
      partner: {
        blocks: [
          t("in a long-term thing, 'k' over text usually means the real conversation is waiting at home. don't have it in the thread."),
          {
            type: 'coach',
            title: 'the move',
            points: [
              "Don't match the coldness — that's how spirals start.",
              'One warm, zero-pressure text: "feels like something\'s off — I\'m around when you want to talk."',
              'Then actually talk. In person. Phones down.',
            ],
          },
        ],
        chips: [{ label: 'What should I text back?', next: 'say' }],
      },
      say: {
        blocks: [
          t("options — and notice none of them mention the 'k'. never audit their punctuation out loud:"),
          {
            type: 'says',
            options: [
              { tone: 'Playful', text: 'a whole letter?? for me?? 🥹 ok but actually — how was the thing today?' },
              { tone: 'Chill', text: '(nothing. post your good day on the story instead. let curiosity work.)' },
              { tone: 'Direct', text: "you're short with me today — all good, or should we talk?" },
            ],
          },
        ],
        chips: [{ label: 'Should I even reply?', next: 'wait' }],
      },
      wait: {
        blocks: [
          {
            type: 'coach',
            title: 'the 24-hour rule',
            points: [
              "Low-effort in, low-urgency back. Don't reward 'k' with a paragraph.",
              'Go live your day loudly — the best reply to distance is a full life.',
              "If the energy doesn't return in a few days, ask directly ONCE. Then believe the answer.",
            ],
          },
        ],
        chips: [{ label: 'What should I text back?', next: 'say' }],
      },
      letgo: {
        blocks: [
          t("here's the reframe: closure isn't something they send you. it's something you decide."),
          {
            type: 'coach',
            title: 'the protocol',
            points: [
              'Mute, don\'t block (blocking is still a message).',
              "Every urge to decode them, redirect: text a friend who actually replies.",
              'The 90% rule: you already know. The decoding is just delay.',
            ],
          },
        ],
        chips: [],
      },
    },
  },

  // ————— saying no —————
  'say-no': {
    title: 'How do I say no?',
    emoji: '🛑',
    keywords: ["say no", "can't say no", 'cant say no', 'favor', 'babysit', 'turn down', 'tell him no', 'tell her no'],
    reflection: {
      insight: 'You pad your no with apologies until it sounds like a maybe — then people push on the maybe, and you fold on the push.',
      skill: 'Clean boundaries',
      skillKey: 'Boundaries',
      xp: 7,
    },
    nodes: {
      start: {
        blocks: [
          t("good news: 'no' is a complete sentence. bad news: not for people who've had a lifetime subscription to your yes."),
          t('what makes THIS no hard?'),
        ],
        options: [
          { label: "They'll be hurt", next: 'hurt' },
          { label: "They'll push back", next: 'push' },
          { label: 'I owe them', next: 'owe' },
          { label: 'I always say yes', next: 'always' },
        ],
      },
      hurt: {
        blocks: [
          t("their disappointment is real — and survivable. you've been treating it as an emergency you must prevent. it's just weather."),
          {
            type: 'coach',
            title: 'the warm no',
            points: [
              'Warmth in the tone, firmness in the content. Never the reverse.',
              "Don't over-explain. Three reasons sound like three doors to argue with.",
              'You can care about their feelings without carrying their feelings.',
            ],
          },
        ],
        chips: [
          { label: 'Give me the words', next: 'say' },
          { label: 'What if they guilt-trip me?', next: 'guilt' },
        ],
      },
      push: {
        blocks: [
          t("pushback isn't a sign your no was wrong — it's a sign your no was inconvenient. those are different things."),
          {
            type: 'coach',
            title: 'the broken record',
            points: [
              'Same sentence, same warm tone, every push: "I get it — still can\'t this time."',
              "Each new excuse you offer is a new handle for them to grab.",
              'Silence after your no is not an invitation to fill it.',
            ],
          },
        ],
        chips: [
          { label: 'Give me the words', next: 'say' },
          { label: 'What if they guilt-trip me?', next: 'guilt' },
        ],
      },
      owe: {
        blocks: [
          t("debts between people who love each other don't compound like this. if the ledger only ever runs one direction, it's not a ledger — it's a leash."),
          t("you can honor what they've done for you AND decline this ask. gratitude is not an unlimited credit line."),
        ],
        chips: [
          { label: 'Give me the words', next: 'say' },
          { label: 'What if they guilt-trip me?', next: 'guilt' },
        ],
      },
      always: {
        blocks: [
          t("then this first no is going to feel earthquake-sized to you and mildly surprising to them. that gap is the anxiety talking."),
          {
            type: 'coach',
            title: 'why the first no matters',
            points: [
              "Every yes you didn't mean taught them your time is free.",
              "The first no re-prices it. Expect one confused blink, not a rupture.",
              "People who only like you when you're useful were never the audience for your boundaries anyway.",
            ],
          },
        ],
        chips: [
          { label: 'Give me the words', next: 'say' },
          { label: 'What if they guilt-trip me?', next: 'guilt' },
        ],
      },
      say: {
        blocks: [
          {
            type: 'says',
            options: [
              { tone: 'Warm + firm', text: "I love that you thought of me — I can't take this one on. Hope it goes great." },
              { tone: 'No reason', text: "Can't this time! Next round's on me though." },
              { tone: 'Honest', text: "I've been saying yes past my limit lately and I'm fixing that. This one's a no — nothing to do with you." },
            ],
          },
          t('notice: zero "sorry"s. an apology tells them a wrong occurred. no wrong occurred.'),
        ],
        chips: [{ label: 'What if they guilt-trip me?', next: 'guilt' }],
      },
      guilt: {
        blocks: [
          { type: 'roleplay', as: 'them', text: 'Wow. Okay. I guess I just remember all the times I helped YOU…' },
          {
            type: 'coach',
            title: 'guilt-trip disarm',
            points: [
              'Name it gently: "sounds like you\'re disappointed — that\'s fair."',
              'Re-state, don\'t re-argue: "still can\'t this time."',
              'Do NOT match the escalation. Calm is the whole game.',
            ],
          },
        ],
        chips: [{ label: 'Give me the words', next: 'say' }],
      },
    },
  },

  // ————— taught lesson from Growth: direct asks —————
  'direct-ask': {
    title: 'Asking directly',
    emoji: '🎯',
    keywords: ['teach me to ask directly'],
    reflection: {
      insight: 'Hinting protects you from a "no" by making sure there was never really a question. Direct asks risk the no — and get the yes.',
      skill: 'Direct asks',
      skillKey: 'Assertiveness',
      xp: 5,
    },
    nodes: {
      start: {
        blocks: [
          t("ok — the direct ask, the skill you've been orbiting in three separate situations 👀"),
          {
            type: 'coach',
            title: 'the anatomy of a direct ask',
            points: [
              'Name the want: "I\'d like…" — not "would it maybe be possible…"',
              'One sentence. The longer the ask, the weaker it sounds.',
              "Silence after asking. Whoever fills it first is negotiating with themselves.",
              'A "no" to a direct ask stings less than a lifetime of unheard hints. That\'s the trade.',
            ],
          },
          {
            type: 'says',
            options: [
              { tone: 'At work', text: "I'd like to lead the next client project. What would it take?" },
              { tone: 'Dating', text: "I like you. I'd rather see you Friday than keep texting. You in?" },
              { tone: 'Friends', text: 'Can you actually be on time Saturday? It matters to me.' },
            ],
          },
        ],
        chips: [],
      },
    },
  },

  // ————— generic fallback —————
  generic: {
    title: null,
    emoji: '💬',
    keywords: [],
    reflection: {
      insight: 'You brought the situation here instead of reacting on impulse — that pause between feeling and response is the actual skill.',
      skill: 'The pause',
      skillKey: 'Conversation',
      xp: 4,
    },
    nodes: {
      start: {
        blocks: [
          t("ok, I'm listening 🧠 give me the raw material — what was said, word for word if you can. messy details welcome, that's where the truth lives."),
        ],
        options: [],
        onFree: 'coached',
      },
      coached: {
        blocks: [
          t("got it. here's what I'd look at before anything else:"),
          {
            type: 'coach',
            title: 'first read',
            points: [
              'Separate what happened from the story you\'re telling about it. Facts first, verdicts later.',
              "Ask what they were protecting — embarrassment? status? Most weird behavior is defense, not offense.",
              'What outcome do you actually want here? Answer that before you respond to anything.',
            ],
          },
        ],
        chips: [{ label: 'What should I say?', next: 'say' }],
      },
      say: {
        blocks: [
          {
            type: 'says',
            options: [
              { tone: 'Curious', text: "Hey — that landed a bit strangely with me. What did you mean by it?" },
              { tone: 'Honest', text: "I've been chewing on what happened. Can we talk it through properly?" },
              { tone: 'Light', text: 'Ok that was a weird moment. Are we good?' },
            ],
          },
        ],
        chips: [],
      },
    },
  },
}

export function routeFlow(text) {
  const s = text.toLowerCase()
  for (const [id, flow] of Object.entries(FLOWS)) {
    if (id === 'generic') continue
    if (flow.keywords.some((k) => s.includes(k))) return id
  }
  return 'generic'
}

// ——— skills ———
export const INITIAL_SKILLS = [
  { key: 'Conversation', value: 81 },
  { key: 'Reading people', value: 72 },
  { key: 'Conflict', value: 64 },
  { key: 'Dating', value: 63 },
  { key: 'Assertiveness', value: 51 },
  { key: 'Boundaries', value: 46 },
]

// ——— seed situations so the home screen tells the story ———
export const SEED_SITUATIONS = [
  {
    id: 'seed-1',
    title: "She hasn't replied since yesterday",
    emoji: '❤️',
    status: 'open',
    when: '2h ago',
    flowId: 'left-on-read',
    nodeId: 'start',
    messages: [
      { from: 'user', blocks: [t("she hasn't replied since yesterday and her last text was just 'k'")] },
      { from: 'kael', blocks: FLOWS['left-on-read'].nodes.start.blocks },
    ],
  },
  {
    id: 'seed-2',
    title: 'Boss interrupted me again',
    emoji: '💼',
    status: 'resolved',
    when: 'yesterday',
    flowId: 'boss-criticism',
    nodeId: 'say',
    messages: [
      { from: 'user', blocks: [t('my boss interrupted me twice in the standup and talked over my idea')] },
      {
        from: 'kael',
        blocks: [
          t("noted — and the fact that it's 'again' matters. interruption once is rudeness; as a pattern it's rank-marking."),
          {
            type: 'coach',
            title: 'reclaiming airtime',
            points: [
              '"Let me land this thought" — calm, no uptick at the end.',
              'Finish to the ROOM, not to him. Eye contact with the audience.',
              'If it persists, name it 1:1: "I notice I get cut off in standups. I need to finish my points."',
            ],
          },
        ],
      },
      {
        from: 'kael',
        blocks: [
          {
            type: 'reflection',
            insight: 'When interrupted, you stop talking mid-sentence — you yield the floor before anyone actually takes it.',
            skill: 'Holding the floor',
            skillKey: 'Assertiveness',
            xp: 8,
          },
        ],
      },
    ],
  },
]

export const NOTICED = {
  text: 'Three of your recent situations involve avoiding a direct ask — the raise, the second date, the roommate thing.',
  cta: 'Teach me to ask directly',
  flowId: 'direct-ask',
}
