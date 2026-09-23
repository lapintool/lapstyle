# LsMenu (`ls-menu`)

Standalone menu. Leaf clicks emit select and update v-model when data-value is set.

Import: `import { LsMenu } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-menu v-model="sel" icons fill>
  <button type="button" class="item" data-value="a"><span class="label">A</span></button>
  <button type="button" class="item" data-value="b"><span class="label">B</span></button>
</ls-menu>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Selected value |
| `icons` | `boolean` | `false` | Reserve icon column |
| `fill` | `boolean` | `false` | Filled items |
| `plain` | `boolean` | `false` | No card chrome |
| `collapsed` | `boolean` | `false` | Collapsed / rail |
| `card` | `boolean` | `true` | Wrap with .ls-card |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null` | Selection |
| `select` | `{ value, label, item }` | Leaf selected |

### Slots

| Name | Description |
| --- | --- |
| `default` | .item rows and nested structure |

## CSS root

`.ls-menu` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsMenu.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
