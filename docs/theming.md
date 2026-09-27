# Theming

Set the theme on the document:

```html
<html data-theme="dark">
```

Values: `dark` | `light` | `mint` | `sky` | `pink` | `brown` | `amber`.
`dark` is charcoal; the others are light surfaces.

## Type scale

Set the root type size on `<html>`:

```html
<html data-ls-scale="lg">
```

Values: `sm` (14px) | `md` (16px) | `lg` (18px) | `xl` (20px).
Default is the browser root (16px), same as `md`. Kit chrome is `rem`, so fonts, icons, and controls scale together. Put `data-ls-scale` on `<html>` only (`rem` is relative to the root).

Semantic type sizes (also `rem`, follow the root scale):

| Token | @ md | Use |
| --- | --- | --- |
| `--ls-font-title` | 18px | Section / dialog titles |
| `--ls-font-body` | 14px | Primary prose (matches md control font) |
| `--ls-font-secondary` | 13px | Notes, menus, tables |
| `--ls-font-caption` | 12px | Hints, tooltips |

```css
h2 { font-size: var(--ls-font-title); }
p  { font-size: var(--ls-font-body); }
.hint { font-size: var(--ls-font-secondary); color: var(--ls-text-dim); }
```

The kit does **not** set `body { font-size }`. Apps that want prose to follow scale should set `font-size: var(--ls-font-body)` themselves.

Import tokens once:

```ts
import "lapstyle/index.css";
```

Or per-file (tokens first):

```ts
import "lapstyle/tokens.css";
import "lapstyle/button.css";
```

Default `<ls-btn>` (no color word) uses `--ls-accent` / `--ls-accent-on` for the **current theme**. `.gray` / `color="gray"` is a fixed gray, not the accent.

Do not invent Quasar / other-library token names. Customize via `--ls-*` in `src/tokens.css`.
