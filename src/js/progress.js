const progressState = new WeakMap();

function getProgressMeta(el) {
  let state = progressState.get(el);
  if (!state) {
    state = { fromAria: false };
    progressState.set(el, state);
  }
  return state;
}

function parseProgressNumber(raw, fallback) {
  if (raw == null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function progressPercentFromCss(el) {
  const inline = el.style.getPropertyValue("--ls-progress").trim();
  const raw = inline || getComputedStyle(el).getPropertyValue("--ls-progress").trim();
  // 允许 "40%" 或纯数字 "40"
  const match = raw.match(/^(-?[\d.]+)\s*%?$/);
  if (!match) return null;
  const pct = Number(match[1]);
  return Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : null;
}

export function syncProgress(el) {
  if (!(el instanceof HTMLElement)) return;
  const state = getProgressMeta(el);
  if (!el.getAttribute("role")) el.setAttribute("role", "progressbar");

  const animated =
    el.classList.contains("indeterminate") || el.classList.contains("query");
  if (animated) {
    el.removeAttribute("aria-valuenow");
    if (state.fromAria) {
      el.style.removeProperty("--ls-progress");
      state.fromAria = false;
    }
    return;
  }

  const min = parseProgressNumber(el.getAttribute("aria-valuemin"), 0);
  const max = parseProgressNumber(el.getAttribute("aria-valuemax"), 100);
  if (!el.hasAttribute("aria-valuemin")) el.setAttribute("aria-valuemin", String(min));
  if (!el.hasAttribute("aria-valuemax")) el.setAttribute("aria-valuemax", String(max));

  const ariaRaw = el.getAttribute("aria-valuenow");
  if (ariaRaw != null && ariaRaw !== "") {
    const now = Number(ariaRaw);
    if (!Number.isFinite(now) || max === min) return;
    const pct = Math.min(100, Math.max(0, ((now - min) / (max - min)) * 100));
    const next = `${Number(pct.toFixed(4))}%`;
    if (el.style.getPropertyValue("--ls-progress").trim() !== next) {
      el.style.setProperty("--ls-progress", next);
    }
    state.fromAria = true;
    return;
  }

  // 去掉此前由 aria 路径写过的 inline，保留作者自己写的 --ls-progress
  if (state.fromAria) {
    el.style.removeProperty("--ls-progress");
    state.fromAria = false;
  }
  const pct = progressPercentFromCss(el);
  if (pct == null || max === min) return;
  const now = min + (pct / 100) * (max - min);
  const rounded = Number.isInteger(now) ? String(now) : String(Number(now.toFixed(4)));
  if (el.getAttribute("aria-valuenow") !== rounded) {
    el.setAttribute("aria-valuenow", rounded);
  }
}

export function setProgressValue(el, value, { silent = false } = {}) {
  if (!(el instanceof HTMLElement)) return;
  if (value === null || value === undefined || Number.isNaN(value)) {
    el.removeAttribute("aria-valuenow");
  } else {
    el.setAttribute("aria-valuenow", String(value));
  }
  syncProgress(el);
  if (!silent) {
    el.dispatchEvent(
      new CustomEvent("ls-progress:change", {
        detail: { value: value == null || Number.isNaN(value) ? null : Number(value) },
        bubbles: true,
      }),
    );
  }
}

export function initProgress(el) {
  if (!(el instanceof HTMLElement)) return;
  const existing = progressState.get(el);
  if (existing?.bound) return;
  const authoredRole = el.hasAttribute("role");
  syncProgress(el);
  const mo = new MutationObserver(() => syncProgress(el));
  mo.observe(el, {
    attributes: true,
    attributeFilter: ["aria-valuenow", "aria-valuemin", "aria-valuemax", "class", "style"],
  });
  const state = getProgressMeta(el);
  state.bound = true;
  state.authoredRole = authoredRole;
  state.destroy = () => {
    mo.disconnect();
    if (!state.authoredRole && el.getAttribute("role") === "progressbar") {
      el.removeAttribute("role");
    }
    if (state.fromAria) {
      el.style.removeProperty("--ls-progress");
      state.fromAria = false;
    }
    progressState.delete(el);
  };
}

export function destroyProgress(el) {
  progressState.get(el)?.destroy?.();
}
