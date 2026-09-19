import { between, parseNum, trackListener } from "./util.js";

const splitterState = new WeakMap();

function splitAvailableSize(root, handle, vertical) {
  const rect = root.getBoundingClientRect();
  const total = vertical ? rect.height : rect.width;
  return Math.max(0, total - (vertical ? handle.offsetHeight : handle.offsetWidth));
}

export function initSplitter(root) {
  if (splitterState.has(root)) return;
  const panes = Array.from(root.children).filter((el) => el.classList.contains("pane"));
  if (panes.length < 2) return;

  let handle = root.querySelector(":scope > .handle");
  if (handle && splitterState.has(handle)) return;

  // Reserve root slot early so concurrent init does not double-bind.
  splitterState.set(root, { pending: true });

  if (!handle) {
    handle = document.createElement("div");
    handle.className = "handle";
    handle.setAttribute("role", "separator");
    handle.tabIndex = 0;
    root.insertBefore(handle, panes[1]);
  }

  const vertical = root.classList.contains("vertical");
  // data-target="start" 固定左侧/上侧 pane（适合编辑器|预览）；默认固定右侧/下侧。
  const targetStart = root.dataset.target === "start";
  const target = targetStart ? handle.previousElementSibling : handle.nextElementSibling;
  if (!target || !target.classList.contains("pane")) {
    splitterState.delete(root);
    return;
  }

  const min = parseNum(root.dataset.min, 80);
  const max = root.dataset.max !== undefined ? parseNum(root.dataset.max, Infinity) : Infinity;
  const hasInitial = root.dataset.initial !== undefined;

  handle.setAttribute("aria-orientation", vertical ? "horizontal" : "vertical");

  function currentSize() {
    return vertical ? target.offsetHeight : target.offsetWidth;
  }

  function apply(size) {
    target.style.flexGrow = "0";
    target.style.flexShrink = "0";
    target.style.flexBasis = `${size}px`;
    emit(size);
  }

  function emit(size) {
    root.dispatchEvent(new CustomEvent("ls-splitter:resize", { detail: { size }, bubbles: true }));
  }

  function clamp(size) {
    const available = splitAvailableSize(root, handle, vertical) - min;
    return between(Math.round(size), Math.min(min, Math.max(0, available)), Math.min(max, Math.max(0, available)));
  }

  function sizeFromEvent(event) {
    const rect = root.getBoundingClientRect();
    const raw = handle.previousElementSibling === target
      ? (vertical ? event.clientY - rect.top : event.clientX - rect.left)
      : (vertical ? rect.bottom - event.clientY : rect.right - event.clientX);
    return clamp(raw);
  }

  let dragging = false;

  function onPointerDown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    dragging = true;
    handle.classList.add("is-dragging");
    handle.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    apply(sizeFromEvent(event));
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove("is-dragging");
    handle.releasePointerCapture?.(event.pointerId);
  }

  function onKeyDown(event) {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const towardStart = event.key === "ArrowLeft" || event.key === "ArrowUp";
    // target 是 handle 之后（右/下）的 pane：向左/上移动分隔线 = 缩小它；
    // target 是之前的 pane 时方向相反。
    const sign = handle.previousElementSibling === target ? (towardStart ? 1 : -1) : towardStart ? -1 : 1;
    const step = event.shiftKey ? 64 : 16;
    apply(clamp(currentSize() + sign * step));
  }

  function onDoubleClick() {
    if (hasInitial) {
      apply(clamp(parseNum(root.dataset.initial, currentSize())));
      return;
    }
    target.style.flexGrow = "";
    target.style.flexShrink = "";
    target.style.flexBasis = "";
    emit(currentSize());
  }

  if (hasInitial) apply(clamp(parseNum(root.dataset.initial, currentSize())));

  const cleanups = [];
  trackListener(cleanups, handle, "pointerdown", onPointerDown);
  trackListener(cleanups, handle, "pointermove", onPointerMove);
  trackListener(cleanups, handle, "pointerup", onPointerUp);
  trackListener(cleanups, handle, "pointercancel", onPointerUp);
  trackListener(cleanups, handle, "keydown", onKeyDown);
  trackListener(cleanups, handle, "dblclick", onDoubleClick);

  // 容器尺寸变化时把当前尺寸重新夹回 min/max 可用区间
  const ro = new ResizeObserver(() => {
    if (dragging) return;
    const size = currentSize();
    const clamped = clamp(size);
    if (clamped !== size && (target.style.flexBasis || hasInitial)) apply(clamped);
  });
  ro.observe(root);

  const state = {
    destroy() {
      cleanups.forEach((remove) => remove());
      ro.disconnect();
      splitterState.delete(handle);
      splitterState.delete(root);
    },
  };
  splitterState.set(root, state);
  splitterState.set(handle, state);
}

export function destroySplitter(root) {
  const state = splitterState.get(root);
  if (state?.destroy) {
    state.destroy();
    return;
  }
  const handle = root.querySelector(":scope > .handle");
  if (handle) {
    const handleState = splitterState.get(handle);
    if (handleState?.destroy) handleState.destroy();
    else splitterState.delete(root);
  } else {
    splitterState.delete(root);
  }
}
