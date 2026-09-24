/* @ts-self-types="./lapstyle.d.ts" */
// Lapstyle progressive enhancement. Vanilla JS, no framework dependency.
// Opt-in: import this module and call enhance().
// SPA usage: call destroy(root) (or the per-component destroy*) before unmount
// to detach the listeners and observers that enhance() added.

import { destroyColorPicker, initColorPicker, setPickerValue } from "./js/color-picker.js";
import {
  destroyDialog,
  destroyDialogDrag,
  initDialog,
  initDialogDrag,
  setDialogOpen,
} from "./js/dialog.js";
import {
  destroyDropdown,
  initDropdown,
  setDropdownOpen,
} from "./js/dropdown.js";
import {
  destroyExpand,
  initExpand,
  normalizeExpandConfig,
  refreshExpand,
  setExpandOpen,
  warnExpandIssues,
} from "./js/expand.js";
import { destroyMenu, initMenu } from "./js/menu.js";
import {
  destroyProgress,
  initProgress,
  setProgressValue,
  syncProgress,
} from "./js/progress.js";
import { destroySlider, initSlider, setSliderValue } from "./js/slider.js";
import { destroySplitter, initSplitter, setSplitterSize } from "./js/splitter.js";
import { destroyTabs, initTabs } from "./js/tabs.js";
import { destroyTooltip, initTooltip } from "./js/tooltip.js";

function forEachMatch(root, selector, fn) {
  if (root instanceof Element && typeof root.matches === "function" && root.matches(selector)) {
    fn(root);
  }
  if (root && typeof root.querySelectorAll === "function") {
    root.querySelectorAll(selector).forEach(fn);
  }
}

export function enhance(root = document) {
  forEachMatch(root, ".ls-color-picker", initColorPicker);
  forEachMatch(root, ".ls-dialog", initDialog);
  forEachMatch(root, ".ls-dropdown", initDropdown);
  forEachMatch(root, ".ls-btn-dropdown", initDropdown);
  forEachMatch(root, ".ls-tabs", initTabs);
  forEachMatch(root, ".ls-slider", initSlider);
  forEachMatch(root, ".ls-splitter", initSplitter);
  forEachMatch(root, ".ls-progress", initProgress);
  forEachMatch(root, ".ls-tooltip", initTooltip);
  forEachMatch(root, ".ls-expand", initExpand);
  forEachMatch(root, ".ls-menu", initMenu);
}

export function destroy(root = document) {
  forEachMatch(root, ".ls-color-picker", destroyColorPicker);
  forEachMatch(root, ".ls-dialog", destroyDialog);
  forEachMatch(root, ".ls-dropdown", destroyDropdown);
  forEachMatch(root, ".ls-btn-dropdown", destroyDropdown);
  forEachMatch(root, ".ls-tabs", destroyTabs);
  forEachMatch(root, ".ls-slider", destroySlider);
  forEachMatch(root, ".ls-splitter", destroySplitter);
  forEachMatch(root, ".ls-progress", destroyProgress);
  forEachMatch(root, ".ls-tooltip", destroyTooltip);
  forEachMatch(root, ".ls-expand", destroyExpand);
  forEachMatch(root, ".ls-menu", destroyMenu);
}

const Lapstyle = {
  enhance,
  destroy,
  setPickerValue,
  initColorPicker,
  destroyColorPicker,
  initDialog,
  destroyDialog,
  setDialogOpen,
  initDialogDrag,
  destroyDialogDrag,
  initDropdown,
  destroyDropdown,
  setDropdownOpen,
  initTabs,
  destroyTabs,
  initSlider,
  destroySlider,
  setSliderValue,
  initSplitter,
  destroySplitter,
  setSplitterSize,
  initProgress,
  destroyProgress,
  setProgressValue,
  syncProgress,
  initTooltip,
  destroyTooltip,
  initExpand,
  destroyExpand,
  setExpandOpen,
  refreshExpand,
  normalizeExpandConfig,
  warnExpandIssues,
  initMenu,
  destroyMenu,
};

export {
  setPickerValue,
  initColorPicker,
  destroyColorPicker,
  initDialog,
  destroyDialog,
  setDialogOpen,
  initDialogDrag,
  destroyDialogDrag,
  initDropdown,
  destroyDropdown,
  setDropdownOpen,
  initTabs,
  destroyTabs,
  initSlider,
  destroySlider,
  setSliderValue,
  initSplitter,
  destroySplitter,
  setSplitterSize,
  initProgress,
  destroyProgress,
  setProgressValue,
  syncProgress,
  initTooltip,
  destroyTooltip,
  initExpand,
  destroyExpand,
  setExpandOpen,
  refreshExpand,
  normalizeExpandConfig,
  warnExpandIssues,
  initMenu,
  destroyMenu,
};

export default Lapstyle;
