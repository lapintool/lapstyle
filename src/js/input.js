import { registerWindowGeom } from "./util.js";

// Preserve native stepping and hit targets. Paint independent hover states in
// a decorative overlay because Chromium exposes both arrows as one pseudo-element.
const instances = new WeakMap();

export function initInput(input) {
  if (instances.has(input)) return;
  let overlay;
  let timer;
  let unregister;
  const removeOverlay = () => {
    clearTimeout(timer);
    overlay?.remove();
    overlay = undefined;
    unregister?.();
    unregister = undefined;
    input.classList.remove("is-spin-overlay");
  };
  const clear = () => {
    input.classList.remove("is-spin-hover", "is-spin-up-hover", "is-spin-down-hover");
    if (!overlay) return;
    overlay.classList.remove("up-hover", "down-hover");
    clearTimeout(timer);
    const durations = getComputedStyle(overlay.firstElementChild).transitionDuration.split(",");
    const duration = Math.max(0, ...durations.map((value) => parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000) || 0));
    timer = setTimeout(removeOverlay, duration);
  };
  const move = (event) => {
    if (input.type !== "number" || input.disabled || input.readOnly) return clear();
    const rect = input.getBoundingClientRect();
    const style = getComputedStyle(input);
    const scale = parseFloat(style.getPropertyValue("--ls-input-spin-size")) || 1;
    const width = 14 * scale;
    const height = 22 * scale;
    const rtl = style.direction === "rtl";
    const inset = (parseFloat(rtl ? style.paddingLeft : style.paddingRight) || 0) + (parseFloat(rtl ? style.borderLeftWidth : style.borderRightWidth) || 0);
    const edge = rtl ? event.clientX - rect.left : rect.right - event.clientX;
    const center = rect.top + rect.height / 2;
    if (edge < inset || edge > inset + width || Math.abs(event.clientY - center) > height / 2) return clear();
    clearTimeout(timer);
    const created = !overlay;
    if (!overlay) {
      overlay = document.createElement("span");
      overlay.className = "ls-input-spin-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = '<span class="up"><svg viewBox="0 0 12 11"><path d="M1 8.2 6 2.4 11 8.2 9.2 8.2 6 4.8 2.8 8.2Z"/></svg></span><span class="down"><svg viewBox="0 0 12 11"><path d="M1 2.8 2.8 2.8 6 6.2 9.2 2.8 11 2.8 6 8.6Z"/></svg></span>';
      document.body.append(overlay);
      unregister = registerWindowGeom(() => { clear(); removeOverlay(); });
    }
    Object.assign(overlay.style, {
      left: `${rtl ? rect.left + inset : rect.right - inset - width}px`,
      top: `${center - height / 2}px`, width: `${width}px`, height: `${height}px`,
      color: style.color,
    });
    overlay.style.setProperty("--ls-spin-accent", style.getPropertyValue("--ls-accent-hover").trim() || style.color);
    overlay.style.setProperty("--ls-hover", style.getPropertyValue("--ls-hover"));
    // Commit the same resting color/geometry as the native arrows before fading.
    if (created) void overlay.offsetWidth;
    const up = event.clientY < center;
    input.classList.add("is-spin-overlay", "is-spin-hover");
    input.classList.toggle("is-spin-up-hover", up);
    input.classList.toggle("is-spin-down-hover", !up);
    overlay.classList.toggle("up-hover", up);
    overlay.classList.toggle("down-hover", !up);
  };
  input.addEventListener("pointermove", move);
  input.addEventListener("pointerleave", clear);
  input.addEventListener("blur", clear);
  instances.set(input, () => {
    input.removeEventListener("pointermove", move);
    input.removeEventListener("pointerleave", clear);
    input.removeEventListener("blur", clear);
    clear();
    removeOverlay();
  });
}

export function destroyInput(input) {
  instances.get(input)?.();
  instances.delete(input);
}
