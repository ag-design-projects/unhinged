# UNHINGED — Build Specification

## 1. Product Definition

**Game name:** UNHINGED

**Genre:** Multiplayer social party / roast game

**Audience:** DEO / workplace audience; corporate humor, sarcasm, pettiness, and playful roasting.

**Core promise:** People answer funny workplace prompts, vote on each other’s answers, and use earned powers to make the next round more chaotic.

**Tone:** Fast, sarcastic, playful, slightly chaotic, workplace-safe enough for a PG-13 office demo.

**Category:** Corporate only. There is no category-selection screen in v1.

**Primary design principle:** The game should feel like a chaotic corporate game show, not a productivity dashboard.

---

## 2. Demo Scope

- **LOCKED:** Goal is one successful, rehearsable demo run, not arbitrary real-world robustness.
- **LOCKED:** Visual polish gets high priority because the demo is judged heavily by what is visible on screen.
- **LOCKED:** Real people fill all player seats; no bot/simulated players.
- **LOCKED:** Every phase has explicit on-screen instruction copy.
- **LOCKED:** Minimum viable disconnect/error state is required: `Connection lost. Refresh to rejoin.`
- **LOCKED:** No reconnect/state restoration or host migration in v1.
- **LOCKED:** Host screen includes a visible copy/share-link affordance.
- **LOCKED:** Lobby explains how the game works before the host starts.
- **LOCKED:** Lobby shows live `X of 3 minimum joined` status.
- **LOCKED:** Start button remains disabled until at least 3 players are present.
- **LOCKED:** AI roast output should be pre-generated/cached for the exact rehearsed demo where practical; the live API path still exists and has a fallback.

---

## 3. Platform & Stack

- **LOCKED:** Responsive web app. Mobile-first.
- **LOCKED:** No native app or app store.
- **LOCKED:** Replit.
- **LOCKED:** Node.js + Express + Socket.io.
- **LOCKED:** In-memory state only. No database in v1.
- **LOCKED:** Every player uses their own phone. There is no separate TV/host display.
- **LOCKED:** Works for colocated and remote play through the same web app/server.
- **DEFAULT:** 3 people may edit the Replit project together.

---

## 4. Player Count & Game Length

- **LOCKED:** Minimum players to start = 3.
- **LOCKED:** Maximum players = 8.
- **LOCKED:** Host also plays.
- **LOCKED:** 3 rounds total.
- **LOCKED:** Round 1 and Round 2 are head-to-head Quiplash-style rounds.
- **LOCKED:** Round 3 is an all-player final round.
- **LOCKED:** Game advances automatically when the current phase has completed for all required players, except host-controlled start/next actions where explicitly specified below.

---

## 5. Core Game Flow

```text
home
→ join / create
→ lobby
→ round 1 prompt
→ answering
→ voting
→ results
→ powerSelect
→ powerReveal
→ round 2 prompt
→ answering
→ voting
→ results
→ powerSelect
→ powerReveal
→ round 3 prompt
→ answering
→ voting
→ final results
→ play again / return home
```

There is **no categorySelect phase** because the only category is Corporate.

---

## 6. Round Mechanics

### Round 1 — Classic Roast

- Round 1 creates exactly **one 2-question set per player**.
- Each 2-question set is assigned to exactly 2 players.
- The two players in a set receive the same Question 1, then the same Question 2.
- Both submit one answer to each question.
- Other eligible players vote between the two answers for each question.
- A player cannot vote for their own answer.
- During answering, players do not see what anyone else is typing.
- During voting, players never see their own answer.
- A player may appear in more than one pair set.
- Pair selection is **not** the exhaustive `n(n-1)/2` combination set. The game selects only **n pair sets for n players**.
- Example with 4 players: `(A,B)`, `(A,C)`, `(B,C)`, `(C,D)` = 4 pair sets = 8 actual questions.
- Example with 5 players: 5 pair sets = 10 actual questions.
- Each pair set is conceptually one matchup containing 2 questions; the two players stay paired for both questions in that set.
- Winner receives points based on votes.
- The winner then receives **2 Ability Points** for the next round.

### Round 2 — Higher Stakes Roast

- Uses the same **one 2-question set per player** structure as Round 1.
- Each pair stays together for the two questions in its assigned set.
- Same head-to-head voting mechanic as Round 1.
- A winner-selected ability from Round 1 is active.
- The ability applies to the targeted player in the relevant Round 2 matchup.
- Scoring is higher than Round 1.
- Winner receives **2 Ability Points** for the next round.

### Round 3 — Final Roast

- Everyone receives the same prompt.
- Everyone submits one answer.
- Players see all eligible answers after answering closes.
- Players vote for the answer they prefer.
- A player cannot vote for their own answer.
- Scoring is highest in the game.
- No power selection after Round 3.
- Final leaderboard and player archetype are shown.

---

## 7. Pairing & Question Count

The game uses a **pair-set model**, not all possible player combinations.

For `n` players:

- Create exactly **n pair sets** in each head-to-head round.
- Each pair set contains **2 questions** shared by the same two players.
- Therefore total actual questions in Round 1 or Round 2 = **n × 2**.

| Players | Pair sets | Questions per set | Actual questions in round |
|---:|---:|---:|---:|
| 3 | 3 | 2 | 6 |
| 4 | 4 | 2 | 8 |
| 5 | 5 | 2 | 10 |
| 6 | 6 | 2 | 12 |
| 7 | 7 | 2 | 14 |
| 8 | 8 | 2 | 16 |

Example for 4 players:

```text
(A,B) → Q1 + Q2
(A,C) → Q3 + Q4
(B,C) → Q5 + Q6
(C,D) → Q7 + Q8
```

Pair selection is controlled by the game rather than generated as the full `n(n-1)/2` unique-combination set. A player may appear in multiple pair sets. The exact pairing algorithm can be randomized or curated later without changing the game-state model.

---

## 8. Scoring

Keep the scoring easy to understand.

### Round 1

**100 points per vote received.**

Example: 4 votes = 400 points.

### Round 2

**150 points per vote received.**

Example: 4 votes = 600 points.

### Round 3

**200 points per vote received.**

Example: 5 votes = 1,000 points.

### Tie handling

- If two answers tie, both receive the points corresponding to their votes.
- No extra winner bonus is awarded for a tie.
- If a tie occurs in the round that determines the next power, one of the tied players is randomly selected to choose the power.
- Both tied players retain their earned score.

**Ability Points are separate from game score.** They are used only to choose a modifier for the next round.

---

## 9. Ability Power System

After Rounds 1 and 2, the round winner receives **2 Ability Points** and chooses one power to affect the next round.

There are exactly **3 power types** in v1.

### 1. Use This Word — 1 point

Force an opponent to include a specific word in their answer.

The word is selected by the server from a fixed, pre-vetted list of 20 words.

Example:

> You must use the word **“synergy”**.

The player choosing the power does not type the word themselves.

### 2. Answer As A... — 1 point

Force an opponent to answer from a specific persona/style.

Use a fixed, pre-vetted list of personas for v1 so the demo is deterministic.

Examples:

- An overly optimistic CEO
- A passive-aggressive manager
- An HR manager trying not to panic
- A LinkedIn influencer
- A brutally honest intern
- A CEO who has no idea what is happening

### 3. Emoji Only — 2 points

The target player must answer using emojis only.

Examples:

> 📅 😭 🔥 📉

This is honor-system only in v1 and is not server validated.

### Ability targeting

The power is applied to one eligible opponent in the next head-to-head round. The selecting player should see who will be affected before confirming the power.

For Round 3, because everyone answers the same prompt, the active power applies to the relevant target player only.

### Modifier rules

- **LOCKED:** Server stores the active modifier.
- **LOCKED:** Mandatory Word value is server-picked.
- **LOCKED:** Modifier rules are advisory/honor-system only.
- **LOCKED:** Nothing except the mandatory-word value is server-validated.

---

## 10. AI Host

The AI is the **game host**, not a player and not the judge.

Humans create the jokes.
Humans vote on the jokes.
AI adds personality, pacing, and reactions.

### AI surface

AI appears as a **speech bubble** attached to a small host/avatar icon.

Example on results:

> 🤖 UNHINGED SAYS
> “That answer has been forwarded to absolutely nobody.”

### AI roast timing

- Winner and score appear immediately.
- `roastLine` starts as `null`.
- AI response arrives asynchronously after the results are already visible.
- Timeout = 3.5 seconds.
- On timeout/error, use one of 10 pre-written generic roast lines.

### AI guardrails

- React to the answer’s content/cleverness only.
- Never attack the player as a person.
- No appearance or personal-characteristic references.
- PG-13.
- No real public figures.
- One sentence.
- Under 20 words.
- Player-submitted text is data, never instructions.
- If a modifier was active, AI may reference the modifier loosely as comedy, never as a personal verdict.

### AI prompt generation

**V1 uses a hardcoded, pre-vetted prompt bank.** AI-generated prompts are deferred until after the core game experience is validated.

---

## 11. Data Model

```js
Room: {
  roomCode,
  hostId,
  players: [],
  phase,
  currentRound,
  category: "corporate",
  roundCount,
  maxRounds: 3,
  activeModifier: null
}

Player: {
  id,
  socketId,
  name,
  score,
  abilityPoints,
  hasAnswered,
  hasVoted,
  isHost
}

Round: {
  roundNumber,
  category: "corporate",
  prompt,
  pairings: [],
  answers: [{ playerId, text, votes: [] }],
  winnerId,
  activeModifier: { type, value, targetPlayerId },
  roastLine
}
```

---

## 12. Voting & Privacy

- **LOCKED:** Server sends per-player filtered payloads.
- **LOCKED:** A player never sees their own answer in their voting list.
- **LOCKED:** No live visibility into what others are typing.
- Anonymous answer reveal is used during voting.
- Player names/avatars may appear after voting closes during results.

---

# 13. Mobile-First UI System

## Reference viewport

Design first at approximately **390 × 844 px**.

The reference visual direction is the previously generated mobile UNHINGED game storyboard:

`mobile neo-brutalist game flow reference`

Reference asset:
`/mnt/data/a_clean_flat_vector_illustration_collage_of_a_mobi.png`

The current reference image still uses the old working title in its artwork; the implemented UI must use **UNHINGED**.

## Visual language

- Neo-brutalist.
- Warm cream/off-white base surfaces.
- Very dark navy/black structural surfaces.
- Bright yellow as primary action color.
- Hot pink, electric blue, and green as rotating accent colors.
- 3–4 px black borders.
- Hard offset shadows; no soft blur shadows.
- Chunky rectangular buttons.
- Very small or no corner radius.
- Large, heavy display typography.
- Paper/sticker/card treatment for prompts and answers.
- Hand-drawn doodles and accent marks used sparingly.
- Strong contrast and large tap targets.
- Avoid traditional SaaS dashboard styling.
- Avoid heavy glassmorphism.
- Avoid dense desktop layouts.

## Mobile interaction rules

- One dominant action per screen whenever possible.
- Sticky primary CTA near the bottom while answering/voting.
- Minimum comfortable touch target around 44 px.
- Respect iOS/Android safe areas.
- Timer is visible at the top right.
- Round progress dots sit near the round label.
- Keep prompts and answer cards readable without zooming.
- Use vertically stacked cards for voting instead of side-by-side desktop columns.

---

# 14. Screen Map & UI Specification

## Screen 1 — Home

### Purpose
Immediate start point.

### Layout
Top/center-heavy brand treatment with large logo and short tagline. Two large stacked buttons near the bottom.

### Copy

```text
UNHINGED

The corporate roast game.

Say what you can't say at work.

[ CREATE GAME → ]
[ JOIN GAME ]
```

### Notes
- No login.
- No settings required before starting.
- Primary action is Create Game.

---

## Screen 2 — Join Game

### Layout
Two fields, then a large CTA. QR option below.

### Copy

```text
JOIN A GAME

Enter the game code
[ 7FKP ]

Your name
[ Amogh ]

[ JOIN MEETING → ]

──────── OR ────────

[ SCAN QR ]
```

### Validation
- Game code required.
- Name required.
- Show concise inline error if invalid.

---

## Screen 3 — Lobby

### Layout
Corporate boardroom illustration / abstract visual, player list card, room code, and sticky bottom CTA.

### Copy

```text
BOARDROOM

Nobody knows why we're here.

MEETING ID: 7FKP
[ COPY / SHARE LINK ]

4 / 8 PEOPLE IN

● Amogh      YOU
● Priya
● Rahul
● Sarah
○ Waiting...

HOW TO PLAY
Answer the prompt.
Vote for your favourite answer.
Win points. Cause problems.

[ START MEETING → ]
```

### Start state

For 1–2 players:

```text
2 / 8 PEOPLE IN

Waiting for 1 more employee...
```

Start button disabled.

For 3+ players:

```text
3 / 8 PEOPLE IN

Ready when you are.
```

Start button enabled for host.

---

## Screen 4 — Round Prompt / Answering

### Layout
Dark structural background. Cream prompt card. Timer and round progress at top. Large answer input and sticky CTA at bottom.

### Copy

```text
ROUND 1                         00:38

● ● ○ ○ ○

⚡ QUICK SYNC

Your manager says:

“Can we jump on a quick call?”

Complete the sentence:

THE CALL WILL DEFINITELY _______

[ Type your answer... ]

32 characters remaining

[ LOCK IT IN → ]
```

### Answering behavior
- Max answer length = 32 characters.
- Submit CTA disabled until text exists.
- After submitting, lock the input.

Locked state:

```text
✓ ANSWER LOCKED

Waiting for everyone...
```

Show live `X of Y answered` when available.

---

## Screen 5 — Voting

### Layout
Vertical answer cards. Each card is a large tap target.

### Copy

```text
ROUND 1

WHICH RESPONSE IS BETTER?

┌─────────────────────┐
│ A                   │
│                     │
│ “Last two hours.”   │
│                     │
│ [ TAP TO VOTE ]     │
└─────────────────────┘

OR

┌─────────────────────┐
│ B                   │
│                     │
│ “My entire          │
│ afternoon.”         │
│                     │
│ [ TAP TO VOTE ]     │
└─────────────────────┘
```

### Privacy
- Never show the current player’s own answer.
- Do not identify authors until voting closes.

After voting:

```text
✓ VOTE LOCKED

Waiting for everyone...

● ● ● ✓ ●
```

---

## Screen 6 — Round Results

### Layout
Big winner treatment. Large score. Winning answer on a paper card. AI host speech bubble appears after initial render.

### Copy

```text
ROUND 1 · RESULTS

🏆 WINNER!

PRIYA

+400 PTS

“My entire afternoon.”

Voted by 4 people.

🤖 UNHINGED SAYS
“Apparently four people needed their afternoon back.”

[ NEXT → ]
```

AI bubble should animate/pop in after the result is already visible.

If AI fails, use a fallback roast line.

---

## Screen 7 — Ability Selection

### Purpose
Reward the round winner and introduce controlled chaos.

### Layout
Full-screen dramatic moment. Three large stacked power cards.

### Copy

```text
YOU WON.

NOW CAUSE PROBLEMS.

+2 ABILITY POINTS

Choose your power.

┌─────────────────────┐
│ 📝 USE THIS WORD    │
│                     │
│ Force a word into   │
│ an answer.          │
│                     │
│ 1 PT                │
└─────────────────────┘

┌─────────────────────┐
│ 🎭 ANSWER AS A...   │
│                     │
│ Change the          │
│ personality.        │
│                     │
│ 1 PT                │
└─────────────────────┘

┌─────────────────────┐
│ 😂 EMOJI ONLY       │
│                     │
│ No words allowed.   │
│                     │
│ 2 PTS               │
└─────────────────────┘
```

Selected state visibly highlights the card.

Then show a target picker if needed:

```text
WHO GETS IT?

[ Priya ] [ Rahul ] [ Sarah ]

[ CONFIRM POWER → ]
```

The winner cannot target themselves.

---

## Screen 8 — Power Reveal

### Layout
One large paper card / sticker reveal. This is a celebratory transition into the next round.

### Example: Use This Word

```text
YOUR POWER

📝 USE THIS WORD

YOUR TARGET MUST USE:

“SYNERGY”

Good luck explaining that.

[ LET'S GO → ]
```

### Example: Answer As A...

```text
YOUR POWER

🎭 ANSWER AS A...

YOUR TARGET MUST ANSWER AS:

DESPERATELY OPTIMISTIC CEO

You have 30 seconds.

[ LET'S GO → ]
```

### Example: Emoji Only

```text
YOUR POWER

😂 EMOJI ONLY

YOUR TARGET
CAN ONLY USE EMOJIS.

This is going well.

[ LET'S GO → ]
```

---

## Screen 9 — Round 2 Prompt / Answering

### Layout
Power constraint appears above the prompt and remains visible throughout the answering phase.

### Example

```text
ROUND 2                         00:45

⚠️ POWER PLAY

ANSWER AS:
DESPERATELY OPTIMISTIC CEO

Your team missed the deadline.

Explain why it was actually
strategically successful.

[ Type your answer... ]

32 characters remaining

[ LOCK IT IN → ]
```

The target should not need to remember the constraint.

---

## Screen 10 — Round 2 Voting

Same voting component as Round 1 with the same privacy rules.

The UI may retain a small `POWER PLAY` marker so the constraint remains part of the round identity, but the voting screen should not reveal authors before voting closes.

---

## Screen 11 — Round 2 Results

Same results structure as Round 1, but with the higher scoring value and AI speech bubble.

Example:

```text
ROUND 2 · RESULTS

🏆 WINNER!

RAHUL

+600 PTS

“I think we're aligned on the
synergy here.”

🤖 UNHINGED SAYS
“Nothing says accountability like the word synergy.”

[ NEXT → ]
```

Winner receives 2 Ability Points for Round 3.

---

## Screen 12 — Round 3 Final Prompt

### Layout
More dramatic final-round treatment.

### Copy

```text
FINAL ROUND

● ● ● ● ●

EVERYONE ANSWERS

Convince the board that your
team's biggest failure was
actually a strategic success.

00:45

Everyone answers now.

[ LET'S GO → ]
```

Then switch to the answering state.

---

## Screen 13 — Round 3 Answering

Same answer input component, but copy changes to:

```text
EVERYONE IS ANSWERING...

7 / 8 answered
```

When the player submits:

```text
✓ ANSWER LOCKED

You’re in.
Waiting for everyone else...
```

---

## Screen 14 — Round 3 Voting

All eligible answers shown as a vertical stack.

The current player’s own answer remains hidden.

Example:

```text
THE FINAL VOTE

Pick the answer that deserves
the boardroom mic.

[ ANSWER A ]
[ ANSWER B ]
[ ANSWER C ]
[ ANSWER D ]
...

[ TAP TO VOTE ]
```

Use progressive reveal/scrolling if 8 players create a long list.

---

## Screen 15 — Final Results

### Layout
Leaderboard + playful corporate archetype card + AI closing speech bubble.

### Copy

```text
THE QUARTERLY RESULTS

🥇 PRIYA       2,840
🥈 RAHUL       2,510
🥉 AMOGH       1,920
4  SARAH       1,640

YOUR CORPORATE PERSONA

☢️ STRATEGIC MENACE

“Most likely to say ‘noted’
while plotting revenge.”

🤖 UNHINGED SAYS
“Congratulations. Nobody learned anything.”

[ PLAY AGAIN → ]
```

Archetype is decorative/fun and must not affect score.

---

## Screen 16 — End Card / Rematch

Optional final celebration screen after the final leaderboard.

```text
SAME CHAOS.
NEW MEETING.

[ PLAY AGAIN → ]

[ SHARE GAME ]
```

If implemented, Share Game should return the room/invite link.

---

## Screen 17 — Connection Error

Visible failure state, not an infinite spinner.

```text
UH OH.

CONNECTION LOST.

Refresh the page to rejoin the meeting.

[ REFRESH ]
```

No reconnect logic is required in v1.

---

# 15. Shared UI Components

Build reusable components rather than separate bespoke markup for every screen.

```text
GameHeader
RoundIndicator
Timer
PlayerAvatarRow
PlayerList
PromptCard
AnswerInput
AnswerCard
VoteCard
ResultsCard
AbilityCard
PowerRevealCard
AISpeechBubble
Scoreboard
Toast / ErrorMessage
PrimaryButton
SecondaryButton
```

---

# 16. Game State / Phase Rules

Suggested phase enum:

```js
"lobby"
"promptReveal"
"answering"
"voting"
"results"
"powerSelect"
"powerReveal"
"gameOver"
"error"
```

Round progression:

```text
Round 1:
answering → voting → results → powerSelect → powerReveal

Round 2:
answering → voting → results → powerSelect → powerReveal

Round 3:
answering → voting → results → gameOver
```

---

# 17. Prompt Bank

V1 uses a hardcoded prompt bank focused on workplace humor.

Example prompt themes:

### Corporate
- “The real reason this meeting exists is ______.”
- “The most dangerous sentence in corporate life is ______.”
- “My manager said ‘quick question’ and then ______.”
- “The real meaning of ‘let’s circle back’ is ______.”

### Petty
- “The most professionally petty way to say ‘I told you so’ is ______.”
- “Someone ignored your message for three days and then said ‘Quick question…’ You reply: ______.”
- “The most passive-aggressive calendar invite title is ______.”

### Workplace situations
- “Your manager says ‘Can you squeeze this in today?’ You respond: ______.”
- “Someone says ‘make it pop.’ What they actually mean is ______.”
- “Your PM says ‘Engineering says it should be easy.’ You say: ______.”

Prompt content should remain PG-13 and workplace-focused.

---

# 18. Multiplayer Requirements

- Room creator becomes host.
- Host plays normally.
- Host can start once 3+ players are present.
- Host can see large meeting code and copy/share link.
- Each player joins from their own device.
- Server is the source of truth for room/game state.
- Answering, voting, results, and power selection are synchronized through Socket.io.
- Late joiners are not required to join an active round in v1; they can be admitted to the room but should enter the next available round.
- No host migration.
- No reconnect/state restoration.

---

# 19. Implementation Notes

The frontend should be a small state-driven game client. Avoid building every screen as an isolated route if a single game shell with phase-specific components is simpler.

The server owns:

- Room membership
- Host identity
- Current phase
- Current round
- Prompt
- Pairings
- Answers
- Votes
- Scores
- Ability points
- Active modifier
- Winner
- AI roastLine

The client owns only local interaction state such as text currently being typed and the selected vote before submission.

---

# 20. Build Priorities

### Phase 1 — Visual prototype

Build the mobile screens and transitions with mocked data:

Home → Lobby → Round 1 → Voting → Results → Power → Round 2 → Final Round → Results.

### Phase 2 — Multiplayer state

Connect Room / Player / Round state through Socket.io.

### Phase 3 — Real scoring and powers

Implement voting, scores, power selection, targeting, and round progression.

### Phase 4 — AI host

Add asynchronous AI roast with fallback and guardrails.

### Phase 5 — Demo polish

Tune animation, transitions, timer treatment, winner moments, speech-bubble appearance, and mobile spacing.

---

# 21. Final Locked Decisions

| Decision | Final |
|---|---|
| Game name | UNHINGED |
| Platform | Responsive web |
| Design priority | Mobile-first |
| Visual system | Neo-brutalist |
| Category | Corporate only |
| Category screen | None |
| Minimum players | 3 |
| Maximum players | 8 |
| Host plays | Yes |
| Rounds | 3 |
| Round 1 | Head-to-head |
| Round 2 | Head-to-head + power |
| Round 3 | Everyone answers |
| Ability types | Use This Word / Answer As A... / Emoji Only |
| Ability points | 2 to round winner |
| AI role | Game host / roast commentator |
| AI presentation | Speech bubble |
| AI prompt generation | Deferred; hardcoded prompt bank for v1 |
| AI roast | Async, 3.5s timeout, fallback lines |
| Reconnect | Out of scope |
| Host migration | Out of scope |
| Database | None in v1 |
| State | In-memory |
