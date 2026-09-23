# LsTabs (`ls-tabs`)

Tab bar. v-model is the active LsTab value.

Import: `import { LsTabs } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-tabs v-model="tab">
  <ls-tab value="a" label="Overview" />
  <ls-tab value="b" label="Files" closable />
  <template #panels>
    <div class="panel" role="tabpanel">Panel for {{ tab }}</div>
  </template>
</ls-tabs>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Active tab value |
| `barOnly` | `boolean` | `false` | Bar only, no panels region |
| `color` | `"" \| "blue" \| "cyan" \| "magenta" \| "green" \| "red" \| "yellow" \| "dark" \| "gray" \| "white" \| "black"` | `""` | Accent class on the bar |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number` | Active tab changed |
| `change` | `{ value, tab, index }` | After switch |
| `close` | `{ value, tab, index, event }` | Close clicked; event.preventDefault() keeps the tab |

### Slots

| Name | Description |
| --- | --- |
| `default` | LsTab items (also #tabs) |
| `tabs` | Alias for tab items |
| `panels` | Tab panels |

## CSS root

`.ls-tabs` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsTabs.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
