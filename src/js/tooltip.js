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
  tip.style.removeProperty("transition");
  tip.style.removeProperty("pointer-events");
  tip.style.removeProperty("transform");
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
  tipClearMeasure(tip);
}

export function initTooltip(tip) {
  if (!(tip instanceof HTMLElement) || tipState.has(tip)) return;
  const host = tip.parentElement;
  if (!(host instanceof HTMLElement)) return;

  if (tipHasFixedSide(tip)) {
    tipState.set(tip, {
      destroy() {
        tipState.delete(tip);
      },
    });
    return;
  }

  const onEnter = () => placeTooltip(tip, host);
  const cleanups = [];
  trackListener(cleanups, host, "pointerenter", onEnter);
  trackListener(cleanups, host, "focusin", onEnter);

  tipState.set(tip, {
    destroy() {
      cleanups.forEach((remove) => remove());
      tip.removeAttribute("data-ls-placement");
      tipClearMeasure(tip);
      tipState.delete(tip);
    },
  });
}

export function destroyTooltip(tip) {
  tipState.get(tip)?.destroy();
}
