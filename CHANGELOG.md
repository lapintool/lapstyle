# Changelog

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
