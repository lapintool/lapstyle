# LsDatePicker (`ls-date-picker`)

Date and time picker with date, date-time, and time-only modes.

Import: `import { LsDatePicker } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-date-picker v-model="date" mode="date" />
<ls-date-picker v-model="dateTime" mode="datetime" />
<ls-date-picker v-model="time" mode="time" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `""` | v-model; YYYY-MM-DD, YYYY-MM-DD HH:mm, or HH:mm by mode |
| `mode` | `"date" \| "datetime" \| "time"` | `"date"` | Date only, date and time, or time only |
| `locale` | `string` | `"zh-CN"` | Calendar locale and Chinese/English control labels; bind it to the application's active language |
| `size` | `"" \| "sm" \| "md" \| "lg"` | `""` | sm \| md \| lg (empty = md) |
| `dense` | `boolean` | `false` | Compact input |
| `disabled` | `boolean` | `false` | Disabled |
| `readonly` | `boolean` | `false` | Prevent typing; picker remains available |
| `placeholder` | `string` | `""` | Override the mode-specific placeholder |
| `clearable` | `boolean` | `true` | Show the Clear shortcut |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | v-model value |
| `change` | `string` | Committed or cleared value |
| `open` | — | Picker panel opened |
| `close` | — | Picker panel closed |

### Pitfalls

- Date mode emits YYYY-MM-DD; datetime mode emits YYYY-MM-DD HH:mm; time mode emits HH:mm. Values use local wall time and do not include a timezone.
- Selection is a draft until OK; Cancel and outside click discard the draft.
- The body-mounted popover flips above or below and aligns to the available viewport space. Opening and closing use a short opacity fade; --ls-date-picker-duration defaults to 160ms.

## CSS root

`.ls-date-picker` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsDatePicker.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
