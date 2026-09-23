# Framework-free path (enhance)

Use this only when there is **no Vue**. Vue apps should import `lapstyle/vue`; those wrappers call `enhance` internally.

```ts
import "lapstyle/index.css";
import { enhance, destroy } from "lapstyle";

enhance(document);
// SPA unmount:
destroy(document);
```

Without a bundler:

```html
<script type="module">
  import "lapstyle/index.css";
  import "lapstyle/auto";
</script>
```

`<html data-ls-no-auto>` skips automatic `enhance`. You can still call `window.Lapstyle.enhance`.

Markup is CSS classes (`.ls-btn`, `.ls-dialog`, …), not `<ls-*>` tags. Interactive widgets listen for custom events such as `ls-dialog:action`, `ls-menu:select`, `ls-tabs:change`, `ls-slider:change`.

Scrollbar: add `class="ls-scroll"` to an overflowing container. There is no `LsScroll` component.

If you need a Vue example, leave this file and read `docs/components/*.md`.
