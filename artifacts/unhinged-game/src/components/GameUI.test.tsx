import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CTA } from "./GameUI";

test("primary CTA variants use the design-system rounded Button", () => {
  for (const color of ["yellow", "pink", "cyan"] as const) {
    const html = renderToStaticMarkup(createElement(CTA, { testId: "primary", color, children: "CONTINUE" }));
    assert.match(html, /data-testid="primary"/);
    assert.match(html, /border-radius:0\.375rem/);
    assert.match(html, /width:100%/);
    assert.match(html, /CONTINUE →/);
  }
  const disabled = renderToStaticMarkup(createElement(CTA, { testId: "primary", disabled: true, children: "CONTINUE" }));
  assert.match(disabled, /border-radius:0\.375rem/);
  assert.match(disabled, /disabled=""/);
});