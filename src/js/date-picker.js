/** Viewport placement for an anchored picker. Prefer below, then flip and clamp. */
export function placeDatePicker(anchor, panel, viewport, padding = 8, gap = 6) {
  const width = Math.min(panel.width, Math.max(1, viewport.width - padding * 2));
  const below = Math.max(0, viewport.height - anchor.bottom - padding - gap);
  const above = Math.max(0, anchor.top - padding - gap);
  const bottom = panel.height <= below || below >= above;
  const maxHeight = Math.max(1, Math.min(bottom ? below : above, viewport.height - padding * 2));
  const height = Math.min(panel.height, maxHeight);
  const end = anchor.left + width > viewport.width - padding;
  const left = Math.max(padding, Math.min(end ? anchor.right - width : anchor.left, viewport.width - padding - width));
  const top = Math.max(padding, Math.min(bottom ? anchor.bottom + gap : anchor.top - gap - height, viewport.height - padding - height));
  return { left, top, width, maxHeight, placement: `${bottom ? "bottom" : "top"}-${end ? "end" : "start"}` };
}
