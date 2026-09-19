import { EXPAND_EASING, parseExpandDurationMs, trackListener } from "./util.js";

const expandState = new WeakMap();

function ensureExpandFrame(root) {
  let frame = root.querySelector(":scope > .frame");
  if (frame) return frame;
  frame = document.createElement("div");
  frame.className = "frame";
  while (root.firstChild) frame.appendChild(root.firstChild);
  root.appendChild(frame);
  return frame;
}

function applyExpandDurationVar(root) {
  const ms = parseExpandDurationMs(root);
  root.style.setProperty("--ls-expand-duration", `${ms}ms`);
  root.style.setProperty("--ls-expand-ease", EXPAND_EASING);
  return ms;
}

function expandTokenPx(root, name, fallback) {
  const v = parseFloat(getComputedStyle(root).getPropertyValue(name));
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function expandMode(root, which) {
  const v = (root.getAttribute(which) || "").trim();
  return v || "tr";
}

function isExpandEdgeMode(mode) {
  return mode === "r" || mode === "l" || mode === "t" || mode === "b";
}

function expandParentEl(root) {
  return root.offsetParent instanceof HTMLElement ? root.offsetParent : root.parentElement;
}

function cancelExpandWaapi(el) {
  if (!(el instanceof HTMLElement)) return;
  for (const anim of el.getAnimations()) {
    if (typeof CSSTransition !== "undefined" && anim instanceof CSSTransition) continue;
    if (typeof CSSAnimation !== "undefined" && anim instanceof CSSAnimation) continue;
    try {
      anim.commitStyles();
    } catch {
      /* ignore */
    }
    anim.cancel();
  }
}

function measureExpandOpenSize(root) {
  const parent = expandParentEl(root);
  const mode = expandMode(root, "data-expand");
  let w = expandTokenPx(root, "--ls-expand-open-w", 216);
  let h = expandTokenPx(root, "--ls-expand-open-h", 208);
  if (parent) {
    if (mode === "r" || mode === "l") {
      h = Math.max(expandTokenPx(root, "--ls-expand-collapsed-h", 28), parent.clientHeight);
    } else if (mode === "t" || mode === "b") {
      w = Math.max(expandTokenPx(root, "--ls-expand-collapsed-w", 28), parent.clientWidth);
    }
  }
  root.style.setProperty("--ls-expand-open-w", `${Math.round(w)}px`);
  root.style.setProperty("--ls-expand-open-h", `${Math.round(h)}px`);
  return { w: Math.round(w), h: Math.round(h) };
}

function measureExpandCollapsedSize(root) {
  return {
    w: Math.round(expandTokenPx(root, "--ls-expand-collapsed-w", 28)),
    h: Math.round(expandTokenPx(root, "--ls-expand-collapsed-h", 28)),
  };
}

/** 边停靠小钮沿边缘的偏移；50% 表示居中。 */
function parseExpandEdgeOffset(root, alongSize, collapsedSize) {
  const raw = getComputedStyle(root).getPropertyValue("--ls-expand-edge-offset").trim() || "50%";
  const max = Math.max(0, alongSize - collapsedSize);
  if (/%$/i.test(raw)) {
    const p = parseFloat(raw);
    if (!Number.isFinite(p)) return Math.round(max / 2);
    return Math.round(max * (p / 100));
  }
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return Math.round(max / 2);
  return Math.max(0, Math.min(max, Math.round(n)));
}

function measureExpandEdgeGeo(root, open) {
  const parent = expandParentEl(root);
  const collapse = expandMode(root, "data-collapse");
  const collapsed = measureExpandCollapsedSize(root);
  const expanded = measureExpandOpenSize(root);
  const parentW = parent instanceof HTMLElement ? parent.clientWidth : expanded.w;
  const parentH = parent instanceof HTMLElement ? parent.clientHeight : expanded.h;
  const handleY = parseExpandEdgeOffset(root, parentH, collapsed.h);
  const handleX = parseExpandEdgeOffset(root, parentW, collapsed.w);
  const geo = {
    mode: collapse,
    w: open ? expanded.w : collapsed.w,
    h: open ? expanded.h : collapsed.h,
    handleX,
    handleY,
  };
  if (collapse === "r" || collapse === "l") {
    geo.top = open ? 0 : handleY;
    geo.frameTop = open ? 0 : -handleY;
  }
  if (collapse === "t" || collapse === "b") {
    geo.left = open ? 0 : handleX;
    geo.frameLeft = open ? 0 : -handleX;
  }
  return geo;
}

function animateExpandBox(el, toWidth, toHeight, durationMs, instant = false, extra = {}) {
  const prev = el.getBoundingClientRect();
  cancelExpandWaapi(el);
  const frame = extra.frame;
  if (frame instanceof HTMLElement) cancelExpandWaapi(frame);

  const parent = expandParentEl(el);
  const from = el.getBoundingClientRect();
  const pr = parent instanceof HTMLElement ? parent.getBoundingClientRect() : { top: 0, left: 0 };
  const fromW = from.width || prev.width;
  const fromH = from.height || prev.height;
  const fromTop = from.top - pr.top;
  const fromLeft = from.left - pr.left;

  const keyFrom = { width: `${fromW}px`, height: `${fromH}px` };
  const keyTo = { width: `${toWidth}px`, height: `${toHeight}px` };
  el.style.width = `${toWidth}px`;
  el.style.height = `${toHeight}px`;

  if (extra.top != null) {
    keyFrom.top = `${fromTop}px`;
    keyTo.top = `${extra.top}px`;
    el.style.top = `${extra.top}px`;
  }
  if (extra.left != null) {
    keyFrom.left = `${fromLeft}px`;
    keyTo.left = `${extra.left}px`;
    el.style.left = `${extra.left}px`;
  }

  const frameFrom = {};
  const frameTo = {};
  let animFrame = false;
  if (frame instanceof HTMLElement && extra.frameTop != null) {
    const prevTop = parseFloat(frame.style.top);
    frameFrom.top = `${Number.isFinite(prevTop) ? prevTop : extra.frameTop}px`;
    frameTo.top = `${extra.frameTop}px`;
    frame.style.top = `${extra.frameTop}px`;
    animFrame = true;
  }
  if (frame instanceof HTMLElement && extra.frameLeft != null) {
    const prevLeft = parseFloat(frame.style.left);
    frameFrom.left = `${Number.isFinite(prevLeft) ? prevLeft : extra.frameLeft}px`;
    frameTo.left = `${extra.frameLeft}px`;
    frame.style.left = `${extra.frameLeft}px`;
    animFrame = true;
  }

  const unchanged =
    Math.abs(fromW - toWidth) < 0.5 &&
    Math.abs(fromH - toHeight) < 0.5 &&
    (extra.top == null || Math.abs(fromTop - extra.top) < 0.5) &&
    (extra.left == null || Math.abs(fromLeft - extra.left) < 0.5);
  if (instant || unchanged) return;

  el.animate([keyFrom, keyTo], { duration: durationMs, easing: EXPAND_EASING });
  if (animFrame) {
    frame.animate([frameFrom, frameTo], { duration: durationMs, easing: EXPAND_EASING });
  }
}

function clearExpandFloatPlace(root) {
  root.style.removeProperty("top");
  root.style.removeProperty("left");
  root.style.removeProperty("right");
  root.style.removeProperty("bottom");
  root.removeAttribute("data-ls-float-place");
  root.removeAttribute("data-ls-float-pinned");
}

/**
 * 浮动：把当前停靠像素钉成 inline，之后只改宽高，不再重算 top/left/right/bottom。
 * 默认右下角向左上揭开（与 Lapin 同构）。
 */
function pinExpandFloatDock(root) {
  if (root.getAttribute("data-ls-float-pinned") === "1") return;

  const parent = root.offsetParent instanceof HTMLElement ? root.offsetParent : root.parentElement;
  if (!(parent instanceof HTMLElement)) return;

  if (!root.getAttribute("data-ls-float-anchor")) {
    root.setAttribute("data-ls-float-anchor", "br");
  }
  const anchor = root.getAttribute("data-ls-float-anchor") || "br";
  const pr = parent.getBoundingClientRect();
  const br = root.getBoundingClientRect();

  root.style.top = "auto";
  root.style.left = "auto";
  root.style.right = "auto";
  root.style.bottom = "auto";

  if (anchor === "tr" || anchor === "br") {
    root.style.right = `${Math.round(pr.right - br.right)}px`;
  }
  if (anchor === "tl" || anchor === "bl") {
    root.style.left = `${Math.round(br.left - pr.left)}px`;
  }
  if (anchor === "tr" || anchor === "tl") {
    root.style.top = `${Math.round(br.top - pr.top)}px`;
  }
  if (anchor === "br" || anchor === "bl") {
    root.style.bottom = `${Math.round(pr.bottom - br.bottom)}px`;
  }

  root.setAttribute("data-ls-float-pinned", "1");
  root.setAttribute("data-ls-float-place", anchor);
}

export function setExpandOpen(root, open, instant = false) {
  if (!(root instanceof HTMLElement)) return;
  ensureExpandFrame(root);
  const durationMs = applyExpandDurationVar(root);
  const isFloat =
    expandMode(root, "data-expand") === "float" ||
    (root.getAttribute("data-collapse") || "").trim() === "float";
  const collapse = expandMode(root, "data-collapse");
  const isEdgeButton = isExpandEdgeMode(collapse);

  if (isFloat) pinExpandFloatDock(root);

  let size;
  const extra = {};
  if (isEdgeButton) {
    const geo = measureExpandEdgeGeo(root, open);
    size = { w: geo.w, h: geo.h };
    root.style.setProperty("--ls-expand-handle-x", `${geo.handleX}px`);
    root.style.setProperty("--ls-expand-handle-y", `${geo.handleY}px`);
    extra.frame = root.querySelector(":scope > .frame");
    if (geo.top != null) extra.top = geo.top;
    if (geo.left != null) extra.left = geo.left;
    if (geo.frameTop != null) extra.frameTop = geo.frameTop;
    if (geo.frameLeft != null) extra.frameLeft = geo.frameLeft;
  } else {
    size = open ? measureExpandOpenSize(root) : measureExpandCollapsedSize(root);
  }

  root.classList.toggle("is-expanded", open);
  const head = root.querySelector(".head");
  if (head) head.setAttribute("aria-expanded", open ? "true" : "false");

  animateExpandBox(root, size.w, size.h, durationMs, instant, extra);
}

export function initExpand(root) {
  if (!(root instanceof HTMLElement) || expandState.has(root)) return;
  ensureExpandFrame(root);
  const head = root.querySelector(".head");
  if (!(head instanceof HTMLElement)) return;

  applyExpandDurationVar(root);

  const isFloat =
    expandMode(root, "data-expand") === "float" ||
    (root.getAttribute("data-collapse") || "").trim() === "float";
  if (isFloat && !root.hasAttribute("data-ls-float-anchor")) {
    root.setAttribute("data-ls-float-anchor", "br");
  }

  const initial =
    root.hasAttribute("data-expanded") ||
    root.classList.contains("is-expanded");
  // 先落到收起/展开尺寸，再钉浮动坐标，避免用未布局的 rect
  setExpandOpen(root, initial, true);
  if (isFloat) pinExpandFloatDock(root);

  const onClick = (event) => {
    event.preventDefault();
    setExpandOpen(root, !root.classList.contains("is-expanded"), false);
  };
  const cleanups = [];
  trackListener(cleanups, head, "click", onClick);

  const onAttr = (mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "data-duration") applyExpandDurationVar(root);
    }
  };
  const mo = new MutationObserver(onAttr);
  mo.observe(root, { attributes: true, attributeFilter: ["data-duration"] });

  // 边停靠：父级尺寸变化时同步满高/满宽，并保持小钮沿边偏移
  const parent = expandParentEl(root);
  let ro = null;
  const edgeMode = expandMode(root, "data-expand");
  if (parent && isExpandEdgeMode(edgeMode)) {
    ro = new ResizeObserver(() => {
      if (root.getAnimations().some((a) => {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
        if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
        return true;
      })) return;
      setExpandOpen(root, root.classList.contains("is-expanded"), true);
    });
    ro.observe(parent);
  }

  expandState.set(root, {
    destroy() {
      cleanups.forEach((remove) => remove());
      mo.disconnect();
      ro?.disconnect();
      clearExpandFloatPlace(root);
      root.removeAttribute("data-ls-float-anchor");
      expandState.delete(root);
    },
  });
}

export function destroyExpand(root) {
  expandState.get(root)?.destroy();
}
