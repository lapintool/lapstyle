/**
 * Generate AI-facing docs + Vue .d.ts from src/vue/api-spec.js
 * Usage: node scripts/render-ai-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  COMPONENT_ORDER,
  vueComponents,
} from "../src/vue/api-spec.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const installCmd = `pnpm add github:lapintool/lapstyle#v${pkg.version}`;
const docsDir = path.join(root, "docs");
const componentsDir = path.join(docsDir, "components");

function escCell(text) {
  return String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function escType(type) {
  return `\`${String(type).replace(/\|/g, "\\|")}\``;
}

function mdTable(headers, rows) {
  if (!rows.length) return "";
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
  return `${head}\n${sep}\n${body}\n`;
}

function componentMarkdown(spec) {
  const props = spec.props.length
    ? `### Props\n\n${mdTable(
        ["Name", "Type", "Default", "Description"],
        spec.props.map((p) => [
          `\`${p.name}\``,
          escType(p.type),
          p.required ? "required" : p.default ? `\`${escCell(p.default)}\`` : "—",
          escCell(p.desc),
        ]),
      )}`
    : "";
  const events = spec.events.length
    ? `### Events\n\n${mdTable(
        ["Name", "Payload", "Description"],
        spec.events.map((e) => [
          `\`${e.name}\``,
          e.payload ? escType(e.payload) : "—",
          escCell(e.desc),
        ]),
      )}`
    : "";
  const slots = spec.slots.length
    ? `### Slots\n\n${mdTable(
        ["Name", "Description"],
        spec.slots.map((s) => [`\`${s.name}\``, escCell(s.desc)]),
      )}`
    : "";
  const patterns = spec.patterns?.length
    ? `### Pitfalls\n\n${spec.patterns.map((p) => `- ${p}`).join("\n")}\n`
    : "";

  const sections = [props, events, slots, patterns].filter(Boolean).join("\n");

  return `# ${spec.name} (\`${spec.tag}\`)

${spec.summary}

Import: \`import { ${spec.name} } from "lapstyle/vue"\` (or \`app.use(LapstyleVue)\`).

## Minimal usage

\`\`\`vue
${spec.minimal}
\`\`\`

${sections}
## CSS root

\`${spec.cssRoot}\` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read \`src/vue/${spec.name}.vue\` next. Do not copy class-only demo HTML unless you are on the framework-free path (\`docs/enhance.md\`).
`;
}

function gettingStarted() {
  return `# Getting started

Lapstyle is a **desktop Vue UI kit**. Default path: \`Ls*\` / \`ls-*\` components with \`v-model\`, events, and slots.

Do **not** start from class HTML + \`enhance()\` unless the app has no Vue.

## Install

\`\`\`bash
${installCmd}
\`\`\`

Peer: \`vue\` \`^3.4\` (required only when using \`lapstyle/vue\`).

## Setup

\`\`\`ts
import { createApp } from "vue";
import { LapstyleVue } from "lapstyle/vue";
import "lapstyle/index.css";
import App from "./App.vue";

const app = createApp(App);
app.use(LapstyleVue);
app.mount("#app");
\`\`\`

On demand:

\`\`\`ts
import { LsBtn, LsDialog } from "lapstyle/vue";
\`\`\`

Scaffold: \`pnpm dlx https://github.com/lapintool/create-lapstyle my-app\`

## Theme

Set \`data-theme\` on \`<html>\`: \`dark\` (default) | \`light\` | \`mint\` | \`sky\` | \`pink\` | \`brown\` | \`amber\`.
See \`docs/theming.md\`.

## How to use these docs

1. This file for install.
2. \`docs/llms.txt\` as the index.
3. \`docs/components/<tag>.md\` for one component (props / events / slots / pitfalls).
4. \`docs/llms-full.txt\` to ingest everything at once.
5. TypeScript: \`lapstyle/vue\` (\`src/vue/index.d.ts\`).
6. Source (\`src/vue/*.vue\`, \`src/js/*.js\`) only if the docs and types are not enough.

Tags are kebab-case (\`<ls-dialog>\`); exports are PascalCase (\`LsDialog\`).
`;
}

function theming() {
  return `# Theming

Set the theme on the document:

\`\`\`html
<html data-theme="dark">
\`\`\`

Values: \`dark\` | \`light\` | \`mint\` | \`sky\` | \`pink\` | \`brown\` | \`amber\`.
\`dark\` is charcoal; the others are light surfaces.

Import tokens once:

\`\`\`ts
import "lapstyle/index.css";
\`\`\`

Or per-file (tokens first):

\`\`\`ts
import "lapstyle/tokens.css";
import "lapstyle/button.css";
\`\`\`

Default \`<ls-btn>\` (no color word) uses \`--ls-accent\` / \`--ls-accent-on\` for the **current theme**. \`.gray\` / \`color="gray"\` is a fixed gray, not the accent.

Do not invent Quasar / other-library token names. Customize via \`--ls-*\` in \`src/tokens.css\`.
`;
}

function enhanceDoc() {
  return `# Framework-free path (enhance)

Use this only when there is **no Vue**. Vue apps should import \`lapstyle/vue\`; those wrappers call \`enhance\` internally.

\`\`\`ts
import "lapstyle/index.css";
import { enhance, destroy } from "lapstyle";

enhance(document);
// SPA unmount:
destroy(document);
\`\`\`

Without a bundler:

\`\`\`html
<script type="module">
  import "lapstyle/index.css";
  import "lapstyle/auto";
</script>
\`\`\`

\`<html data-ls-no-auto>\` skips automatic \`enhance\`. You can still call \`window.Lapstyle.enhance\`.

Markup is CSS classes (\`.ls-btn\`, \`.ls-dialog\`, …), not \`<ls-*>\` tags. Interactive widgets listen for custom events such as \`ls-dialog:action\`, \`ls-menu:select\`, \`ls-tabs:change\`, \`ls-slider:change\`.

Scrollbar: add \`class="ls-scroll"\` to an overflowing container. There is no \`LsScroll\` component.

If you need a Vue example, leave this file and read \`docs/components/*.md\`.
`;
}

function scrollbarDoc() {
  return `# Scrollbar (\`.ls-scroll\`)

CSS-only. There is **no** \`LsScroll\` / \`<ls-scroll>\` component.

\`\`\`html
<div class="ls-scroll" style="max-height: 160px">
  …overflowing content…
</div>
\`\`\`

Class: \`.ls-scroll\` — thin scrollbar, fades in on hover.

In Vue, put \`class="ls-scroll"\` on any overflowing host (including \`ls-menu\` / dropdown menus, which already include it where needed).
`;
}

function llmsTxt(indexLines) {
  return `# Lapstyle

> Desktop Vue UI kit. Use Ls* / ls-* components (v-model, events, slots). CSS tokens are the look layer.

Install: \`${installCmd}\`
Setup: \`app.use(LapstyleVue)\` and \`import "lapstyle/index.css"\`.
Theme: \`<html data-theme="dark|light|mint|sky|pink|brown|amber">\`.

Read these files in the installed package (paths relative to the package root):

${indexLines}

Rules for coding agents:
- Prefer \`<ls-*>\` from \`lapstyle/vue\`. Do not copy class HTML from demos.
- \`enhance()\` is for pages without Vue. See \`docs/enhance.md\`.
- Default button color follows \`--ls-accent\`; do not hardcode gray unless asked.
- If a component page is not enough, read \`src/vue/<Name>.vue\` next, then \`src/js/\`.
`;
}

function dtsType(type) {
  return type;
}

function dtsPayload(payload) {
  const text = payload.trim();
  if (text.startsWith("{")) return "Record<string, unknown>";
  if (text === "MouseEvent") return "MouseEvent";
  return text;
}

function emitSig(event) {
  const name = JSON.stringify(event.name);
  if (!event.payload) return `(e: ${name}): void`;
  return `(e: ${name}, value: ${dtsPayload(event.payload)}): void`;
}

function renderIndexDts() {
  const blocks = COMPONENT_ORDER.map((name) => {
    const spec = vueComponents[name];
    const propsName = `${name}Props`;
    const emitsName = `${name}Emits`;
    const slotsName = `${name}Slots`;
    const propLines = spec.props
      .map((p) => {
        const opt = p.required ? "" : "?";
        return `  ${p.name}${opt}: ${dtsType(p.type)};`;
      })
      .join("\n");
    const emitsType = spec.events.length
      ? `export type ${emitsName} = {
${spec.events.map((e) => `  ${emitSig(e)};`).join("\n")}
};`
      : `export type ${emitsName} = Record<string, never>;`;

    const slotLines = spec.slots
      .map((s) => {
        const key = s.name.includes("/") ? `"${s.name.split("/")[0].trim()}"` : s.name === "default" ? "default" : s.name;
        const ident = /^[A-Za-z_]\w*$/.test(key) ? key : JSON.stringify(key);
        return `  ${ident}?: () => unknown;`;
      })
      .join("\n");
    return `export interface ${propsName} {
${propLines || "  [key: string]: unknown;"}
}

${emitsType}

export interface ${slotsName} {
${slotLines || "  default?: () => unknown;"}
}

export declare const ${name}: DefineComponent<${propsName}>;
`;
  });

  return `import type { App, Component, DefineComponent } from "vue";

${blocks.join("\n")}
export declare const components: {
  ${COMPONENT_ORDER.map((n) => `${n}: typeof ${n};`).join("\n  ")}
};

export declare const LapstyleVue: {
  install(app: App): void;
};

export default LapstyleVue;
`;
}

function writeFile(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const next = body.endsWith("\n") ? body : `${body}\n`;
  fs.writeFileSync(file, next);
}

const extras = [
  { file: "getting-started.md", title: "Getting started", body: gettingStarted() },
  { file: "theming.md", title: "Theming", body: theming() },
  { file: "enhance.md", title: "Framework-free enhance", body: enhanceDoc() },
  { file: "components/scrollbar.md", title: "Scrollbar", body: scrollbarDoc() },
];

fs.mkdirSync(componentsDir, { recursive: true });

const componentFiles = COMPONENT_ORDER.map((name) => {
  const spec = vueComponents[name];
  const rel = `components/${spec.tag}.md`;
  writeFile(path.join(docsDir, rel), componentMarkdown(spec));
  return { rel, title: `${spec.name} (${spec.tag})` };
});

for (const extra of extras) {
  writeFile(path.join(docsDir, extra.file), extra.body);
}

const indexLines = [
  `- Getting started: docs/getting-started.md`,
  `- Theming: docs/theming.md`,
  `- Full pack: docs/llms-full.txt`,
  `- Types: src/vue/index.d.ts`,
  ...componentFiles.map((c) => `- ${c.title}: docs/${c.rel}`),
  `- Scrollbar (CSS only): docs/components/scrollbar.md`,
  `- Framework-free: docs/enhance.md`,
].join("\n");

writeFile(path.join(docsDir, "llms.txt"), llmsTxt(indexLines));

const full = [
  gettingStarted(),
  theming(),
  ...COMPONENT_ORDER.map((name) => componentMarkdown(vueComponents[name])),
  scrollbarDoc(),
  enhanceDoc(),
].join("\n---\n\n");

writeFile(path.join(docsDir, "llms-full.txt"), `# Lapstyle — full AI pack\n\n${full}`);
writeFile(path.join(root, "src/vue/index.d.ts"), renderIndexDts());

console.log(`Wrote ${componentFiles.length} component docs + llms.txt + index.d.ts`);
