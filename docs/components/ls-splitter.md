# LsSplitter (`ls-splitter`)

Two-pane splitter. Put two .pane children in the default slot.

Import: `import { LsSplitter } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-splitter v-model="size" :min="120" :max="420">
  <div class="pane">Left</div>
  <div class="pane">Right</div>
</ls-splitter>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | — | Target pane size in px (default: end/right pane) |
| `vertical` | `boolean` | `false` | Stack panes vertically |
| `min` | `number \| string` | — | Min size in px (data-min; default 80) |
| `max` | `number \| string` | — | Max size in px (data-max) |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | While resizing |
| `resize` | `number` | Size changed |

### Slots

| Name | Description |
| --- | --- |
| `default` | Two .pane children |

## CSS root

`.ls-splitter` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsSplitter.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
