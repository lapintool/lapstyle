import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeExpandConfig } from "../src/js/expand.js";

const CORNERS = ["tl", "tr", "bl", "br"];
const EDGES = ["t", "r", "b", "l"];
const ALL = [...CORNERS, ...EDGES, "float"];

function allowed({ expand, collapse, floatAnchor }) {
  if (collapse === "float") return expand === "float" && CORNERS.includes(floatAnchor);
  if (floatAnchor !== "") return false;
  if (EDGES.includes(collapse)) return expand === collapse;
  return expand === collapse || (EDGES.includes(expand) && collapse.includes(expand));
}

describe("normalizeExpandConfig", () => {
  it("defaults to tr / tr", () => {
    const c = normalizeExpandConfig();
    assert.equal(c.expand, "tr");
    assert.equal(c.collapse, "tr");
    assert.deepEqual(c.issues, []);
  });

  it("derives collapse from expand instead of falling back to tr", () => {
    const c = normalizeExpandConfig({ expand: "bl" });
    assert.equal(c.collapse, "bl");
    assert.equal(c.expand, "bl");
    assert.deepEqual(c.issues, []);
  });

  it("keeps valid corner + adjacent edge pairs", () => {
    for (const [collapse, expand] of [["tr", "t"], ["tr", "r"], ["bl", "b"], ["bl", "l"]]) {
      const c = normalizeExpandConfig({ collapse, expand });
      assert.equal(c.expand, expand, `${collapse}/${expand}`);
      assert.deepEqual(c.issues, []);
    }
  });

  it("falls back to collapse for mismatched expand", () => {
    const c = normalizeExpandConfig({ collapse: "tr", expand: "b" });
    assert.equal(c.expand, "tr");
    assert.equal(c.issues.length, 1);
    assert.equal(normalizeExpandConfig({ collapse: "r", expand: "tr" }).expand, "r");
  });

  it("drops unknown values", () => {
    const c = normalizeExpandConfig({ collapse: "middle", expand: "up" });
    assert.equal(c.collapse, "tr");
    assert.equal(c.expand, "tr");
    assert.equal(c.issues.length, 2);
  });

  it("forces float on both sides and validates the anchor", () => {
    const c = normalizeExpandConfig({ collapse: "tr", expand: "float", floatAnchor: "middle" });
    assert.equal(c.collapse, "float");
    assert.equal(c.expand, "float");
    assert.equal(c.floatAnchor, "br");
    assert.equal(normalizeExpandConfig({ expand: "float", floatAnchor: "TL" }).floatAnchor, "tl");
  });

  it("ignores floatAnchor outside float", () => {
    const c = normalizeExpandConfig({ collapse: "tl", floatAnchor: "tl" });
    assert.equal(c.floatAnchor, "");
    assert.equal(c.issues.length, 1);
  });

  it("every input combination lands on an allowed layout", () => {
    const values = ["", "bogus", ...ALL];
    for (const collapse of values) {
      for (const expand of values) {
        for (const floatAnchor of ["", "x", ...CORNERS]) {
          const c = normalizeExpandConfig({ collapse, expand, floatAnchor });
          assert.ok(allowed(c), JSON.stringify({ collapse, expand, floatAnchor, out: c }));
        }
      }
    }
  });

  it("accepts pixel sizes only", () => {
    assert.equal(normalizeExpandConfig({ openWidth: 168 }).openWidth, 168);
    assert.equal(normalizeExpandConfig({ openWidth: "168" }).openWidth, 168);
    assert.equal(normalizeExpandConfig({ openWidth: "168px" }).openWidth, 168);
    for (const bad of ["50%", "10rem", -5, 0, "abc"]) {
      const c = normalizeExpandConfig({ openWidth: bad });
      assert.equal(c.openWidth, null, String(bad));
      assert.equal(c.issues.length, 1, String(bad));
    }
  });

  it("ignores the size the mode does not use", () => {
    const top = normalizeExpandConfig({ collapse: "tr", expand: "t", openWidth: 300, openHeight: 120 });
    assert.equal(top.openWidth, null);
    assert.equal(top.openHeight, 120);
    const side = normalizeExpandConfig({ collapse: "r", openWidth: 200, openHeight: 90 });
    assert.equal(side.openWidth, 200);
    assert.equal(side.openHeight, null);
  });
});
