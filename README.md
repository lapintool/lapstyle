# Lapstyle

A desktop **Vue UI kit** with a defined Lapstyle look. Use `Ls*` components (`v-model` / events / slots). CSS tokens and class conventions remain the look layer; `enhance()` is for framework-free pages.

Current version **0.5.4-alpha**. License: MIT. Repository: https://github.com/lapintool/lapstyle

English is the default language for docs and the official demo.

## For coding agents

Do not scrape `src/vue/*.vue` first. Read the packaged docs:

1. `docs/llms.txt` — index and rules
2. `docs/getting-started.md` — install / `LapstyleVue`
3. `docs/components/<tag>.md` — one component (props / events / slots)
4. `docs/llms-full.txt` — everything in one file
5. `src/vue/index.d.ts` — TypeScript props

Prefer `<ls-*>` from `lapstyle/vue`. Class HTML + `enhance()` is the framework-free path (`docs/enhance.md`).

## Development checks

Run `npm test` for the self-contained library tests and `npm run docs` to regenerate packaged docs and Vue declarations. The official site (`../lapstyle-ui`) links this checkout and runs Vue behavior and TypeScript contract tests with `pnpm test`.

The optional scaffold version check reads a separate `create-lapstyle` checkout only when `LAPSTYLE_SCAFFOLD_ROOT` points to it. For example, `LAPSTYLE_SCAFFOLD_ROOT=../create-lapstyle npm test` on a POSIX shell, or `$env:LAPSTYLE_SCAFFOLD_ROOT = "D:\path\to\create-lapstyle"` followed by `npm test` in PowerShell. Without this variable, that integration check is skipped.

## Install

Lapstyle is available on [npm](https://www.npmjs.com/package/lapstyle). Add it to an existing project:

```bash
npm install lapstyle
```

Or with pnpm:

```bash
pnpm add lapstyle
```

The current npm release is **0.5.4-alpha**. To follow the alpha release channel, use `npm install lapstyle@alpha`; to pin this release, use `npm install lapstyle@0.5.4-alpha`.

### Vue (recommended)

Use Vue **3.4 or newer** with a Vue-capable bundler such as Vite. Import the stylesheet once in your application entry and register the components:

```ts
import { createApp } from "vue";
import { LapstyleVue } from "lapstyle/vue";
import "lapstyle/index.css";
import App from "./App.vue";

const app = createApp(App);
app.use(LapstyleVue);
app.mount("#app");
```

Or import components on demand:

```ts
import { LsBtn, LsDropdown, LsDialog } from "lapstyle/vue";
```

```vue
<template>
  <ls-btn color="blue">Save</ls-btn>
  <ls-dropdown v-model="lang" :options="['JS', 'TS']" />
  <ls-dialog v-model="open" title="Confirm">…</ls-dialog>
</template>
```

### Framework-free (class + enhance)

```ts
import "lapstyle/index.css";
import { enhance } from "lapstyle";

enhance(document);
```

For pages without a bundler, use the auto entry:

```html
<script type="module">
  import "lapstyle/index.css";
  import "lapstyle/auto";
</script>
```

`<html data-ls-no-auto>` skips automatic `enhance`. You can still call `window.Lapstyle.enhance` yourself.

## Create an app

Scaffold a Vite + Vue app from GitHub:

```bash
npm create https://github.com/lapintool/lapstyle my-app
pnpm dlx https://github.com/lapintool/create-lapstyle my-app
```

The app opens on a button page with a sidebar. `src/main.ts` imports `lapstyle/index.css` and registers `LapstyleVue`. The shell uses `<ls-menu>` / `<ls-btn-dropdown>`. To install this version directly from GitHub: `pnpm add github:lapintool/lapstyle#v0.5.4-alpha`.

Add an empty page, then paste an example into it:

```bash
pnpm add-view Expand
pnpm add-view Expand 展开面板
```

That creates `src/views/ExpandView.vue` and a sidebar item. The official demo’s **Copy example** button emits a Vue `Ls*` starter SFC.

Dark is the default theme. Set `data-theme` on the root:

```html
<html data-theme="light">
```

Type size (whole app): `data-ls-scale` on `<html>` — `sm` 14px, `md` 16px (browser default), `lg` 18px, `xl` 20px. Kit sizes are `rem`, so type, icons, and controls scale together. Page prose: `--ls-font-title` / `--ls-font-body` / `--ls-font-secondary` / `--ls-font-caption`.

```html
<html data-theme="dark" data-ls-scale="lg">
```

Named themes (all light surfaces except `dark`):

| Value | Look | Palette source |
| --- | --- | --- |
| `dark` | Default charcoal | Lapstyle |
| `light` | Neutral white | Lapstyle |
| `mint` | Pale green | [Radix Green](https://www.radix-ui.com/colors) + [Everforest](https://github.com/sainnhe/everforest) |
| `sky` | Sky blue | [Tailwind Sky](https://tailwindcss.com/docs/colors) + [Nord Frost](https://www.nordtheme.com/) |
| `pink` | Rose pink | [Rosé Pine Dawn](https://rosepinetheme.com/) |
| `brown` | Warm tan | [Gruvbox Material Light Soft](https://github.com/sainnhe/gruvbox-material) |
| `amber` | Orange-yellow | [Solarized Light](https://ethanschoonover.com/solarized/) |

Per-component CSS (import tokens first):

```ts
import "lapstyle/tokens.css";
import "lapstyle/slider.css";
import "lapstyle/progress.css";
```

Or once:

```ts
import "lapstyle/index.css";
```

## Docs

Human demo pages (interactive) live in the `lapstyle-ui` repo.

AI / machine docs ship **in this package**:

- `docs/llms.txt` — index
- `docs/llms-full.txt` — full pack
- `docs/getting-started.md`, `docs/theming.md`, `docs/enhance.md`
- `docs/components/ls-dialog.md` (and every other `ls-*` tag)

Local demo server also mirrors them at `/llms.txt` and `/docs/…`.

## Peer dependency

`vue` `^3.4` is required only when using `lapstyle/vue`. CSS-only and `enhance()` consumers can omit it (`peerDependenciesMeta.optional`).

## Releases

Version history lives in [`CHANGELOG.md`](./CHANGELOG.md). GitHub Releases mirror each tagged section:

https://github.com/lapintool/lapstyle/releases

After tagging (`v0.x.y` must already exist on the remote):

```bash
pnpm github-release              # package.json version
pnpm github-release -- --all     # backfill every CHANGELOG version that has a matching tag
pnpm github-release -- --dry-run
```

Requires [GitHub CLI](https://cli.github.com/) (`gh auth login`).
