# Getting started

Lapstyle is a **desktop Vue UI kit**. Default path: `Ls*` / `ls-*` components with `v-model`, events, and slots.

Do **not** start from class HTML + `enhance()` unless the app has no Vue.

## Install

```bash
pnpm add lapstyle@0.5.4-alpha
```

Peer: `vue` `^3.4` (required only when using `lapstyle/vue`).

GitHub alternative: `pnpm add github:lapintool/lapstyle#v0.5.4-alpha`.

## Setup

```ts
import { createApp } from "vue";
import { LapstyleVue } from "lapstyle/vue";
import "lapstyle/index.css";
import App from "./App.vue";

const app = createApp(App);
app.use(LapstyleVue);
app.mount("#app");
```

On demand:

```ts
import { LsBtn, LsDialog } from "lapstyle/vue";
```

Scaffold: `pnpm dlx https://github.com/lapintool/create-lapstyle my-app`

## Theme

Set `data-theme` on `<html>`: `dark` (default) | `light` | `mint` | `sky` | `pink` | `brown` | `amber`.
See `docs/theming.md`.

## Type scale

Set `data-ls-scale` on `<html>`: `sm` (14px) | `md` (16px, default) | `lg` (18px) | `xl` (20px).
This sets the root `font-size`. Kit sizes use `rem`, so type, icons, and controls scale together.
Omit the attribute to keep the browser root (same as `md`).
Semantic sizes: `--ls-font-title` / `--ls-font-body` / `--ls-font-secondary` / `--ls-font-caption` (18/14/13/12px @ md).

## How to use these docs

1. This file for install.
2. `docs/llms.txt` as the index.
3. `docs/components/<tag>.md` for one component (props / events / slots / pitfalls).
4. `docs/llms-full.txt` to ingest everything at once.
5. TypeScript: `lapstyle/vue` (`src/vue/index.d.ts`).
6. Source (`src/vue/*.vue`, `src/js/*.js`) only if the docs and types are not enough.

Tags are kebab-case (`<ls-dialog>`); exports are PascalCase (`LsDialog`).
