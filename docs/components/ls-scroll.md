# LsScroll (`ls-scroll`)

Scroll container with native scrollbars by default and optional translucent overlay controls that never reserve content space.

Import: `import { LsScroll } from "lapstyle/vue"` (or `app.use(LapstyleVue)`).

## Minimal usage

```vue
<ls-scroll overlay style="height: 180px; width: 320px; max-width: 100%">
  <p v-for="n in 20" :key="n">Scrollable line {{ n }}</p>
</ls-scroll>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `overlay` | `boolean` | `false` | Float translucent scrollbars over the content without changing viewport width or height |
| `verticalLabel` | `string` | `"Scroll vertically"` | Accessible vertical scrollbar label; bind to the application language |
| `horizontalLabel` | `string` | `"Scroll horizontally"` | Accessible horizontal scrollbar label; bind to the application language |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `scroll` | `Event` | Native viewport scroll event; event.target is the scrolling viewport |

### Slots

| Name | Description |
| --- | --- |
| `default` | Scrollable content |

### Pitfalls

- Set height or max-height on the component to constrain vertical scrolling. Content stays mounted when overlay changes.
- Overlay controls support dragging, track clicks, wheel, Arrow keys, PageUp/PageDown and Home/End. The native viewport preserves touch scrolling and keyboard scrolling.
- A template ref exposes viewport (HTMLElement) for scrollTop, scrollLeft, scrollTo() and scrollIntoView(), and refresh() for manual geometry updates. Resizes and content changes update automatically.
- Use --ls-scrollbar-size, --ls-scrollbar-overlay-alpha (0.35), --ls-scrollbar-overlay-hover-alpha (0.55), and --ls-scrollbar-fade-duration to customize the controls. Add padding inside the slot if content should avoid the overlaid thumb.
- The existing CSS-only .ls-scroll class retains native scrollbars. Framework-free overlay markup needs a viewport/content wrapper and enhance(); see docs/components/scrollbar.md.

## CSS root

`.ls-scroll` — look layer. Prefer the Vue tag in apps.

If this page is not enough, read `src/vue/LsScroll.vue` next. Do not copy class-only demo HTML unless you are on the framework-free path (`docs/enhance.md`).
