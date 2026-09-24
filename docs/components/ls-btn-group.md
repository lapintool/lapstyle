# LsBtnGroup (`ls-btn-group`)

Join adjacent buttons into one group.

Import: `import { LsBtnGroup } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-btn-group>
  <ls-btn>One</ls-btn>
  <ls-btn>Two</ls-btn>
</ls-btn-group>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `spread` | `boolean` | `false` | Equal-width children |
| `outline` | `boolean` | `false` | Shared outline on the group |
| `vertical` | `boolean` | `false` | Stack vertically |
| `dense` | `boolean` | `false` | Compact padding |

### Slots

| Name | Description |
| --- | --- |
| `default` | ls-btn (or other) children |

## CSS root

`.ls-btn-group` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsBtnGroup.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
