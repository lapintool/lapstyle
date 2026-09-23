# LsRadio (`ls-radio`)

Radio with shared v-model across the group.

Import: `import { LsRadio } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-radio v-model="choice" value="a" label="Option A" name="demo" />
<ls-radio v-model="choice" value="b" label="Option B" name="demo" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| null` | — | v-model (group) |
| `value` | `string \| number \| boolean` | required | Option value |
| `label` | `string` | `""` | Label text |
| `name` | `string` | `""` | Native name (group) |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact |
| `disabled` | `boolean` | `false` | Disabled |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | v-model |

### Slots

| Name | Description |
| --- | --- |
| `default` | Label content |

## CSS root

`.ls-radio` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsRadio.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
