# LsBtnDropdown (`ls-btn-dropdown`)

Menu button: simple (one trigger) or split (main + arrow).

Import: `import { LsBtnDropdown } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-btn-dropdown color="blue" label="Actions">
  <button type="button" class="item" data-value="new"><span class="label">New</span></button>
</ls-btn-dropdown>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `split` | `boolean` | `false` | Main button + separate arrow |
| `color` | `"" \| "blue" \| "cyan" \| "magenta" \| "green" \| "red" \| "yellow" \| "dark" \| "gray" \| "white" \| "black"` | `""` | Omit for theme accent. Else: blue \| cyan \| magenta \| green \| red \| yellow \| dark \| gray \| white \| black |
| `variant` | `"" \| "fill" \| "push" \| "flat" \| "ghost" \| "outline"` | `""` | fill \| push \| flat \| ghost \| outline (empty = outline) |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact padding |
| `label` | `string` | `"Dropdown"` | Trigger text when #label is empty |
| `disabled` | `boolean` | `false` | Disabled state |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `select` | `{ value, label, item }` | Menu leaf selected |
| `click` | `MouseEvent` | Main button click when split |

### Slots

| Name | Description |
| --- | --- |
| `default` | Menu .item buttons |
| `label` | Trigger label |

## CSS root

`.ls-btn-dropdown` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsBtnDropdown.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
