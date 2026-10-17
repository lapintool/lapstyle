# Scrollbar (`.ls-scroll`)

The existing `.ls-scroll` class uses native thin scrollbars. Vue apps can also use `LsScroll`; enable its optional `overlay` prop to float translucent controls above the content without reserving any layout space.

```html
<div class="ls-scroll" style="max-height: 160px">
  …overflowing content…
</div>
```

Class: `.ls-scroll` — thin scrollbar, fades in on hover.

In Vue, put `class="ls-scroll"` on any overflowing host (including `ls-menu` / dropdown menus, which already include it where needed).

## Overlay mode

```vue
<ls-scroll overlay style="height: 180px; max-width: 100%">
  <p v-for="n in 20" :key="n">Line {{ n }}</p>
</ls-scroll>
```

Import `LsScroll` from `lapstyle/vue` or register `LapstyleVue`. See [LsScroll](ls-scroll.md) for props and events. It supports both axes, drag, track clicks, wheel, touch and keyboard scrolling. Content size changes are observed automatically; switching overlay does not remount content. The component ref exposes `viewport` and `refresh()`.

For framework-free pages, call `enhance()` with this markup:

```html
<div class="ls-scroll overlay" style="height: 180px">
  <div class="ls-scroll__viewport ls-scroll" tabindex="0">
    <div class="ls-scroll__content">…overflowing content…</div>
  </div>
</div>
```

Controls use absolute positioning outside the native viewport. If JavaScript is unavailable, native scrollbars remain usable. Existing class-only containers remain unchanged. For external scroll listeners or programmatic scrolling, target `.ls-scroll__viewport`, not the wrapper. Release observers and listeners with `destroy(root)` before removing framework-free markup.

Opacity tokens: `--ls-scrollbar-overlay-alpha: 0.35` and `--ls-scrollbar-overlay-hover-alpha: 0.55`. Thickness and fading reuse `--ls-scrollbar-size` and `--ls-scrollbar-fade-duration`. Overlay controls cover the content edge; add padding inside the slot if needed.
