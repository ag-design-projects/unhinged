import assert from "node:assert/strict";
import test from "node:test";
import { GameEngine, snapshot, type Player } from "./engine";
import { curatedPrompts } from "./prompts";

const player = (id: string): Player => ({ id, name: id, score: 0, abilityPoints: 0 });
const started = () => {
  const game = new GameEngine("TEST", player("a"), () => 0);
  game.addPlayer(player("b")); game.addPlayer(player("c")); game.start("a");
  return game;
};

test("creates exactly n pair sets and four answers per player", () => {
  const game = started();
  assert.equal(game.room.pairs.length, 3);
  for (const pair of game.room.pairs) for (const id of pair.playerIds) for (let q = 0; q < 2; q++) game.answer(id, `${id}${q}`, pair.id, q);
  assert.equal(game.room.answers.length, 12);
  assert.equal(game.room.phase, "voting");
});

test("voting snapshots never expose the viewer's own answer", () => {
  const game = started();
  for (const pair of game.room.pairs) for (const id of pair.playerIds) for (let q = 0; q < 2; q++) game.answer(id, `${id}${q}`, pair.id, q);
  const view = snapshot(game.room, "a");
  const groups = view.voteGroups as Array<{ answers: Array<{ id: string; text: string }> }>;
  assert.equal(groups.flatMap(group => group.answers).some(answer => answer.text.startsWith("a")), false);
  assert.equal(groups.every(group => group.answers.length === 2), true);
  assert.equal(groups.length, 2);
  const review = view.answerList as Array<{ authorId: string; prompt: string; text: string; submitted: boolean }>;
  assert.equal(review.length, 12);
  assert.equal(review.filter(a => a.authorId === "a").length, 4);
  assert.equal(review.every(a => a.prompt && a.submitted), true);
  assert.throws(() => game.vote("a", game.room.answers.find(a => a.playerId === "a")!.id), /Invalid or private vote/);
  game.vote("a", groups[0].answers[0].id);
  assert.deepEqual(snapshot(game.room, "a").answerList, review);
  game.timeout();
  const results = (snapshot(game.room, "a").results as { answers: Array<{ authorId: string; text: string; votes: number; submitted: boolean }> }).answers;
  assert.equal(results.length, 12);
  assert.equal(results.filter(a => a.authorId === "a").length, 4);
  assert.equal(results.every(a => a.submitted && a.text !== ""), true);
});

test("scores use 100 points per vote and award ability points", () => {
  const game = started();
  for (const pair of game.room.pairs) for (const id of pair.playerIds) for (let q = 0; q < 2; q++) game.answer(id, `${id}${q}`, pair.id, q);
  for (const voter of ["a", "b", "c"]) {
    const groups = snapshot(game.room, voter).voteGroups as Array<{ answers: Array<{ id: string }> }>;
    for (const group of groups) game.vote(voter, group.answers[0].id);
  }
  assert.ok(game.room.players.some(p => p.score > 0));
  assert.equal(game.room.players.find(p => p.id === game.room.winnerId)?.abilityPoints, 2);
});

test("rejects answers outside the player's server-owned assignments", () => {
  const game = started();
  const foreignPair = game.room.pairs.find(pair => !pair.playerIds.includes("a"));
  assert.ok(foreignPair);
  assert.throws(() => game.answer("a", "forged", foreignPair.id, 0), /Invalid answer assignment/);
  assert.throws(() => game.answer("a", "forged", game.room.pairs[0].id, 9), /Invalid answer assignment/);
  assert.equal(game.room.answers.length, 0);
});

test("answer timeout opens voting and vote timeout preserves real votes", () => {
  const game = started();
  const pair = game.room.pairs.find(p => p.playerIds.includes("a"))!;
  game.answer("a", "No comment.", pair.id, 0);
  game.timeout();
  assert.equal(game.room.phase, "voting");
  assert.equal(game.room.answers.length, 12);
  const view = snapshot(game.room, "b");
  const review = view.answerList as Array<{ id: string; authorId: string; text: string; submitted: boolean }>;
  assert.equal(review.length, 12);
  assert.equal(review.find(a => a.authorId === "a" && a.text === "No comment.")?.submitted, true);
  assert.equal(review.filter(a => !a.submitted && a.text === "").length, 11);
  const missedId = review.find(a => !a.submitted)!.id;
  assert.equal((view.voteGroups as Array<{ answers: Array<{ id: string }> }>).flatMap(g => g.answers).some(a => a.id === missedId), false);
  assert.throws(() => game.vote("b", missedId), /Invalid or private vote/);
  game.vote("c", game.room.answers.find(a => a.text === "No comment.")!.id);
  const chosen = Object.values(game.room.votes)[0];
  game.timeout();
  assert.equal(game.room.phase, "results");
  assert.equal(Object.values(game.room.votes).length, 1);
  assert.equal(Object.values(game.room.votes)[0], chosen);
  const results = (snapshot(game.room, "a").results as { answers: Array<{ text: string; submitted: boolean; votes: number }> }).answers;
  assert.equal(results.length, 12);
  assert.equal(results.find(a => a.text === "No comment.")?.votes, 1);
  assert.equal(results.filter(a => !a.submitted).length, 11);
});

test("final-round spectators can review their own answer without voting for it", () => {
  const game = started();
  game.room.round = 3;
  game.room.phase = "answering";
  game.room.pairs = [];
  game.room.prompt = "Final ______.";
  game.answer("a", "mine");
  game.answer("b", "theirs");
  game.answer("c", "third");
  const view = snapshot(game.room, "a");
  assert.equal((view.answerList as Array<{ text: string }>).some(a => a.text === "mine"), true);
  assert.equal((view.voteGroups as Array<{ answers: Array<{ text: string }> }>)[0].answers.some(a => a.text === "mine"), false);
  assert.throws(() => game.vote("a", "a:final:0"), /Invalid or private vote/);
});

test("eight-player matches draw unique questions across all rounds, restore, and reset on rematch", () => {
  const game = new GameEngine("FULL", player("p0"), () => 0);
  for (let i = 1; i < 8; i++) game.addPlayer(player(`p${i}`));
  game.start("p0");
  const first = game.room.pairs.flatMap(pair => pair.prompts);
  assert.equal(first.length, 16);
  assert.equal(new Set(first).size, 16);
  for (const p of game.room.players) {
    const assignments = snapshot(game.room, p.id).assignments as Array<{ prompt: string }>;
    assert.equal(new Set(assignments.map(a => a.prompt)).size, 4);
  }

  game.timeout(); game.timeout(); game.next();
  const chooser = game.room.powerChooserId!;
  game.choosePower(chooser, "word", game.room.players.find(p => p.id !== chooser)!.id);
  game.next();
  const second = game.room.pairs.flatMap(pair => pair.prompts);
  assert.equal(new Set([...first, ...second]).size, 32);

  // History survives a server restart before the final round.
  const restored = GameEngine.restore(structuredClone(game.room), () => 0);
  restored.timeout(); restored.timeout(); restored.next();
  const secondChooser = restored.room.powerChooserId!;
  restored.choosePower(secondChooser, "word", restored.room.players.find(p => p.id !== secondChooser)!.id);
  restored.next();
  assert.ok(restored.room.prompt);
  assert.equal(new Set([...first, ...second, restored.room.prompt]).size, 33);
  assert.equal(restored.room.usedPrompts?.length, 33);
  restored.timeout(); restored.timeout(); restored.next();
  restored.rematch("p0");
  assert.deepEqual(restored.room.usedPrompts, []);
  restored.start("p0");
  assert.equal(restored.room.pairs.length, 8);
  assert.equal(new Set(restored.room.pairs.flatMap(pair => pair.prompts)).size, 16);
});

test("exhausted curated prompts replenish, and a broken source uses validated fallback without blocking", () => {
  const game = new GameEngine("FALLBACK", player("a"), () => 0, undefined, () => {
    throw new Error("Source unavailable");
  });
  game.addPlayer(player("b")); game.addPlayer(player("c"));
  game.room.usedPrompts = [...curatedPrompts];
  game.start("a");
  const first = game.room.pairs.flatMap(pair => pair.prompts);
  assert.equal(first.length, 6);
  assert.equal(new Set(first).size, 6);
  assert.equal(first.some(prompt => curatedPrompts.includes(prompt as typeof curatedPrompts[number])), false);
  game.timeout(); game.timeout(); game.next();
  const chooser = game.room.powerChooserId!;
  game.choosePower(chooser, "word", game.room.players.find(p => p.id !== chooser)!.id);
  game.next();
  assert.equal(new Set([...first, ...game.room.pairs.flatMap(pair => pair.prompts)]).size, 12);

  const invalid = new GameEngine("INVALID", player("a"), () => 0, undefined,
    () => ["No blank", "Bad\n______", "Valid ______.", "Valid ______."]);
  invalid.addPlayer(player("b")); invalid.addPlayer(player("c"));
  invalid.room.usedPrompts = [...curatedPrompts];
  invalid.start("a");
  assert.equal(invalid.room.pairs.flatMap(pair => pair.prompts).filter(prompt => prompt === "Valid ______.").length, 1);
  assert.equal(new Set(invalid.room.pairs.flatMap(pair => pair.prompts)).size, 6);
});