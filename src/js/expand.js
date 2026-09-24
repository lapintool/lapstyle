import { EXPAND_EASING, parseExpandDurationMs, trackListener } from "./util.js";

const expandState = new WeakMap();
const expandWarned = new WeakMap();
const expandRequested = new WeakMap();

const EXPAND_CORNERS = ["tl", "tr", "bl", "br"];
const EXPAND_EDGES = ["t", "r", "b", "l"];
const EXPAND_DEFAULT_OPEN_W = 216;
const EXPAND_DEFAULT_OPEN_H = 208;

function isExpandValue(v) {
  return v === "float" || EXPAND_CORNERS.includes(v) || EXPAND_EDGES.includes(v);
}

/** 角钮可展开成同一个角或它相邻的两条边；边钮只能沿同一条边展开。 */
function expandAllowed(collapse, expand) {
  if (EXPAND_EDGES.includes(collapse)) return expand === collapse;
  return expand === collapse || (EXPAND_EDGES.includes(expand) && collapse.includes(expand));
}

function readExpandPx(raw, name, used, issues) {
  if (raw == null || raw === "") return null;
  const text = String(raw).trim();
  if (!used) {
    issues.push(`${name}="${text}" is ignored in this mode`);
    return null;
  }
  const m = /^(\d+(?:\.\d+)?)(?:px)?$/i.exec(text);
  const n = m ? Number(m[1]) : NaN;
  if (!(n > 0)) {
    issues.push(`${name}="${text}" is not a positive pixel value; using the default`);
    return null;
  }
  return Math.round(n);
}

/**
 * 把 expand / collapse / floatAnchor / openWidth / openHeight 收敛到合法布局。
 * 无效值忽略，不相容的 expand 改成 collapse，当前模式用不到的尺寸置 null。
 */
export function normalizeExpandConfig(input = {}) {
  const issues = [];
  const pick = (v) => String(v ?? "").trim().toLowerCase();
  let expand = pick(input.expand);
  let collapse = pick(input.collapse);
  let floatAnchor = pick(input.floatAnchor);

  if (expand && !isExpandValue(expand)) {
    issues.push(`expand="${expand}" is not a valid value`);
    expand = "";
  }
  if (collapse && !isExpandValue(collapse)) {
    issues.push(`collapse="${collapse}" is not a valid value`);
    collapse = "";
  }

  if (expand === "float" || collapse === "float") {
    if (expand && expand !== "float") issues.push(`expand="${expand}" becomes "float" because collapse is float`);
    if (collapse && collapse !== "float") issues.push(`collapse="${collapse}" becomes "float" because expand is float`);
    expand = "float";
    collapse = "float";
    if (!EXPAND_CORNERS.includes(floatAnchor)) {
      if (floatAnchor) issues.push(`floatAnchor="${floatAnchor}" is not valid; using "br"`);
      floatAnchor = "br";
    }
  } else {
    if (floatAnchor) issues.push(`floatAnchor="${floatAnchor}" only applies to float`);
    floatAnchor = "";
    if (!collapse) collapse = expand || "tr";
    if (!expand) expand = collapse;
    if (!expandAllowed(collapse, expand)) {
      issues.push(`expand="${expand}" does not fit collapse="${collapse}"; using "${collapse}"`);
      expand = collapse;
    }
  }

  const usesWidth = expand !== "t" && expand !== "b";
  const usesHeight = expand !== "l" && expand !== "r";
  const openWidth = readExpandPx(input.openWidth, "openWidth", usesWidth, issues);
  const openHeight = readExpandPx(input.openHeight, "openHeight", usesHeight, issues);

  return { expand, collapse, floatAnchor, openWidth, openHeight, issues };
}

/** 每个元素同一条提示只打一次。 */
export function warnExpandIssues(el, issues) {
  if (!issues?.length || typeof console === "undefined") return;
  let seen = expandWarned.get(el);
  if (!seen) {
    seen = new Set();
    expandWarned.set(el, seen);
  }
  for (const msg of issues) {
    if (seen.has(msg)) continue;
    seen.add(msg);
    console.warn(`[lapstyle] ls-expand: ${msg}`, el);
  }
}

/** 按 data-* 读配置、纠正后写回，保证 CSS 选择器只会命中合法组合。 */
function applyExpandConfig(root) {
  const config = normalizeExpandConfig({
    expand: root.getAttribute("data-expand"),
    collapse: root.getAttribute("data-collapse"),
    floatAnchor: root.getAttribute("data-ls-float-anchor"),
    openWidth: root.getAttribute("data-open-width"),
    openHeight: root.getAttribute("data-open-height"),
  });
  warnExpandIssues(root, config.issues);
  const setAttr = (name, value) => {
    if (value == null || value === "") {
      if (root.hasAttribute(name)) root.removeAttribute(name);
    } else if (root.getAttribute(name) !== String(value)) {
      root.setAttribute(name, String(value));
    }
  };
  setAttr("data-expand", config.expand);
  setAttr("data-collapse", config.collapse);
  setAttr("data-ls-float-anchor", config.floatAnchor);
  setAttr("data-open-width", config.openWidth);
  setAttr("data-open-height", config.openHeight);
  return config;
}

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

/** 父级 padding box 尺寸（比 clientHeight 更贴齐边框，减轻非 1× DPR 下 1px 缝）。 */
function parentContentSize(parent) {
  const r = parent.getBoundingClientRect();
  const cs = getComputedStyle(parent);
  const w =
    r.width - (parseFloat(cs.borderLeftWidth) || 0) - (parseFloat(cs.borderRightWidth) || 0);
  const h =
    r.height - (parseFloat(cs.borderTopWidth) || 0) - (parseFloat(cs.borderBottomWidth) || 0);
  return { w: Math.max(0, w), h: Math.max(0, h) };
}

function cancelExpandWaapi(el) {
  if (!(el instanceof HTMLElement)) return;
  for (const anim of el.getAnimations()) {
    if (typeof CSSTransition !== "undefined" && anim instanceof CSSTransition) continue;
    if (typeof CSSAnimation !== "undefined" && anim instanceof CSSAnimation) continue;
    anim.cancel();
  }
}

/** 作者要的展开尺寸：data-open-* 优先，其次初始化时样式里的 --ls-expand-open-*。 */
function requestedExpandSize(root) {
  const base = expandRequested.get(root) || { w: EXPAND_DEFAULT_OPEN_W, h: EXPAND_DEFAULT_OPEN_H };
  const attrW = parseFloat(root.getAttribute("data-open-width"));
  const attrH = parseFloat(root.getAttribute("data-open-height"));
  return { w: attrW > 0 ? attrW : base.w, h: attrH > 0 ? attrH : base.h };
}

/** 浮动钉住后离宿主边的距离，展开尺寸要扣掉，免得撑出宿主。 */
function floatInset(root) {
  if (expandMode(root, "data-collapse") !== "float") return { x: 0, y: 0 };
  const anchor = root.getAttribute("data-ls-float-anchor") || "br";
  const px = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  return {
    x: px(anchor === "tr" || anchor === "br" ? root.style.right : root.style.left),
    y: px(anchor === "tr" || anchor === "tl" ? root.style.top : root.style.bottom),
  };
}

function measureExpandOpenSize(root) {
  const parent = expandParentEl(root);
  const mode = expandMode(root, "data-expand");
  const minW = expandTokenPx(root, "--ls-expand-collapsed-w", 28);
  const minH = expandTokenPx(root, "--ls-expand-collapsed-h", 28);
  let { w, h } = requestedExpandSize(root);
  if (parent) {
    const box = parentContentSize(parent);
    const inset = floatInset(root);
    const maxW = Math.max(minW, Math.floor(box.w - inset.x));
    const maxH = Math.max(minH, Math.floor(box.h - inset.y));
    if (mode === "r" || mode === "l") {
      h = Math.max(minH, Math.ceil(box.h - 1e-6));
    } else {
      h = Math.min(Math.max(h, minH), maxH);
    }
    if (mode === "t" || mode === "b") {
      w = Math.max(minW, Math.ceil(box.w - 1e-6));
    } else {
      w = Math.min(Math.max(w, minW), maxW);
    }
  } else {
    w = Math.max(w, minW);
    h = Math.max(h, minH);
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
  const box = parent instanceof HTMLElement ? parentContentSize(parent) : { w: expanded.w, h: expanded.h };
  const parentW = box.w;
  const parentH = box.h;
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

/**
 * 动画结束后贴齐：只拉「对边」，不动 data-collapse 钉住的那一侧。
 * axis=v（expand r|l）：顶停靠拉 bottom，底停靠拉 top。
 * axis=h（expand t|b）：右停靠拉 left，左停靠拉 right。
 */
function settleExpandStretch(el, axis) {
  const collapse = expandMode(el, "data-collapse");
  if (axis === "v") {
    el.style.height = "auto";
    if (collapse === "br" || collapse === "bl" || collapse === "b") {
      el.style.top = "0px";
      el.setAttribute("data-ls-expand-stretch", "v-top");
    } else {
      el.style.bottom = "0px";
      el.setAttribute("data-ls-expand-stretch", "v-bottom");
    }
  } else if (axis === "h") {
    el.style.width = "auto";
    if (collapse === "tl" || collapse === "bl" || collapse === "l") {
      el.style.right = "0px";
      el.setAttribute("data-ls-expand-stretch", "h-right");
    } else {
      el.style.left = "0px";
      el.setAttribute("data-ls-expand-stretch", "h-left");
    }
  }
}

/** 收起 / 重动画前：把 stretch 收成 px，并清掉对边 inset，避免钉错角。 */
function clearExpandStretch(el, visual = null) {
  const axis = el.getAttribute("data-ls-expand-stretch");
  if (!axis) return;
  const rect = visual || el.getBoundingClientRect();
  if (axis.startsWith("v")) {
    if (rect.height > 0) el.style.height = `${Math.round(rect.height)}px`;
    if (axis === "v-top") el.style.removeProperty("top");
    else el.style.removeProperty("bottom");
  } else if (axis.startsWith("h")) {
    if (rect.width > 0) el.style.width = `${Math.round(rect.width)}px`;
    if (axis === "h-right") el.style.removeProperty("right");
    else el.style.removeProperty("left");
  }
  el.removeAttribute("data-ls-expand-stretch");
}

function animateExpandBox(el, toWidth, toHeight, durationMs, instant = false, extra = {}) {
  // 先占 busy / token，让旧动画的 oncancel 因 token 不匹配而直接返回
  const token = {};
  el._lsExpandBusy = true;
  el._lsExpandAnimToken = token;
  const parent = expandParentEl(el);
  const visual = el.getBoundingClientRect();
  const pr = parent instanceof HTMLElement ? parent.getBoundingClientRect() : { top: 0, left: 0 };
  const fromW = visual.width;
  const fromH = visual.height;
  const fromTop = visual.top - pr.top;
  const fromLeft = visual.left - pr.left;

  clearExpandStretch(el, visual);
  cancelExpandWaapi(el);
  const frame = extra.frame;
  if (frame instanceof HTMLElement) cancelExpandWaapi(frame);

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

  const finishStretch = () => {
    if (el._lsExpandAnimToken !== token) return;
    el._lsExpandAnimToken = null;
    if (extra.stretchAxis) settleExpandStretch(el, extra.stretchAxis);
    el._lsExpandBusy = false;
  };

  const unchanged =
    Math.abs(fromW - toWidth) < 0.5 &&
    Math.abs(fromH - toHeight) < 0.5 &&
    (extra.top == null || Math.abs(fromTop - extra.top) < 0.5) &&
    (extra.left == null || Math.abs(fromLeft - extra.left) < 0.5);
  if (instant || unchanged) {
    finishStretch();
    return;
  }

  const anim = el.animate([keyFrom, keyTo], {
    duration: durationMs,
    easing: EXPAND_EASING,
    fill: "none",
  });
  if (animFrame) {
    frame.animate([frameFrom, frameTo], {
      duration: durationMs,
      easing: EXPAND_EASING,
      fill: "none",
    });
  }
  anim.onfinish = finishStretch;
  anim.oncancel = finishStretch;
  anim.finished.then(finishStretch, finishStretch);
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
  applyExpandConfig(root);
  const durationMs = applyExpandDurationVar(root);
  const expand = expandMode(root, "data-expand");
  const isFloat =
    expand === "float" ||
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

  // 仅展开结束时 stretch；收起前 animateExpandBox 内会 clearExpandStretch
  if (open && (expand === "r" || expand === "l")) extra.stretchAxis = "v";
  if (open && (expand === "t" || expand === "b")) extra.stretchAxis = "h";

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

  const authorAnchor = root.hasAttribute("data-ls-float-anchor");
  const config = applyExpandConfig(root);
  if (!expandRequested.has(root)) {
    expandRequested.set(root, {
      w: expandTokenPx(root, "--ls-expand-open-w", EXPAND_DEFAULT_OPEN_W),
      h: expandTokenPx(root, "--ls-expand-open-h", EXPAND_DEFAULT_OPEN_H),
    });
  }
  applyExpandDurationVar(root);

  const isFloat = config.collapse === "float";

  const initial =
    root.hasAttribute("data-expanded") ||
    root.classList.contains("is-expanded");
  // 先落到收起/展开尺寸，再钉浮动坐标，避免用未布局的 rect
  setExpandOpen(root, initial, true);
  if (isFloat) pinExpandFloatDock(root);

  const onClick = (event) => {
    event.preventDefault();
    const open = !root.classList.contains("is-expanded");
    setExpandOpen(root, open, false);
    root.dispatchEvent(new CustomEvent("ls-expand:toggle", { detail: { open }, bubbles: true }));
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

  // 父级尺寸变化时重算：边停靠同步满高/满宽，其余模式把展开尺寸重新夹进宿主。
  // 已 stretch 时由 CSS 贴边，勿反复 clear。
  const parent = expandParentEl(root);
  let ro = null;
  if (parent) {
    ro = new ResizeObserver(() => {
      if (root._lsExpandBusy) return;
      if (root.getAnimations().some((a) => {
        if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) return false;
        if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation) return false;
        return true;
      })) return;
      if (root.classList.contains("is-expanded") && root.hasAttribute("data-ls-expand-stretch")) {
        return;
      }
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
      if (!authorAnchor) root.removeAttribute("data-ls-float-anchor");
      clearExpandStretch(root);
      expandState.delete(root);
    },
  });
}

export function destroyExpand(root) {
  expandState.get(root)?.destroy();
}

/** 停靠方式变了以后重建：清掉旧模式写下的定位，再按新配置初始化，保留开合状态。 */
export function refreshExpand(root) {
  if (!(root instanceof HTMLElement)) return;
  const open = root.classList.contains("is-expanded");
  destroyExpand(root);
  for (const prop of ["top", "left", "right", "bottom", "width", "height"]) root.style.removeProperty(prop);
  const frame = root.querySelector(":scope > .frame");
  if (frame instanceof HTMLElement) {
    frame.style.removeProperty("top");
    frame.style.removeProperty("left");
  }
  root.classList.toggle("is-expanded", open);
  initExpand(root);
}
