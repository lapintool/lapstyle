import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Lapstyle, * as api from "../src/lapstyle.js";

describe("public export surface", () => {
  it("exposes the color picker API", () => {
    for (const name of [
      "enhance",
      "destroy",
      "initColorPicker",
      "destroyColorPicker",
      "setPickerValue",
    ]) {
      assert.equal(typeof api[name], "function", `api.${name}`);
      assert.equal(typeof Lapstyle[name], "function", `Lapstyle.${name}`);
    }
  });

  it("default export mirrors the named exports", () => {
    assert.equal(Lapstyle.enhance, api.enhance);
    assert.equal(Lapstyle.setPickerValue, api.setPickerValue);
    assert.equal(Lapstyle.initColorPicker, api.initColorPicker);
    assert.equal(Lapstyle.destroyColorPicker, api.destroyColorPicker);
  });
});
