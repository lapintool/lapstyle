# LsMenuItem (`ls-menu-item`)

Leaf row inside LsMenu or LsMenuGroup.

Import: `import { LsMenuItem } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-menu-item label="Records" value="records" :icon="ListIcon" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `""` | Row text (or use the default slot) |
| `value` | `string \| number \| null` | `null` | Selection value; falls back to label |
| `icon` | `string \| Component \| null` | `null` | Icon component (e.g. a lucide icon) or an LsIcon name |
| `href` | `string` | `""` | Render as a link |
| `disabled` | `boolean` | `false` | Disable the row |

### Slots

| Name | Description |
| --- | --- |
| `default` | Label content |
| `icon` | Custom icon (SVG or glyph); wrapped in LsIcon for you |

## CSS root

`.ls-menu .item` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsMenuItem.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
