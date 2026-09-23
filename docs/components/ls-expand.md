# LsExpand (`ls-expand`)

Corner / edge / float expand panel. v-model is expanded state.

Import: `import { LsExpand } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-expand v-model="open" expand="tr" title="Panel">
  <p>Body</p>
</ls-expand>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Expanded (v-model) |
| `expand` | `"tr" \| "tl" \| "br" \| "bl" \| "t" \| "b" \| "l" \| "r"` | `"tr"` | Dock: tr \| tl \| br \| bl \| t \| b \| l \| r |
| `collapse` | `string` | `""` | Collapsed-edge target |
| `floatAnchor` | `string` | `""` | Float pin (data-ls-float-anchor) |
| `title` | `string` | `""` | Head title |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open state |
| `change` | `boolean` | After toggle |

### Slots

| Name | Description |
| --- | --- |
| `head` | Custom head content |
| `default` | Panel body |

## CSS root

`.ls-expand` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsExpand.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
