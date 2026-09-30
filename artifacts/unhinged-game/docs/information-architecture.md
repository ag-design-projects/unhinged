# UNHINGED — Sitemap & Information Architecture

This documents the **existing** web app. It is a live, room-based game, not a multi-page site: the visible screen changes with local entry state and the server's game phase.

## URL-level sitemap

```text
/                         UNHINGED app
├── Home                   Create Game / Join Game
├── Create Game            Host name → create room
└── Join Game              Room code + player name → join room

/?room=ROOM_CODE           Invite / returning-player entry
├── Returning player       Resume saved room session, if available
└── New player             Join Game with room code prefilled
```

There are **no separate URLs** for the lobby, rounds, voting, results, settings, or leaderboard. Once someone joins a room, the server's current phase determines which screen they see. Creating or joining a room updates the browser URL to include `?room=ROOM_CODE`.

## In-room screen map

```text
Room lobby ("Board Room")
│  Room code, invite-link copy, player list (3–8 players)
│  Host: "Avoid recent questions" setting and Start Meeting
│  Others: wait for host
│
└── Round 1 — Answering
    ├── Assigned prompt → write answer → Lock It In
    ├── Repeat for remaining assigned prompts
    └── After all own answers: Locked / waiting
         ↓ all responses received or answer timer expires
    Round 1 — Voting
    ├── Eligible matchup: choose between submitted responses
    ├── All answers: read-only review, including own responses
    └── After eligible votes: Locked / waiting; review remains visible
         ↓ all required votes received or vote timer expires
    Round 1 — Results
    ├── Winner and winning response
    ├── All answers, authors, submission status, vote totals
    └── Host or winner: Next
         ↓
    Power selection
    ├── Winner: choose power and target
    └── Others: wait
         ↓
    Power reveal
    └── Host or winner: Continue
         ↓
    Round 2 — Answering → Voting → Results → Power selection → Power reveal
         ↓
    Round 3 — Answering → Voting → Results
         ↓ Host or winner: Next
    Final results ("The Quarterly Results")
    ├── Score leaderboard
    ├── All final-round answers and vote totals
    └── Host: Play Again → Room lobby (rematch)
```

Rounds 1 and 2 assign **four answers per player** across paired matchups; round 3 assigns **one answer per player**. The answer window is **90 seconds** and the voting window is **45 seconds**. Phases can advance earlier when the required submissions or votes are complete.

## Roles and permissions

| Role / situation | Can do | Sees |
| --- | --- | --- |
| Visitor | Create a room or join by code/invite | Home, Create Game, Join Game |
| Host in lobby | Copy invite, change the recent-question setting, start with at least 3 players | Room code, player roster, question setting |
| Player answering | Submit only their own pending assigned answers | Their current prompt, timer, submission progress; then a waiting state |
| Player voting | Vote in eligible matchups only; cannot vote for their own answer or a matchup they answered in rounds 1–2 | Eligible vote cards plus a read-only list of **all** answers, including their own |
| Player viewing results | Review winner, all answers, vote totals, and reaction | Round results; author names appear here |
| Round winner | Select a power and a different player as target | Power-selection controls; host or winner can advance eligible inter-round screens |
| Host after final results | Start a rematch | Final leaderboard and Play Again |

The read-only **All answers** list is distinct from the vote cards. It marks the viewer's own answers, shows whether a response was submitted, and does not enable ineligible votes. A missing response is shown as **Not submitted**, not as player-written text. During voting, other players' author names are not shown in the review list; results reveal authors and totals.

## Alternate and recovery states

- **Reconnecting:** A full-screen reconnection state replaces the game while the connection is being restored. An existing room session is resumed using the room code in the URL and the saved session on that device.
- **Unable to reconnect / no active session:** An error screen offers Refresh. Join and game-action errors can also appear inline on their relevant screens.
- **Waiting:** Players who have finished their assigned answers, finished eligible votes, or are waiting for a power choice see a locked/waiting state rather than another action.
- **Host changes:** The server may transfer the host role after the disconnected host's grace period; host-only controls follow the current host identity.
- **Rematch:** The same room returns to the lobby and scores reset. The host can choose whether to avoid recently used prompts across rematches.

## Current navigation boundaries

- There is no persistent navigation menu, accounts/profile area, public room directory, separate settings page, or historical game archive.
- Back navigation is offered from Create Game and Join Game to Home. In-room movement is controlled by the server's phase and role-specific actions rather than by page links.
- This is a **product-state sitemap**, not an XML search-engine sitemap: private room screens are not independently addressable public pages.

## Source of truth

- Screen rendering and calls to action: `artifacts/unhinged-game/src/pages/GameShell.tsx`
- Answer review: `artifacts/unhinged-game/src/components/AnswerReview.tsx`
- Room URL and session recovery: `artifacts/unhinged-game/src/game/useGameSocket.ts`
- Phase transitions, deadlines, voting rules, and per-player snapshots: `artifacts/api-server/src/game/engine.ts`
- Room events, reconnect, and host transfer: `artifacts/api-server/src/game/socket.ts`