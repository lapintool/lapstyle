# LsBtn (`ls-btn`)

Button. Props map to the same modifier classes as .ls-btn.

Import: `import { LsBtn } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-btn color="blue">Save</ls-btn>
<ls-btn color="cyan" variant="fill">Fill</ls-btn>
<ls-btn size="sm" dense>Dense</ls-btn>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `"" \| "blue" \| "cyan" \| "magenta" \| "green" \| "red" \| "yellow" \| "dark" \| "gray" \| "white" \| "black"` | `""` | Omit for theme accent. Else: blue \| cyan \| magenta \| green \| red \| yellow \| dark \| gray \| white \| black |
| `variant` | `"" \| "fill" \| "push" \| "flat" \| "ghost" \| "outline"` | `""` | fill \| push \| flat \| ghost \| outline (empty = outline) |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact padding |
| `rounded` | `boolean` | `false` | Pill radius |
| `round` | `boolean` | `false` | Circle |
| `icon` | `boolean` | `false` | Square icon button |
| `stack` | `boolean` | `false` | Icon above, label below |
| `noCaps` | `boolean` | `false` | Disable uppercase |
| `type` | `string` | `"button"` | Native button type |
| `disabled` | `boolean` | `false` | Disabled state |
| `href` | `string` | `""` | Render as <a> when set |
| `tag` | `string` | `"button"` | Root tag; "a" also forces a link |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `click` | `MouseEvent` | Native click (bubbles) |

### Slots

| Name | Description |
| --- | --- |
| `default` | Label, icons |

## CSS root

`.ls-btn` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsBtn.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
