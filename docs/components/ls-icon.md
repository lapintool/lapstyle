# LsIcon (`ls-icon`)

Icon host. Lapstyle does not ship fonts; put SVG or glyphs in the slot.

Import: `import { LsIcon } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-icon size="sm" name="close" />
<ls-icon><svg viewBox="0 0 24 24" width="24" height="24">…</svg></ls-icon>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | `""` | Optional built-in glyph class (e.g. close) |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `filled` | `boolean` | `false` | Filled variant when applicable |

### Slots

| Name | Description |
| --- | --- |
| `default` | Custom SVG / font glyph |

### Pitfalls

- The kit does not bundle icon fonts. Import Material Symbols / your SVG yourself.

## CSS root

`.ls-icon` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsIcon.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
