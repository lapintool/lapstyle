# LsSlider (`ls-slider`)

Range control. Track UI is built by enhance inside the component.

Import: `import { LsSlider } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-slider v-model="n" :min="0" :max="100" label />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number` | `0` | Current value (v-model) |
| `min` | `number \| string` | `0` | Minimum |
| `max` | `number \| string` | `100` | Maximum |
| `step` | `number \| string` | `1` | Step |
| `color` | `"" \| "blue" \| "cyan" \| "magenta" \| "green" \| "red" \| "yellow" \| "dark" \| "gray" \| "white" \| "black"` | `""` | Omit for theme accent. Else: blue \| cyan \| magenta \| green \| red \| yellow \| dark \| gray \| white \| black |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact |
| `label` | `boolean` | `false` | Show value label |
| `input` | `boolean` | `false` | Numeric input beside the track |
| `vertical` | `boolean` | `false` | Vertical orientation |
| `reverse` | `boolean` | `false` | Reverse direction |
| `disabled` | `boolean` | `false` | Disabled |
| `ariaLabel` | `string` | `""` | Accessibility label |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `number` | While dragging / stepping |
| `input` | `number` | Same as continuous update |
| `change` | `number` | Committed value |

## CSS root

`.ls-slider` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsSlider.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
