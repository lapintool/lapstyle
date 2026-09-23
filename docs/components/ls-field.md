# LsField (`ls-field`)

Label wrapper around a control (usually ls-input).

Import: `import { LsField } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-field label="Name">
  <ls-input v-model="name" />
</ls-field>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `""` | Label text |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `forId` | `string` | `""` | for= on the label |

### Slots

| Name | Description |
| --- | --- |
| `default` | Control inside the field |
| `label` | Custom label |

## CSS root

`.ls-field` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsField.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
