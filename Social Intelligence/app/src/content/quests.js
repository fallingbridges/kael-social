// Real-world Field Quests — the differentiator. One is assigned per completed lesson,
// matched to the unit's skill. Check-ins move the Real-World Score (nothing else does).
export const FIELD_QUESTS = {
  icebreaking: [
    {
      id: 'fq-ib-1', skill: 'icebreaking', gems: 15,
      title: 'The Specific Compliment',
      mission: 'Give one stranger or acquaintance a specific compliment today — about a choice they made (jacket, playlist, order), not their looks.',
      why: 'Compliments about choices invite stories (“thanks, I got it in Lisbon…”). Compliments about looks invite “thanks.” You’re practicing giving people a thread to pull.',
      bar: 'Takes ~10 seconds of courage',
    },
    {
      id: 'fq-ib-2', skill: 'icebreaking', gems: 15,
      title: 'The Transition Window',
      mission: 'Spot one “transition moment” today — someone closing a laptop, taking off headphones, joining a line — and say one sentence to them.',
      why: 'Approach anxiety shrinks when you hunt windows instead of judging yourself. You’re training the noticing muscle — the sentence is almost a bonus.',
      bar: 'One sentence. Any sentence.',
    },
  ],
  listening: [
    {
      id: 'fq-ls-1', skill: 'listening', gems: 15,
      title: 'The Second Question',
      mission: 'In one conversation today, ask a follow-up question instead of changing the subject or sharing your version. Then ask ONE more.',
      why: 'Most people listen just long enough to reply. Two consecutive follow-ups puts you in the top 5% of listeners — and people can feel it.',
      bar: 'Two questions deep, once',
    },
    {
      id: 'fq-ls-2', skill: 'listening', gems: 15,
      title: 'The Echo',
      mission: 'Once today, repeat back someone’s exact key phrase before responding (“wait — ‘espresso is drinkable chemistry’?”).',
      why: 'Echoing a person’s own words is the fastest trust signal in conversation science. It proves processing, not just waiting for your turn.',
      bar: 'One echo, any conversation',
    },
  ],
  confidence: [
    {
      id: 'fq-cf-1', skill: 'confidence', gems: 15,
      title: 'The Unhedged Ask',
      mission: 'Make one request today with zero hedges. No “sorry to bother you”, no “it’s probably dumb but”. Ask, then stop talking.',
      why: 'Hedges feel polite from inside and sound unsure from outside. One clean ask rewires what your brain considers “safe”.',
      bar: 'One ask, zero apologies',
    },
    {
      id: 'fq-cf-2', skill: 'confidence', gems: 15,
      title: 'Receive One Compliment',
      mission: 'Next compliment you get, say only: “Thank you — that’s really nice to hear.” No deflecting, no discounting, no returning it out of panic.',
      why: 'Deflecting compliments trains people to stop giving them and trains you to distrust praise. Receiving cleanly is confidence cardio.',
      bar: 'You’ll get a chance — watch for it',
    },
  ],
  storytelling: [
    {
      id: 'fq-st-1', skill: 'storytelling', gems: 15,
      title: 'The 30-Second Story',
      mission: 'When someone asks “how’s it going?” today, answer with one tiny TRUE story (a moment, not a summary) instead of “good, you?”',
      why: 'Every “how’s it going” is an open mic nobody uses. One specific moment (“I watched a pigeon fight a bagel this morning”) makes you memorable.',
      bar: 'One moment, 30 seconds',
    },
    {
      id: 'fq-st-2', skill: 'storytelling', gems: 15,
      title: 'Bank a Story',
      mission: 'Tonight, write down one thing that happened today that could be a story — with the detail that makes it work.',
      why: 'Great storytellers aren’t luckier — they’re collectors. A story bank turns “nothing ever happens to me” into raw material.',
      bar: 'Two sentences in your notes app',
    },
  ],
  empathy: [
    {
      id: 'fq-em-1', skill: 'empathy', gems: 15,
      title: 'The Includer',
      mission: 'In any group today (chat or in person), notice who’s quietest and hand them one easy on-ramp (“Jamie, you’ve seen this — what do you think?”).',
      why: 'Every group has someone at the edge. The person who builds them a door is the person everyone ends up trusting.',
      bar: 'One on-ramp, one person',
    },
    {
      id: 'fq-em-2', skill: 'empathy', gems: 15,
      title: 'The No-Fix Zone',
      mission: 'When someone shares a problem today, go a full 2 minutes without offering a single solution. Validate, ask, stay.',
      why: 'The urge to fix is really an urge to end discomfort — yours. Two minutes of witness is worth twenty solutions.',
      bar: '120 seconds of not fixing',
    },
  ],
  mixed: [
    {
      id: 'fq-mx-1', skill: 'mixed', gems: 20,
      title: 'The Reach-Out',
      mission: 'Message one person you genuinely like but haven’t talked to in months. One specific memory + one real question.',
      why: 'Dormant ties are the highest-value, lowest-risk social move that exists. Almost nobody is annoyed to be remembered fondly.',
      bar: 'One message. Old friend.',
    },
  ],
}

export function questForSkill(skill, completedIds) {
  const pool = FIELD_QUESTS[skill] || FIELD_QUESTS.mixed
  return pool.find((q) => !completedIds.includes(q.id)) || FIELD_QUESTS.mixed.find((q) => !completedIds.includes(q.id)) || null
}

export const FELT_SCALE = [
  { v: 1, emoji: '😖', label: 'Rough' },
  { v: 2, emoji: '😅', label: 'Awkward but did it' },
  { v: 3, emoji: '🙂', label: 'Went okay' },
  { v: 4, emoji: '😄', label: 'Went well!' },
  { v: 5, emoji: '🤩', label: 'Nailed it' },
]
