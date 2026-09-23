# LsCard (`ls-card`)

Surface container. note is a dashed callout.

Import: `import { LsCard } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-card>Content</ls-card>
<ls-card note>Hint text</ls-card>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `note` | `boolean` | `false` | Dashed callout |
| `dense` | `boolean` | `false` | Compact padding |
| `flat` | `boolean` | `false` | No elevation |
| `tag` | `string` | `"div"` | Root element |

### Slots

| Name | Description |
| --- | --- |
| `default` | Card body |

## CSS root

`.ls-card` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsCard.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
