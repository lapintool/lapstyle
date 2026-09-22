# Lapstyle

A desktop UI kit with a defined look, optional JS enhancement, and no Vue / React binding. Author native elements with class conventions; call `enhance()` when you need interaction.

Current version **0.4.1-alpha**. License: MIT. Repository: https://github.com/lapintool/lapstyle

English is the default language for docs and the official demo.

## Install

```bash
pnpm add github:lapintool/lapstyle#v0.4.1-alpha
```

Bundler / SPA (recommended; call `enhance` yourself):

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

Dark is the default theme. Set `data-theme` on the root:

```html
<html data-theme="light">
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

> Use public paths such as `lapstyle/index.css` or `lapstyle/progress.css`. Do not import `lapstyle/src/...`.

### Browser baseline

Needs a recent desktop browser. Tooltip visibility depends on CSS `:has()` (Firefox ≥ 121, Chrome ≥ 105, Safari ≥ 15.4). Without it, hover tooltips may not show.

### 0.3 token prefix

Theme and surface variables are all `--ls-*`. Examples:

| Old | New |
| --- | --- |
| `--bg` / `--text` / `--border` | `--ls-bg` / `--ls-text` / `--ls-border` |
| `--color-blue` | `--ls-color-blue` |
| `--btn-fill` / `--input-bg` | `--ls-btn-fill` / `--ls-input-bg` |
| `--duration` / `--ease-out` | `--ls-duration` / `--ls-ease-out` |

There are no unprefixed aliases. Full list: [CHANGELOG.md](./CHANGELOG.md).

JSR (`@lapintool/lapstyle`) cannot register CSS as module entries; styles still use in-package file paths.

## Components

| Component | Root class | enhance |
| --- | --- | --- |
| Button | `.ls-btn` | No |
| Button group / dropdown button | `.ls-btn-group` / `.ls-btn-dropdown` | Popover menus |
| Input | `.ls-input` | No |
| Radio | `.ls-radio` | No |
| Checkbox / switch | `.ls-checkbox` | No |
| Tabs | `.ls-tabs` | Yes |
| Dropdown | `.ls-dropdown` | Popover menus |
| Dialog | `.ls-dialog` | `.draggable` only |
| Tooltip | `.ls-tooltip` | Yes |
| Scrollbar | `.ls-scroll` | No |
| Icon | `.ls-icon` | No |
| Menu | `.ls-menu` | Yes (auto flip) |
| Card | `.ls-card` | No |
| Table | `.ls-table` | No |
| Slider | `.ls-slider` | Yes |
| Progress | `.ls-progress` | Recommended (aria / CSS sync) |
| Splitter | `.ls-splitter` | Yes |
| Expand | `.ls-expand` | Yes |
| Color picker | `.ls-color-picker` | Yes |

Write popover menus as `.ls-card.ls-menu`: the card is the surface, the menu owns geometry and open/close. Without a locked `.top` / `.bottom` / `.start` / `.end`, the menu flips when there is not enough room.

## Size and density

Control size with `.sm` / `.md` (default) / `.lg`, driven by tokens:

```css
--ls-size-sm-font / --ls-size-sm-icon / --ls-size-sm-control
--ls-size-md-font / --ls-size-md-icon / --ls-size-md-control
--ls-size-lg-font / --ls-size-lg-icon / --ls-size-lg-control
```

`.dense` only shrinks padding / height (`--ls-dense-shrink`) and can stack with size classes.

## Product rules

| Item | Meaning |
| --- | --- |
| Minimum HTML | Author-written roots / a small subtree |
| Library-generated | Nodes, aria, and CSS variables added by `enhance()` |
| CSS customization | Stable part classes + `--ls-*` variables |
| Change state | `data-*` / `setSliderValue` / `setProgressValue` / `setExpandOpen` / events |

## Class naming

1. **Component roots** use global `ls-*`: `.ls-btn`, `.ls-dialog`, `.ls-splitter`.
2. **Parts** live inside the parent, short names, no prefix: `.ls-dialog .panel`, `.ls-splitter .pane`.
3. **Modifiers / effects** are global and unprefixed: `.dense`, `.modeless`, `.draggable`.
4. No BEM `__`. Dragging uses the class `draggable`, not the HTML `draggable` attribute.

## Minimal examples

```html
<div class="ls-slider blue label" data-value="40" aria-label="Volume"></div>
<div class="ls-slider blue input" data-value="14" data-min="8" data-max="32" data-suffix="px" aria-label="Font size"></div>
```

```ts
import { enhance, setSliderValue } from "lapstyle";
enhance(document);
setSliderValue(document.querySelector(".ls-slider"), 70);
```

Progress:

```html
<div
  class="ls-progress blue"
  role="progressbar"
  aria-valuenow="40"
  aria-valuemin="0"
  aria-valuemax="100"
></div>
```

Do not author conflicting `aria-valuenow` and `--ls-progress` at the same time.

## enhance / destroy

The main entry only exports the API. For automatic browser enhancement, import `lapstyle/auto`. Before an SPA unmount, call `destroy(root)` on a local root. `enhance(root)` / `destroy(root)` also handle **the root itself** when it matches a selector, not only descendants.

Scripted values: `setSliderValue`, `setProgressValue` / `syncProgress`, `setExpandOpen`, `setPickerValue`. Common events: `ls-slider:input`, `ls-progress:change`, `ls-splitter:resize`, `ls-color-picker:input` / `change`.

Full API: `src/lapstyle.d.ts`. Component source lives in `src/js/`.

## Playground

The official demo **View code** button opens **Playground** (`@vue/repl`). The editor shows a **Vue SFC skeleton** you can copy into an app (`script setup` + `enhance` + author markup).
