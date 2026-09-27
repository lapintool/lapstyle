# LsTable (`ls-table`)

Table shell. Put a native <table> inside. Columns size to content; the shell stays content-tall unless fill.

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
| `fixed` | `boolean` | `false` | Equal-width columns (table-layout: fixed) |
| `fill` | `boolean` | `false` | Grow to the remaining height in a flex/grid pane |

### Slots

| Name | Description |
| --- | --- |
| `default` | Native <table> markup |

### Pitfalls

- Default table-layout is auto. Use fixed (class .fixed) when you want equal columns or have long unbreakable strings.
- The shell does not stretch with flex-1. Use fill (class .fill) when the table should occupy the remaining pane and scroll inside.

## CSS root

`.ls-table` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsTable.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
