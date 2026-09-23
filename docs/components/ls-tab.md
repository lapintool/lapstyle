# LsTab (`ls-tab`)

One tab inside LsTabs.

Import: `import { LsTab } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-tab value="a" label="Overview" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | required | Tab id (v-model of LsTabs) |
| `label` | `string` | `""` | Tab text |
| `closable` | `boolean` | `false` | Show close control |
| `disabled` | `boolean` | `false` | Disabled tab |

### Slots

| Name | Description |
| --- | --- |
| `default` | Label override |
| `icon` | Leading icon |

## CSS root

`.ls-tabs .tab` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsTab.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
