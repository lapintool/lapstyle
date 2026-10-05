import { tipClipRect, trackListener } from "./util.js";

const tipState = new WeakMap();

const TIP_SIDES = ["top", "bottom", "left", "right"];
const TIP_AUTO_ORDER = ["top", "bottom", "right", "left"];
const TIP_SHOWN_TRANSFORM = {
  top: "translateX(-50%) translateY(0)",
  bottom: "translateX(-50%) translateY(0)",
  left: "translate(0, -50%)",
  right: "translate(0, -50%)",
};
const TIP_HIDDEN_TRANSFORM = {
  top: "translateX(-50%) translateY(var(--ls-tooltip-motion-distance))",
  bottom: "translateX(-50%) translateY(calc(-1 * var(--ls-tooltip-motion-distance)))",
  left: "translate(var(--ls-tooltip-motion-distance), -50%)",
  right: "translate(calc(-1 * var(--ls-tooltip-motion-distance)), -50%)",
};

function tipHasFixedSide(tip) {
  return TIP_SIDES.some((side) => tip.classList.contains(side));
}

function tipOverflow(tip, host, pad = 4) {
  const r = tip.getBoundingClientRect();
  const clip = tipClipRect(host);
  return (
    Math.max(0, clip.top + pad - r.top) +
    Math.max(0, r.bottom - (clip.bottom - pad)) +
    Math.max(0, clip.left + pad - r.left) +
    Math.max(0, r.right - (clip.right - pad))
  );
}

function tipPrepareMeasure(tip, side) {
  tip.setAttribute("data-ls-placement", side);
  tip.style.setProperty("opacity", "0");
  tip.style.setProperty("visibility", "visible");
  tip.style.setProperty("transition", "none");
  tip.style.setProperty("pointer-events", "none");
  tip.style.setProperty("transform", TIP_SHOWN_TRANSFORM[side]);
}

function tipClearMeasure(tip) {
  tip.style.removeProperty("opacity");
  tip.style.removeProperty("visibility");
  tip.style.removeProperty("pointer-events");
  tip.style.removeProperty("transform");
  // Restore transitions last. Otherwise clearing the inline measurement
  // transform starts an unwanted transition back to the hidden offset.
  tip.style.removeProperty("transition");
}

function placeTooltip(tip, host) {
  if (tipHasFixedSide(tip)) {
    tip.removeAttribute("data-ls-placement");
    return;
  }
  let chosen = "top";
  let best = Infinity;
  for (const side of TIP_AUTO_ORDER) {
    tipPrepareMeasure(tip, side);
    void tip.offsetWidth;
    const overflow = tipOverflow(tip, host);
    if (overflow < best) {
      best = overflow;
      chosen = side;
    }
    if (overflow === 0) break;
  }
  tip.setAttribute("data-ls-placement", chosen);
  // Restore the hidden transform while transitions are still disabled. If we
  // clear the temporary shown transform first, the browser starts a hidden
  // transition back to the offset; enabling the shown state then cancels it.
  tip.style.setProperty("transform", TIP_HIDDEN_TRANSFORM[chosen]);
  void tip.offsetWidth;
  tipClearMeasure(tip);
}

export function initTooltip(tip) {
  if (!(tip instanceof HTMLElement) || tipState.has(tip)) return;
  const host = tip.parentElement;
  if (!(host instanceof HTMLElement)) return;

  let placementFrame;
  const triggerIsActive = () => host.matches(":hover, :focus-visible");
  const scheduleShow = () => {
    if (!triggerIsActive()) return;
    if (placementFrame !== undefined) return;
    placementFrame = requestAnimationFrame(() => {
      placementFrame = undefined;
      if (!triggerIsActive()) return;
      placeTooltip(tip, host);
      // Measurement temporarily changes visibility and transform. Flush the
      // restored hidden state before enabling the shown class so both opacity
      // and the positional transition get a real starting frame.
      void tip.offsetWidth;
      tip.classList.add("ls-tooltip--shown");
    });
  };
  const syncVisibility = () => {
    if (triggerIsActive()) {
      scheduleShow();
      return;
    }
    if (placementFrame !== undefined) {
      cancelAnimationFrame(placementFrame);
      placementFrame = undefined;
    }
    tip.classList.remove("ls-tooltip--shown");
  };
  const cleanups = [];
  trackListener(cleanups, host, "pointerenter", scheduleShow);
  trackListener(cleanups, host, "pointerleave", syncVisibility);
  trackListener(cleanups, host, "focusin", scheduleShow);
  trackListener(cleanups, host, "focusout", syncVisibility);
  scheduleShow();

  tipState.set(tip, {
    destroy() {
      if (placementFrame !== undefined) cancelAnimationFrame(placementFrame);
      cleanups.forEach((remove) => remove());
      tip.classList.remove("ls-tooltip--shown");
      tip.removeAttribute("data-ls-placement");
      tipClearMeasure(tip);
      tipState.delete(tip);
    },
  });
}

export function destroyTooltip(tip) {
  tipState.get(tip)?.destroy();
}
