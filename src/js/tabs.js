import { trackListener } from "./util.js";

const tabsState = new WeakMap();

function tabList(root) {
  return [...root.querySelectorAll(":scope > .bar > .tab")];
}

function panelList(root) {
  return [...root.querySelectorAll(":scope > .panel")];
}

function syncTabsScrolled(root) {
  const panels = panelList(root);
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

function setActiveTab(root, tab, opts = {}) {
  const tabs = tabList(root);
  const index = tabs.indexOf(tab);
  if (index < 0) return;

  tabs.forEach((el) => {
    const on = el === tab;
    el.classList.toggle("is-active", on);
    el.setAttribute("aria-selected", on ? "true" : "false");
    if (el.hasAttribute("tabindex")) el.setAttribute("tabindex", on ? "0" : "-1");
  });

  const panels = panelList(root);
  if (panels.length > 1) {
    panels.forEach((panel, i) => {
      const show = i === index;
      panel.hidden = !show;
      if (show) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
  }

  syncTabsScrolled(root);

  if (!opts.silent) {
    root.dispatchEvent(
      new CustomEvent("ls-tabs:change", {
        bubbles: true,
        detail: { tab, index, tabs: root },
      }),
    );
  }
}

function closeTab(root, tab) {
  const tabs = tabList(root);
  const index = tabs.indexOf(tab);
  if (index < 0) return;

  const allowed = root.dispatchEvent(
    new CustomEvent("ls-tabs:close", {
      bubbles: true,
      cancelable: true,
      detail: { tab, index, tabs: root },
    }),
  );
  if (!allowed) return;

  const wasActive = tab.classList.contains("is-active");
  const panels = panelList(root);
  const panel = panels.length > 1 ? panels[index] : null;

  tab.remove();
  if (panel) panel.remove();

  const nextTabs = tabList(root);
  if (!nextTabs.length) {
    syncTabsScrolled(root);
    return;
  }
  if (wasActive) {
    const next = nextTabs[Math.min(index, nextTabs.length - 1)];
    setActiveTab(root, next);
  } else {
    syncTabsScrolled(root);
  }
}

export function initTabs(root) {
  if (tabsState.has(root)) return;
  const panels = panelList(root);
  if (!panels.length && !tabList(root).length) return;

  const cleanups = [];
  const sync = () => syncTabsScrolled(root);

  panels.forEach((panel) => {
    trackListener(cleanups, panel, "scroll", sync, { passive: true });
  });

  const mo = new MutationObserver(sync);
  panels.forEach((panel) => {
    mo.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
  });
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(sync) : null;
  if (ro) panels.forEach((panel) => ro.observe(panel));

  const onClick = (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    const closeBtn = t.closest(".tab .close");
    if (closeBtn) {
      const tab = closeBtn.closest(".tab");
      if (tab && root.contains(tab)) {
        event.preventDefault();
        event.stopPropagation();
        closeTab(root, tab);
      }
      return;
    }
    const tab = t.closest(".tab");
    if (!tab || !root.contains(tab) || !tab.parentElement?.classList.contains("bar")) return;
    event.preventDefault();
    setActiveTab(root, tab);
  };

  trackListener(cleanups, root, "click", onClick);

  // Ensure one active tab / panel visibility
  const tabs = tabList(root);
  const active = tabs.find((el) => el.classList.contains("is-active")) || tabs[0];
  if (active) setActiveTab(root, active, { silent: true });
  else sync();

  tabsState.set(root, {
    destroy() {
      cleanups.forEach((remove) => remove());
      mo.disconnect();
      if (ro) ro.disconnect();
      root.classList.remove("is-scrolled");
      tabsState.delete(root);
    },
  });
}

export function destroyTabs(root) {
  tabsState.get(root)?.destroy();
}
