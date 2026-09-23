import { trackListener } from "./util.js";

const dropdownState = new WeakMap();

let docBound = false;
let docCleanups = [];

function isDropdownHost(el) {
  return (
    el instanceof HTMLElement &&
    (el.classList.contains("ls-dropdown") || el.classList.contains("ls-btn-dropdown"))
  );
}

function dropdownMenu(host) {
  const menu = host.querySelector(":scope > .ls-menu");
  return menu instanceof HTMLElement ? menu : null;
}

function dropdownTriggers(host) {
  if (host.classList.contains("ls-dropdown")) {
    return [...host.querySelectorAll(":scope > .trigger")].filter(
      (el) => el instanceof HTMLElement && !el.disabled,
    );
  }
  if (host.classList.contains("split")) {
    return [...host.querySelectorAll(":scope > .arrow-btn")].filter(
      (el) => el instanceof HTMLElement && !el.disabled,
    );
  }
  return [...host.querySelectorAll(":scope > button")].filter(
    (el) => el instanceof HTMLElement && !el.disabled && !el.closest(".ls-menu"),
  );
}

function setTriggerExpanded(host, open) {
  for (const btn of dropdownTriggers(host)) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
}

function syncSelectLabel(host, label) {
  if (!host.classList.contains("ls-dropdown")) return;
  const trigger = host.querySelector(":scope > .trigger");
  if (!(trigger instanceof HTMLElement)) return;
  const text = trigger.querySelector(":scope > span:not(.caret)");
  if (text) text.textContent = label;
  else {
    const caret = trigger.querySelector(":scope > .caret");
    const node = document.createTextNode(label);
    if (caret) trigger.insertBefore(node, caret);
    else trigger.appendChild(node);
  }
}

export function setDropdownOpen(host, open) {
  if (!isDropdownHost(host)) return;
  const menu = dropdownMenu(host);
  if (!menu) return;
  if (open) {
    closeAllDropdowns(host);
    menu.hidden = false;
    menu.removeAttribute("hidden");
    host.classList.add("is-open");
    setTriggerExpanded(host, true);
  } else {
    menu.hidden = true;
    menu.setAttribute("hidden", "");
    host.classList.remove("is-open");
    setTriggerExpanded(host, false);
  }
}

export function closeAllDropdowns(except) {
  document.querySelectorAll(".ls-dropdown.is-open, .ls-btn-dropdown.is-open").forEach((el) => {
    if (el === except) return;
    if (el instanceof HTMLElement) setDropdownOpen(el, false);
  });
  document.querySelectorAll(".ls-dropdown, .ls-btn-dropdown").forEach((el) => {
    if (!(el instanceof HTMLElement) || el === except) return;
    const menu = dropdownMenu(el);
    if (menu && !menu.hidden) setDropdownOpen(el, false);
  });
}

function ensureDocBinding() {
  if (docBound || typeof document === "undefined") return;
  docBound = true;

  const onPointerDown = (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    if (t.closest(".ls-dropdown, .ls-btn-dropdown")) return;
    closeAllDropdowns();
  };

  const onKeydown = (event) => {
    if (event.key !== "Escape") return;
    closeAllDropdowns();
  };

  trackListener(docCleanups, document, "pointerdown", onPointerDown, true);
  trackListener(docCleanups, document, "keydown", onKeydown);
}

function isLeafMenuItem(item) {
  return !item.querySelector(":scope > .caret");
}

export function initDropdown(host) {
  if (!isDropdownHost(host) || dropdownState.has(host)) return;
  ensureDocBinding();

  const menu = dropdownMenu(host);
  if (!menu) return;

  if (!menu.hasAttribute("hidden") && menu.hidden !== true) {
    // keep authored open state
  } else {
    menu.hidden = true;
    setTriggerExpanded(host, false);
    host.classList.remove("is-open");
  }

  const onTriggerClick = (event) => {
    const btn = event.currentTarget;
    if (!(btn instanceof HTMLElement)) return;
    event.preventDefault();
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeAllDropdowns();
    if (willOpen) setDropdownOpen(host, true);
  };

  const onMenuSelect = (event) => {
    if (!(event instanceof CustomEvent)) return;
    if (event.type !== "ls-menu:select") return;
    const item = event.detail?.item;
    if (!(item instanceof HTMLElement) || !menu.contains(item)) return;
    if (!isLeafMenuItem(item)) return;
    const label =
      item.querySelector(":scope > .label")?.textContent?.replace(/\s+/g, " ").trim() ||
      item.textContent?.replace(/\s+/g, " ").trim() ||
      "";
    syncSelectLabel(host, label);
    setDropdownOpen(host, false);
  };

  const cleanups = [];
  for (const btn of dropdownTriggers(host)) {
    trackListener(cleanups, btn, "click", onTriggerClick);
  }
  trackListener(cleanups, menu, "ls-menu:select", onMenuSelect);

  dropdownState.set(host, {
    destroy() {
      cleanups.forEach((remove) => remove());
      dropdownState.delete(host);
    },
  });
}

export function destroyDropdown(host) {
  dropdownState.get(host)?.destroy?.();
}
