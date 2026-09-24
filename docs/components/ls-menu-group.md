# LsMenuGroup (`ls-menu-group`)

Expandable row with nested items. Collapsed by default; caret and submenu are generated.

Import: `import { LsMenuGroup } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-menu-group label="Analytics" :icon="ChartIcon" open>
  <ls-menu-item label="Usage" />
</ls-menu-group>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Expanded (v-model:open) |
| `label` | `string` | `""` | Row text |
| `icon` | `string \| Component \| null` | `null` | Icon component or an LsIcon name |
| `disabled` | `boolean` | `false` | Disable the row |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Expanded / collapsed |

### Slots

| Name | Description |
| --- | --- |
| `default` | Nested LsMenuItem / LsMenuGroup |
| `label` | Custom label content |
| `icon` | Custom icon; wrapped in LsIcon for you |

## CSS root

`.ls-menu .item` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsMenuGroup.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
