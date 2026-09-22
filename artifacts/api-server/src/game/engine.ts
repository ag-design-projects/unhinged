export type Phase =
  | "lobby" | "answering" | "voting" | "results"
  | "powerSelect" | "powerReveal" | "gameOver";
export type PowerType = "word" | "persona" | "emoji";
export interface Player {
  id: string; name: string; socketId?: string; score: number; abilityPoints: number;
  sessionTokenHash?: string; disconnectedAt?: number;
}
export interface Pair { id: string; playerIds: [string, string]; prompts: [string, string]; }
export interface Answer { id: string; playerId: string; pairId?: string; question: number; text: string; }
export interface Modifier { type: PowerType; value: string; targetPlayerId: string; }
export interface Room {
  code: string; hostId: string; players: Player[]; phase: Phase; round: number;
  pairs: Pair[]; prompt?: string; answers: Answer[]; votes: Record<string, string>;
  modifier: Modifier | null; winnerId?: string; roastLine: string | null;
  powerChooserId?: string; powerChoice?: PowerType; deadline?: number;
}

const prompts = [
  "The real reason this meeting exists is ______.",
  "The most dangerous sentence in corporate life is ______.",
  "My manager said “quick question” and then ______.",
  "The real meaning of “let’s circle back” is ______.",
  "Someone says “make it pop.” What they actually mean is ______.",
];
const words = ["synergy", "alignment", "bandwidth", "leverage", "circle-back", "deliverable", "stakeholder", "pivot", "roadmap", "touch-base", "workflow", "scalable", "quick-win", "deep-dive", "actionable", "visibility", "ideate", "optics", "boil-the-ocean", "low-hanging-fruit"];
const personas = ["an overly optimistic CEO", "a passive-aggressive manager", "an HR manager trying not to panic", "a LinkedIn influencer", "a brutally honest intern", "a CEO who has no idea what is happening"];
const fallbackRoasts = ["That answer has been forwarded to absolutely nobody.", "Bold strategy. The board is concerned.", "Somewhere, a spreadsheet just sighed.", "Absolutely aligned with the chaos.", "A truly impressive use of workplace vocabulary.", "This meeting could have been an email.", "The synergy is aggressively present.", "No notes. Several questions.", "That answer has earned a performance review.", "Congratulations on making it everyone’s problem."];

export class GameEngine {
  readonly room: Room;
  private readonly random: () => number;
  constructor(code: string, host: Player, random = Math.random, restoredRoom?: Room) {
    this.random = random;
    this.room = restoredRoom ?? { code, hostId: host.id, players: [host], phase: "lobby", round: 0, pairs: [], answers: [], votes: {}, modifier: null, roastLine: null };
  }
  static restore(room: Room, random = Math.random) {
    if (!room.players[0]) throw new Error("Cannot restore an empty room");
    return new GameEngine(room.code, room.players[0], random, room);
  }
  addPlayer(player: Player) {
    if (this.room.phase !== "lobby") throw new Error("Game already started");
    if (this.room.players.length >= 8) throw new Error("Room is full");
    if (this.room.players.some(p => p.name.trim().toLocaleLowerCase() === player.name.trim().toLocaleLowerCase())) throw new Error("That name is already in use");
    this.room.players.push(player);
  }
  start(playerId: string) {
    if (playerId !== this.room.hostId) throw new Error("Only the host can start");
    if (this.room.players.length < 3) throw new Error("At least 3 players are required");
    this.startRound(1);
  }
  private startRound(round: number) {
    this.room.round = round; this.room.phase = "answering"; this.room.answers = []; this.room.votes = {};
    this.room.winnerId = undefined; this.room.powerChoice = undefined; this.room.powerChooserId = undefined;
    this.room.prompt = prompts[(round - 1) % prompts.length];
    this.room.deadline = Date.now() + 45_000;
    if (round < 3) {
      const ps = this.room.players;
      this.room.pairs = ps.map((p, i) => {
        const other = ps[(i + 1) % ps.length];
        return { id: `r${round}-p${i}`, playerIds: [p.id, other.id], prompts: [prompts[(round + i) % prompts.length], prompts[(round + i + 1) % prompts.length]] };
      });
    } else this.room.pairs = [];
  }
  answer(playerId: string, text: string, pairId?: string, question = 0) {
    if (this.room.phase !== "answering") throw new Error("Not accepting answers");
    if (!text.trim() || text.length > 32) throw new Error("Answer must be 1-32 characters");
    if (!this.room.players.some(p => p.id === playerId)) throw new Error("Unknown player");
    if (this.room.round < 3) {
      const pair = this.room.pairs.find(candidate => candidate.id === pairId);
      if (!pair || !pair.playerIds.includes(playerId) || !Number.isInteger(question) || question < 0 || question > 1) {
        throw new Error("Invalid answer assignment");
      }
    } else if (pairId !== undefined || question !== 0) {
      throw new Error("Invalid final answer assignment");
    }
    const key = `${playerId}:${pairId ?? "final"}:${question}`;
    if (this.room.answers.some(a => a.id === key)) throw new Error("Answer already submitted");
    this.room.answers.push({ id: key, playerId, pairId, question, text: text.trim() });
    const required = this.room.round < 3 ? this.room.players.length * 4 : this.room.players.length;
    if (this.room.answers.length >= required) {
      this.room.phase = "voting";
      this.room.deadline = Date.now() + 45_000;
    }
  }
  vote(voterId: string, answerId: string) {
    if (this.room.phase !== "voting") throw new Error("Not accepting votes");
    const answer = this.room.answers.find(a => a.id === answerId);
    if (!answer || answer.playerId === voterId) throw new Error("Invalid or private vote");
    if (this.room.round < 3) {
      const pair = this.room.pairs.find(candidate => candidate.id === answer.pairId);
      if (!pair || !pair.playerIds.includes(answer.playerId) || pair.playerIds.includes(voterId) || (answer.question !== 0 && answer.question !== 1)) {
        throw new Error("Invalid or private vote");
      }
    }
    const key = this.room.round === 3 ? voterId : `${voterId}:${answer.pairId}:${answer.question}`;
    if (this.room.votes[key]) throw new Error("Vote already submitted");
    this.room.votes[key] = answerId;
    const required = this.room.round < 3
      ? this.room.pairs.length * Math.max(1, this.room.players.length - 2) * 2
      : this.room.players.length;
    if (Object.keys(this.room.votes).length >= required) this.finishResults();
  }
  private finishResults() {
    const counts = new Map<string, number>();
    Object.values(this.room.votes).forEach(id => counts.set(id, (counts.get(id) ?? 0) + 1));
    const points = this.room.round === 1 ? 100 : this.room.round === 2 ? 150 : 200;
    for (const [id, count] of counts) {
      const answer = this.room.answers.find(a => a.id === id)!;
      this.room.players.find(p => p.id === answer.playerId)!.score += count * points;
    }
    const totals = new Map<string, number>();
    for (const answer of this.room.answers) totals.set(answer.playerId, (totals.get(answer.playerId) ?? 0) + (counts.get(answer.id) ?? 0));
    const max = Math.max(0, ...totals.values());
    const winners = [...totals.entries()].filter(([, n]) => n === max).map(([id]) => id);
    this.room.winnerId = winners[Math.floor(this.random() * winners.length)] ?? this.room.players[0].id;
    this.room.roastLine = null; this.room.phase = "results"; this.room.deadline = undefined;
    if (this.room.round < 3) { this.room.players.find(p => p.id === this.room.winnerId)!.abilityPoints += 2; this.room.powerChooserId = this.room.winnerId; }
  }
  choosePower(playerId: string, type: PowerType, targetPlayerId: string) {
    if (this.room.phase !== "results" && this.room.phase !== "powerSelect") throw new Error("Power selection is closed");
    if (playerId !== this.room.powerChooserId || playerId === targetPlayerId) throw new Error("Invalid power target");
    const cost = type === "emoji" ? 2 : 1;
    const chooser = this.room.players.find(p => p.id === playerId)!;
    if (chooser.abilityPoints < cost || !this.room.players.some(p => p.id === targetPlayerId)) throw new Error("Insufficient ability points");
    chooser.abilityPoints -= cost;
    const value = type === "word" ? words[Math.floor(this.random() * words.length)] : type === "persona" ? personas[Math.floor(this.random() * personas.length)] : "emojis only";
    this.room.modifier = { type, value, targetPlayerId }; this.room.phase = "powerReveal";
  }
  next() {
    if (this.room.phase === "results" && this.room.round < 3) this.room.phase = "powerSelect";
    else if (this.room.phase === "powerReveal") this.startRound(this.room.round + 1);
    else if (this.room.phase === "results" && this.room.round === 3) this.room.phase = "gameOver";
  }
  setRoast(line?: string) { this.room.roastLine = line?.slice(0, 140) || fallbackRoasts[Math.floor(this.random() * fallbackRoasts.length)]; }
  rematch(playerId: string) {
    if (playerId !== this.room.hostId) throw new Error("Only the host can rematch");
    for (const player of this.room.players) { player.score = 0; player.abilityPoints = 0; }
    this.room.phase = "lobby"; this.room.round = 0; this.room.answers = []; this.room.votes = {};
    this.room.pairs = []; this.room.modifier = null; this.room.roastLine = null; this.room.winnerId = undefined; this.room.deadline = undefined;
    this.room.powerChooserId = undefined; this.room.powerChoice = undefined; this.room.prompt = undefined;
  }
  timeout() {
    if (this.room.phase === "answering") {
      if (this.room.round < 3) for (const pair of this.room.pairs) for (const playerId of pair.playerIds) for (let q = 0; q < 2; q++) {
        if (!this.room.answers.some(a => a.playerId === playerId && a.pairId === pair.id && a.question === q))
          this.room.answers.push({ id: `${playerId}:${pair.id}:${q}`, playerId, pairId: pair.id, question: q, text: "No comment." });
      } else for (const p of this.room.players) if (!this.room.answers.some(a => a.playerId === p.id))
        this.room.answers.push({ id: `${p.id}:final:0`, playerId: p.id, question: 0, text: "No comment." });
      this.room.phase = "voting";
      this.room.deadline = Date.now() + 45_000;
      return;
    }
    if (this.room.phase === "voting") this.finishResults();
  }
}

export function snapshot(room: Room, viewerId: string) {
  const own = room.players.find(p => p.id === viewerId);
  const publicPlayers = room.players.map(p => ({ id: p.id, name: p.name, score: p.score, abilityPoints: p.abilityPoints, connected: Boolean(p.socketId) }));
  const dto: Record<string, unknown> = {
    roomCode: room.code, hostId: room.hostId, phase: room.phase, round: room.round,
    players: publicPlayers, prompt: room.prompt, deadline: room.deadline,
    me: own ? { id: own.id, name: own.name, score: own.score, abilityPoints: own.abilityPoints } : null,
    winnerId: room.winnerId,
    powerChooserId: room.powerChooserId,
    progress: room.phase === "answering"
      ? { submitted: room.answers.filter(a => a.playerId === viewerId).length, required: room.round < 3 ? 4 : 1 }
      : { submitted: Object.keys(room.votes).filter(k => k === viewerId || k.startsWith(`${viewerId}:`)).length, required: room.round < 3 ? Math.max(0, room.players.length - 2) * 2 : 1 },
  };
  if (room.phase === "answering") {
    dto.assignments = room.round < 3
      ? room.pairs.filter(pair => pair.playerIds.includes(viewerId)).flatMap(pair =>
        pair.prompts.map((prompt, question) => ({
          assignmentId: `${pair.id}:${question}`, prompt, question,
          answer: room.answers.find(a => a.playerId === viewerId && a.pairId === pair.id && a.question === question)?.text ?? null,
        })))
      : [{ assignmentId: "final:0", prompt: room.prompt, question: 0, answer: room.answers.find(a => a.playerId === viewerId)?.text ?? null }];
  } else if (room.phase === "voting") {
    const groups = new Map<string, { matchupId: string; question: number; answers: { id: string; text: string }[] }>();
    for (const a of room.answers) if (a.playerId !== viewerId && (room.round === 3 || !room.pairs.find(pair => pair.id === a.pairId)?.playerIds.includes(viewerId))) {
      const matchupId = a.pairId ?? "final";
      const key = `${matchupId}:${a.question}`;
      const group = groups.get(key) ?? { matchupId, question: a.question, answers: [] };
      group.answers.push({ id: a.id, text: a.text }); groups.set(key, group);
    }
    dto.voteGroups = [...groups.values()].map(g => ({ ...g, voted: Boolean(room.votes[room.round === 3 ? viewerId : `${viewerId}:${g.matchupId}:${g.question}`]) }));
  } else if (room.phase === "results" || room.phase === "gameOver") {
    dto.results = {
      winnerId: room.winnerId, roastLine: room.roastLine,
      answers: room.answers.map(a => ({ id: a.id, authorId: a.playerId, authorName: room.players.find(p => p.id === a.playerId)?.name, text: a.text, votes: Object.values(room.votes).filter(v => v === a.id).length })),
      leaderboard: [...publicPlayers].sort((a, b) => b.score - a.score),
    };
  }
  if (room.phase === "powerSelect" && room.powerChooserId === viewerId) {
    dto.powerTargets = publicPlayers.filter(player => player.id !== viewerId);
  }
  if ((room.phase === "powerReveal" || room.phase === "answering") && room.modifier && (room.powerChooserId === viewerId || room.modifier.targetPlayerId === viewerId)) {
    dto.modifier = room.modifier;
  }
  return dto;
}