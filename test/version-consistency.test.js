import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version;
const tag = `v${version}`;

/** Any pin of the lapstyle repo at a version: `…lapstyle#v…` / `…lapstyle.git#v…`. */
const pinRe = /lapstyle(?:\.git)?#(v[\d.]+(?:-[\w.]+)?)/g;

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

describe("version consistency", () => {
  it("package.json and jsr.json agree", () => {
    const jsr = JSON.parse(read("jsr.json"));
    assert.equal(jsr.version, version);
  });

  it("README.md pins the current version", () => {
    const readme = read("README.md");
    assert.ok(
      readme.includes(`Current version **${version}**`),
      'README.md: update the "Current version **…**" line',
    );
    for (const [, found] of readme.matchAll(pinRe)) {
      assert.equal(found, tag, `README.md pins ${found}, expected ${tag}`);
    }
  });

  it("create-lapstyle template and docs pin the current version", {
    skip: !process.env.LAPSTYLE_SCAFFOLD_ROOT,
  }, () => {
    const scaffoldRoot = path.resolve(process.env.LAPSTYLE_SCAFFOLD_ROOT);
    for (const file of [
      "README.md",
      "README.zh.md",
      "template/package.json",
    ]) {
      const contents = fs.readFileSync(path.join(scaffoldRoot, file), "utf8");
      for (const [, found] of contents.matchAll(pinRe)) {
        assert.equal(found, tag, `${file} pins ${found}, expected ${tag}`);
      }
    }
  });

  it("generated docs were rendered after the last bump (run pnpm run docs)", () => {
    for (const file of ["docs/llms.txt", "docs/llms-full.txt", "docs/getting-started.md"]) {
      const raw = read(file);
      assert.ok(
        raw.includes(`#${tag}`),
        `${file} does not mention ${tag} — run \`pnpm run docs\` to regenerate`,
      );
      for (const [, found] of raw.matchAll(pinRe)) {
        assert.equal(found, tag, `${file} pins ${found}, expected ${tag}`);
      }
    }
  });
});
