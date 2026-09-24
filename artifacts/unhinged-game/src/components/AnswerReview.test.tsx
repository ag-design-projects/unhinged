import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnswerReview } from "./AnswerReview";

const answers = [
  { id: "mine", authorId: "a", authorName: "Alex", prompt: "The ______.", text: "No comment.", submitted: true, votes: 2 },
  { id: "missed", authorId: "b", authorName: "Blair", prompt: "The ______.", text: "", submitted: false, votes: 0 },
];

test("voting review shows own real text and missed status without vote controls", () => {
  const html = renderToStaticMarkup(createElement(AnswerReview, { answers, viewerId: "a" }));
  assert.match(html, /No comment/);
  assert.match(html, /Yours/);
  assert.match(html, /Not submitted/);
  assert.match(html, /For review only/);
  assert.doesNotMatch(html, /<button/);
  assert.doesNotMatch(html, /Blair/);
});

test("results review shows every author and vote total, including missed responses", () => {
  const html = renderToStaticMarkup(createElement(AnswerReview, { answers, viewerId: "a", showVotes: true }));
  assert.match(html, /Alex/);
  assert.match(html, /Blair/);
  assert.match(html, /2 votes/);
  assert.match(html, /0 votes/);
  assert.doesNotMatch(html, /<button/);
});