import { trackListener } from "./util.js";

const dragState = new WeakMap();
const dialogState = new WeakMap();

let openBound = false;
let openCleanups = [];

export function initDialogDrag(panel) {
  if (dragState.has(panel)) return;

  const handle =
    panel.querySelector(".drag-handle") ||
    panel.querySelector(".head") ||
    panel.querySelector(".title");
  if (!handle) return;

  let startX = 0,
    startY = 0,
    originX = 0,
    originY = 0,
    dragging = false;

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

function resolveDialog(sel) {
  if (!sel) return null;
  try {
    const el = document.querySelector(sel);
    return el instanceof HTMLElement && el.classList.contains("ls-dialog") ? el : null;
  } catch {
    return null;
  }
}

function isDialogPersistent(dialog) {
  return dialog.hasAttribute("data-persistent");
}

function isDialogModeless(dialog) {
  return dialog.classList.contains("modeless");
}

/** 应用层自己管开合（如 ColorDialog）时加 data-ls-manual，库只绑拖拽。 */
function isDialogManual(dialog) {
  return dialog.hasAttribute("data-ls-manual");
}

export function setDialogOpen(dialog, open) {
  if (!(dialog instanceof HTMLElement) || !dialog.classList.contains("ls-dialog")) return;
  if (open) {
    dialog.hidden = false;
    dialog.removeAttribute("hidden");
  } else {
    dialog.hidden = true;
    dialog.setAttribute("hidden", "");
  }
}

function emitDialogAction(dialog, button) {
  const ev = new CustomEvent("ls-dialog:action", {
    bubbles: true,
    cancelable: true,
    detail: { button, dialog },
  });
  return dialog.dispatchEvent(ev);
}

function closeDialogFromAction(dialog, button) {
  if (!emitDialogAction(dialog, button)) return;
  setDialogOpen(dialog, false);
}

function ensureDialogOpenBinding() {
  if (openBound || typeof document === "undefined") return;
  openBound = true;

  const onClick = (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;

    const opener = t.closest("[data-ls-open]");
    if (opener instanceof HTMLElement) {
      const dialog = resolveDialog(opener.getAttribute("data-ls-open"));
      if (dialog) {
        event.preventDefault();
        setDialogOpen(dialog, true);
        return;
      }
    }

    const dialog = t.closest(".ls-dialog");
    if (!(dialog instanceof HTMLElement) || isDialogManual(dialog)) return;

    if (t === dialog && !isDialogModeless(dialog) && !isDialogPersistent(dialog)) {
      setDialogOpen(dialog, false);
      return;
    }

    const actionBtn = t.closest(".ls-dialog .actions button, .ls-dialog .actions .ls-btn");
    if (actionBtn instanceof HTMLElement && dialog.contains(actionBtn)) {
      closeDialogFromAction(dialog, actionBtn);
    }
  };

  const onKeydown = (event) => {
    if (event.key !== "Escape") return;
    const open = [...document.querySelectorAll(".ls-dialog:not([hidden])")].filter(
      (el) => el instanceof HTMLElement && !isDialogPersistent(el) && !isDialogManual(el),
    );
    const top = open[open.length - 1];
    if (top) {
      event.preventDefault();
      setDialogOpen(top, false);
    }
  };

  trackListener(openCleanups, document, "click", onClick);
  trackListener(openCleanups, document, "keydown", onKeydown);
}

export function initDialog(dialog) {
  if (!(dialog instanceof HTMLElement) || !dialog.classList.contains("ls-dialog")) return;
  ensureDialogOpenBinding();

  const existing = dialogState.get(dialog);
  if (existing?.bound) {
    dialog.querySelectorAll(":scope > .panel.draggable").forEach((panel) => {
      if (panel instanceof HTMLElement) initDialogDrag(panel);
    });
    return;
  }

  dialog.querySelectorAll(":scope > .panel.draggable").forEach((panel) => {
    if (panel instanceof HTMLElement) initDialogDrag(panel);
  });

  dialogState.set(dialog, {
    bound: true,
    destroy() {
      dialog.querySelectorAll(":scope > .panel.draggable").forEach((panel) => {
        if (panel instanceof HTMLElement) destroyDialogDrag(panel);
      });
      dialogState.delete(dialog);
    },
  });
}

export function destroyDialog(dialog) {
  dialogState.get(dialog)?.destroy?.();
}
