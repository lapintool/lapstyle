import { trackListener } from "./util.js";

const dragState = new WeakMap();

export function initDialogDrag(panel) {
  if (dragState.has(panel)) return;

  const handle =
    panel.querySelector(".drag-handle") ||
    panel.querySelector(".head") ||
    panel.querySelector(".title");
  if (!handle) return;

  let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;

  function readDragOrigin() {
    const x = parseFloat(panel.style.getPropertyValue("--ls-drag-x")) || 0;
    const y = parseFloat(panel.style.getPropertyValue("--ls-drag-y")) || 0;
    return { x, y };
  }

  function writeDrag(x, y) {
    panel.style.setProperty("--ls-drag-x", `${x}px`);
    panel.style.setProperty("--ls-drag-y", `${y}px`);
    panel.style.transform = "translate(var(--ls-drag-x), var(--ls-drag-y))";
  }

  /** 整条标题带可拖：面板顶边到手柄底边、全宽（含贴边空白），控件除外。 */
  function inDragZone(event) {
    const t = event.target;
    if (!(t instanceof Element)) return false;
    if (t.closest("button, input, select, textarea, a, .no-drag")) return false;
    const panelRect = panel.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    const { clientX: x, clientY: y } = event;
    if (x < panelRect.left || x > panelRect.right) return false;
    if (y < panelRect.top || y > handleRect.bottom) return false;
    return true;
  }

  function onDown(event) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    if (!inDragZone(event)) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    const origin = readDragOrigin();
    originX = origin.x;
    originY = origin.y;
    panel.setPointerCapture(event.pointerId);
    panel.style.willChange = "transform";
  }

  function onMove(event) {
    if (!dragging) return;
    writeDrag(originX + (event.clientX - startX), originY + (event.clientY - startY));
  }

  function onUp(event) {
    if (!dragging) return;
    dragging = false;
    if (panel.hasPointerCapture?.(event.pointerId)) {
      panel.releasePointerCapture(event.pointerId);
    }
    panel.style.willChange = "";
  }

  const cleanups = [];
  trackListener(cleanups, panel, "pointerdown", onDown);
  trackListener(cleanups, panel, "pointermove", onMove);
  trackListener(cleanups, panel, "pointerup", onUp);
  trackListener(cleanups, panel, "pointercancel", onUp);

  dragState.set(panel, {
    destroy() {
      cleanups.forEach((remove) => remove());
      dragState.delete(panel);
    },
  });
}

export function destroyDialogDrag(panel) {
  dragState.get(panel)?.destroy();
}
