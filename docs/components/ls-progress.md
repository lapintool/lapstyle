# LsProgress (`ls-progress`)

Linear progress. v-model sets aria-valuenow / --ls-progress.

Import: `import { LsProgress } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-progress v-model="pct" color="cyan" />
<ls-progress indeterminate />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | — | 0–100 (or null for CSS-only) |
| `buffer` | `number \| string \| null` | — | Buffer percent |
| `indeterminate` | `boolean` | `false` | Indeterminate animation |
| `color` | `"" \| "blue" \| "cyan" \| "magenta" \| "green" \| "red" \| "yellow" \| "dark" \| "gray" \| "white" \| "black"` | `""` | Omit for theme accent. Else: blue \| cyan \| magenta \| green \| red \| yellow \| dark \| gray \| white \| black |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | When the value is written |

## CSS root

`.ls-progress` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsProgress.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
