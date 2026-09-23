# LsInput (`ls-input`)

Text field with v-model.

Import: `import { LsInput } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-input v-model="name" placeholder="Enter a name" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `""` | v-model |
| `type` | `string` | `"text"` | Native input type |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact padding |
| `outlined` | `boolean` | `false` | Outline look |
| `filled` | `boolean` | `false` | Filled look |
| `borderless` | `boolean` | `false` | No border |
| `clearable` | `boolean` | `false` | Reserved; not yet wired in the wrapper |
| `placeholder` | `string` | `""` | Placeholder |
| `disabled` | `boolean` | `false` | Disabled |
| `readonly` | `boolean` | `false` | Read-only |
| `autocomplete` | `string` | `"off"` | autocomplete attribute |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number` | v-model |

## CSS root

`.ls-input` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsInput.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
