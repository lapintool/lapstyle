// Shared helpers for Lapstyle modules.

export function hexToRgb(hex) {
  const parsed = parseHex(hex);
  if (!parsed) return { r: 0, g: 0, b: 0 };
  const v = parseInt(parsed.slice(1), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function rgbToHsv(r, g, b) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rr) h = (gg - bb) / delta + (gg < bb ? 6 : 0);
    else if (max === gg) h = (bb - rr) / delta + 2;
    else h = (rr - gg) / delta + 4;
    h /= 6;
  }
  return { h: h * 360, s: max === 0 ? 0 : delta / max, v: max };
}

export function hsvToRgb(h, s, v) {
  const hue = (((h % 360) + 360) % 360) / 60;
  const c = v * s;
  const x = c * (1 - Math.abs((hue % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (hue < 1) [r, g, b] = [c, x, 0];
  else if (hue < 2) [r, g, b] = [x, c, 0];
  else if (hue < 3) [r, g, b] = [0, c, x];
  else if (hue < 4) [r, g, b] = [0, x, c];
  else if (hue < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function parseHex(raw) {
  let v = String(raw).trim().toLowerCase();
  if (!v.startsWith("#")) v = `#${v}`;
  if (/^#[0-9a-f]{6}$/.test(v)) return v;
  if (/^#[0-9a-f]{3}$/.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return null;
}

// 记录每个增强实例添加的监听器，供 destroy 逐一移除。
export function trackListener(cleanups, target, type, fn, options) {
  target.addEventListener(type, fn, options);
  cleanups.push(() => target.removeEventListener(type, fn, options));
}

// 全局 resize/scroll 共用一份监听，避免每个 popover 各挂一对。
const windowGeomCallbacks = new Set();
let windowGeomBound = false;
let windowGeomRaf = 0;

function onWindowGeomFlush() {
  windowGeomRaf = 0;
  for (const cb of windowGeomCallbacks) cb();
}

function onWindowGeomEvent() {
  if (windowGeomRaf) return;
  windowGeomRaf = requestAnimationFrame(onWindowGeomFlush);
}

function ensureWindowGeomListeners() {
  if (windowGeomBound || typeof window === "undefined") return;
  windowGeomBound = true;
  window.addEventListener("resize", onWindowGeomEvent);
  window.addEventListener("scroll", onWindowGeomEvent, true);
}

export function registerWindowGeom(cb) {
  windowGeomCallbacks.add(cb);
  ensureWindowGeomListeners();
  return () => {
    windowGeomCallbacks.delete(cb);
  };
}

export function ratio(el, event, axis) {
  const rect = el.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const x = w > 0 ? Math.min(1, Math.max(0, (event.clientX - rect.left) / w)) : 0;
  if (axis === "x") return { x, y: 0 };
  const y = h > 0 ? Math.min(1, Math.max(0, (event.clientY - rect.top) / h)) : 0;
  return { x, y };
}

export function between(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

export function parseNum(raw, fallback) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function decimalsOf(step) {
  const part = String(step).trim().split(".")[1] || "";
  return part.length;
}

export function roundToStep(value, step, origin = 0) {
  if (!(step > 0)) return value;
  // 用相对误差缓解浮点除法偏格
  const n = Math.round((value - origin) / step + Number.EPSILON);
  return Number.parseFloat((origin + n * step).toFixed(decimalsOf(step)));
}

export function sameNumber(a, b) {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-9;
}

/** Clip rect used by tooltip auto-placement and popover menus. */
export function tipClipRect(host) {
  let clip = {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };
  let node = host.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    const oy = style.overflowY;
    const ox = style.overflowX;
    if (/(auto|scroll|hidden|clip)/.test(oy) || /(auto|scroll|hidden|clip)/.test(ox)) {
      const r = node.getBoundingClientRect();
      clip = {
        top: Math.max(clip.top, r.top),
        left: Math.max(clip.left, r.left),
        right: Math.min(clip.right, r.right),
        bottom: Math.min(clip.bottom, r.bottom),
      };
    }
    node = node.parentElement;
  }
  return clip;
}

/** Shared by expand panel and menu rail aperture animations. */
export const EXPAND_EASING = "cubic-bezier(0.165, 0.84, 0.44, 1)";

export function parseExpandDurationMs(root) {
  const raw = (root.getAttribute("data-duration") || "").trim();
  const fromAttr = raw || getComputedStyle(root).getPropertyValue("--ls-expand-duration").trim() || "0.5s";
  if (/ms$/i.test(fromAttr)) return Math.max(0, parseFloat(fromAttr) || 500);
  if (/s$/i.test(fromAttr)) return Math.max(0, (parseFloat(fromAttr) || 0.5) * 1000);
  const n = parseFloat(fromAttr);
  if (!Number.isFinite(n)) return 500;
  return n > 20 ? n : n * 1000;
}
