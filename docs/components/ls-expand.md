# LsExpand (`ls-expand`)

Corner / edge / float expand panel. v-model is expanded state.

Import: `import { LsExpand } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-expand v-model="open" collapse="tr" :open-width="240" :open-height="180" title="Panel">
  Notes, a form, or a list.
</ls-expand>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Expanded (v-model) |
| `collapse` | `"" \| "tl" \| "tr" \| "bl" \| "br" \| "t" \| "r" \| "b" \| "l" \| "float"` | `""` | Where the collapsed button docks. Empty: derived from expand, else tr |
| `expand` | `"" \| "tl" \| "tr" \| "bl" \| "br" \| "t" \| "r" \| "b" \| "l" \| "float"` | `""` | Open shape. Corner collapse: same corner or an adjacent edge. Edge collapse: same edge. Empty: same as collapse |
| `floatAnchor` | `"" \| "tl" \| "tr" \| "bl" \| "br"` | `""` | Float only: pinned corner (default br) |
| `openWidth` | `number \| string \| null` | `null` | Open width in px (default 216). Ignored for expand t / b (full width) |
| `openHeight` | `number \| string \| null` | `null` | Open height in px (default 208). Ignored for expand l / r (full height) |
| `title` | `string` | `""` | Head title (also the head aria-label) |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open state |
| `change` | `boolean` | After toggle |

### Slots

| Name | Description |
| --- | --- |
| `icon` | Collapsed-button icon (default: square) |
| `head` | Replace the whole head (title + icon) |
| `default` | Panel body (already wrapped in .body) |

### Pitfalls

- Invalid combinations never render: unknown values are dropped, a mismatched expand falls back to collapse, float forces both to float. Each correction logs one console.warn.
- Sizes are clamped between the collapsed size (28px) and the host box. The host needs position: relative and a size.
- Do not wrap the default slot in <div class="body">; the component already does.

## CSS root

`.ls-expand` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsExpand.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
