import {
  EXPAND_EASING,
  parseExpandDurationMs,
  registerWindowGeom,
  tipClipRect,
  trackListener,
} from "./util.js";

const menuState = new WeakMap();

function getMenuMeta(root) {
  let state = menuState.get(root);
  if (!state) {
    state = {};
    menuState.set(root, state);
  }
  return state;
}

function isMenuItemDisabled(item) {
  return (
    item.matches(":disabled, [disabled], [aria-disabled='true']") ||
    item.hasAttribute("disabled")
  );
}

function isMenuExpander(item) {
  return Boolean(item.querySelector(":scope > .caret"));
}

function isMenuDummyHref(anchor) {
  const raw = anchor.getAttribute("href");
  if (raw == null || raw === "" || raw === "#" || raw.trim().toLowerCase().startsWith("javascript:")) {
    return true;
  }
  try {
    const url = new URL(anchor.href);
    return (
      url.origin === location.origin &&
      url.pathname === location.pathname &&
      url.search === location.search &&
      (url.hash === "" || url.hash === "#")
    );
  } catch {
    return false;
  }
}

function nextMenuSub(item) {
  let el = item.nextElementSibling;
  while (el && !el.classList.contains("sub") && !el.classList.contains("item")) {
    el = el.nextElementSibling;
  }
  return el && el.classList.contains("sub") ? el : null;
}

function applyMenuExpand(item, open) {
  const sub = nextMenuSub(item);
  item.classList.toggle("is-expanded", open);
  item.setAttribute("aria-expanded", open ? "true" : "false");
  if (!sub) return;
  if (open) sub.removeAttribute("hidden");
  else sub.setAttribute("hidden", "");
}

function syncMenuExpandState(item) {
  if (!isMenuExpander(item)) return;
  const sub = nextMenuSub(item);
  const open = item.classList.contains("is-expanded") || (Boolean(sub) && !sub.hasAttribute("hidden"));
  applyMenuExpand(item, open);
}

function toggleMenuExpand(item) {
  if (!isMenuExpander(item)) return;
  const open = !item.classList.contains("is-expanded");
  applyMenuExpand(item, open);
  item.dispatchEvent(new CustomEvent("ls-menu:toggle", { detail: { open, item }, bubbles: true }));
}

function menuRailLabels(root) {
  return root.querySelectorAll(":scope .item > .label");
}

function clearMenuLabelFade(root) {
  menuRailLabels(root).forEach((el) => {
    el.style.removeProperty("opacity");
  });
}

function cancelMenuLabelAnims(root) {
  const state = menuState.get(root);
  const fades = state?.labelAnims;
  if (!fades) return;
  for (const anim of fades) {
    try {
      anim.cancel();
    } catch {
      /* already finished */
    }
  }
  if (state) state.labelAnims = null;
}

function cancelMenuRailWaapi(root) {
  cancelMenuLabelAnims(root);
  const state = menuState.get(root);
  const anim = state?.railAnim;
  if (!anim) return;
  try {
    anim.cancel();
  } catch {
    /* already finished */
  }
  if (state) state.railAnim = null;
}

function resolveCssVarPx(el, name, fallback) {
  const probe = document.createElement("div");
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:var(${name});height:0;`;
  el.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  probe.remove();
  return w > 0 ? w : fallback;
}

function syncMenuRailPad(root) {
  const cs = getComputedStyle(root);
  const pad = parseFloat(cs.paddingLeft) || 0;
  root.style.setProperty("--ls-menu-rail-pad", `${pad}px`);
}

function captureMenuOpenSize(root) {
  if (root.classList.contains("collapsed") || root.hasAttribute("data-ls-aperture")) return;
  if (root.style.width) return;
  const outer = root.getBoundingClientRect().width;
  const item = root.querySelector(":scope > .item");
  const inner = item ? item.getBoundingClientRect().width : outer;
  const prevOuter = parseFloat(root.style.getPropertyValue("--ls-menu-open-width"));
  if (outer > 1 && (!Number.isFinite(prevOuter) || outer >= prevOuter - 0.5)) {
    root.style.setProperty("--ls-menu-open-width", `${outer}px`);
  }
  const prevInner = parseFloat(root.style.getPropertyValue("--ls-menu-open-inner"));
  if (inner > 1 && (!Number.isFinite(prevInner) || inner >= prevInner - 0.5)) {
    root.style.setProperty("--ls-menu-open-inner", `${inner}px`);
  }
}

function menuCollapsedOuterWidth(root) {
  const size = resolveCssVarPx(root, "--ls-menu-collapsed-size", 28);
  const cs = getComputedStyle(root);
  return (
    size +
    (parseFloat(cs.paddingLeft) || 0) +
    (parseFloat(cs.paddingRight) || 0) +
    (parseFloat(cs.borderLeftWidth) || 0) +
    (parseFloat(cs.borderRightWidth) || 0)
  );
}

function menuOpenOuterWidth(root) {
  const stored = parseFloat(getComputedStyle(root).getPropertyValue("--ls-menu-open-width"));
  if (Number.isFinite(stored) && stored > 0) return stored;
  return 200;
}

function isMenuRailRow(root) {
  return getComputedStyle(root).flexDirection === "row";
}

function applyMenuRailSize(root, px) {
  root.style.width = `${px}px`;
}

function clearMenuRailSize(root) {
  root.style.removeProperty("width");
}

function finishMenuRail(root, collapsed) {
  cancelMenuLabelAnims(root);
  clearMenuLabelFade(root);
  root.removeAttribute("data-ls-aperture");
  if (collapsed) {
    root.setAttribute("data-ls-rail", "");
    applyMenuRailSize(root, menuCollapsedOuterWidth(root));
  } else {
    root.removeAttribute("data-ls-rail");
    clearMenuRailSize(root);
    captureMenuOpenSize(root);
  }
}

function animateMenuRail(root, collapsed, instant = false) {
  cancelMenuRailWaapi(root);
  if (!root.classList.contains("icons") || isMenuRailRow(root)) {
    finishMenuRail(root, collapsed);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const from = root.getBoundingClientRect().width;
  const to = collapsed ? menuCollapsedOuterWidth(root) : menuOpenOuterWidth(root);
  const labels = menuRailLabels(root);
  if (!collapsed) {
    labels.forEach((el) => {
      el.style.opacity = "0";
    });
  }
  root.setAttribute("data-ls-aperture", "");
  root.removeAttribute("data-ls-rail");
  if (instant || reduce || Math.abs(from - to) < 0.5) {
    finishMenuRail(root, collapsed);
    return;
  }
  const durationMs = parseExpandDurationMs(root);
  applyMenuRailSize(root, to);
  const anim = root.animate(
    [{ width: `${from}px` }, { width: `${to}px` }],
    { duration: durationMs, easing: EXPAND_EASING },
  );
  const state = getMenuMeta(root);
  state.railAnim = anim;
  const fades = [];
  labels.forEach((el) => {
    fades.push(
      el.animate(
        [{ opacity: collapsed ? 1 : 0 }, { opacity: collapsed ? 0 : 1 }],
        { duration: durationMs, easing: EXPAND_EASING, fill: "forwards" },
      ),
    );
  });
  state.labelAnims = fades;
  const token = (state.railToken = (state.railToken || 0) + 1);
  anim.finished
    .then(() => {
      if (menuState.get(root)?.railToken !== token) return;
      finishMenuRail(root, collapsed);
    })
    .catch(() => {});
}

function initMenuRail(root) {
  syncMenuRailPad(root);
  captureMenuOpenSize(root);
  const collapsed = root.classList.contains("collapsed");
  if (collapsed) finishMenuRail(root, true);

  let wasCollapsed = collapsed;
  const mo = new MutationObserver(() => {
    const now = root.classList.contains("collapsed");
    if (now === wasCollapsed) return;
    wasCollapsed = now;
    animateMenuRail(root, now, false);
  });
  mo.observe(root, { attributes: true, attributeFilter: ["class"] });

  let ro = null;
  if (typeof ResizeObserver === "function") {
    ro = new ResizeObserver(() => {
      if (root.classList.contains("collapsed") || root.hasAttribute("data-ls-aperture")) return;
      captureMenuOpenSize(root);
    });
    ro.observe(root);
  }

  const state = getMenuMeta(root);
  state.railDestroy = () => {
    mo.disconnect();
    if (ro) ro.disconnect();
    cancelMenuRailWaapi(root);
    clearMenuLabelFade(root);
    root.removeAttribute("data-ls-aperture");
    root.removeAttribute("data-ls-rail");
    state.railDestroy = null;
    state.railAnim = null;
    state.labelAnims = null;
    state.railToken = null;
  };
}

function isPopoverMenu(menu) {
  const host = menu.parentElement;
  return Boolean(
    host &&
      (host.classList.contains("ls-dropdown") || host.classList.contains("ls-btn-dropdown")),
  );
}

function menuFixedPlace(menu) {
  return {
    v: menu.classList.contains("top") ? "top" : menu.classList.contains("bottom") ? "bottom" : "",
    h: menu.classList.contains("end") ? "end" : menu.classList.contains("start") ? "start" : "",
  };
}

function placePopoverMenu(menu) {
  if (!isPopoverMenu(menu) || menu.hasAttribute("hidden")) return;
  const host = menu.parentElement;
  const clip = tipClipRect(host);
  const hostR = host.getBoundingClientRect();
  const menuR = menu.getBoundingClientRect();
  const gap = 4;
  const needH = Math.max(menuR.height, 1);
  const needW = Math.max(menuR.width, 1);
  const below = clip.bottom - hostR.bottom - gap;
  const above = hostR.top - clip.top - gap;
  const toEnd = clip.right - hostR.left;
  const toStart = hostR.right - clip.left;
  const lock = menuFixedPlace(menu);

  let v = lock.v;
  if (!v) {
    if (below >= needH) v = "bottom";
    else if (above >= needH) v = "top";
    else v = above > below ? "top" : "bottom";
  }

  let h = lock.h;
  if (!h) {
    if (toEnd >= needW) h = "start";
    else if (toStart >= needW) h = "end";
    else h = toEnd >= toStart ? "start" : "end";
  }

  const avail = v === "top" ? above : below;
  menu.style.setProperty("--ls-menu-pop-max-h", `${Math.max(48, Math.floor(avail))}px`);
  menu.setAttribute("data-ls-placement", `${v}-${h}`);
}

function initPopoverMenu(menu) {
  const state = getMenuMeta(menu);
  if (state.popoverDestroy) return;
  const host = menu.parentElement;
  if (!(host instanceof HTMLElement)) return;

  const schedule = () => placePopoverMenu(menu);

  const mo = new MutationObserver(schedule);
  mo.observe(menu, { attributes: true, attributeFilter: ["hidden", "class"] });
  mo.observe(host, { attributes: true, attributeFilter: ["class"] });

  const unregisterGeom = registerWindowGeom(schedule);

  if (!menu.hasAttribute("hidden")) schedule();

  state.popoverDestroy = () => {
    mo.disconnect();
    unregisterGeom();
    menu.removeAttribute("data-ls-placement");
    menu.style.removeProperty("--ls-menu-pop-max-h");
    state.popoverDestroy = null;
  };
}

function menuItemLabel(item) {
  return (
    item.querySelector(":scope > .label")?.textContent?.replace(/\s+/g, " ").trim() ||
    item.textContent?.replace(/\s+/g, " ").trim() ||
    ""
  );
}

function emitMenuSelect(root, item) {
  const label = menuItemLabel(item);
  const value = item.getAttribute("data-value") || label;
  return root.dispatchEvent(
    new CustomEvent("ls-menu:select", {
      bubbles: true,
      cancelable: true,
      detail: { item, label, value, menu: root },
    }),
  );
}

let collapseBound = false;
let collapseCleanups = [];

function resolveCollapseTarget(sel) {
  if (!sel) return null;
  try {
    const el = document.querySelector(sel);
    return el instanceof HTMLElement ? el : null;
  } catch {
    return null;
  }
}

function ensureMenuCollapseBinding() {
  if (collapseBound || typeof document === "undefined") return;
  collapseBound = true;

  const onClick = (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    const btn = t.closest("[data-ls-collapse]");
    if (!(btn instanceof HTMLElement)) return;
    const target = resolveCollapseTarget(btn.getAttribute("data-ls-collapse"));
    if (!target) return;
    event.preventDefault();
    const collapsed = target.classList.toggle("collapsed");
    btn.setAttribute("aria-expanded", String(!collapsed));
    btn.setAttribute("aria-pressed", String(collapsed));
    const labelOn = btn.getAttribute("data-ls-label-expanded");
    const labelOff = btn.getAttribute("data-ls-label-collapsed");
    if (labelOn && labelOff) btn.textContent = collapsed ? labelOff : labelOn;
  };

  trackListener(collapseCleanups, document, "click", onClick);
}

export function initMenu(root) {
  const existing = menuState.get(root);
  if (existing?.bound) return;

  ensureMenuCollapseBinding();

  const state = getMenuMeta(root);
  state.bound = true;

  root.querySelectorAll(".item").forEach((item) => {
    if (item instanceof HTMLElement) syncMenuExpandState(item);
  });

  const onClick = (event) => {
    const item = event.target.closest(".item");
    if (!item || !root.contains(item) || isMenuItemDisabled(item)) return;
    if (item.tagName === "A" && isMenuDummyHref(item)) event.preventDefault();
    if (isMenuExpander(item) && !root.classList.contains("collapsed")) {
      toggleMenuExpand(item);
      return;
    }
    root.querySelectorAll(".item.is-active").forEach((el) => {
      if (el !== item) el.classList.remove("is-active");
    });
    item.classList.add("is-active");
    emitMenuSelect(root, item);
  };

  const cleanups = [];
  trackListener(cleanups, root, "click", onClick);
  if (root.classList.contains("icons")) initMenuRail(root);
  if (isPopoverMenu(root)) initPopoverMenu(root);
  state.destroy = () => {
    cleanups.forEach((remove) => remove());
    state.railDestroy?.();
    state.popoverDestroy?.();
    menuState.delete(root);
  };
}

export function destroyMenu(root) {
  menuState.get(root)?.destroy?.();
}
