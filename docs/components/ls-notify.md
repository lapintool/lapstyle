# LsNotify (`ls-notify`)

Viewport notification with timed or persistent display, a close button and shared position stacks.

Import: `import { LsNotify } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-btn @click="open = true">Show message</ls-btn>
<ls-notify v-model="open" message="Changes saved" :timeout="3000" />
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | Visibility (v-model) |
| `message` | `string` | `""` | Message text; default slot overrides it |
| `icon` | `string` | `""` | Leading LsIcon name, e.g. info, success, warning, error or close. Empty hides it; the icon slot overrides this prop. |
| `html` | `boolean` | `false` | Render message as HTML. Only pass trusted or sanitized HTML; the default slot still takes precedence. Caption remains plain text. |
| `caption` | `string` | `""` | Secondary text |
| `position` | `"top" \| "bottom" \| "left" \| "right" \| "top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "center"` | `"top"` | Viewport position; invalid values fall back to top |
| `timeout` | `number` | `3000` | Milliseconds until dismissal; 0 or negative keeps the notification open |
| `closable` | `boolean` | `true` | Show the standard LsBtn close button |
| `closeLabel` | `string` | `"Close"` | Accessible close-button label; bind to the application language |
| `type` | `"info" \| "success" \| "warning" \| "error"` | `"info"` | Message text color; error uses role=alert, others role=status |
| `pauseOnHover` | `boolean` | `true` | Pause remaining timeout while hovered; keyboard focus always pauses it |
| `group` | `boolean \| string` | `true` | Merge identical message/caption/HTML at the same position, regardless of type. false disables merging; a string provides an explicit group key. Slots only merge with an explicit key. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility changed |
| `show` | — | Notification opened |
| `close` | `"close" \| "timeout" \| "model"` | Dismissal reason; model means the parent closed it |

### Slots

| Name | Description |
| --- | --- |
| `default` | Custom message |
| `icon` | Custom SVG or icon component, wrapped in LsIcon; overrides icon |
| `actions` | Custom action buttons; slot exposes close() |

### Pitfalls

- Set timeout=0 for persistent messages and v-model=false to dismiss programmatically.
- Notifications teleport to body and stack at the same position. They use document-root theme tokens and do not block the page or steal focus.
- Import lapstyle/index.css once. Messages render as plain text by default; use html=true for HTML strings. Use the default slot for Vue components, bindings and event handlers.
- Messages stack in show order at every position. Repeated groups keep their original position and display a count. Closing a group dismisses all its members; a repeated message restarts the visible member's timeout.
- A template ref exposes show() and close(). Calling show() again while open increments its repeat count and restarts the timer. Assigning v-model=true to an already-open component does not trigger another show.
- The close button is at the top-right. Override --ls-notify-duration on the notification to customize the default 400ms fade/slide animation.
- Icons are optional and inherit the notification text color. For example: type=success icon=success. Custom icon fonts or SVGs can go in the icon slot.

## CSS root

`.ls-notify` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsNotify.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
