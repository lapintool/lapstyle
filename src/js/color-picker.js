import {
  hexToRgb,
  hsvToRgb,
  parseHex,
  ratio,
  rgbToHex,
  rgbToHsv,
  trackListener,
} from "./util.js";

const pickerState = new WeakMap();

function renderPicker(picker, hex, h, s, v) {
  const hueRgb = hsvToRgb(h, 1, 1);
  picker.style.setProperty("--ls-cp-value", hex);
  picker.style.setProperty("--ls-cp-hue", rgbToHex(hueRgb.r, hueRgb.g, hueRgb.b));
  picker.style.setProperty("--ls-cp-h", String(h));
  picker.style.setProperty("--ls-cp-s", String(s));
  picker.style.setProperty("--ls-cp-v", String(v));
  const hexInput = picker.querySelector(".hex");
  if (hexInput && document.activeElement !== hexInput) hexInput.value = hex;
  const hidden = picker.querySelector('input[type="hidden"]');
  if (hidden && hidden.value !== hex) hidden.value = hex;
}

function emitValue(picker, hex) {
  picker.dispatchEvent(new CustomEvent("ls-color-picker:input", { detail: { value: hex }, bubbles: true }));
}

export function setPickerValue(picker, hex, opts) {
  const parsed = parseHex(hex) || "#888888";
  const rgb = hexToRgb(parsed);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const state = pickerState.get(picker);
  if (typeof state?.setHsv === "function") {
    state.setHsv(hsv.h, hsv.s, hsv.v, parsed, opts);
    return;
  }
  renderPicker(picker, parsed, hsv.h, hsv.s, hsv.v);
  if (!opts?.silent) emitValue(picker, parsed);
}

export function initColorPicker(picker) {
  if (pickerState.has(picker)) return;

  const initial = parseHex(picker.dataset.value || "#888888") || "#888888";
  const initialRgb = hexToRgb(initial);
  const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);
  // Hue is authoritative state; preserved across S/V changes so the hue
  // thumb does not drift when dragging into low-saturation/low-value areas.
  let h = initialHsv.h;
  let s = initialHsv.s;
  let v = initialHsv.v;

  const sv = picker.querySelector(".sv");
  const hue = picker.querySelector(".hue");
  const hexInput = picker.querySelector(".hex");
  let drag = null;

  function commit() {
    const rgb = hsvToRgb(h, s, v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    renderPicker(picker, hex, h, s, v);
    emitValue(picker, hex);
  }

  function onSv(event) {
    const { x, y } = ratio(sv, event, "xy");
    s = x;
    v = 1 - y;
    commit();
  }

  function onHue(event) {
    const { x } = ratio(hue, event, "x");
    h = x * 360;
    commit();
  }

  function start(kind, event) {
    drag = kind;
    (event.currentTarget).setPointerCapture(event.pointerId);
    if (kind === "sv") onSv(event);
    else onHue(event);
  }

  function move(kind, event) {
    if (drag !== kind) return;
    if (kind === "sv") onSv(event);
    else onHue(event);
  }

  function end() {
    if (drag === null) return;
    drag = null;
    picker.dispatchEvent(new CustomEvent("ls-color-picker:change", { detail: { value: picker.style.getPropertyValue("--ls-cp-value") }, bubbles: true }));
  }

  renderPicker(picker, initial, h, s, v);

  const cleanups = [];
  if (sv) {
    trackListener(cleanups, sv, "pointerdown", (e) => start("sv", e));
    trackListener(cleanups, sv, "pointermove", (e) => move("sv", e));
    trackListener(cleanups, sv, "pointerup", end);
    trackListener(cleanups, sv, "pointercancel", end);
  }
  if (hue) {
    trackListener(cleanups, hue, "pointerdown", (e) => start("hue", e));
    trackListener(cleanups, hue, "pointermove", (e) => move("hue", e));
    trackListener(cleanups, hue, "pointerup", end);
    trackListener(cleanups, hue, "pointercancel", end);
  }
  if (hexInput) {
    trackListener(cleanups, hexInput, "input", () => {
      const next = parseHex(hexInput.value);
      if (!next) return;
      const rgb = hexToRgb(next);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      h = hsv.s < 0.02 || hsv.v < 0.02 ? h : hsv.h;
      s = hsv.s;
      v = hsv.v;
      renderPicker(picker, next, h, s, v);
      emitValue(picker, next);
    });
    trackListener(cleanups, hexInput, "blur", () => {
      const next = parseHex(hexInput.value);
      if (!next) {
        const cur = picker.style.getPropertyValue("--ls-cp-value") || "#888888";
        renderPicker(picker, cur, h, s, v);
        return;
      }
      picker.dispatchEvent(new CustomEvent("ls-color-picker:change", { detail: { value: next }, bubbles: true }));
    });
    trackListener(cleanups, hexInput, "keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const next = parseHex(hexInput.value);
      if (!next) {
        const cur = picker.style.getPropertyValue("--ls-cp-value") || "#888888";
        renderPicker(picker, cur, h, s, v);
        return;
      }
      picker.dispatchEvent(new CustomEvent("ls-color-picker:change", { detail: { value: next }, bubbles: true }));
      hexInput.blur();
    });
  }

  const state = {
    setHsv(nh, ns, nv, hex, opts) {
      const nextHex = String(hex).toLowerCase();
      const curHex = (picker.style.getPropertyValue("--ls-cp-value") || "").trim().toLowerCase();
      // 自己 emit 后又被 v-model / 外层 watch 写回同一 hex：保留当前 H（SV 拖动时绝不能从 RGB 反算色相）
      if (curHex === nextHex) {
        renderPicker(picker, nextHex, h, s, v);
        if (!opts?.silent) emitValue(picker, nextHex);
        return;
      }
      // 外层设成近灰 / 近黑，或用当前色相编码出同一 hex：也别改 H
      const keptRgb = hsvToRgb(h, ns, nv);
      const kept = rgbToHex(keptRgb.r, keptRgb.g, keptRgb.b);
      if (ns < 0.02 || nv < 0.02 || kept === nextHex) {
        s = ns;
        v = nv;
      } else {
        h = nh;
        s = ns;
        v = nv;
      }
      renderPicker(picker, nextHex, h, s, v);
      if (!opts?.silent) emitValue(picker, nextHex);
    },
    destroy() {
      cleanups.forEach((remove) => remove());
      pickerState.delete(picker);
    },
  };
  pickerState.set(picker, state);
}

export function destroyColorPicker(picker) {
  pickerState.get(picker)?.destroy();
}
