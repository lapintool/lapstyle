import assert from "node:assert/strict";
import test from "node:test";
import {
  extractChangelogSection,
  isPrerelease,
  listChangelogSections,
  normalizeVersion,
  tagForVersion,
  tidyNotes,
} from "../scripts/changelog-section.mjs";

const sample = [
  "# Changelog",
  "",
  "## Unreleased",
  "",
  "## 0.5.2-alpha",
  "",
  "### Added",
  "",
  "- Type scale \\`data-ls-scale\\`",
  "",
  "## 0.5.1-alpha",
  "",
  "- Menu shorthand",
  "",
].join("\n");

test("normalizeVersion strips v prefix", () => {
  assert.equal(normalizeVersion("v0.5.2-alpha"), "0.5.2-alpha");
  assert.equal(tagForVersion("0.5.2-alpha"), "v0.5.2-alpha");
});

test("isPrerelease detects alpha", () => {
  assert.equal(isPrerelease("0.5.2-alpha"), true);
  assert.equal(isPrerelease("0.4.0"), false);
});

test("listChangelogSections skips Unreleased", () => {
  const list = listChangelogSections(sample);
  assert.deepEqual(
    list.map((s) => s.version),
    ["0.5.2-alpha", "0.5.1-alpha"],
  );
});

test("extractChangelogSection returns tidy notes", () => {
  const section = extractChangelogSection("0.5.2-alpha", sample);
  assert.match(section.notes, /^## 0\.5\.2-alpha\n/);
  assert.match(section.notes, /Type scale `data-ls-scale`/);
  assert.doesNotMatch(section.notes, /\\`/);
});

test("tidyNotes unescapes backticks", () => {
  assert.equal(tidyNotes("use \\`x\\`"), "use `x`\n");
});
