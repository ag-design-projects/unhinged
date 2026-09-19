export type Player = { id: string; name: string; score: number; color: string };
export type Power = { id: "word" | "persona" | "emoji"; title: string; description: string; cost: number; value: string };

export const initialPlayers: Player[] = [
  { id: "you", name: "Amogh", score: 1920, color: "#3DFFFF" },
  { id: "priya", name: "Priya", score: 2840, color: "#FF3DBA" },
  { id: "rahul", name: "Rahul", score: 2510, color: "#00FF85" },
  { id: "sarah", name: "Sarah", score: 1640, color: "#FFE500" },
];

export const powers: Power[] = [
  { id: "word", title: "USE THIS WORD", description: "Force a word into an answer.", cost: 1, value: "SYNERGY" },
  { id: "persona", title: "ANSWER AS A...", description: "Change the personality.", cost: 1, value: "DESPERATELY OPTIMISTIC CEO" },
  { id: "emoji", title: "EMOJI ONLY", description: "No words allowed.", cost: 2, value: "CALENDAR / PANIC / FIRE / DECLINE" },
];

export const r1Prompt = "THE CALL WILL DEFINITELY _______";
export const r2Prompt = "Your team missed the deadline. Explain why it was actually strategically successful.";
export const finalPrompt = "Convince the board that your team's biggest failure was actually a strategic success.";