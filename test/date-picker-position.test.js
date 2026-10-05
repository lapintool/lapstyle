import assert from "node:assert/strict";
import { test } from "node:test";
import { placeDatePicker } from "../src/js/date-picker.js";

test("picker flips above an input near the bottom of the viewport", () => {
  const result = placeDatePicker({ left: 400, right: 650, top: 650, bottom: 678 }, { width: 383, height: 255 }, { width: 1280, height: 720 });
  assert.equal(result.placement, "top-start");
  assert.ok(result.top + 255 < 650);
});

test("picker opens below when there is room, aligned to the right at the viewport edge", () => {
  const result = placeDatePicker({ left: 850, right: 990, top: 100, bottom: 128 }, { width: 383, height: 255 }, { width: 1000, height: 720 });
  assert.equal(result.placement, "bottom-end");
  assert.ok(result.top > 128);
  assert.ok(result.left + result.width <= 992);
});

test("oversized panels and partially offscreen anchors stay within the viewport", () => {
  const viewport = { width: 320, height: 480 };
  for (const anchor of [
    { left: 290, right: 450, top: 250, bottom: 278 },
    { left: -50, right: 200, top: 20, bottom: 48 },
  ]) {
    const result = placeDatePicker(anchor, { width: 500, height: 600 }, viewport);
    assert.ok(result.left >= 8);
    assert.ok(result.left + result.width <= 312);
    assert.ok(result.top >= 8);
    assert.ok(result.top + result.maxHeight <= 472);
  }
});
