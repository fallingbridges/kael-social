// Kai's diagnostic conversation. Each answer nudges skill scores (0 baseline, summed then normalized).
export const DIAGNOSIS_STEPS = [
  {
    id: 'goal',
    kai: ['Hey, I’m Kai! 🦊', 'I coach humans on the stuff school never taught — conversations.', 'First things first: what brought you here?'],
    caption: 'Pick what fits most — this shapes your path',
    options: [
      { text: '💬 Small talk feels like a job interview', weights: { icebreaking: -2, storytelling: -1 } },
      { text: '🫥 I fade into the background in groups', weights: { confidence: -2, storytelling: -1 } },
      { text: '❤️ I want deeper friendships, not more acquaintances', weights: { empathy: -1, listening: -1 } },
      { text: '💼 I want presence at work — meetings, asks, pushback', weights: { confidence: -2, icebreaking: -1 } },
    ],
  },
  {
    id: 'party',
    kai: ['Got it. Now let’s see your instincts — no wrong answers, just honest ones.', 'You walk into a party where you know exactly one person… and they’re in the bathroom. What’s your real move?'],
    options: [
      { text: 'Phone out. I live here now, by the snacks', weights: { icebreaking: -2, confidence: -1 } },
      { text: 'Hover near a group and wait for an opening that never comes', weights: { icebreaking: -1, confidence: -1 } },
      { text: 'Find another solo person and say hi', weights: { icebreaking: 2, confidence: 1 } },
      { text: 'Join the loudest circle and jump right in', weights: { icebreaking: 2, listening: -1 } },
    ],
  },
  {
    id: 'vent',
    kai: ['A friend calls: “Worst day ever. My boss tore apart my project in front of everyone.”', 'What comes out of your mouth first?'],
    options: [
      { text: '“Ugh, that’s brutal. Tell me everything.”', weights: { listening: 2, empathy: 1 } },
      { text: '“Here’s what you should do about it…”', weights: { listening: -2, confidence: 1 } },
      { text: '“That happened to me once! So there I was…”', weights: { listening: -2, storytelling: 1 } },
      { text: 'Honestly? I freeze. I never know what to say', weights: { empathy: -1, confidence: -1 } },
    ],
  },
  {
    id: 'story',
    kai: ['Someone at dinner asks about your weekend. Something genuinely funny DID happen.', 'How does it usually go when you tell it?'],
    options: [
      { text: 'I rush to the ending and it lands flat', weights: { storytelling: -2 } },
      { text: 'I add every detail and lose them halfway', weights: { storytelling: -1, empathy: -1 } },
      { text: 'People usually laugh — timing’s my thing', weights: { storytelling: 2, confidence: 1 } },
      { text: 'I just say “it was good” and pass', weights: { storytelling: -1, confidence: -1 } },
    ],
  },
  {
    id: 'no',
    kai: ['Last one. A friend asks for a favor you really don’t have time for.', 'What actually happens?'],
    options: [
      { text: 'I say yes. I always say yes. Help', weights: { confidence: -2, empathy: 1 } },
      { text: 'I say no but apologize for a full minute', weights: { confidence: -1 } },
      { text: 'Clean no, warm delivery — got that one down', weights: { confidence: 2, empathy: 1 } },
      { text: 'I ghost until the favor expires', weights: { confidence: -1, empathy: -1 } },
    ],
  },
]

// score per skill: 0.5 baseline + 0.11 * summed weights, clamped to [0.12, 0.95]
export function computeDiagnosis(answers) {
  const scores = { icebreaking: 0.5, listening: 0.5, confidence: 0.5, storytelling: 0.5, empathy: 0.5 }
  for (const a of answers) {
    for (const [skill, w] of Object.entries(a.weights || {})) {
      scores[skill] += w * 0.11
    }
  }
  for (const k of Object.keys(scores)) scores[k] = Math.min(0.95, Math.max(0.12, scores[k]))

  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1])
  const weakest = sorted[0][0]
  const strongest = sorted[sorted.length - 1][0]
  const order = [...sorted.map(([k]) => k), 'connection']

  const arch = ARCHETYPES[strongest]?.[weakest] || ARCHETYPES.fallback
  return { scores, strongest, weakest, order, ...arch }
}

const ARCHETYPES = {
  listening: {
    icebreaking: { archetype: 'The Deep-End Swimmer', blurb: 'Once you’re IN a conversation you’re gold — getting in is the hard part. We’ll fix the front door.' },
    confidence: { archetype: 'The Quiet Anchor', blurb: 'People trust you with their real stuff — now let’s get you taking up your share of the room.' },
    storytelling: { archetype: 'The Vault', blurb: 'You absorb everyone’s stories and never tell your own. Time to open the vault.' },
    empathy: { archetype: 'The Careful Observer', blurb: 'You hear every word — next: feeling the current under them.' },
  },
  empathy: {
    icebreaking: { archetype: 'The Warm Wallflower', blurb: 'You read rooms beautifully from the edge of them. Let’s get you three steps in.' },
    confidence: { archetype: 'The Gentle Giant', blurb: 'All that care for others, so little claimed for yourself. We’re fixing the balance.' },
    storytelling: { archetype: 'The Heart Reader', blurb: 'You feel everything and narrate none of it. Your stories deserve airtime.' },
    listening: { archetype: 'The Intuitive', blurb: 'You sense feelings before words arrive — now let’s sharpen what you do with them.' },
  },
  confidence: {
    icebreaking: { archetype: 'The Slow Burner', blurb: 'Rock-solid once warmed up — we’ll shrink your warm-up from an hour to a minute.' },
    listening: { archetype: 'The Broadcaster', blurb: 'Big presence, strong signal — your superpower unlocks when you flip to receive.' },
    storytelling: { archetype: 'The Straight Shooter', blurb: 'Direct and clear — add narrative and you’ll be unstoppable.' },
    empathy: { archetype: 'The Bulldozer (Affectionate)', blurb: 'You get things DONE. Now let’s tune the radar for how it lands.' },
  },
  storytelling: {
    icebreaking: { archetype: 'The Campfire', blurb: 'Legendary with friends, invisible with strangers. Let’s port your magic to minute one.' },
    listening: { archetype: 'The Headliner', blurb: 'You can hold a room — the encore skill is handing back the mic.' },
    confidence: { archetype: 'The Reluctant Star', blurb: 'Funny, vivid, magnetic — and allergic to claiming it. We’ll work on the claiming.' },
    empathy: { archetype: 'The Entertainer', blurb: 'You bring the show; now let’s bring the radar for what the room needs.' },
  },
  icebreaking: {
    listening: { archetype: 'The Firecracker', blurb: 'You start conversations everywhere — the growth is in what happens after hello.' },
    confidence: { archetype: 'The Friendly Ghost', blurb: 'Easy opener, quick exit. We’ll build the staying power.' },
    storytelling: { archetype: 'The Sparkplug', blurb: 'Great at igniting — let’s add the fuel that keeps it burning.' },
    empathy: { archetype: 'The Social Butterfly', blurb: 'A mile wide, ready to go an inch deeper. That’s where the good stuff is.' },
  },
  fallback: { archetype: 'The Balanced Operator', blurb: 'Solid across the board — we’ll sharpen everything a notch at a time.' },
}
