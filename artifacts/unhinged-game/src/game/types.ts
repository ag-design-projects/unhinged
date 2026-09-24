export type Phase = "lobby" | "answering" | "voting" | "results" | "powerSelect" | "powerReveal" | "gameOver";
export type PowerType = "word" | "persona" | "emoji";

export interface Player { id: string; name: string; score: number; abilityPoints: number; connected?: boolean }
export interface Assignment { assignmentId: string; prompt: string; question: number; answer: string | null }
export interface VoteGroup { matchupId: string; question: number; answers: { id: string; text: string }[]; voted: boolean }
export interface AnswerEntry { id: string; authorId: string; authorName?: string; prompt?: string; text: string; submitted: boolean }
export interface Results {
  winnerId?: string; roastLine: string | null;
  answers: (AnswerEntry & { votes: number })[];
  leaderboard: Player[];
}
export interface Snapshot {
  roomCode: string; hostId: string; phase: Phase; round: number;
  players: Player[]; prompt?: string; deadline?: number; avoidRecentPrompts: boolean;
  me: Player | null;
  progress: { submitted: number; required: number };
  assignments?: Assignment[]; voteGroups?: VoteGroup[]; answerList?: AnswerEntry[]; results?: Results;
  modifier?: { type: PowerType; value: string; targetPlayerId: string } | null;
  powerChooserId?: string; powerChoice?: PowerType;
}