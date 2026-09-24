# Changelog

## 0.5.1-alpha

### Added

- `LsMenuItem` / `LsMenuGroup` shorthand inside `LsMenu` (icons, `href`, group `open` as initial state).
- Expand Vue props: `openWidth`, `openHeight`, `expand`, `collapse`, `floatAnchor`, `title`, plus `#icon` / `#head` slots.
- `setSplitterSize` so `LsSplitter` `v-model` is pixels, not a CSS percentage.

### Changed

- `LsGroup` is now `LsBtnGroup` (`<ls-btn-group>`).
- Expand: animate in px, then settle to stretch; invalid expand/collapse pairs are normalized (with a warning).
- Menu caret matches the initial expanded state (`is-expanded` / `.sub[hidden]`).

### Fixed

- Splitter size waits until the host has room, so a hidden pane no longer reports `0`.

## 0.5.0-alpha

### Breaking (default path)

- **Vue is the default authoring path.** Import `Ls*` from `lapstyle/vue` or `app.use(LapstyleVue)`. Components own `enhance` / `destroy` on their root; apps should not call `enhance(document)` for page content.
- Package description and docs push Vue first. Class markup + `enhance()` remain the look / framework-free kernel.

### Added

- `lapstyle/vue` export: `LsBtn`, `LsDropdown`, `LsDialog`, `LsSlider`, `LsBtnDropdown`, `LsTabs` / `LsTab`, `LsProgress`, `LsExpand`, `LsMenu`, `LsSplitter`, `LsColorPicker`, `LsTooltip`, `LsInput`, `LsField`, `LsCheckbox`, `LsRadio`, `LsCard`, `LsTable`, `LsIcon`, `LsGroup`, and the `LapstyleVue` plugin.
- `peerDependencies.vue` `^3.4` (optional for CSS-only / enhance-only consumers).
- Official demo: per-component API tables (props / events / slots), Vue-first home copy, Playground copies Vue starters, REPL embeds `lapstyle/vue`.
- `create-lapstyle` registers `LapstyleVue` and demos `<ls-btn>`.
- Default `.ls-btn` (no color class) uses `--ls-accent` so it follows the current theme. `.gray` stays the fixed gray.
- AI-facing docs in `docs/` (`llms.txt`, `llms-full.txt`, per-component markdown) and real Vue prop types in `src/vue/index.d.ts`. Regenerated with `pnpm docs`.

### Kept

- Root `enhance()` / `destroy()` and all CSS class conventions for no-framework pages.
- Dialog / dropdown / tabs / menu open-close ownership inside enhance (from 0.4.1).

## 0.4.1-alpha

- `.ls-card.note` is a dashed, unfilled callout for hints and extra context.
- Menu selection is bold accent text with no fill. `.fill` opts into the active background. `.highlight` is removed.
- Draggable dialogs no longer jump on open, and dragging follows the pointer. Dialog open/close and drag live in one `dialog.js` module.
- `enhance()` opens and closes Dropdown, Button-dropdown, and Dialog (`data-ls-open`, backdrop, Esc, actions). Pages listen for `ls-menu:select` and `ls-dialog:action`.
- Tabs: `enhance()` switches tabs and emits `ls-tabs:change` / `ls-tabs:close` (cancelable).
- Menu icon rail: `data-ls-collapse="#id"` toggles `.collapsed`.
- Splitter handles use smooth SVG resize cursors, with the system cursor as fallback.
- A tooltip with `data-theme` uses that theme's elevated background and text.

## 0.4.0

- Added named themes: `mint`, `sky`, `pink`, `brown`, `amber` (`data-theme` on `<html>`).
- Table cells all have borders. The rounded frame stays on the shell. `.no-frame` drops the outer stroke, `.plain` drops every line, and `.hover` opts into a light row tint.
- Number inputs draw the spinner in `currentColor` and keep the caret the same height as the glyphs.
- Menu `.highlight` marks the selected item with bold accent text and no fill.
- Slider hides the marker-label row when there are no labels.
- Input, checkbox, radio, progress, splitter, and slider hovers follow `--ls-accent`.

## 0.3.1

- English is the default language for the README, package description, and official demo copy.

## 0.3.0

### Breaking

- Theme and surface CSS variables now use an `--ls-*` prefix (`--bg` → `--ls-bg`, `--color-blue` → `--ls-color-blue`). Unprefixed aliases are not provided.
- The main `lapstyle.js` entry no longer auto-runs `enhance(document)` or mounts `window.Lapstyle`. Use `import "lapstyle/auto"` for no-bundler pages (`<html data-ls-no-auto>` to opt out).
- JS is split into `src/js/*` modules. Component state lives in WeakMaps instead of `__ls*` properties on DOM nodes.

### Fixed

- Slider: arrow keys and Home/End follow `.reverse`; `change` on keyup only fires when the value actually changed.
- Slider: a sidecar input without an authored `type` is set to `number`.
- Dialog drag: offset is stored in `--ls-drag-x/y` instead of parsing `transform` with a regex.
- Splitter: hardcoded Chinese `aria-label`s removed; root binding is idempotent.
- `setSliderValue` no longer fires `change` on first init.
- d.ts now includes `export default`.

### Improved

- Popover menus share one window `resize` / `scroll` listener.
- `destroySlider` / `destroyProgress` remove library-injected DOM / role.
- Slider config is cached; surface z-index / tooltip / icon default tokens live in `tokens.css`.
- First `forced-colors` pass for checkbox, radio, and slider.
- `node:test` coverage for pure utility functions.

### Removed

- Unused tokens: `--accent`, `--expand-shadow*`, `--find-no-results`, `--icon-color*`, `--popover-hover`.

## 0.2.0

- Added table, progress, and expand.
- Sliders support a sidecar `.input` number field (horizontal / vertical).
- Menu popovers auto-flip; `.ls-card.ls-menu` is the surface.
- Size scale `.sm` / `.md` / `.lg` and `.dense`.
- Motion tokens can be tuned on the demo Custom page.
