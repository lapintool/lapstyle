# Theming

Set the theme on the document:

```html
<html data-theme="dark">
```

Values: `dark` | `light` | `mint` | `sky` | `pink` | `brown` | `amber`.
`dark` is charcoal; the others are light surfaces.

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
