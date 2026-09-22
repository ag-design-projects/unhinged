import assert from "node:assert/strict";
import test from "node:test";
import { GameEngine, snapshot, type Player } from "./engine";

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
  const groups = view.voteGroups as Array<{ answers: Array<{ text: string }> }>;
  assert.equal(groups.flatMap(group => group.answers).some(answer => answer.text.startsWith("a")), false);
  assert.equal(groups.every(group => group.answers.length === 2), true);
  assert.equal(groups.length, 2);
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