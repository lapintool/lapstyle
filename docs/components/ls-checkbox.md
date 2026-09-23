# LsCheckbox (`ls-checkbox`)

Checkbox. Switch / round / button looks are extra classes on the host.

Import: `import { LsCheckbox } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-checkbox v-model="on" label="Enable" />
<ls-checkbox v-model="on" class="switch cyan" label="Switch" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean \| unknown[]` | `false` | v-model (boolean or array) |
| `value` | `string \| number \| boolean` | `true` | Value when used in array mode |
| `label` | `string` | `""` | Label text |
| `name` | `string` | `""` | Native name |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact |
| `disabled` | `boolean` | `false` | Disabled |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean \| unknown[]` | v-model |

### Slots

| Name | Description |
| --- | --- |
| `default` | Label content |

### Pitfalls

- Add class="switch" / "round" / "btn" / a color word on <ls-checkbox>.

## CSS root

`.ls-checkbox` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsCheckbox.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
