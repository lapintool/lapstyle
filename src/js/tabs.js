import { trackListener } from "./util.js";

const tabsState = new WeakMap();

function syncTabsScrolled(root) {
  const panels = root.querySelectorAll(":scope > .panel");
  let scrolled = false;
  for (const panel of panels) {
    if (panel.hidden) continue;
    if (panel.scrollTop > 0) {
      scrolled = true;
      break;
    }
  }
  root.classList.toggle("is-scrolled", scrolled);
}

export function initTabs(root) {
  if (tabsState.has(root)) return;
  const panels = root.querySelectorAll(":scope > .panel");
  if (!panels.length) return;

  const cleanups = [];
  const sync = () => syncTabsScrolled(root);

  panels.forEach((panel) => {
    trackListener(cleanups, panel, "scroll", sync, { passive: true });
  });

  const mo = new MutationObserver(sync);
  panels.forEach((panel) => {
    mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
  });
  const ro = new ResizeObserver(sync);
  panels.forEach((panel) => ro.observe(panel));

  sync();

  tabsState.set(root, {
    destroy() {
      cleanups.forEach((remove) => remove());
      mo.disconnect();
      ro.disconnect();
      root.classList.remove("is-scrolled");
      tabsState.delete(root);
    },
  });
}

export function destroyTabs(root) {
  tabsState.get(root)?.destroy();
}
