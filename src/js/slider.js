import {
  between,
  decimalsOf,
  parseNum,
  roundToStep,
  sameNumber,
  trackListener,
} from "./util.js";

const sliderState = new WeakMap();

const LS_SLIDER_THUMB_PATH = "M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0";
const LS_SLIDER_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

function ensureSliderDom(root) {
  let trackContainer = root.querySelector(".track-container");
  if (!trackContainer) {
    trackContainer = document.createElement("div");
    trackContainer.className = "track-container";
    root.appendChild(trackContainer);
  }

  let track = trackContainer.querySelector(".track");
  if (!track) {
    track = document.createElement("div");
    track.className = "track";
    trackContainer.appendChild(track);
  }

  let inner = track.querySelector(".inner");
  if (!inner) {
    inner = document.createElement("div");
    inner.className = "inner";
    track.appendChild(inner);
  }

  let selection = track.querySelector(".selection");
  if (!selection) {
    selection = document.createElement("div");
    selection.className = "selection";
    track.appendChild(selection);
  }

  let markers = track.querySelector(".markers");
  if (!markers) {
    markers = document.createElement("div");
    markers.className = "markers";
    track.appendChild(markers);
  }

  let thumb = track.querySelector(".thumb");
  if (!thumb) {
    thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.innerHTML = `
      <svg class="thumb-shape" viewBox="0 0 20 20" aria-hidden="true"><path d="${LS_SLIDER_THUMB_PATH}"></path></svg>
      <div class="focus-ring"></div>
      <div class="pin">
        <div class="label">
          <div class="text-container"><span class="text"></span></div>
        </div>
      </div>`;
    track.appendChild(thumb);
  }

  let markerLabels = root.querySelector(".marker-labels");
  if (!markerLabels) {
    markerLabels = document.createElement("div");
    markerLabels.className = "marker-labels";
    root.appendChild(markerLabels);
  }

  return { trackContainer, track, inner, selection, markers, thumb, markerLabels };
}

function ensureSliderInput(root, dom) {
  const want = root.classList.contains("input");
  let field = root.querySelector(":scope > .field");
  if (!want) {
    if (field) field.hidden = true;
    dom.field = field || null;
    dom.input = field?.querySelector("input") || null;
    dom.suffix = field?.querySelector(".suffix") || null;
    return;
  }

  if (!field) {
    field = document.createElement("div");
    field.className = "field";
    const orphan = root.querySelector(":scope > input");
    if (orphan) {
      orphan.replaceWith(field);
      field.appendChild(orphan);
    } else {
      root.appendChild(field);
    }
  }
  field.hidden = false;

  let input = field.querySelector("input");
  if (!input) {
    input = document.createElement("input");
    input.type = "number";
    input.className = "ls-input value";
    field.insertBefore(input, field.firstChild);
  } else if (!input.classList.contains("ls-input")) {
    input.classList.add("ls-input");
  }
  if (!input.getAttribute("type")) input.type = "number";

  let suffix = field.querySelector(".suffix");
  if (!suffix) {
    suffix = document.createElement("span");
    suffix.className = "suffix";
    field.appendChild(suffix);
  }

  dom.field = field;
  dom.input = input;
  dom.suffix = suffix;
}

function readSliderConfig(root) {
  const min = parseNum(root.dataset.min, 0);
  const max = parseNum(root.dataset.max, 100);
  const step = Math.max(0, parseNum(root.dataset.step, 1));
  let innerMin = root.dataset.innerMin !== undefined ? parseNum(root.dataset.innerMin, min) : min;
  let innerMax = root.dataset.innerMax !== undefined ? parseNum(root.dataset.innerMax, max) : max;
  innerMin = between(innerMin, min, max);
  innerMax = between(innerMax, min, max);
  if (innerMin > innerMax) [innerMin, innerMax] = [innerMax, innerMin];

  let markers = false;
  if (root.dataset.markers !== undefined) {
    if (root.dataset.markers === "" || root.dataset.markers === "true") markers = true;
    else {
      const n = Number(root.dataset.markers);
      markers = Number.isFinite(n) && n > 0 ? n : true;
    }
  }

  let markerLabels = false;
  if (root.dataset.markerLabels !== undefined) {
    const raw = root.dataset.markerLabels;
    if (raw === "" || raw === "true") markerLabels = true;
    else {
      try {
        markerLabels = JSON.parse(raw);
      } catch {
        markerLabels = true;
      }
    }
  }

  return {
    min,
    max,
    step,
    innerMin,
    innerMax,
    markers,
    markerLabels,
    snap: root.classList.contains("snap") || root.dataset.snap !== undefined,
    vertical: root.classList.contains("vertical"),
    reverse: root.classList.contains("reverse"),
    label: root.classList.contains("label") || root.classList.contains("label-always"),
    labelAlways: root.classList.contains("label-always"),
    labelValue: root.dataset.labelValue,
    // disabled 以属性为准；.disabled 只作渲染输出，不当输入源
    disabled: root.hasAttribute("disabled") || root.getAttribute("aria-disabled") === "true",
    readonly: root.classList.contains("readonly") || root.dataset.readonly !== undefined,
    trackSize: root.dataset.trackSize,
    thumbSize: root.dataset.thumbSize,
    trackColor: root.dataset.trackColor,
    innerTrackColor: root.dataset.innerTrackColor,
    selectionColor: root.dataset.selectionColor,
    thumbColor: root.dataset.thumbColor,
    labelColor: root.dataset.labelColor,
    labelTextColor: root.dataset.labelTextColor,
    trackImg: root.dataset.trackImg,
    innerTrackImg: root.dataset.innerTrackImg,
    selectionImg: root.dataset.selectionImg,
    thumbPath: root.dataset.thumbPath || LS_SLIDER_THUMB_PATH,
  };
}

export function initSlider(root) {
  if (sliderState.has(root)) return;

  const dom = ensureSliderDom(root);
  let value = null;
  let active = false;
  let focused = false;
  let dragging = null;
  let syncing = false;
  let handling = false;
  let markersBuiltFor = "";
  let dragRatio = null;
  let pointerFocus = false;
  let pendingRefresh = false;
  let boundInput = null;

  let cachedCfg = null;
  let cfgDirty = true;

  function cfg() {
    if (cfgDirty || !cachedCfg) {
      cachedCfg = readSliderConfig(root);
      cfgDirty = false;
    }
    return cachedCfg;
  }

  function invalidateCfg() {
    cfgDirty = true;
  }

  function axisOf(c) {
    if (c.vertical) {
      return c.reverse
        ? { pos: "top", dim: "height", other: "bottom" }
        : { pos: "bottom", dim: "height", other: "top" };
    }
    return c.reverse
      ? { pos: "right", dim: "width", other: "left" }
      : { pos: "left", dim: "width", other: "right" };
  }

  function setRangeStyle(el, c, startRatio, sizeRatio) {
    const { pos, dim, other } = axisOf(c);
    el.style[pos] = `${100 * startRatio}%`;
    el.style[dim] = sizeRatio === 0 ? "2px" : `${100 * sizeRatio}%`;
    el.style[other] = "";
  }

  function editable() {
    const c = cfg();
    return !c.disabled && !c.readonly && c.innerMin < c.innerMax;
  }

  function trackLen(c) {
    return c.max - c.min;
  }

  function modelToRatio(model, c) {
    const len = trackLen(c);
    return len === 0 ? 0 : (model - c.min) / len;
  }

  function ratioToModel(ratio, c) {
    let model = c.min + ratio * trackLen(c);
    // 吸附原点与刻度一致：以 min 为网格原点，再钳到 inner 区间
    if (c.step > 0) model = roundToStep(model, c.step, c.min);
    return between(model, c.innerMin, c.innerMax);
  }

  function getRatioFromEvent(event, c) {
    const rect = dom.track.getBoundingClientRect();
    let ratio = c.vertical
      ? between((rect.bottom - event.clientY) / rect.height, 0, 1)
      : between((event.clientX - rect.left) / rect.width, 0, 1);
    if (c.reverse) ratio = 1 - ratio;
    const minR = modelToRatio(c.innerMin, c);
    const maxR = modelToRatio(c.innerMax, c);
    return between(ratio, minR, maxR);
  }

  function markerTicks(c) {
    const step = typeof c.markers === "number" ? c.markers : c.step > 0 ? c.step : 1;
    const decimals = Math.max(decimalsOf(step), decimalsOf(c.min));
    const acc = [];
    let index = 0;
    let tick = c.min;
    do {
      acc.push(tick);
      index += 1;
      const next = Number.parseFloat((c.min + index * step).toFixed(decimals));
      tick = next > tick ? next : c.min + index * step;
    } while (tick < c.max);
    acc.push(c.max);
    return acc;
  }

  function resolveMarkerLabels(c) {
    const def = c.markerLabels;
    if (def === false) return null;
    if (def === true) return markerTicks(c).map((v) => ({ value: v, label: String(v) }));
    if (typeof def === "function") {
      return markerTicks(c).map((v) => {
        const item = def(v);
        return typeof item === "object" && item ? { value: v, label: String(item.label ?? v), ...item } : { value: v, label: String(item) };
      });
    }
    if (Array.isArray(def)) {
      return def
        .map((item) => (typeof item === "object" && item ? { label: String(item.label ?? item.value), ...item } : { value: Number(item), label: String(item) }))
        .filter((item) => item.value >= c.min && item.value <= c.max);
    }
    if (def && typeof def === "object") {
      return Object.keys(def)
        .map((key) => {
          const item = def[key];
          const num = Number(key);
          return typeof item === "object" && item
            ? { value: num, label: String(item.label ?? num), ...item }
            : { value: num, label: String(item) };
        })
        .filter((item) => item.value >= c.min && item.value <= c.max);
    }
    return null;
  }

  function applyChrome(c) {
    if (c.trackSize) root.style.setProperty("--ls-slider-track-size", c.trackSize);
    if (c.thumbSize) root.style.setProperty("--ls-slider-thumb-size", c.thumbSize);
    if (c.trackColor) dom.track.style.background = c.trackColor;
    if (c.innerTrackColor) {
      if (c.innerTrackColor === "transparent") dom.inner.hidden = true;
      else {
        dom.inner.hidden = false;
        dom.inner.style.background = c.innerTrackColor;
      }
    }
    if (c.selectionColor) {
      if (c.selectionColor === "transparent") dom.selection.hidden = true;
      else {
        dom.selection.hidden = false;
        dom.selection.style.background = c.selectionColor;
      }
    }
    if (c.thumbColor) dom.thumb.style.color = c.thumbColor;
    if (c.labelColor) {
      const pin = dom.thumb.querySelector(".pin");
      if (pin) pin.style.color = c.labelColor;
    }
    if (c.labelTextColor) {
      const text = dom.thumb.querySelector(".text");
      if (text) text.style.color = c.labelTextColor;
    }
    if (c.trackImg) dom.track.style.backgroundImage = `url(${c.trackImg})`;
    if (c.innerTrackImg) dom.inner.style.backgroundImage = `url(${c.innerTrackImg})`;
    if (c.selectionImg) dom.selection.style.backgroundImage = `url(${c.selectionImg})`;
    const path = dom.thumb.querySelector(".thumb-shape path");
    if (path) path.setAttribute("d", c.thumbPath);
  }

  function renderMarkers(c) {
    const show = c.markers !== false;
    dom.markers.hidden = !show;
    if (!show) return;
    const minR = modelToRatio(c.innerMin, c);
    const maxR = modelToRatio(c.innerMax, c);
    const step = typeof c.markers === "number" ? c.markers : c.step > 0 ? c.step : 1;
    const innerLen = c.innerMax - c.innerMin;
    const size = innerLen === 0 ? "2px" : `${(100 * step) / innerLen}%`;
    setRangeStyle(dom.markers, c, minR, maxR - minR);
    dom.markers.style.backgroundSize = c.vertical ? `2px ${size}` : `${size} 2px`;
  }

  function renderMarkerLabels(c) {
    const list = resolveMarkerLabels(c);
    const switchSide = root.classList.contains("switch-markers");
    if (!list) {
      if (markersBuiltFor !== "") {
        dom.markerLabels.hidden = true;
        dom.markerLabels.textContent = "";
        markersBuiltFor = "";
      }
      return;
    }
    const key = `${c.min}:${c.max}:${c.vertical}:${c.reverse}:${switchSide}:${JSON.stringify(list.map((item) => [item.value, item.label]))}`;
    if (key === markersBuiltFor) return;
    markersBuiltFor = key;
    dom.markerLabels.hidden = false;
    dom.markerLabels.setAttribute("aria-hidden", "true");
    if (switchSide) root.insertBefore(dom.markerLabels, dom.trackContainer);
    else root.appendChild(dom.markerLabels);
    const { pos } = axisOf(c);
    while (dom.markerLabels.firstChild) dom.markerLabels.removeChild(dom.markerLabels.firstChild);
    for (const item of list) {
      const el = document.createElement("div");
      el.className = item.classes ? `marker-label ${item.classes}` : "marker-label";
      el.style[pos] = `${100 * modelToRatio(item.value, c)}%`;
      el.textContent = String(item.label ?? "");
      dom.markerLabels.appendChild(el);
    }
  }

  function parseInputRaw(raw) {
    const text = String(raw).trim();
    if (text === "" || text === "-" || text === "." || text === "-.") return null;
    const n = Number(text);
    return Number.isFinite(n) ? n : NaN;
  }

  function syncInputField(c, hasValue, model) {
    const input = dom.input;
    const suffix = dom.suffix;
    if (suffix) {
      const text = (root.getAttribute("data-suffix") || "").trim();
      suffix.textContent = text;
      suffix.hidden = !text;
    }
    if (!input) return;
    input.min = String(c.innerMin);
    input.max = String(c.innerMax);
    input.step = c.step > 0 ? String(c.step) : "any";
    input.disabled = c.disabled;
    input.readOnly = c.readonly;
    input.classList.toggle("dense", root.classList.contains("dense"));
    if (!input.getAttribute("aria-label")) {
      const label = root.getAttribute("aria-label");
      if (label) input.setAttribute("aria-label", label);
    }
    if (document.activeElement === input) return;
    input.value = hasValue ? String(model) : "";
  }

  function commitInputValue({ change = false } = {}) {
    if (!dom.input) return;
    const parsed = parseInputRaw(dom.input.value);
    if (parsed === null || Number.isNaN(parsed)) {
      render();
      return;
    }
    setValue(parsed, { change });
    render();
  }

  function onFieldInput() {
    const parsed = parseInputRaw(dom.input?.value ?? "");
    if (parsed === null || Number.isNaN(parsed)) return;
    setValue(parsed);
  }

  function onFieldBlur() {
    commitInputValue({ change: true });
  }

  function onFieldKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitInputValue({ change: true });
      dom.input?.blur();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      render();
      dom.input?.blur();
    }
    event.stopPropagation();
  }

  function bindInputField() {
    const input = dom.input;
    if (!input || boundInput === input) return;
    boundInput = input;
    trackListener(cleanups, input, "input", onFieldInput);
    trackListener(cleanups, input, "blur", onFieldBlur);
    trackListener(cleanups, input, "keydown", onFieldKeyDown);
  }

  function render(c = cfg()) {
    ensureSliderInput(root, dom);
    bindInputField();
    root.classList.toggle("disabled", c.disabled);
    root.classList.toggle("editable", editable());
    root.classList.toggle("no-value", value === null || value === undefined || Number.isNaN(value));
    root.classList.toggle("active", active);
    root.classList.toggle("focus", focused);
    root.classList.toggle("inactive", !active);
    root.classList.toggle("label", c.label || c.labelAlways);
    applyChrome(c);

    const hasValue = !(value === null || value === undefined || Number.isNaN(value));
    const model = hasValue ? between(value, c.innerMin, c.innerMax) : c.innerMin;
    const modelRatio = modelToRatio(model, c);
    const ratio = active && dragRatio !== null && !c.snap ? dragRatio : modelRatio;
    const minR = modelToRatio(c.innerMin, c);
    const maxR = modelToRatio(c.innerMax, c);
    const { pos, other } = axisOf(c);

    setRangeStyle(dom.inner, c, minR, maxR - minR);

    if (c.selectionColor !== "transparent") {
      dom.selection.hidden = false;
      setRangeStyle(dom.selection, c, minR, Math.max(0, ratio - minR));
      if (c.selectionColor) dom.selection.style.background = c.selectionColor;
      if (c.selectionImg) dom.selection.style.backgroundImage = `url(${c.selectionImg})`;
    }

    dom.thumb.style[pos] = `${100 * ratio}%`;
    dom.thumb.style[other] = "";
    if (c.thumbColor) dom.thumb.style.color = c.thumbColor;

    const text = dom.thumb.querySelector(".text");
    if (text) {
      text.textContent = c.labelValue !== undefined
        ? String(c.labelValue)
        : hasValue ? String(model) : "";
    }
    const textContainer = dom.thumb.querySelector(".text-container");
    if (textContainer && !c.vertical) {
      const p = c.reverse ? ratio : 1 - ratio;
      textContainer.style.transform = `translateX(calc(${2 * p - 1} * var(--ls-slider-thumb-size) / 2 + ${50 - 100 * p}%))`;
    } else if (textContainer) {
      textContainer.style.transform = "";
    }

    renderMarkers(c);
    renderMarkerLabels(c);

    const nextAttr = hasValue ? String(model) : "";
    syncing = true;
    if (root.dataset.value !== nextAttr) root.dataset.value = nextAttr;
    syncInputField(c, hasValue, model);
    root.setAttribute("aria-valuemin", String(c.min));
    root.setAttribute("aria-valuemax", String(c.max));
    if (hasValue) root.setAttribute("aria-valuenow", String(model));
    else root.removeAttribute("aria-valuenow");
    root.setAttribute("role", "slider");
    const tab = editable() ? 0 : -1;
    if (root.tabIndex !== tab) root.tabIndex = tab;
    queueMicrotask(() => {
      syncing = false;
    });
  }

  function emit(type, detail) {
    root.dispatchEvent(new CustomEvent(`ls-slider:${type}`, { detail, bubbles: true }));
  }

  function setValue(next, { change = false, silent = false } = {}) {
    const c = cfg();
    dragRatio = null;
    let rounded = null;
    if (!(next === null || next === undefined || Number.isNaN(next))) {
      const stepped = c.step > 0 ? roundToStep(next, c.step, c.min) : next;
      rounded = between(stepped, c.innerMin, c.innerMax);
    }
    const unchanged = sameNumber(rounded, value);
    if (!unchanged) {
      value = rounded;
      render(c);
      if (!silent) emit("input", { value });
    }
    if (change && !silent) emit("change", { value });
    return !unchanged;
  }

  function applyPointer(event, { change = false, end = false } = {}) {
    const c = cfg();
    const live = getRatioFromEvent(event, c);
    const next = ratioToModel(live, c);
    dragRatio = end ? null : c.snap ? modelToRatio(next, c) : live;
    if (!sameNumber(next, value)) {
      value = next;
      emit("input", { value });
    }
    if (change) emit("change", { value });
    render(c);
  }

  function onPointerDown(event) {
    if (!editable() || event.button > 0 || dragging !== null || handling) return;
    event.preventDefault();
    pointerFocus = true;
    active = true;
    focused = false;
    dragging = event.pointerId;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    emit("pan", { phase: "start" });
    handling = true;
    try {
      applyPointer(event);
    } finally {
      handling = false;
    }
  }

  function onPointerMove(event) {
    if (dragging !== event.pointerId || handling) return;
    handling = true;
    try {
      applyPointer(event);
    } finally {
      handling = false;
    }
  }

  function onPointerUp(event) {
    if (dragging !== event.pointerId || handling) return;
    dragging = null;
    active = false;
    focused = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    handling = true;
    try {
      applyPointer(event, { change: true, end: true });
      emit("pan", { phase: "end" });
      if (document.activeElement === root || root.contains(document.activeElement)) {
        root.blur();
      }
    } finally {
      handling = false;
      queueMicrotask(() => {
        pointerFocus = false;
        if (pendingRefresh) {
          pendingRefresh = false;
          const raw = root.dataset.value;
          const next = raw === undefined || raw === "" ? null : parseNum(raw, null);
          if (!sameNumber(next, value)) value = next;
          render();
        }
      });
    }
  }

  let keyStart = null;

  function onKeyDown(event) {
    if (event.target !== root) return;
    if (!editable() || !LS_SLIDER_KEYS.has(event.key)) return;
    event.preventDefault();
    const c = cfg();
    const step = c.step > 0 ? c.step : 1;
    const page = step * 10;
    const dir = c.reverse ? -1 : 1;
    let next = value ?? c.innerMin;
    if (keyStart === null) keyStart = value;
    if (event.key === "Home") next = c.reverse ? c.innerMax : c.innerMin;
    else if (event.key === "End") next = c.reverse ? c.innerMin : c.innerMax;
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") next += dir * step;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= dir * step;
    else if (event.key === "PageUp") next += dir * page;
    else if (event.key === "PageDown") next -= dir * page;
    focused = true;
    setValue(next);
  }

  function onKeyUp(event) {
    if (event.target !== root) return;
    if (!LS_SLIDER_KEYS.has(event.key)) return;
    if (keyStart !== null && !sameNumber(keyStart, value)) emit("change", { value });
    keyStart = null;
  }

  function onFocus(event) {
    if (event.target !== root) return;
    if (pointerFocus || dragging !== null) return;
    focused = true;
    render();
  }

  function onBlur(event) {
    if (event.target !== root) return;
    focused = false;
    active = false;
    render();
  }

  const cleanups = [];
  const initial = root.dataset.value;
  value = initial === undefined || initial === "" ? null : parseNum(initial, null);
  render();

  trackListener(cleanups, dom.trackContainer, "pointerdown", onPointerDown);
  trackListener(cleanups, dom.trackContainer, "pointermove", onPointerMove);
  trackListener(cleanups, dom.trackContainer, "pointerup", onPointerUp);
  trackListener(cleanups, dom.trackContainer, "pointercancel", onPointerUp);
  trackListener(cleanups, root, "keydown", onKeyDown);
  trackListener(cleanups, root, "keyup", onKeyUp);
  trackListener(cleanups, root, "focus", onFocus);
  trackListener(cleanups, root, "blur", onBlur);

  const mo = new MutationObserver((mutations) => {
    let valueOnly = true;
    for (const m of mutations) {
      if (m.attributeName !== "data-value") {
        valueOnly = false;
        break;
      }
    }
    if (!valueOnly) invalidateCfg();
    if (dragging !== null || active || syncing || handling) {
      pendingRefresh = true;
      return;
    }
    const raw = root.dataset.value;
    const next = raw === undefined || raw === "" ? null : parseNum(raw, null);
    // 配置属性变化时即使 value 未变也要重渲；仅 value 变化时更新模型
    if (!sameNumber(next, value)) value = next;
    render();
  });
  mo.observe(root, {
    attributes: true,
    attributeFilter: [
      "data-value",
      "data-min",
      "data-max",
      "data-step",
      "data-inner-min",
      "data-inner-max",
      "data-markers",
      "data-marker-labels",
      "data-label-value",
      "data-suffix",
      "data-readonly",
      "disabled",
      "aria-disabled",
      "class",
    ],
  });

  sliderState.set(root, {
    setValue,
    refresh: () => render(),
    destroy() {
      cleanups.forEach((remove) => remove());
      mo.disconnect();
      const trackContainer = root.querySelector(":scope > .track-container");
      const markerLabels = root.querySelector(":scope > .marker-labels");
      trackContainer?.remove();
      markerLabels?.remove();
      const field = root.querySelector(":scope > .field");
      if (field) field.hidden = true;
      root.removeAttribute("role");
      root.removeAttribute("tabindex");
      root.removeAttribute("aria-valuemin");
      root.removeAttribute("aria-valuemax");
      root.removeAttribute("aria-valuenow");
      root.removeAttribute("aria-orientation");
      root.removeAttribute("aria-disabled");
      root.classList.remove(
        "disabled",
        "editable",
        "no-value",
        "active",
        "focused",
        "has-markers",
        "has-marker-labels",
        "inactive",
      );
      sliderState.delete(root);
    },
  });
}

export function destroySlider(root) {
  sliderState.get(root)?.destroy();
}

export function setSliderValue(root, next, opts) {
  const state = sliderState.get(root);
  if (typeof state?.setValue === "function") {
    state.setValue(next, opts);
    return;
  }
  root.dataset.value = next === null || next === undefined ? "" : String(next);
  initSlider(root);
}
