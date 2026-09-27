/**
 * Create GitHub Releases from CHANGELOG.md sections (tags must already exist).
 *
 * Usage:
 *   node scripts/github-release.mjs                 # package.json version
 *   node scripts/github-release.mjs 0.5.2-alpha
 *   node scripts/github-release.mjs --all           # every CHANGELOG version that has a matching git tag
 *   node scripts/github-release.mjs --dry-run
 *   node scripts/github-release.mjs --all --dry-run
 *
 * Requires: `gh` authenticated to the repo remote (lapintool/lapstyle).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractChangelogSection,
  isPrerelease,
  listChangelogSections,
  normalizeVersion,
  tagForVersion,
} from "./changelog-section.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    ...opts,
  });
  return r;
}

function whichGh() {
  const probe = spawnSync(process.platform === "win32" ? "where.exe" : "which", ["gh"], {
    encoding: "utf8",
  });
  if (probe.status === 0) {
    const first = String(probe.stdout || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find(Boolean);
    if (first) return first;
  }
  const candidates = [
    path.join(process.env.ProgramFiles || "C:\\Program Files", "GitHub CLI", "gh.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Programs", "GitHub CLI", "gh.exe"),
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  return null;
}

function gitTags() {
  const r = run("git", ["tag", "-l", "v*"]);
  if (r.status !== 0) throw new Error(r.stderr || "git tag failed");
  return new Set(
    String(r.stdout || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function releaseExists(gh, tag) {
  const r = run(gh, ["release", "view", tag], { stdio: ["ignore", "pipe", "pipe"] });
  return r.status === 0;
}

function createRelease(gh, { version, dryRun }) {
  const section = extractChangelogSection(version);
  const tag = tagForVersion(version);
  const title = section.heading;
  const notesPath = path.join(os.tmpdir(), `lapstyle-release-${tag}.md`);
  fs.writeFileSync(notesPath, section.notes, "utf8");

  const args = [
    "release",
    "create",
    tag,
    "--title",
    title,
    "--notes-file",
    notesPath,
  ];
  if (isPrerelease(version)) args.push("--prerelease");

  if (dryRun) {
    console.log(`[dry-run] gh ${args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(" ")}`);
    console.log("--- notes ---");
    process.stdout.write(section.notes);
    console.log("-------------");
    return { tag, created: false, dryRun: true };
  }

  const r = run(gh, args, { stdio: "inherit" });
  try {
    fs.unlinkSync(notesPath);
  } catch {
    /* ignore */
  }
  if (r.status !== 0) {
    throw new Error(`gh release create ${tag} failed (exit ${r.status})`);
  }
  return { tag, created: true, dryRun: false };
}

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("-")));
  const positional = argv.filter((a) => !a.startsWith("-"));
  return {
    all: flags.has("--all"),
    dryRun: flags.has("--dry-run"),
    version: normalizeVersion(positional[0] || ""),
  };
}

function main(argv) {
  const { all, dryRun, version } = parseArgs(argv);
  const gh = whichGh();
  if (!gh) {
    throw new Error("GitHub CLI (`gh`) not found. Install: winget install GitHub.cli");
  }

  const tags = gitTags();
  let versions;
  if (all) {
    versions = listChangelogSections()
      .map((s) => s.version)
      .filter((v) => tags.has(tagForVersion(v)));
    if (!versions.length) {
      throw new Error("No CHANGELOG versions match existing v* tags");
    }
  } else {
    const v = version || pkg.version;
    const tag = tagForVersion(v);
    if (!tags.has(tag)) {
      throw new Error(`Missing git tag ${tag}. Push the tag before creating a Release.`);
    }
    versions = [v];
  }

  const results = [];
  for (const v of versions) {
    const tag = tagForVersion(v);
    if (!dryRun && releaseExists(gh, tag)) {
      console.log(`skip ${tag} (release already exists)`);
      results.push({ tag, created: false, skipped: true });
      continue;
    }
    if (dryRun && releaseExists(gh, tag)) {
      console.log(`[dry-run] would skip ${tag} (release already exists)`);
      results.push({ tag, created: false, skipped: true, dryRun: true });
      continue;
    }
    results.push(createRelease(gh, { version: v, dryRun }));
  }

  const created = results.filter((r) => r.created).length;
  const skipped = results.filter((r) => r.skipped).length;
  console.log(
    dryRun
      ? `dry-run done: ${results.length} version(s), ${skipped} would skip`
      : `done: created ${created}, skipped ${skipped}`,
  );
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
