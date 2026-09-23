# LsSplitter (`ls-splitter`)

Two-pane splitter. Put two .pane children in the default slot.

Import: `import { LsSplitter } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-splitter v-model="size" :min="20" :max="80">
  <div class="pane">Left</div>
  <div class="pane">Right</div>
</ls-splitter>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | — | First pane size % |
| `vertical` | `boolean` | `false` | Stack panes vertically |
| `min` | `number \| string` | `0` | Percent lower bound |
| `max` | `number \| string` | `100` | Percent upper bound |

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
