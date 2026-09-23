# LsColorPicker (`ls-color-picker`)

SV + hue + HEX. v-model is the hex string.

Import: `import { LsColorPicker } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-color-picker v-model="hex" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `"#248df4"` | HEX color (v-model) |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | While dragging |
| `input` | `string` | Same as continuous update |
| `change` | `string` | Committed color |

### Slots

| Name | Description |
| --- | --- |
| `default` | Optional; overrides the built-in SV panel, hue bar and HEX field markup |

## CSS root

`.ls-color-picker` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsColorPicker.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
