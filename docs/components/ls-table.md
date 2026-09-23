# LsTable (`ls-table`)

Table shell. Put a native <table> inside.

Import: `import { LsTable } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-table dense hover>
  <table>
    <thead><tr><th>A</th><th>B</th></tr></thead>
    <tbody><tr><td>1</td><td>2</td></tr></tbody>
  </table>
</ls-table>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `dense` | `boolean` | `false` | Tighten cell padding |
| `hover` | `boolean` | `false` | Highlight the body row under the pointer |
| `plain` | `boolean` | `false` | No cell or shell lines |
| `noFrame` | `boolean` | `false` | Drop the outer border; inner lines stay |

### Slots

| Name | Description |
| --- | --- |
| `default` | Native <table> markup |

## CSS root

`.ls-table` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsTable.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
