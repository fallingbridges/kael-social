// ——— Kael's brain v3: companion model ———
// Situations walk a flow graph. No scores, no statuses — situations get
// wrapped up with an observation (what Kael learned about you), and Kael
// follows up later. followUp lives on a situation until answered.

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
    observation: "You tend to respond fast when your competence is questioned. Speed is the tell — in a status moment, the strongest move is usually the slowest one.",
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
            red: ['Does it in front of seniors = performing', "Pattern, not one-off? Then it's strategy"],
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
    observation: 'You mistake ambiguity for rejection. The silence started a story in your head — and you almost replied to the story instead of the person.',
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
              "Mute, don't block (blocking is still a message).",
              'Every urge to decode them, redirect: text a friend who actually replies.',
              'The 90% rule: you already know. The decoding is just delay.',
            ],
          },
        ],
        chips: [],
      },
      // ——— follow-up branches (Kael checks in from the home screen) ———
      'fu-replied': {
        blocks: [
          t("SEE. the fan-fiction your brain wrote was worse than the reality — it usually is 😌"),
          t("what did she say? bring it here, let's read the temperature together."),
        ],
        chips: [],
      },
      'fu-nothing': {
        blocks: [
          t("ok. two days of silence IS information — not about your worth, about her bandwidth or her interest."),
          {
            type: 'coach',
            title: 'where this goes now',
            points: [
              'One graceful check-in is allowed. Past that, you\'re donating your dignity.',
              "Send it once, then go be unreachable and thriving.",
              'If nothing comes back in a few days — that was the answer. Believe it.',
            ],
          },
          {
            type: 'says',
            options: [
              { tone: 'Graceful', text: "no stress if life got loud — door's open this week if you want to grab that drink" },
              { tone: 'Closure', text: "taking the silence as an answer — no hard feelings. good luck out there ✌️" },
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
    keywords: ['say no', "can't say no", 'cant say no', 'favor', 'babysit', 'turn down', 'tell him no', 'tell her no'],
    observation: 'You pad your no with apologies until it sounds like a maybe — then people push on the maybe, and you fold on the push.',
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
              'Each new excuse you offer is a new handle for them to grab.',
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
              'The first no re-prices it. Expect one confused blink, not a rupture.',
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

  // ————— working on directness (opened from the You tab) —————
  'direct-ask': {
    title: 'Asking directly',
    emoji: '🎯',
    keywords: ['ask directly', 'more direct'],
    observation: 'Hinting protects you from a "no" by making sure there was never really a question. Direct asks risk the no — and get the yes.',
    nodes: {
      start: {
        blocks: [
          t("ok — the direct ask. the thing you've been orbiting in three separate situations 👀"),
          {
            type: 'coach',
            title: 'the anatomy of a direct ask',
            points: [
              'Name the want: "I\'d like…" — not "would it maybe be possible…"',
              'One sentence. The longer the ask, the weaker it sounds.',
              'Silence after asking. Whoever fills it first is negotiating with themselves.',
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
          t("next time a real ask comes up — bring it here before you send the hint version. we'll sharpen it live."),
        ],
        chips: [],
      },
    },
  },

  // ————— drills: roleplay reps, no real stakes —————
  'drill-guilt': {
    title: 'The Guilt-Tripper',
    emoji: '🧟',
    keywords: [],
    observation: null,
    nodes: {
      start: {
        blocks: [
          t("drill time 🏋️ I'm your friend asking you to cover my shift — third time this month. no real stakes, full reps. ready?"),
          { type: 'roleplay', as: 'your friend', text: "pleaseee, I know it's last minute but you're literally the only person I trust with this. remember when I helped you move?" },
          t('what do you say?'),
        ],
        options: [
          { label: 'Ugh… fine, I\'ll do it', next: 'cave' },
          { label: "I'm so sorry, it's just that I have this thing and—", next: 'sorry' },
          { label: "Can't this time! Hope you find someone 🤞", next: 'clean' },
        ],
      },
      cave: {
        blocks: [
          t("the classic cave 😩 you just taught them shift #4 is also free. notice the math: their one favor last year is buying your third weekend this month."),
          t("run it back — this time protect the weekend."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      sorry: {
        blocks: [
          t("see what happened mid-sentence? you started negotiating with yourself in public. every excuse you hand them is a handle to grab — and a guilt-tripper collects handles."),
          t('the no can be warm AND handle-free. try the short one.'),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      clean: {
        blocks: [
          t("💯 clean. warm, short, zero doors left open — and notice: nothing exploded. the friendship survives your no."),
          t('ready for the boss level? guilt-trippers escalate when the old tricks stop working.'),
        ],
        chips: [{ label: '😈 Harder mode', next: 'hard' }, { label: 'Run it again', next: 'start' }],
      },
      hard: {
        blocks: [
          { type: 'roleplay', as: 'your friend', text: 'wow. okay. I guess I just know where we stand now.' },
          t('the escalation. what do you do?'),
        ],
        options: [
          { label: 'Okay okay wait — I\'ll do it, don\'t be like that', next: 'fold' },
          { label: '"Sounds like you\'re disappointed — fair. Still can\'t this time."', next: 'hold' },
        ],
      },
      fold: {
        blocks: [
          t("and THAT'S the move the whole act was designed for. the drama was the price tag, and you paid it."),
          t("remember: their disappointment is weather, not an emergency. run it again and stand in the rain for one more sentence."),
        ],
        chips: [{ label: 'Run it again', next: 'hard' }],
      },
      hold: {
        blocks: [
          t("🔥 that's the whole skill. you named the feeling, held the line, and didn't match the escalation. guilt-trips die in calm weather."),
          t("that's a full rep. next time this happens in real life, your mouth already knows the words."),
        ],
        chips: [{ label: 'Run the drill again', next: 'start' }],
      },
    },
  },

  'drill-interrupt': {
    title: 'The Interrupter',
    emoji: '🎤',
    keywords: [],
    observation: null,
    nodes: {
      start: {
        blocks: [
          t("drill time 🏋️ team meeting, you're two sentences into your idea. here it comes—"),
          { type: 'roleplay', as: 'your coworker', text: "—okay we get it, let's just move on. anyway, about the launch date…" },
          t('what do you do?'),
        ],
        options: [
          { label: 'Go quiet, bring it up after the meeting', next: 'quiet' },
          { label: '"Let me land this thought — thirty seconds."', next: 'land' },
          { label: '"Can I FINISH? seriously."', next: 'snap' },
        ],
      },
      quiet: {
        blocks: [
          t("safe, but it leaks status. the room just learned your ideas can be skipped — and rooms remember."),
          t("you don't need volume, you need one calm sentence of presence. try it."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      land: {
        blocks: [
          t("💯 exactly. calm, specific, no apology, no drama — the room hears authority, not conflict. and notice: nobody thinks you're rude. they think you're someone who finishes."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      snap: {
        blocks: [
          t("understandable — but the snap makes YOU the incident. the room stops hearing your idea and starts watching a fight."),
          t("same message, lower temperature: 'let me land this thought.' it wins the same ground without the debris."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
    },
  },

  'drill-cold': {
    title: 'The Cold Text',
    emoji: '🥶',
    keywords: [],
    observation: null,
    nodes: {
      start: {
        blocks: [
          t("drill time 🏋️ you sent a good message an hour ago. the reply just arrived:"),
          { type: 'roleplay', as: 'your crush', text: 'k' },
          t('your move.'),
        ],
        options: [
          { label: 'did I do something wrong?? 🥺', next: 'chase' },
          { label: 'wow ok. why are you being so dry lol', next: 'audit' },
          { label: '(nothing now) then later: "rate your week 1–10, no 7s allowed"', next: 'cool' },
        ],
      },
      chase: {
        blocks: [
          t("you replied to the story in your head, not the text. one 'k' now owns your whole evening — that's a lot of power to hand a single letter."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      audit: {
        blocks: [
          t("never audit their punctuation out loud 💀 now the conversation is about the conversation — the least attractive topic that exists."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      cool: {
        blocks: [
          t("💯 that's the one. no pursuit, no audit — just an easy door back in on your timeline. if they walk through it, great. if not, you spent zero dignity."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
    },
  },

  'drill-lowball': {
    title: 'The Lowball',
    emoji: '💰',
    keywords: [],
    observation: null,
    nodes: {
      start: {
        blocks: [
          t("drill time 🏋️ final round went great. then the offer call:"),
          { type: 'roleplay', as: 'the hiring manager', text: "so — budget's tight this quarter. best we can do is 70. I'd need an answer by tomorrow." },
          t('what do you say?'),
        ],
        options: [
          { label: 'Okay… yeah, I can make that work', next: 'accept' },
          { label: 'Oh. I was hoping for a bit more, but…', next: 'trail' },
          { label: '"I\'m targeting 85 based on the role and market." (then silence)', next: 'anchor' },
        ],
      },
      accept: {
        blocks: [
          t("instant yes = you just told them the lowball worked, and the fake deadline too. that discount compounds every year you're there."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      trail: {
        blocks: [
          t("you opened the door and then… trailed off. a hope is not a number. they can't negotiate against 'a bit more', so they won't."),
          t('say the number. then let the silence do its job.'),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
      anchor: {
        blocks: [
          t("💯 number first, evidence attached, and then the hard part — you didn't fill the silence. whoever talks first after the number is negotiating with themselves."),
          t("full rep. your voice will want to shrink on the real call — now it has muscle memory."),
        ],
        chips: [{ label: 'Run it again', next: 'start' }],
      },
    },
  },

  // ————— generic fallback —————
  generic: {
    title: null,
    emoji: '💬',
    keywords: [],
    observation: 'You brought the situation here instead of reacting on impulse — that pause between feeling and response is the actual skill.',
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
              "Separate what happened from the story you're telling about it. Facts first, verdicts later.",
              'Ask what they were protecting — embarrassment? status? Most weird behavior is defense, not offense.',
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
              { tone: 'Curious', text: 'Hey — that landed a bit strangely with me. What did you mean by it?' },
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

// ——— seed situations ———
export const SEED_SITUATIONS = [
  {
    id: 'seed-1',
    title: "She hasn't replied since yesterday",
    emoji: '❤️',
    when: 'yesterday',
    flowId: 'left-on-read',
    nodeId: 'start',
    followUp: {
      question: 'Did she ever reply?',
      options: [
        { label: 'She did 🎉', next: 'fu-replied' },
        { label: 'Still nothing', next: 'fu-nothing' },
      ],
    },
    messages: [
      { from: 'user', blocks: [t("she hasn't replied since yesterday and her last text was just 'k'")] },
      { from: 'kael', blocks: FLOWS['left-on-read'].nodes.start.blocks },
    ],
  },
  {
    id: 'seed-2',
    title: 'Boss interrupted me again',
    emoji: '💼',
    when: '3 days ago',
    flowId: 'boss-criticism',
    nodeId: 'say',
    wrapped: true,
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
      { from: 'user', blocks: [t('that helps, thank you 🙏')] },
      {
        from: 'kael',
        blocks: [
          t('anytime. one thing before you go —'),
          {
            type: 'observe',
            text: 'When interrupted, you stop talking mid-sentence — you yield the floor before anyone actually takes it.',
          },
        ],
      },
    ],
  },
  {
    id: 'seed-3',
    title: 'Dinner with her parents',
    emoji: '👥',
    when: 'last week',
    flowId: 'generic',
    nodeId: 'say',
    wrapped: true,
    messages: [
      { from: 'user', blocks: [t("meeting her parents saturday and I'm terrified of the silence moments")] },
      {
        from: 'kael',
        blocks: [
          t("classic. everyone's scared of the silence — including her parents. whoever relaxes first wins the whole table."),
          {
            type: 'coach',
            title: 'the dinner kit',
            points: [
              'Questions beat performances. "How did you two meet?" runs for ten minutes on its own.',
              "Compliment the home, not her mom's looks. Safe, warm, classy.",
              'One silence survived calmly reads as confidence, not awkwardness.',
            ],
          },
        ],
      },
      { from: 'user', blocks: [t('that helps, thank you 🙏')] },
      {
        from: 'kael',
        blocks: [
          {
            type: 'observe',
            text: "You rehearse conversations that haven't happened yet — the anxiety is doing the talking before anyone's said a word.",
          },
        ],
      },
    ],
  },
]

// ——— the You tab: identity, skill journeys, and growth receipts ———

// ——— the Learn tab: a practice gym, not a library ———

export const DRILLS = [
  { id: 'drill-guilt', emoji: '🧟', title: 'The Guilt-Tripper', sub: 'Say no. Survive the guilt.', time: '2 min', tint: 'coral' },
  { id: 'drill-interrupt', emoji: '🎤', title: 'The Interrupter', sub: 'Hold the floor, calmly', time: '2 min', tint: 'butter' },
  { id: 'drill-cold', emoji: '🥶', title: 'The Cold Text', sub: "Don't chase the 'k'", time: '1 min', tint: 'sage' },
  { id: 'drill-lowball', emoji: '💰', title: 'The Lowball', sub: 'Counter without flinching', time: '2 min', tint: 'butter' },
  { id: 'drill-silence', emoji: '🤐', title: 'The Awkward Silence', sub: 'Unlocks after your next situation', tint: 'coral', locked: true },
  { id: 'drill-backhand', emoji: '🎭', title: 'The Backhanded Compliment', sub: 'Unlocks after your next situation', tint: 'sage', locked: true },
]

export const RECOMMENDED = {
  drillId: 'drill-guilt',
  because: 'How do I say no?',
}

export const TRAINING = [
  { skill: 'Boundaries', note: 'trained 2× this week', hot: true },
  { skill: 'Speaking up', note: 'trained once this week', hot: true },
  { skill: 'Dating & ambiguity', note: 'not yet this week' },
  { skill: 'Negotiation', note: 'new — first rep waiting' },
]
