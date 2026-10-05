import { trackListener } from "./util.js";

const dropdownState = new WeakMap();

let docBound = false;
let docCleanups = [];
let activeDropdowns = 0;

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
      (el) => el instanceof HTMLElement,
    );
  }
  if (host.classList.contains("split")) {
    return [...host.querySelectorAll(":scope > .arrow-btn")].filter(
      (el) => el instanceof HTMLElement,
    );
  }
  return [...host.querySelectorAll(":scope > button")].filter(
    (el) => el instanceof HTMLElement && !el.closest(".ls-menu"),
  );
}

function setTriggerExpanded(host, open) {
  for (const btn of dropdownTriggers(host)) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.querySelector("input")?.setAttribute("aria-expanded", open ? "true" : "false");
  }
}

function syncSelectLabel(host, label) {
  if (!host.classList.contains("ls-dropdown")) return;
  const trigger = host.querySelector(":scope > .trigger");
  if (!(trigger instanceof HTMLElement)) return;
  const editor = trigger.querySelector("input");
  if (editor) {
    editor.value = label;
    return;
  }
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

  const menu = dropdownMenu(host);
  if (!menu) return;
  ensureDocBinding();
  activeDropdowns++;

  if (!menu.hasAttribute("hidden") && menu.hidden !== true) {
    // keep authored open state
  } else {
    menu.hidden = true;
    setTriggerExpanded(host, false);
    host.classList.remove("is-open");
  }

  const onTriggerClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const btn = dropdownTriggers(host).find((trigger) => trigger.contains(target));
    if (!btn || btn.disabled || btn.getAttribute("aria-disabled") === "true") return;
    if (target.matches("input.editor")) {
      setDropdownOpen(host, true);
      return;
    }
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
  const onEditorKeydown = (event) => {
    if (event.isComposing) return;
    if (!event.target?.matches?.(".trigger > input.editor") || event.target.disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setDropdownOpen(host, true);
      const items = [...menu.querySelectorAll(":scope > .item:not(:disabled):not([aria-disabled='true'])")];
      (event.key === "ArrowUp" ? items.at(-1) : items[0])?.focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      setDropdownOpen(host, false);
    }
  };
  // Delegate so disabled/enabled and split/simple changes do not require rebinding.
  trackListener(cleanups, host, "click", onTriggerClick);
  trackListener(cleanups, host, "keydown", onEditorKeydown);
  trackListener(cleanups, menu, "ls-menu:select", onMenuSelect);

  dropdownState.set(host, {
    destroy() {
      cleanups.forEach((remove) => remove());
      dropdownState.delete(host);
      if (--activeDropdowns === 0) {
        docCleanups.forEach((remove) => remove());
        docCleanups = [];
        docBound = false;
      }
    },
  });
}

export function destroyDropdown(host) {
  dropdownState.get(host)?.destroy?.();
}
