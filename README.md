# UNHINGED

A live, mobile-first corporate roast party game for **3–8 players**. Create a room, share its code or invite link, write answers to workplace prompts, vote on other players' responses, and compete across three rounds.

## Play

1. One player selects **Create Game** and enters a host name. Everyone else selects **Join Game**, enters the room code and a unique name, or opens the invite link.
2. In the **Board Room** lobby, the host can choose whether to avoid recently used questions across rematches. The host starts once at least three players have joined.
3. In rounds 1 and 2, each player receives four short answer assignments across paired matchups. Round 3 gives each player one final prompt. Answering has a **90-second** window; unanswered assignments are marked **Not submitted**.
4. In the **45-second** voting phase, vote on eligible responses. You cannot vote for your own answer or on a matchup you answered in rounds 1 and 2. Everyone can review all answers, including their own, in a read-only list.
5. Results show the round winner, answers, authors, and vote totals. Votes award **100 / 150 / 200 points** in rounds 1 / 2 / 3. After rounds 1 and 2, the winner can select a power and a target for the next round.
6. The final screen shows the leaderboard. The host can start a rematch in the same room.

The game advances when the required actions are complete or the phase timer expires. The host or round winner advances the inter-round screens. A returning player can resume their room on the same browser/device using the room link and saved session.

## Run on Replit

This is a pnpm workspace using Node.js 24, React/Vite, an Express + Socket.IO API, and PostgreSQL. The app needs a PostgreSQL connection in `DATABASE_URL`; do not commit connection strings or secrets.

1. Install dependencies from the repository root:

   ```sh
   pnpm install --frozen-lockfile
   ```

2. Configure `DATABASE_URL` in the development environment and apply the development schema:

   ```sh
   pnpm --filter @workspace/db run push
   ```

3. Start the configured **API Server** and **UNHINGED web** workflows. Their commands are:

   ```sh
   pnpm --filter @workspace/api-server run dev
   pnpm --filter @workspace/unhinged-game run dev
   ```

   The workflows supply the required `PORT` values and the web app's `BASE_PATH`. Open the web preview to create a room; share its invite link so other players can join. The API health endpoint is `/api/healthz`.

The host-reaction feature can use the Replit-managed OpenAI integration when `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` are available to the API. If it is unavailable or times out, the game uses a prewritten reaction instead.

**Outside Replit:** Both services require `PORT`, and Vite also requires `BASE_PATH` (for example, `/`). The browser connects to Socket.IO at `/socket.io` on the **same origin** as the web app, so a standalone local setup also needs a reverse proxy routing `/socket.io` and `/api` to the API server. Running Vite and the API on separate ports without that routing will not provide a working multiplayer preview.

## Checks

Run from the repository root:

```sh
pnpm run typecheck
pnpm --filter @workspace/api-server test
pnpm --filter @workspace/api-server run build
PORT=23984 BASE_PATH=/ pnpm --filter @workspace/unhinged-game run build
```

## Repository map

- [`artifacts/unhinged-game/`](artifacts/unhinged-game/) — player-facing React app
- [`artifacts/api-server/src/game/`](artifacts/api-server/src/game/) — authoritative game rules, room events, and persistence
- [`artifacts/neo-brutalism-ui/`](artifacts/neo-brutalism-ui/) — shared design system
- [`lib/db/`](lib/db/) — PostgreSQL schema and database access
- [`artifacts/unhinged-game/docs/information-architecture.md`](artifacts/unhinged-game/docs/information-architecture.md) — sitemap, game states, and role permissions