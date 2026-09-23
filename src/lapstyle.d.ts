export function enhance(root?: ParentNode | Document): void;
export function destroy(root?: ParentNode | Document): void;
export function setPickerValue(
  picker: HTMLElement,
  hex: string,
  opts?: { silent?: boolean },
): void;
export function initColorPicker(picker: HTMLElement): void;
export function destroyColorPicker(picker: HTMLElement): void;
export function initDialog(dialog: HTMLElement): void;
export function destroyDialog(dialog: HTMLElement): void;
export function setDialogOpen(dialog: HTMLElement, open: boolean): void;
export function initDialogDrag(panel: HTMLElement): void;
export function destroyDialogDrag(panel: HTMLElement): void;
export function initDropdown(host: HTMLElement): void;
export function destroyDropdown(host: HTMLElement): void;
export function setDropdownOpen(host: HTMLElement, open: boolean): void;
export function initTabs(root: HTMLElement): void;
export function destroyTabs(root: HTMLElement): void;
export function initSlider(root: HTMLElement): void;
export function destroySlider(root: HTMLElement): void;
export function setSliderValue(
  root: HTMLElement,
  value: number | null,
  opts?: { change?: boolean; silent?: boolean },
): void;
export function initSplitter(root: HTMLElement): void;
export function destroySplitter(root: HTMLElement): void;
export function initProgress(el: HTMLElement): void;
export function destroyProgress(el: HTMLElement): void;
export function syncProgress(el: HTMLElement): void;
export function setProgressValue(
  el: HTMLElement,
  value: number | null,
  opts?: { silent?: boolean },
): void;
export function initTooltip(tip: HTMLElement): void;
export function destroyTooltip(tip: HTMLElement): void;
export function initExpand(root: HTMLElement): void;
export function destroyExpand(root: HTMLElement): void;
export function setExpandOpen(
  root: HTMLElement,
  open: boolean,
  instant?: boolean,
): void;
export function initMenu(root: HTMLElement): void;
export function destroyMenu(root: HTMLElement): void;
export const Lapstyle: {
  enhance: typeof enhance;
  destroy: typeof destroy;
  setPickerValue: typeof setPickerValue;
  initColorPicker: typeof initColorPicker;
  destroyColorPicker: typeof destroyColorPicker;
  initDialog: typeof initDialog;
  destroyDialog: typeof destroyDialog;
  setDialogOpen: typeof setDialogOpen;
  initDialogDrag: typeof initDialogDrag;
  destroyDialogDrag: typeof destroyDialogDrag;
  initDropdown: typeof initDropdown;
  destroyDropdown: typeof destroyDropdown;
  setDropdownOpen: typeof setDropdownOpen;
  initTabs: typeof initTabs;
  destroyTabs: typeof destroyTabs;
  initSlider: typeof initSlider;
  destroySlider: typeof destroySlider;
  setSliderValue: typeof setSliderValue;
  initSplitter: typeof initSplitter;
  destroySplitter: typeof destroySplitter;
  initProgress: typeof initProgress;
  destroyProgress: typeof destroyProgress;
  setProgressValue: typeof setProgressValue;
  syncProgress: typeof syncProgress;
  initTooltip: typeof initTooltip;
  destroyTooltip: typeof destroyTooltip;
  initExpand: typeof initExpand;
  destroyExpand: typeof destroyExpand;
  setExpandOpen: typeof setExpandOpen;
  initMenu: typeof initMenu;
  destroyMenu: typeof destroyMenu;
};

export default Lapstyle;
