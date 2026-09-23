# LsDialog (`ls-dialog`)

Modal / modeless dialog. v-model is open. Action buttons close by default.

Import: `import { LsDialog } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-btn color="blue" @click="open = true">Open</ls-btn>
<ls-dialog v-model="open" title="New file">
  <ls-field label="File name">
    <ls-input v-model="name" />
  </ls-field>
  <template #actions>
    <ls-btn color="red">Cancel</ls-btn>
    <ls-btn color="blue">OK</ls-btn>
  </template>
</ls-dialog>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Open state (v-model) |
| `title` | `string` | `""` | Default head title |
| `persistent` | `boolean` | `false` | Backdrop / Esc do not close |
| `modeless` | `boolean` | `false` | No overlay; page stays clickable |
| `draggable` | `boolean` | `false` | Drag from the title band |
| `kind` | `"" \| "warning" \| "error"` | `""` | warning \| error (title icon color) |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open / close |
| `action` | `{ button, dialog }` | Before close from #actions; preventDefault() to keep open |
| `close` | — | After the dialog becomes hidden |

### Slots

| Name | Description |
| --- | --- |
| `default` | Body |
| `head` | Custom header (overrides title) |
| `actions` | Footer buttons; clicks close unless prevented |

### Pitfalls

- Validate on OK: @action — if the OK button is invalid, call event.preventDefault().

## CSS root

`.ls-dialog` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsDialog.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
