# LsDropdown (`ls-dropdown`)

Select-style dropdown. v-model + options, or slot .item rows.

Import: `import { LsDropdown } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-dropdown
  v-model="lang"
  :options="['JavaScript', 'TypeScript', 'Python']"
/>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Selected value (v-model) |
| `options` | `Array<string \| number \| { value?: string \| number, label?: string \| number }> \| null` | `null` | Data-driven items; omit when using the default slot |
| `placeholder` | `string` | `"Select"` | Trigger text when empty |
| `editable` | `boolean` | `false` | Use an input as the trigger: select an option or enter any text. Typed values are strings; selected values keep their original type. |
| `arrow` | `"chevron" \| "triangle"` | `"chevron"` | Dropdown icon: chevron or filled triangle |
| `borderless` | `boolean` | `false` | Transparent trigger without a border |
| `noArrow` | `boolean` | `false` | Hide the dropdown icon; can combine with borderless |
| `split` | `boolean` | `false` | Separate the selection text and arrow with a full-height divider |
| `disabled` | `boolean` | `false` | Disabled |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact |
| `end` | `boolean` | `false` | Align menu to the right |
| `menuClass` | `string` | `""` | Extra classes on the menu |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null` | Selection or editable text changed |
| `select` | `{ value, label, item }` | Leaf item selected |

### Slots

| Name | Description |
| --- | --- |
| `default` | Custom .item buttons instead of options |

### Pitfalls

- Custom menu: omit options and put <button type="button" class="item" data-value="…"> in the default slot.
- Editable: <ls-dropdown v-model="value" :options="options" editable />. ArrowDown/ArrowUp open the menu; Enter commits text and closes it; Escape closes it. Combine with split, borderless or no-arrow.

## CSS root

`.ls-dropdown` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsDropdown.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
