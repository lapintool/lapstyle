import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hexToRgb,
  hsvToRgb,
  parseHex,
  rgbToHsv,
  roundToStep,
} from "../src/js/util.js";

describe("parseHex", () => {
  it("accepts 6-digit and 3-digit hex", () => {
    assert.equal(parseHex("#AbCdEf"), "#abcdef");
    assert.equal(parseHex("abc"), "#aabbcc");
    assert.equal(parseHex("#fff"), "#ffffff");
  });

  it("rejects invalid input", () => {
    assert.equal(parseHex("#zzz"), null);
    assert.equal(parseHex("not-a-color"), null);
    assert.equal(parseHex(""), null);
  });
});

describe("hexToRgb", () => {
  it("parses known colors", () => {
    assert.deepEqual(hexToRgb("#ff0000"), { r: 255, g: 0, b: 0 });
    assert.deepEqual(hexToRgb("#00ff00"), { r: 0, g: 255, b: 0 });
  });

  it("returns black for invalid input", () => {
    assert.deepEqual(hexToRgb("#zzz"), { r: 0, g: 0, b: 0 });
  });
});

describe("rgbToHsv / hsvToRgb", () => {
  it("round-trips primary colors", () => {
    for (const hex of ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000"]) {
      const rgb = hexToRgb(hex);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      const back = hsvToRgb(hsv.h, hsv.s, hsv.v);
      assert.deepEqual(back, rgb);
    }
  });
});

describe("roundToStep", () => {
  it("snaps to grid from origin", () => {
    assert.equal(roundToStep(14, 5, 0), 15);
    assert.equal(roundToStep(12, 5, 0), 10);
    assert.equal(roundToStep(13, 5, 10), 15);
  });
});
