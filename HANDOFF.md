# UNHINGED Multiplayer Handoff

## Delivery

- Repository: `https://github.com/ag-design-projects/unhinged`
- Branch: `main`
- Implementation commit: `1a5c317`
- Product: responsive 3–8 player Socket.io party game
- State model: server-authoritative, PostgreSQL-backed room snapshots

## Shipped Scope

- Create a room, share its invite link, and join with a unique display name.
- Host-controlled start with a three-player minimum and eight-player maximum.
- Three synchronized rounds:
  - Rounds 1 and 2 use exactly one two-question pair set per player.
  - Round 3 gives every player the same final prompt.
- Private, sequential assignments and anonymous eligible voting.
- Server-owned action validation prevents forged answers and ineligible votes.
- Round scoring at 100, 150, and 200 points per received vote.
- Tie handling, round winners, ability points, three powers, target selection, and reveal flow.
- Server deadlines for answering and voting, including safe abstention handling.
- Results, asynchronous host reactions with a 3.5-second fallback, final leaderboard, and host rematch.
- Stable room-scoped player identities with automatic reconnection and private-state restoration.
- Host migration after a 30-second reconnect grace period.
- Automatic cleanup after every player has been disconnected for two hours.
- Collision-checked eight-character room codes and per-socket join throttling.
- Neo-brutalist responsive UI based on the project design system.

## Verification Completed

- API game tests: 6 passing.
- Three real Socket.io clients create, join, and receive private assignments.
- Malformed create payloads are rejected without crashing the server.
- API TypeScript typecheck passes.
- API production build passes.
- Frontend TypeScript typecheck passes.
- Frontend production build passes with `PORT=23984 BASE_PATH=/`.
- Workspace-wide typecheck passes.
- API and frontend workflows restart and remain running.
- Mobile preview verified at 390 × 844 with no current browser errors.
- Earlier responsive checks also passed at 768 × 1024 and 1280 × 900.

## Operations

- API development workflow:
  - `pnpm --filter @workspace/api-server run dev`
- Frontend development workflow:
  - `pnpm --filter @workspace/unhinged-game run dev`
- API tests:
  - `pnpm --filter @workspace/api-server test`
- Workspace typecheck:
  - `pnpm typecheck`
- Socket.io is exposed through `/socket.io`.
- API health check is available at `/api/healthz`.
- Active room snapshots are stored in the `game_rooms` table.
- `scripts/post-merge.sh` installs packages and applies the development database schema.
- Replit Publish applies managed production schema changes.

## AI Host Reactions

- The live reaction path uses the OpenAI-compatible Replit AI Integration environment when available.
- Required runtime variables:
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
- If the integration is unavailable, errors, or exceeds 3.5 seconds, the server uses a pre-written safe fallback.
- AI output is optional to game progression and cannot block results.

## Intentional V1 Limitations

- Resume credentials are stored in the browser for the specific room and device.
- A host who remains disconnected past the 30-second grace period loses host control to the first connected player.
- Rooms with no connected players are removed after two hours.
- Late joiners are rejected after the game starts.
- Power constraints are honor-system prompts rather than server-enforced content rules.
- No database, login, moderation dashboard, or analytics.

## Next-Agent Guidance

1. Preserve the server-authoritative model. Clients submit intent and render filtered snapshots only.
2. Keep all player-specific payload filtering in the API; never expose a player's own answer in their voting groups.
3. When changing phase transitions, test both normal completion and deadline completion.
4. Guard asynchronous host-reaction updates with round, phase, and winner identity checks.
5. Continue using the tokens and components from `artifacts/neo-brutalism-ui`; do not introduce local visual constants when the design system already provides them.
6. Preserve opaque resume tokens: only their SHA-256 hashes belong in persisted room state.
7. Keep room persistence serialized per room so a slower older write cannot overwrite newer game state.