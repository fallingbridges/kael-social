// ——— The rep: Boundary Setting, levels 1→5 ———
// quality: strong | almost | fold | harsh
// An option with `next` continues the scene (NPC pushes back) before any coaching.

export const SKILL = { name: 'Boundary Setting', emoji: '🛡️' }

export const REPS = [
  {
    id: 'punchline',
    level: 1,
    context: 'Friday night. Your friend has made you the joke three times in front of the group.',
    npc: { name: 'Jake', role: 'your friend', emoji: '😏', color: 'var(--butter)' },
    line: "come on, I'm just messing with you. don't be so sensitive.",
    options: [
      { text: 'haha yeah, whatever.', quality: 'fold', verdict: 'You laughed it off', why: 'The joke stays free — and rep #4 of being the punchline is already scheduled.', better: "I know you're joking. I just don't like being the punchline every time." },
      { text: 'maybe stop being an asshole then.', quality: 'harsh', verdict: 'Boundary landed, grenade attached', why: 'You attacked his character instead of naming the behavior — now HE gets to be the wounded one.', better: "I know you're joking. I just don't like being the punchline every time." },
      { text: "I know you're joking. I just don't like being the punchline every time.", quality: 'strong', verdict: 'Clear without escalating', why: 'You named the behavior and the boundary — zero attack on him as a person. Nothing for him to defend.' },
      { text: '(say nothing — not worth making it awkward)', quality: 'fold', verdict: 'The silent tax', why: "Avoiding ten awkward seconds now buys you months of the same joke. Silence reads as a license.", better: "I know you're joking. I just don't like being the punchline every time." },
    ],
  },
  {
    id: 'airport',
    level: 1,
    context: '9:48 PM. You work at 7 tomorrow.',
    npc: { name: 'Sam', role: 'your friend', emoji: '✈️', color: 'var(--sage)' },
    line: 'broo my flight lands at 1am — can you get me? ubers from the airport are INSANE 😭',
    options: [
      { text: "can't tonight — I'm up at 6. hope it goes smooth ✌️", quality: 'strong', verdict: 'Clean no', why: 'One reason, no apology, warmth intact. This is the whole skill in one text.' },
      { text: "yeah ok, I'll set an alarm 😮‍💨", quality: 'fold', verdict: 'The 1AM yes', why: "You just taught Sam your sleep costs less than his Uber. He'll remember that price.", better: "can't tonight — I'm up at 6. hope it goes smooth ✌️" },
      { text: "ugh I have work at 7 and I'm exhausted and honestly my car's been making this noise and—", quality: 'almost', verdict: 'The no is in there somewhere', why: 'Three excuses = three doors to argue with. "The noise isn\'t that bad bro." One reason. Then stop.', better: "can't tonight — I'm up at 6. hope it goes smooth ✌️" },
      { text: 'do I look like a taxi service?', quality: 'harsh', verdict: 'No + collateral damage', why: 'The no was fine. The contempt was extra. He needed a boundary, not a review.', better: "can't tonight — I'm up at 6. hope it goes smooth ✌️" },
    ],
  },
  {
    id: 'slides',
    level: 2,
    context: "6:40 PM. You've stayed late twice this week already.",
    npc: { name: 'Maya', role: 'your coworker', emoji: '💼', color: 'var(--coral)' },
    line: 'can you quickly finish these slides tonight? need them first thing tomorrow 🙏',
    options: [
      { text: "yeah sure, I'll get it done.", quality: 'fold', verdict: 'You gave the boundary away', why: 'You solved tonight\'s tension by making every future 6:40 PM ask more likely. "Quickly" was doing a lot of lying in that sentence.', better: "can't tonight. send them over now and I'll do a pass first thing at 9." },
      { text: "can't tonight. send them now and I'll do a pass first thing at 9.", quality: 'strong', verdict: 'Helpful without the yes', why: 'You protected the evening AND offered something real. Boundaries with an alternative are almost impossible to resent.' },
      { text: 'I mean… I guess, if literally no one else can?', quality: 'fold', verdict: 'A yes in a trench coat', why: 'That was a yes with extra guilt for everyone. She heard "yes." You heard "yes." The boundary heard nothing.', better: "can't tonight. send them over now and I'll do a pass first thing at 9." },
      { text: 'we really need to talk about your planning.', quality: 'harsh', verdict: 'True, and 6:40 PM is not the time', why: "The pattern conversation is legit — as its own conversation. Bolted onto a no, it just reads as a jab.", better: "can't tonight. send them over now and I'll do a pass first thing at 9." },
    ],
  },
  {
    id: 'venmo',
    level: 2,
    context: 'Chris has owed you $60 for five weeks. He just texted.',
    npc: { name: 'Chris', role: 'your friend', emoji: '🍕', color: 'var(--butter)' },
    line: 'yooo pizza tonight?? 🍕',
    options: [
      { text: 'in for pizza — also grab me that $60 from last time? then we\'re square 🤝', quality: 'strong', verdict: 'Light touch, real ask', why: 'Direct, casual, zero ceremony. Money asks rot when they marinate — this one\'s handled in one text.' },
      { text: 'sure! 🍕', quality: 'fold', verdict: 'Week six begins', why: "The $60 didn't come up because you're hoping he'll remember. He won't. Hope is not a collections strategy.", better: "in for pizza — also grab me that $60 from last time? then we're square 🤝" },
      { text: "no worries at ALL and zero rush but like, whenever, the $60? sorry to even ask lol", quality: 'almost', verdict: 'The ask survived. Barely.', why: 'You wrapped a fair request in so many apologies it arrived pre-refused. You\'re allowed to want your money back.', better: "in for pizza — also grab me that $60 from last time? then we're square 🤝" },
      { text: "you still owe me money and you're out here planning pizza?", quality: 'harsh', verdict: 'Court is now in session', why: 'Fair grievance, prosecutorial delivery. Same ask, lighter touch, gets the money AND keeps the friend.', better: "in for pizza — also grab me that $60 from last time? then we're square 🤝" },
    ],
  },
  {
    id: 'stretch',
    level: 3,
    context: "Your manager, after you flagged that you're at capacity.",
    npc: { name: 'Dana', role: 'your manager', emoji: '📊', color: 'var(--coral)' },
    line: "I know you're busy, but everyone needs to stretch sometimes.",
    options: [
      { text: "you're right. I'll figure it out.", quality: 'fold', verdict: 'The instant cave', why: '"Stretch" now officially means "absorb anything." You flagged capacity and then deleted your own flag.', better: 'I hear you. walk me through what to deprioritize so this fits.' },
      { text: "that's not really my responsibility.", quality: 'harsh', verdict: 'Technically true, socially expensive', why: 'Accurate — and it hands Dana a story about your attitude instead of a decision about your workload.', better: 'I hear you. walk me through what to deprioritize so this fits.' },
      { text: 'I hear you. walk me through what to deprioritize so this fits.', quality: 'strong', verdict: 'The trade-off move', why: "You didn't refuse the work — you made the cost visible and handed the prioritization back to its owner. Elite." },
      { text: 'can we talk about this next week?', quality: 'almost', verdict: 'A delay is not a decision', why: "Next week the work is still yours, plus interest. Deferring feels like a boundary but it's just scheduling the cave.", better: 'I hear you. walk me through what to deprioritize so this fits.' },
    ],
  },
  {
    id: 'shift',
    level: 3,
    context: 'Saturday is your first free day in two weeks.',
    npc: { name: 'Riley', role: 'your coworker', emoji: '🧟', color: 'var(--sage)' },
    line: "pleaseee cover my shift saturday — you're literally the only one I trust 🙏 remember when I helped you move?",
    options: [
      {
        text: "can't this saturday! hope you find someone 🤞",
        quality: 'strong',
        silent: true,
        next: {
          line: 'wow. okay. I guess I just know where we stand now.',
          options: [
            { text: "sounds like you're disappointed — fair. still can't this time.", quality: 'strong', verdict: 'Held under fire 🔥', why: "You named the feeling, restated the no, matched none of the drama. Guilt-trips die in calm weather. That was the whole workout." },
            { text: "okay okay fine — don't be like that. I'll do it.", quality: 'fold', verdict: 'The drama was the price tag', why: 'And you paid it. The first no was perfect — the escalation is exactly the moment it needed to survive.', better: "sounds like you're disappointed — fair. still can't this time." },
            { text: 'are you seriously guilt-tripping me right now??', quality: 'harsh', verdict: "You took the bait", why: 'Naming manipulation as an accusation invites a war about the word "guilt-trip." Stay on your sentence, not their tactics.', better: "sounds like you're disappointed — fair. still can't this time." },
          ],
        },
      },
      { text: 'ugh… fine. what time?', quality: 'fold', verdict: 'Speedrun to yes', why: 'The "you\'re the only one I trust" line is flattery doing a crowbar\'s job. Your free day deserved at least one sentence of defense.', better: "can't this saturday! hope you find someone 🤞" },
      {
        text: 'I mean I have a thing but maybe I could move it…',
        quality: 'almost',
        silent: true,
        next: {
          line: "omg YES you're the best!! so that's a yes right?? 🥹",
          options: [
            { text: 'no — I said maybe, and it actually doesn\'t work. can\'t this time.', quality: 'strong', verdict: 'Recovered the maybe', why: 'Walking back a soft maybe is harder than a clean first no — and you did it without apologizing for existing. Respect.' },
            { text: '…yeah ok, it\'s a yes 😅', quality: 'fold', verdict: 'The maybe was a trapdoor', why: 'A hedge always becomes a commitment in THEIR bookkeeping. This rep is why "maybe" is the most expensive word in boundaries.', better: "no — I said maybe, and it actually doesn't work. can't this time." },
          ],
        },
      },
    ],
  },
  {
    id: 'partner',
    level: 4,
    context: "You have plans with friends tonight. Your partner's face says everything before they speak.",
    npc: { name: 'Alex', role: 'your partner', emoji: '💞', color: 'var(--coral)' },
    line: "why can't you just cancel? we barely get time together anymore.",
    options: [
      { text: 'fine. I\'ll cancel.', quality: 'fold', verdict: 'Resentment on layaway', why: "You bought peace tonight and you'll pay it back with interest — probably passive-aggressively, around 10pm.", better: "I'm keeping tonight — and you're right that we need more us-time. Saturday, just us. locked?" },
      { text: "you're being clingy. I'm allowed to have a life.", quality: 'harsh', verdict: 'Two fights for the price of one', why: 'The boundary was defensible; the diagnosis was a declaration of war. "Clingy" will outlive this entire evening.', better: "I'm keeping tonight — and you're right that we need more us-time. Saturday, just us. locked?" },
      { text: "I'm keeping tonight — and you're right that we need more us-time. Saturday, just us. locked?", quality: 'strong', verdict: 'Boundary + the real need', why: 'You held the plan AND heard the actual message underneath ("I miss you"). Both people won. This is expert-tier.' },
      { text: 'we literally hung out on tuesday??', quality: 'almost', verdict: 'Winning the facts, losing the point', why: '"We barely get time" was a feeling, not a claim to fact-check. Litigating the calendar leaves the feeling unanswered — and growing.', better: "I'm keeping tonight — and you're right that we need more us-time. Saturday, just us. locked?" },
    ],
  },
  {
    id: 'reask',
    level: 4,
    typed: true,
    context: 'You told Maya no on the slides yesterday. She waited one day.',
    npc: { name: 'Maya', role: 'your coworker', emoji: '💼', color: 'var(--coral)' },
    line: 'hey! so about those slides… any chance today? 🥺',
    placeholder: 'type your actual reply…',
  },
  {
    id: 'mother',
    level: 5,
    context: "You told your mom you can't come home this weekend — a real deadline. The typing bubble appeared and disappeared three times.",
    npc: { name: 'Mom', role: 'your mother', emoji: '🏠', color: 'var(--butter)' },
    line: "fine. don't come. clearly your work is more important than your family.",
    options: [
      { text: "mom, stop, okay— I'll figure out the deadline somehow.", quality: 'fold', verdict: 'The nuclear guilt worked', why: "Level 5 pressure and it landed clean. Notice the move: she made your no mean something it doesn't. It's a weekend, not a verdict on the family.", better: "I love you, and I'm not coming this weekend. I'll be there for dad's birthday on the 22nd — locked." },
      {
        text: "I love you, and I'm not coming this weekend. I'll be there for dad's birthday on the 22nd — locked.",
        quality: 'strong',
        silent: true,
        next: {
          line: '…you\'ve changed, you know.',
          options: [
            { text: "maybe. I'm trying to keep my word to myself too. see you on the 22nd ❤️", quality: 'strong', verdict: 'Final boss cleared 👑', why: '"You\'ve changed" is what boundaries sound like to someone who benefited from you not having any. You stayed warm, stayed firm, and gave her a date to hold onto. Elite.' },
            { text: 'FINE. I\'ll come. happy??', quality: 'fold', verdict: 'So close', why: 'You survived the guilt bomb and folded to three words. "You\'ve changed" is the last gate — it means the boundary is WORKING.', better: "maybe. I'm trying to keep my word to myself too. see you on the 22nd ❤️" },
            { text: "and you've always been like this. this is why I don't visit.", quality: 'harsh', verdict: 'Scorched earth', why: 'Twenty years of grievances just entered a conversation about one weekend. You had the high ground and traded it for a counterattack.', better: "maybe. I'm trying to keep my word to myself too. see you on the 22nd ❤️" },
          ],
        },
      },
      { text: "it's not that work is more important, it's just this deadline, see, my manager—", quality: 'almost', verdict: 'Defending the charge accepts the frame', why: 'The moment you argue "work isn\'t more important," you\'ve agreed those are the stakes. Don\'t argue her frame. Replace it.', better: "I love you, and I'm not coming this weekend. I'll be there for dad's birthday on the 22nd — locked." },
    ],
  },
]

export const XP = { strong: 8, almost: 5, harsh: 3, fold: 2 }

// heuristic grader for the typed rep — demo-grade, deliberately opinionated
export function gradeTyped(text) {
  const t = text.toLowerCase()
  if (/(sorry|apolog)/.test(t))
    return { quality: 'almost', verdict: 'Lose the apology', why: 'An apology tells her a wrong occurred. No wrong occurred — you said no and she asked again. The rest was solid.', better: "still can't take these on — but my 9am offer stands if you send them tonight." }
  if (/(maybe|i guess|i'll try|might be able|let me see)/.test(t))
    return { quality: 'fold', verdict: 'A maybe in no\'s clothing', why: 'She read that as "ask again at 4pm." A boundary that melts on the second ask was a delay, not a boundary.', better: "still can't take these on — but my 9am offer stands if you send them tonight." }
  if (t.length > 200)
    return { quality: 'almost', verdict: 'Over-explained', why: 'That\'s a paragraph of handles for her to grab. Second asks get SHORTER answers than first ones, not longer.', better: "still can't take these on — but my 9am offer stands if you send them tonight." }
  if (/(no|can't|cant|won't|wont|not going|already said|still)/.test(t))
    return { quality: 'strong', verdict: 'The no survived the re-ask 🔥', why: 'Short, clear, no new excuses to negotiate with. Holding a boundary on the second ask is the rep that actually builds the muscle.' }
  return { quality: 'almost', verdict: 'Warm… but where\'s the no?', why: 'Friendly reply, but the actual answer never showed up. She\'ll read anything that isn\'t a no as a door.', better: "still can't take these on — but my 9am offer stands if you send them tonight." }
}

export const INTERSTITIAL = {
  title: 'quick coaching',
  text: "I'm seeing a pattern: your first no is solid — then you pay full price the moment they push back or look disappointed. Their reaction isn't a bill. You don't have to pay it.",
  cta: 'back to the reps →',
}

export function noticedLine(tally) {
  if ((tally.fold || 0) >= 3)
    return 'You hold the first no, then hand it back when they push. Holding under pressure is your next unlock — we\'ll train exactly that.'
  if ((tally.harsh || 0) >= 2)
    return 'Your boundaries are strong — the delivery starts fires you then have to put out. We\'ll work on warm firmness next.'
  if ((tally.strong || 0) >= 6)
    return 'Warm AND firm under real pressure — you barely flinched. Next session we raise the weight properly.'
  return 'Clear instincts, occasional wobble under pressure — which is exactly what reps are for. Same time tomorrow?'
}
