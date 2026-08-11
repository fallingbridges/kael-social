// Exercise pool, keyed by skill. Types:
//  bestReply  — pick the strongest response to a mini transcript
//  readRoom   — spot the subtext / what's really going on
//  order      — arrange conversation fragments into a natural flow (tiles given in correct order)
//  fixMessage — tap the line that kills the vibe, then pick the repair
//  fillBlank  — complete the line with the right word tile
//  roleplay   — live multi-turn conversation; picks steer the vibe

export const EXERCISES = {
  icebreaking: [
    {
      id: 'ib1', type: 'bestReply', skill: 'icebreaking',
      prompt: 'Pick the best opener',
      scene: 'Elevator. A coworker you’ve never met is holding a bike helmet.',
      options: [
        { text: '“You bike in? I keep telling myself I’ll start.”', correct: true, why: 'A specific observation + a little self-disclosure. Easy for them to pick up.' },
        { text: '“Some weather today, huh?”', why: 'Generic filler — nothing for them to grab onto.' },
        { text: '“What floor?”', why: 'Polite, but it closes the conversation instead of opening it.' },
      ],
    },
    {
      id: 'ib2', type: 'readRoom', skill: 'icebreaking',
      prompt: 'Read the room',
      scene: 'At a party, someone is standing alone by the bookshelf, scanning the titles, glancing up at the room now and then.',
      question: 'What’s the smartest read?',
      options: [
        { text: 'They want to be approached — the glances are an open door', correct: true, why: 'Scanning + glancing up is classic “I’m available, someone talk to me.”' },
        { text: 'They want to be left alone with the books', why: 'Someone avoiding contact keeps their eyes down and their body turned away.' },
        { text: 'They’re waiting for a specific person', why: 'Possible — but glancing at the whole room, not the door, says otherwise.' },
      ],
    },
    {
      id: 'ib3', type: 'fillBlank', skill: 'icebreaking',
      prompt: 'Complete the opener',
      scene: 'Farmers market. A stranger’s dog sniffs your shoe.',
      line: ['“Okay, I have to ask — ', '?”'],
      tiles: [
        { text: 'what’s their name', correct: true },
        { text: 'is it friendly' },
        { text: 'what breed is that' },
      ],
      why: 'Asking the NAME turns it personal and playful — people light up telling you. “What breed” is a quiz; “is it friendly” is about you.',
    },
    {
      id: 'ib4', type: 'order', skill: 'icebreaking',
      prompt: 'Build a natural opener',
      scene: 'First day at a new gym. Someone is re-racking your favorite dumbbells.',
      tiles: ['Hey — first week here.', 'I’m still learning where everything goes.', 'Is there an unspoken rules list I should know about?'],
      why: 'Context → small self-disclosure → light question. You gave them something easy and fun to answer.',
    },
    {
      id: 'ib5', type: 'fixMessage', skill: 'icebreaking',
      prompt: 'Fix the opener',
      scene: 'Messaging someone from a hiking group chat for the first time.',
      segments: [
        { text: 'Hey! Saw your photo from Eagle Peak — that ridge line is unreal.' },
        { text: 'Anyway you probably get a ton of messages, sorry to bother you.', bad: true, why: 'Pre-apologizing tells them to see you as a bother. Confidence is silent — just ask the thing.' },
        { text: 'Was the scramble at the top as sketchy as it looks?' },
      ],
      repair: [
        { text: 'Delete it — the message is better without it', correct: true, why: 'The opener and question were already great. Cut the self-sabotage and send.' },
        { text: '“I promise I’m not weird lol”', why: 'Denying weirdness plants the idea. Never argue a case no one made.' },
        { text: '“Feel free to ignore this!”', why: 'You just gave them permission to ignore you. Don’t.' },
      ],
    },
    {
      id: 'ib6', type: 'bestReply', skill: 'icebreaking',
      prompt: 'Keep it alive',
      scene: 'You opened with a compliment on their jacket. They said “oh, thanks!” and smiled — then silence.',
      options: [
        { text: '“There’s a story behind it, I can tell.”', correct: true, why: 'A playful assumption invites a story — way stronger than another question.' },
        { text: '“So… come here often?”', why: 'The cliché resets you to zero and reads as autopilot.' },
        { text: 'Smile back and walk away — the moment’s over', why: 'One-beat silences are normal. Bailing at the first pause is the #1 icebreaking mistake.' },
      ],
    },
    {
      id: 'ib7', type: 'readRoom', skill: 'icebreaking',
      prompt: 'Pick your moment',
      scene: 'Coffee shop. The person next to you closes their laptop, stretches, and looks out the window.',
      question: 'When’s the window to say something?',
      options: [
        { text: 'Right now — the laptop closing was the door opening', correct: true, why: 'Transitions are invitations. Headphones off, laptop shut, a stretch — that’s the moment.' },
        { text: 'While they were mid-email — catch them before they leave', why: 'Interrupting focus starts you at a deficit.' },
        { text: 'Never — coffee shops are for silence', why: 'A light comment with an easy exit is welcome almost anywhere.' },
      ],
    },
    {
      id: 'ib8', type: 'fillBlank', skill: 'icebreaking',
      prompt: 'Exit gracefully',
      scene: 'Nice 3-minute chat with a stranger at a friend’s BBQ. It’s winding down.',
      line: ['“I’m going to grab a drink — ', '.”'],
      tiles: [
        { text: 'really glad I got to meet you', correct: true },
        { text: 'sorry for talking your ear off' },
        { text: 'see you around I guess' },
      ],
      why: 'End warm and clean. A genuine “glad I met you” is remembered; apologies and shrugs undo the whole chat.',
    },
    {
      id: 'ibr1', type: 'roleplay', skill: 'icebreaking', npc: 'maya',
      prompt: 'Live conversation',
      scene: 'Driftwood Coffee, Tuesday morning. Maya hands you your usual flat white.',
      goal: 'Turn a transaction into a real moment',
      beats: [
        {
          npcLine: 'Flat white for… you, right? You’re becoming a regular.',
          options: [
            { text: '“Guilty. You make it better than anywhere else on the block.”', vibe: 2, feedback: 'Specific compliment about her craft — lands way better than a generic one.' },
            { text: '“Yep. Thanks.”', vibe: -1, feedback: 'Door closed. She offered a thread — “regular” — and you dropped it.' },
            { text: '“Ha, is that a good thing or a bad thing?”', vibe: 1, feedback: 'Playful return — keeps the ball in the air.' },
          ],
        },
        {
          npcLine: 'Better than anywhere on the block? Careful, I’ll get a big head. I’ve only been pulling shots for a year.',
          options: [
            { text: '“A year?! Okay, now I need the origin story.”', vibe: 2, feedback: '“Origin story” invites her to talk about herself — the icebreaker’s best move.' },
            { text: '“Cool. Anyway, busy day today?”', vibe: -1, feedback: 'Topic-hop. She gave you something personal and you swerved to weather-talk.' },
            { text: '“Well it’s working. What got you into it?”', vibe: 1, feedback: 'Solid follow-up question. Slightly safer than playful, still good.' },
          ],
        },
        {
          npcLine: 'Honestly? I failed out of a chemistry degree and realized espresso is just chemistry you can drink.',
          options: [
            { text: '“Espresso is chemistry you can drink — I’m stealing that.”', vibe: 2, feedback: 'Echoing her exact phrase shows you actually listened. Instant rapport.' },
            { text: '“Oh. Sorry about the degree.”', vibe: -1, feedback: 'She framed it as a win. Pity flattens her punchline.' },
            { text: '“Ha, that’s one way to use it!”', vibe: 1, feedback: 'Friendly, but generic — her line deserved a better catch.' },
          ],
        },
      ],
      threshold: 3,
      whyPass: 'You turned “thanks” into a running joke and learned her story. That’s a regular’s relationship now.',
      whyFail: 'Maya offered three threads and they slipped by. Grab the specific thing people hand you.',
    },
  ],

  listening: [
    {
      id: 'ls1', type: 'bestReply', skill: 'listening',
      prompt: 'Pick the real listen',
      scene: 'Friend: “Work’s been brutal. My manager put me on the Henderson account AND kept all my old projects.”',
      options: [
        { text: '“Wait, so they doubled your load without dropping anything?”', correct: true, why: 'Reflecting their situation back proves you processed it — and invites more.' },
        { text: '“Ugh, my week’s been crazy too, honestly…”', why: 'Conversation theft. Their moment just became yours.' },
        { text: '“You should just tell them no.”', why: 'Unrequested advice skips the part where they feel heard.' },
      ],
    },
    {
      id: 'ls2', type: 'readRoom', skill: 'listening',
      prompt: 'Hear what’s under it',
      scene: '“I mean, the wedding’s in June and my sister still hasn’t asked me to be in it, but whatever, it’s fine, it’s her day.”',
      question: 'What did you actually just hear?',
      options: [
        { text: '“I’m hurt, and I don’t feel allowed to say so”', correct: true, why: '“Whatever, it’s fine” after a specific grievance is almost always the opposite.' },
        { text: 'They genuinely don’t care about the wedding', why: 'People who don’t care don’t track exactly who’s been asked.' },
        { text: 'They think weddings are overrated', why: 'That’s not in there at all — careful adding what wasn’t said.' },
      ],
    },
    {
      id: 'ls3', type: 'fillBlank', skill: 'listening',
      prompt: 'Ask the follow-up',
      scene: '“I finally quit the band. Ten years, man. Just walked out of practice on Tuesday.”',
      line: ['“Ten years. ', '?”'],
      tiles: [
        { text: 'What was the moment that decided it', correct: true },
        { text: 'Are you going to join another one' },
        { text: 'Was the band any good' },
      ],
      why: 'Follow the emotion, not the logistics. “The moment that decided it” goes where the story actually is.',
    },
    {
      id: 'ls4', type: 'order', skill: 'listening',
      prompt: 'Respond like a listener',
      scene: 'Your roommate just said their startup laid them off this morning.',
      tiles: ['Oh no — this morning?', 'That’s a gut punch.', 'Do you want to vent or want distraction? I’m good for either.'],
      why: 'Acknowledge → validate the feeling → ask what they need. Advice never appears — that’s the point.',
    },
    {
      id: 'ls5', type: 'fixMessage', skill: 'listening',
      prompt: 'Fix the reply',
      scene: 'Text from a friend: “bombed the bar exam. found out an hour ago.”',
      segments: [
        { text: 'Oh no. I’m so sorry — that’s brutal.' },
        { text: 'Honestly though everything happens for a reason!', bad: true, why: 'Silver-lining someone’s fresh pain is dismissal wearing a nice outfit.' },
        { text: 'Want me to come over tonight?' },
      ],
      repair: [
        { text: '“An hour ago — how are you holding up right now?”', correct: true, why: 'Stays in their moment and asks about the feeling instead of explaining it away.' },
        { text: '“Tons of great lawyers failed it the first time!”', why: 'Still fixing. They need a witness before they need a statistician.' },
        { text: '“At least you know what to expect next time.”', why: '“At least” is the official first word of every dismissal.' },
      ],
    },
    {
      id: 'ls6', type: 'bestReply', skill: 'listening',
      prompt: 'The second question',
      scene: 'New acquaintance: “I moved here for a job, but honestly the job was kind of an excuse to leave Ohio.”',
      options: [
        { text: '“An excuse to leave — what were you hoping to find here?”', correct: true, why: 'You caught the confession hiding in the sentence. That’s level-two listening.' },
        { text: '“Nice, what’s the job?”', why: 'You picked the boring half. The word “excuse” was flashing neon.' },
        { text: '“Ohio’s not that bad!”', why: 'Now you’re debating them about their own life.' },
      ],
    },
    {
      id: 'ls7', type: 'readRoom', skill: 'listening',
      prompt: 'Catch the signal',
      scene: 'Mid-story, your friend keeps checking the door and giving one-word answers, though they invited you here.',
      question: 'What does a good listener do?',
      options: [
        { text: 'Name it gently: “You seem somewhere else — everything okay?”', correct: true, why: 'Listening includes bodies, not just words. Naming it kindly is a gift.' },
        { text: 'Talk more energetically to win their attention back', why: 'Performing harder at a distracted person pushes them further away.' },
        { text: 'Feel insulted and go quiet too', why: 'Their distraction is information, not an insult. Get curious, not wounded.' },
      ],
    },
    {
      id: 'lsr1', type: 'roleplay', skill: 'listening', npc: 'dev',
      prompt: 'Live conversation',
      scene: 'Office kitchen. Dev from design is stirring a tea bag like it owes him money.',
      goal: 'Find out what’s actually wrong',
      beats: [
        {
          npcLine: 'Hey. Sorry, just — long morning. The review went great, by the way. Really great.',
          options: [
            { text: '“That ‘really great’ had a whole other sentence inside it.”', vibe: 2, feedback: 'You heard the tone, not the words. That’s the skill.' },
            { text: '“Congrats man! Knew you’d crush it.”', vibe: -1, feedback: 'You took the words at face value and missed the flat delivery.' },
            { text: '“Long morning? What happened?”', vibe: 1, feedback: 'Decent — you followed the true half of what he said.' },
          ],
        },
        {
          npcLine: 'It’s just… they loved the work, then gave the lead role on it to Marcus. In the same meeting.',
          options: [
            { text: '“In the same meeting. So you got applause and a demotion in one breath.”', vibe: 2, feedback: 'Perfect mirror — his exact hurt, said back clearly. Nothing to fix yet.' },
            { text: '“Marcus is solid though, it’ll be fine.”', vibe: -1, feedback: 'You just took Marcus’s side in a hurt he barely finished saying.' },
            { text: '“That’s rough. Did they say why?”', vibe: 1, feedback: 'Okay — but “why” moves to facts a beat before the feeling is done.' },
          ],
        },
        {
          npcLine: 'Exactly! Am I crazy for being annoyed? Everyone keeps saying it’s a compliment.',
          options: [
            { text: '“You’re not crazy. Both things are true — good review, bad outcome.”', vibe: 2, feedback: 'Validation without pretending it’s all fine. Exactly what he asked for.' },
            { text: '“I mean, it kind of IS a compliment if you think about it…”', vibe: -1, feedback: 'He literally told you everyone says that. Now you’re everyone.' },
            { text: '“You should talk to your manager about it.”', vibe: 1, feedback: 'Reasonable advice — one beat early. He asked to be believed first.' },
          ],
        },
      ],
      threshold: 3,
      whyPass: 'You heard the sentence under the sentence, mirrored it, and validated it. Dev will remember this chat.',
      whyFail: 'The words said “great” and the tone said “help.” Trust the tone.',
    },
  ],

  confidence: [
    {
      id: 'cf1', type: 'fixMessage', skill: 'confidence',
      prompt: 'Cut the shrink-wrap',
      scene: 'Asking your manager for the stretch assignment, over chat.',
      segments: [
        { text: 'Hey! I’d like to take the lead on the Meridian launch.' },
        { text: 'I mean, only if no one better wants it, it’s probably a dumb idea, sorry —', bad: true, why: 'You argued against yourself before anyone else could. The ask was already strong.' },
        { text: 'I ran the two smaller launches this spring and both beat their targets.' },
      ],
      repair: [
        { text: 'Delete it — ask, then evidence. Full stop.', correct: true, why: 'Confidence is often subtraction. The strong version was hiding inside the hedged one.' },
        { text: '“…but no worries if not!! 😅”', why: 'You’d be pre-accepting rejection. Let them answer.' },
        { text: '“I know I’m probably not ready, but…”', why: 'Never open by prosecuting yourself.' },
      ],
    },
    {
      id: 'cf2', type: 'bestReply', skill: 'confidence',
      prompt: 'Take the compliment',
      scene: '“Your presentation was honestly the best one today.”',
      options: [
        { text: '“Thank you — I worked hard on it, that’s really good to hear.”', correct: true, why: 'Receiving a compliment cleanly is quiet confidence. No deflection, no inflation.' },
        { text: '“Oh, it was nothing, I threw it together last night.”', why: 'Deflection insults their judgment and undersells your work in one move.' },
        { text: '“I know, right?”', why: 'Confidence with no warmth reads as smug.' },
      ],
    },
    {
      id: 'cf3', type: 'fillBlank', skill: 'confidence',
      prompt: 'Say no without the essay',
      scene: 'A friend asks you to help them move — the third weekend in a row.',
      line: ['“I can’t this weekend — ', '.”'],
      tiles: [
        { text: 'but I hope it goes smoothly', correct: true },
        { text: 'I’m so so sorry, I feel terrible' },
        { text: 'because I have a thing, it’s complicated' },
      ],
      why: 'A clean no + goodwill. Over-apologizing invites negotiation; vague excuses invite follow-up questions.',
    },
    {
      id: 'cf4', type: 'readRoom', skill: 'confidence',
      prompt: 'Spot real confidence',
      scene: 'Group discussion. Person A talks the most and interrupts. Person B speaks twice, briefly, and both times the room goes quiet to listen.',
      question: 'Who has the room?',
      options: [
        { text: 'Person B — economy of words plus full attention is status', correct: true, why: 'Volume is not authority. When you speak rarely and land, people lean in.' },
        { text: 'Person A — they’re dominating the airtime', why: 'Airtime isn’t influence. Interrupting reads as anxious, not powerful.' },
        { text: 'Neither — talking in groups is just chaos', why: 'Every group has an attention economy. B is rich in it.' },
      ],
    },
    {
      id: 'cf5', type: 'order', skill: 'confidence',
      prompt: 'Push back cleanly',
      scene: 'A coworker presents your idea in a meeting as theirs.',
      tiles: ['Glad that idea landed well.', 'It’s the one I pitched in Tuesday’s doc —', 'happy to walk everyone through where it goes next.'],
      why: 'Claim it with a timestamp, no accusation theater, then move forward holding the ball. Firm and unbothered.',
    },
    {
      id: 'cf6', type: 'bestReply', skill: 'confidence',
      prompt: 'Hold your price',
      scene: 'Freelance client: “Another designer quoted half your rate.”',
      options: [
        { text: '“That can happen. My rate reflects what my clients get — happy to share the results.”', correct: true, why: 'No panic, no discount reflex, no trashing the competitor. Calm is the message.' },
        { text: '“Okay okay, I can probably match that…”', why: 'Folding instantly teaches them your prices are suggestions.' },
        { text: '“Then they’re terrible. You get what you pay for.”', why: 'Insulting the alternative sounds threatened, not premium.' },
      ],
    },
    {
      id: 'cf7', type: 'fillBlank', skill: 'confidence',
      prompt: 'Own the miss',
      scene: 'You missed a deadline that mattered. Your team is waiting on the call.',
      line: ['“That’s on me — ', '.”'],
      tiles: [
        { text: 'here’s how I’m fixing it by Friday', correct: true },
        { text: 'though in my defense the brief was late' },
        { text: 'I’m honestly the worst, I’m so sorry everyone' },
      ],
      why: 'Own it + fix it = credibility grows from a mistake. Excuses shrink you; self-flagellation makes it about you.',
    },
    {
      id: 'cfr1', type: 'roleplay', skill: 'confidence', npc: 'june',
      prompt: 'Live conversation',
      scene: 'House party. June — who runs the gallery downtown — asks what you do.',
      goal: 'Talk about yourself without shrinking',
      beats: [
        {
          npcLine: 'So what do you do? Wait, let me guess — something with computers. Everyone here does something with computers.',
          options: [
            { text: '“I do — I build tools for teachers. Best decision I ever made.”', vibe: 2, feedback: 'Specific + a stake in the ground. You sound like you chose your life.' },
            { text: '“Yeah… just boring tech stuff, you don’t want to hear about it.”', vibe: -1, feedback: 'You answered a question no one asked: “should I be dismissed?”' },
            { text: '“Ha, guilty. Software. What gave it away?”', vibe: 1, feedback: 'Playful, fine — but you left yourself vague.' },
          ],
        },
        {
          npcLine: 'Tools for teachers — okay, that’s not boring. Is it working? Like, actually?',
          options: [
            { text: '“Forty schools so far. Some days it breaks. Most days it’s the best job in the world.”', vibe: 2, feedback: 'Concrete number + honest texture. Confident people don’t need it to be perfect.' },
            { text: '“I mean, it’s okay, nothing huge, we’re really small…”', vibe: -1, feedback: 'She handed you a spotlight and you unplugged it.' },
            { text: '“It’s going well! Anyway — a gallery, that’s way cooler. Tell me everything.”', vibe: 1, feedback: 'Generous, but you deflected one beat too early. Land your answer, then pass.' },
          ],
        },
        {
          npcLine: 'Okay, forty schools. Why do you do that thing where tech people act embarrassed about succeeding?',
          options: [
            { text: '“Fair hit. I’m practicing saying it straight: it’s working, and I’m proud of it.”', vibe: 2, feedback: 'Self-aware without collapsing. That’s the whole skill in one sentence.' },
            { text: '“Haha sorry. Sorry — wait, no, I did it again.”', vibe: 1, feedback: 'Caught it in real time — halfway there.' },
            { text: '“I don’t know… success feels braggy, I guess.”', vibe: -1, feedback: 'Sharing pride when asked isn’t bragging. Bragging is when nobody asked.' },
          ],
        },
      ],
      threshold: 3,
      whyPass: 'You stated your work plainly, took the spotlight when offered, and stayed warm. June remembers you.',
      whyFail: 'Every question was an offered stage — shrinking politely is still shrinking.',
    },
  ],

  storytelling: [
    {
      id: 'st1', type: 'order', skill: 'storytelling',
      prompt: 'Build the story',
      scene: 'Someone asks: “How was the camping trip?”',
      tiles: ['So at 2am I hear this scratching on the tent.', 'I’m frozen, convinced it’s a bear.', 'I count to three, rip open the zipper —', 'and it’s Dave. Sleepwalking. Trying to get INTO our tent.'],
      why: 'Drop into the moment, build tension, delay the reveal. “It was fun” was also true — and forgettable.',
    },
    {
      id: 'st2', type: 'bestReply', skill: 'storytelling',
      prompt: 'Start strong',
      scene: 'Dinner party. Someone asks how you and your best friend met.',
      options: [
        { text: '“We hated each other for a full year first.”', correct: true, why: 'A hook creates a question the listener needs answered. Now they’re leaning in.' },
        { text: '“In college. We had some classes together and just kind of became friends.”', why: 'All true, zero pull. A summary is where a story goes to die.' },
        { text: '“Long story, you don’t want the whole thing.”', why: 'They literally asked for the whole thing.' },
      ],
    },
    {
      id: 'st3', type: 'fixMessage', skill: 'storytelling',
      prompt: 'Rescue the story',
      scene: 'You’re telling the airport disaster story.',
      segments: [
        { text: 'So our gate changes three times in twenty minutes —' },
        { text: 'wait, was it Tuesday? Maybe Wednesday. It doesn’t matter. Actually it might have been Monday —', bad: true, why: 'Accuracy detours kill momentum. Nobody in history has cared which day.' },
        { text: 'and we end up sprinting past the same confused golden retriever. Three times.' },
      ],
      repair: [
        { text: 'Cut it — go straight from gate chaos to the retriever', correct: true, why: 'A story is the moments that matter, in order, and nothing else.' },
        { text: 'Ask the group to help figure out which day it was', why: 'Now four people are doing calendar math instead of laughing.' },
        { text: 'Restart from the beginning to get it right', why: 'Restarting is the only thing worse than the detour.' },
      ],
    },
    {
      id: 'st4', type: 'fillBlank', skill: 'storytelling',
      prompt: 'Add the texture',
      scene: 'Telling the story of your worst job interview.',
      line: ['“The interviewer walks in, and it’s ', '.”'],
      tiles: [
        { text: 'my downstairs neighbor — the one whose packages I kept stealing by accident', correct: true },
        { text: 'someone I sort of knew from before' },
        { text: 'a person I had met previously in my building' },
      ],
      why: 'Specificity is the story. The exact, unfortunate detail does the work of ten adjectives.',
    },
    {
      id: 'st5', type: 'readRoom', skill: 'storytelling',
      prompt: 'Read your audience',
      scene: 'Two minutes into your story, one listener starts folding a napkin, another checks the menu.',
      question: 'The move?',
      options: [
        { text: 'Jump to the punchline — pacing is a live negotiation', correct: true, why: 'Great storytellers edit in real time. Losing the room and finishing anyway is a monologue.' },
        { text: 'Speak louder and add more detail', why: 'More of what’s losing them is… more losing.' },
        { text: 'Stop mid-sentence and say “fine, nobody cares”', why: 'Punishing the room makes the next story land worse.' },
      ],
    },
    {
      id: 'st6', type: 'bestReply', skill: 'storytelling',
      prompt: 'Pass the mic',
      scene: 'You just landed the story. Laughs all around. There’s a pause.',
      options: [
        { text: '“Okay — someone top it. Worst travel story, go.”', correct: true, why: 'Turning your win into an invitation makes you the host, not the performer.' },
        { text: '“And ANOTHER crazy thing happened the next day…”', why: 'Encore syndrome. Sequel stories average half the laughs.' },
        { text: 'Retell the best part again', why: 'The replay always plays worse. Land it and leave it.' },
      ],
    },
    {
      id: 'str1', type: 'roleplay', skill: 'storytelling', npc: 'sam',
      prompt: 'Live conversation',
      scene: 'Gym lobby. Sam notices your wrist brace.',
      goal: 'Turn an answer into a story',
      beats: [
        {
          npcLine: 'Whoa, what happened to the wrist?',
          options: [
            { text: '“I lost a fight with a paddleboard. Well — technically with a swan.”', vibe: 2, feedback: 'A hook with a mystery in it. Sam HAS to know about the swan now.' },
            { text: '“Sprained it. It’s fine.”', vibe: -1, feedback: 'True, closed, forgettable. You had a swan story and buried it.' },
            { text: '“Paddleboarding accident last weekend.”', vibe: 1, feedback: 'Informative but flat — the facts without the fun.' },
          ],
        },
        {
          npcLine: 'A SWAN? Okay, you can’t just say that. Full story. Now.',
          options: [
            { text: '“Picture this: glass lake, 7am, total peace. Then a hiss. Behind me.”', vibe: 2, feedback: 'Scene, then threat. You’re making him live it in order — that’s the craft.' },
            { text: '“So basically a swan attacked me and I fell off. That’s it, really.”', vibe: -1, feedback: 'You skipped to the summary! The buildup WAS the story.' },
            { text: '“Ha, well, swans are territorial in spring, apparently.”', vibe: 1, feedback: 'Interesting fact, wrong genre — he ordered a story and got a documentary.' },
          ],
        },
        {
          npcLine: '*grips counter* A hiss?? What did you DO?',
          options: [
            { text: '“I did what any brave person would. I screamed, swung the paddle, missed, and baptized myself.”', vibe: 2, feedback: 'Self-deprecating punchline, perfect rhythm. Being the fool of your own story is charisma.' },
            { text: '“Fell in. Anyway, the brace comes off Friday.”', vibe: -1, feedback: 'You punchlined into paperwork. Never follow the laugh with logistics.' },
            { text: '“I panicked and fell in, haha.”', vibe: 1, feedback: 'The truth, decently told — a little more theater and it kills.' },
          ],
        },
      ],
      threshold: 3,
      whyPass: 'Hook, buildup, self-deprecating payoff — Sam will retell YOUR story tonight. That’s the win condition.',
      whyFail: 'The raw material was gold. Slow down, set the scene, and let the tension breathe.',
    },
  ],

  empathy: [
    {
      id: 'em1', type: 'readRoom', skill: 'empathy',
      prompt: 'Read the room',
      scene: 'You suggest karaoke for the team outing. Everyone says “sure!” — but two people exchange a glance, and one says “I mean, if everyone’s in…”',
      question: 'What’s the true reading?',
      options: [
        { text: 'That was a soft no — offer an alternative and watch the relief', correct: true, why: '“If everyone’s in” + a shared glance is dissent wearing a polite costume.' },
        { text: 'Everyone agreed — karaoke it is', why: 'Words said yes; the glance said help.' },
        { text: 'They’re annoyed you suggested anything at all', why: 'Too dark — they’re uncomfortable with the plan, not with you.' },
      ],
    },
    {
      id: 'em2', type: 'bestReply', skill: 'empathy',
      prompt: 'Meet them where they are',
      scene: 'Your normally loud friend is quiet at dinner. When someone asks if they’re okay: “Yeah! Totally. Just tired.”',
      options: [
        { text: 'Later, privately: “Tired-tired, or the other kind of tired?”', correct: true, why: 'You honored the public cover story and opened a private door. That’s emotional precision.' },
        { text: 'Announce to the table: “You’ve been off all night, what’s wrong?”', why: 'Public spotlight on private pain — they’ll retreat further.' },
        { text: 'Take it at face value and carry on', why: 'Sometimes right! But with a loud friend gone quiet, “just tired” deserves one gentle follow-up.' },
      ],
    },
    {
      id: 'em3', type: 'fillBlank', skill: 'empathy',
      prompt: 'Include without spotlighting',
      scene: 'Group hang. The new person has been silent for ten minutes while everyone relives old inside jokes.',
      line: ['“Oh — context: Dave once fell asleep in a canoe. ', '”'],
      tiles: [
        { text: 'Jamie, please tell me you have a Dave-tier friend story.', correct: true },
        { text: 'Anyway, you had to be there.' },
        { text: 'Jamie, why are you so quiet over there?' },
      ],
      why: 'Backfill the context, then hand them an easy on-ramp. “Why are you quiet” is a spotlight; this is a door.',
    },
    {
      id: 'em4', type: 'fixMessage', skill: 'empathy',
      prompt: 'Fix the check-in',
      scene: 'Texting a friend who just went through a breakup.',
      segments: [
        { text: 'Hey. Thinking about you today.' },
        { text: 'You two never made sense anyway, you can do way better.', bad: true, why: 'Trashing the ex forces them to defend the person they still love. Classic backfire.' },
        { text: 'No need to reply — but I’m around all weekend if you want company.' },
      ],
      repair: [
        { text: 'Delete it — presence, not verdicts', correct: true, why: 'The other two lines are perfect: care without pressure.' },
        { text: '“Honestly I saw this coming.”', why: 'Congratulations on your foresight; it helps no one.' },
        { text: '“Plenty of fish in the sea!”', why: 'They’re grieving one specific fish.' },
      ],
    },
    {
      id: 'em5', type: 'bestReply', skill: 'empathy',
      prompt: 'Disagree with care',
      scene: 'A friend shares a business idea they’re clearly in love with. You see a fatal flaw.',
      options: [
        { text: '“I love the energy — what’s your plan for the licensing side? That part worries me.”', correct: true, why: 'Honor the dream, then aim your doubt at the plan, not the person. They can hear that.' },
        { text: '“Yeah, that won’t work. The licensing alone kills it.”', why: 'Right and useless — they’ll defend, not listen. Truth needs a doorway.' },
        { text: '“Sounds amazing! Go for it!”', why: 'Cheerleading them off a cliff isn’t kindness.' },
      ],
    },
    {
      id: 'em6', type: 'readRoom', skill: 'empathy',
      prompt: 'The unspoken ask',
      scene: 'Your partner, staring at a mountain of laundry: “I just love how I’m the only one who ever sees this pile.”',
      question: 'What are they actually saying?',
      options: [
        { text: '“I feel alone in the work — join me”', correct: true, why: 'Sarcasm is usually a feeling that didn’t feel safe saying itself plainly.' },
        { text: 'They enjoy doing laundry alone', why: 'Reading sarcasm literally is a choice — a dangerous one.' },
        { text: 'They want you to schedule a chore chart meeting', why: 'Maybe eventually. Right now: pick up a shirt. Actions answer sarcasm best.' },
      ],
    },
    {
      id: 'emr1', type: 'roleplay', skill: 'empathy', npc: 'rosa',
      prompt: 'Live conversation',
      scene: 'Hallway. Your neighbor Rosa, usually chatty, is wrestling her keys with a full grocery bag and gives you a thin smile.',
      goal: 'Help without overstepping',
      beats: [
        {
          npcLine: 'Oh — hi. Sorry, don’t mind me, wrestling with everything today, apparently.',
          options: [
            { text: '“Here, I’ve got the bag while you fight the lock.”', vibe: 2, feedback: 'Concrete help, zero interrogation. Empathy is often logistics.' },
            { text: '“Haha, one of those days?”', vibe: 1, feedback: 'Friendly, light — leaves the door open without pushing.' },
            { text: '“You okay? You seem really off. Like, really off.”', vibe: -1, feedback: 'Diagnosing someone in a hallway makes the thin smile thinner.' },
          ],
        },
        {
          npcLine: 'Thanks. It’s just been… my sister’s in the hospital. It’s fine. It’s probably fine. Anyway—',
          options: [
            { text: '“That’s a lot to carry around while carrying groceries. I’m sorry.”', vibe: 2, feedback: 'You let it be heavy without making her explain. “Probably fine” never means fine.' },
            { text: '“Oh no — what happened? Which hospital? Is it serious?”', vibe: -1, feedback: 'Three questions in one breath turns care into an intake form.' },
            { text: '“I’m sure she’ll be okay!”', vibe: 1, feedback: 'Kind intent — but you promised something you can’t know.' },
          ],
        },
        {
          npcLine: '…Yeah. Thank you. Sorry, I didn’t mean to unload that on you in a hallway.',
          options: [
            { text: '“Hallways are where the real conversations happen. I’m in 4B if you ever want tea and zero advice.”', vibe: 2, feedback: '“Zero advice” is the most reassuring phrase in the language. Specific, pressure-free.' },
            { text: '“Anytime! Let me know if you need ANYTHING at all!”', vibe: 1, feedback: 'Warm, but vague offers are hard to accept. Specific ones get taken.' },
            { text: '“No worries! Anyway, have a good one!”', vibe: -1, feedback: 'You accepted her apology for opening up — which teaches her not to.' },
          ],
        },
      ],
      threshold: 3,
      whyPass: 'You helped with your hands, let her feelings be real, and left a door open with no pressure. Textbook.',
      whyFail: 'She needed lightness, then a witness, then an exit. Match the moment, not your curiosity.',
    },
  ],
}

if (typeof window !== 'undefined') window.__EX = EXERCISES // dev/E2E introspection

export const SKILLS = {
  icebreaking: { id: 'icebreaking', name: 'Ice-Breaking', emoji: '🧊', color: 'var(--coral)', deep: 'var(--coral-deep)', soft: 'var(--coral-soft)' },
  listening: { id: 'listening', name: 'Listening', emoji: '👂', color: 'var(--teal)', deep: 'var(--teal-deep)', soft: 'var(--teal-soft)' },
  confidence: { id: 'confidence', name: 'Confidence', emoji: '🦁', color: 'var(--violet)', deep: 'var(--violet-deep)', soft: 'var(--violet-soft)' },
  storytelling: { id: 'storytelling', name: 'Storytelling', emoji: '🎭', color: 'var(--sun)', deep: 'var(--sun-deep)', soft: 'var(--sun-soft)' },
  empathy: { id: 'empathy', name: 'Empathy', emoji: '💗', color: 'var(--pink)', deep: '#e05a96', soft: 'var(--pink-soft)' },
}
