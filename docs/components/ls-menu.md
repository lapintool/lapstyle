# LsMenu (`ls-menu`)

Standalone menu. Compose LsMenuItem / LsMenuGroup; v-model is the selected item value.

Import: `import { LsMenu } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-menu v-model="sel">
  <ls-menu-group label="DNS" open>
    <ls-menu-item label="Records" value="records" />
    <ls-menu-item label="Settings" value="settings" />
  </ls-menu-group>
  <ls-menu-item label="Email" value="mail" />
</ls-menu>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| null` | — | Selected value |
| `icons` | `boolean` | `false` | Reserve icon column. Turned on automatically when any item has an icon |
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
| `default` | LsMenuItem / LsMenuGroup, or hand-written .item rows |

### Pitfalls

- Hand-written <button class="item"> rows still work and can be mixed with LsMenuItem / LsMenuGroup.
- Highlight follows v-model: an item is active when its value (or label, if no value) equals the model.

## CSS root

`.ls-menu` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsMenu.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
