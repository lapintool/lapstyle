# LsTooltip (`ls-tooltip`)

Tooltip inside a hoverable host. Prefers top and flips to stay in view.

Import: `import { LsTooltip } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-btn color="blue">
  Hover
  <ls-tooltip>Shown on hover</ls-tooltip>
</ls-btn>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `""` | Fallback text when the slot is empty |
| `placement` | `"" \| "top" \| "bottom" \| "left" \| "right"` | `""` | Optional lock: top \| bottom \| left \| right |

### Slots

| Name | Description |
| --- | --- |
| `default` | Tooltip content |

## CSS root

`.ls-tooltip` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsTooltip.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
