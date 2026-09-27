/**
 * Extract one version section from CHANGELOG.md (Keep a Changelog).
 * Usage:
 *   node scripts/changelog-section.mjs [version]
 *   node scripts/changelog-section.mjs --list
 * Default version: package.json "version".
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changelogPath = path.join(root, "CHANGELOG.md");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

export function normalizeVersion(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  return s.replace(/^v/i, "");
}

export function tagForVersion(version) {
  return `v${normalizeVersion(version)}`;
}

export function isPrerelease(version) {
  return /(?:alpha|beta|rc|pre)/i.test(normalizeVersion(version));
}

/** Fix accidental \` from some editors so Release markdown renders code spans. */
export function tidyNotes(text) {
  return `${String(text).replace(/\\`/g, "`").trimEnd()}\n`;
}

/**
 * @returns {{ version: string, heading: string, body: string, notes: string }[]}
 */
export function listChangelogSections(markdown = fs.readFileSync(changelogPath, "utf8")) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let current = null;

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (current) sections.push(finalize(current));
      current = { heading: m[1].trim(), lines: [line] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) sections.push(finalize(current));
  return sections.filter((s) => s.version && s.version.toLowerCase() !== "unreleased");
}

function finalize(section) {
  const version = normalizeVersion(section.heading);
  const notes = tidyNotes(section.lines.join("\n").replace(/^\n+/, "").replace(/\n+$/, ""));
  const body = tidyNotes(section.lines.slice(1).join("\n").replace(/^\n+/, "").replace(/\n+$/, ""));
  return { version, heading: section.heading, body, notes };
}

/**
 * @param {string} version
 * @param {string} [markdown]
 */
export function extractChangelogSection(version, markdown) {
  const want = normalizeVersion(version);
  const hit = listChangelogSections(markdown).find((s) => s.version === want);
  if (!hit) {
    throw new Error(`No "## ${want}" section in CHANGELOG.md`);
  }
  return hit;
}

function main(argv) {
  if (argv.includes("--list")) {
    for (const s of listChangelogSections()) {
      process.stdout.write(`${s.version}\n`);
    }
    return;
  }
  const version = normalizeVersion(argv.find((a) => !a.startsWith("-")) || pkg.version);
  process.stdout.write(extractChangelogSection(version).notes);
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  try {
    main(process.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}
