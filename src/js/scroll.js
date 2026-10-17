// Overlay controls live beside the native viewport, so neither axis takes layout space.
const instances = new WeakMap();
let nextId = 0;

export function initScroll(root) {
  if (instances.has(root)) { refreshScroll(root); return; }
  const viewport = root.querySelector(":scope > .ls-scroll__viewport");
  const content = viewport?.querySelector(":scope > .ls-scroll__content");
  if (!viewport || !content) return;
  const doc = root.ownerDocument, win = doc.defaultView;
  const originalId = viewport.id;
  if (!originalId) {
    let id;
    do { id = `ls-scroll-${++nextId}`; } while (doc.getElementById(id));
    viewport.id = id;
  }
  let frame = 0, timer = 0, drag = null;
  const axes = ["y", "x"].map((axis) => {
    const track = doc.createElement("div"), thumb = doc.createElement("div");
    track.className = `ls-scroll__track ls-scroll__track--${axis}`;
    thumb.className = "ls-scroll__thumb";
    track.hidden = true;
    track.tabIndex = 0;
    track.setAttribute("role", "scrollbar");
    track.setAttribute("aria-controls", viewport.id);
    track.setAttribute("aria-orientation", axis === "y" ? "vertical" : "horizontal");
    track.setAttribute("aria-valuemin", "0");
    track.append(thumb);
    root.append(track);
    return { axis, track, thumb, max: 0, travel: 0, size: 0 };
  });

  function update() {
    if (frame) win.cancelAnimationFrame(frame);
    frame = 0;
    const overlay = root.classList.contains("overlay");
    if (!overlay) endDrag();
    root.toggleAttribute("data-ls-overlay-ready", overlay);
    const both = viewport.scrollHeight > viewport.clientHeight + 1 && viewport.scrollWidth > viewport.clientWidth + 1;
    for (const bar of axes) {
      const vertical = bar.axis === "y";
      bar.rtl = !vertical && win.getComputedStyle(viewport).direction === "rtl";
      const client = vertical ? viewport.clientHeight : viewport.clientWidth;
      const total = vertical ? viewport.scrollHeight : viewport.scrollWidth;
      bar.max = Math.max(0, total - client);
      bar.track.hidden = !overlay || bar.max <= 1 || client <= 0;
      bar.track.style.setProperty("--ls-scroll-cross", both ? "12px" : "2px");
      const length = vertical ? bar.track.clientHeight : bar.track.clientWidth;
      bar.size = Math.min(length, Math.max(24, length * client / (total || 1)));
      bar.travel = Math.max(0, length - bar.size);
      const offset = Math.max(0, Math.min(bar.max, readOffset(bar)));
      const progress = bar.max ? offset / bar.max : 0;
      const position = (bar.rtl ? 1 - progress : progress) * bar.travel;
      bar.thumb.style[vertical ? "height" : "width"] = `${bar.size}px`;
      bar.thumb.style.transform = `translate${vertical ? "Y" : "X"}(${position}px)`;
      bar.track.setAttribute("aria-valuemax", String(Math.round(bar.max)));
      bar.track.setAttribute("aria-valuenow", String(Math.round(offset)));
      bar.track.setAttribute("aria-label", root.getAttribute(vertical ? "data-vertical-label" : "data-horizontal-label") || (vertical ? "Scroll vertically" : "Scroll horizontally"));
    }
  }
  function schedule() { if (!frame) frame = win.requestAnimationFrame(update); }
  function readOffset(bar) { return bar.axis === "y" ? viewport.scrollTop : viewport.scrollLeft * (bar.rtl ? -1 : 1); }
  function scrolled() {
    if (root.classList.contains("overlay")) {
      root.classList.add("is-scrolling");
      win.clearTimeout(timer);
      timer = win.setTimeout(() => root.classList.remove("is-scrolling"), 900);
    }
    schedule();
  }
  function setOffset(bar, value) {
    viewport[bar.axis === "y" ? "scrollTop" : "scrollLeft"] = Math.max(0, Math.min(bar.max, value)) * (bar.rtl ? -1 : 1);
    scrolled();
  }
  function endDrag(event) {
    if (!drag || (event && event.pointerId !== drag.pointerId)) return;
    const { bar, pointerId } = drag;
    drag = null;
    if (bar.track.hasPointerCapture?.(pointerId)) bar.track.releasePointerCapture(pointerId);
    root.classList.remove("is-dragging");
    doc.removeEventListener("pointermove", move);
    doc.removeEventListener("pointerup", endDrag);
    doc.removeEventListener("pointercancel", endDrag);
  }
  function move(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    const coordinate = drag.bar.axis === "y" ? event.clientY : event.clientX;
    setOffset(drag.bar, drag.offset + (coordinate - drag.coordinate) * (drag.bar.rtl ? -1 : 1) * drag.bar.max / (drag.bar.travel || 1));
  }
  const cleanups = [];
  for (const bar of axes) {
    const vertical = bar.axis === "y";
    function down(event) {
      if (event.button !== 0 || bar.track.hidden) return;
      event.preventDefault();
      endDrag();
      update();
      const coordinate = vertical ? event.clientY : event.clientX;
      if (event.target !== bar.thumb) {
        const rect = bar.track.getBoundingClientRect();
        const progress = (coordinate - (vertical ? rect.top : rect.left) - bar.size / 2) / (bar.travel || 1);
        setOffset(bar, (bar.rtl ? 1 - progress : progress) * bar.max);
      }
      drag = { bar, pointerId: event.pointerId, coordinate, offset: readOffset(bar) };
      bar.track.focus({ preventScroll: true });
      bar.track.setPointerCapture?.(event.pointerId);
      root.classList.add("is-dragging");
      doc.addEventListener("pointermove", move, { passive: false });
      doc.addEventListener("pointerup", endDrag);
      doc.addEventListener("pointercancel", endDrag);
    }
    function key(event) {
      const current = readOffset(bar);
      const page = vertical ? viewport.clientHeight : viewport.clientWidth;
      let value;
      if (event.key === "Home") value = 0;
      else if (event.key === "End") value = bar.max;
      else if (event.key === "PageDown") value = current + page;
      else if (event.key === "PageUp") value = current - page;
      else if (event.key === (vertical ? "ArrowDown" : "ArrowRight")) value = current + (bar.rtl ? -40 : 40);
      else if (event.key === (vertical ? "ArrowUp" : "ArrowLeft")) value = current + (bar.rtl ? 40 : -40);
      if (value !== undefined) { event.preventDefault(); setOffset(bar, value); }
    }
    function wheel(event) {
      const delta = vertical ? event.deltaY : event.deltaX || event.deltaY;
      const offset = readOffset(bar);
      const factor = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? (vertical ? viewport.clientHeight : viewport.clientWidth) : 1;
      const next = Math.max(0, Math.min(bar.max, offset + delta * factor * (bar.rtl && event.deltaX ? -1 : 1)));
      if (next !== offset) { event.preventDefault(); setOffset(bar, next); }
    }
    bar.track.addEventListener("pointerdown", down);
    bar.track.addEventListener("lostpointercapture", endDrag);
    bar.track.addEventListener("keydown", key);
    bar.track.addEventListener("wheel", wheel, { passive: false });
    cleanups.push(() => {
      bar.track.removeEventListener("pointerdown", down);
      bar.track.removeEventListener("lostpointercapture", endDrag);
      bar.track.removeEventListener("keydown", key);
      bar.track.removeEventListener("wheel", wheel);
      bar.track.remove();
    });
  }
  viewport.addEventListener("scroll", scrolled, { passive: true });
  content.addEventListener("load", schedule, true);
  const resize = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
  resize?.observe(viewport);
  resize?.observe(content);
  const mutations = new MutationObserver(schedule);
  mutations.observe(content, { subtree: true, childList: true, characterData: true, attributes: true });
  mutations.observe(root, { attributes: true, attributeFilter: ["class", "style", "data-vertical-label", "data-horizontal-label"] });
  win.addEventListener("resize", schedule);
  instances.set(root, { refresh: update, destroy() {
    endDrag();
    mutations.disconnect();
    resize?.disconnect();
    win.cancelAnimationFrame(frame);
    win.clearTimeout(timer);
    viewport.removeEventListener("scroll", scrolled);
    content.removeEventListener("load", schedule, true);
    win.removeEventListener("resize", schedule);
    cleanups.forEach((cleanup) => cleanup());
    root.removeAttribute("data-ls-overlay-ready");
    root.classList.remove("is-scrolling", "is-dragging");
    if (!originalId) viewport.removeAttribute("id");
  } });
  update();
}

export function refreshScroll(root) { instances.get(root)?.refresh(); }
export function destroyScroll(root) {
  instances.get(root)?.destroy();
  instances.delete(root);
}
