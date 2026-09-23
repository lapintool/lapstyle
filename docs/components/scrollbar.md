# Scrollbar (`.ls-scroll`)

CSS-only. There is **no** `LsScroll` / `<ls-scroll>` component.

```html
<div class="ls-scroll" style="max-height: 160px">
  …overflowing content…
</div>
```

Class: `.ls-scroll` — thin scrollbar, fades in on hover.

In Vue, put `class="ls-scroll"` on any overflowing host (including `ls-menu` / dropdown menus, which already include it where needed).
