export function enhance(root?: ParentNode | Document): void;
export function destroy(root?: ParentNode | Document): void;
export function setPickerValue(
  picker: HTMLElement,
  hex: string,
  opts?: { silent?: boolean },
): void;
export function initColorPicker(picker: HTMLElement): void;
export function destroyColorPicker(picker: HTMLElement): void;
export function initDialogDrag(panel: HTMLElement): void;
export function destroyDialogDrag(panel: HTMLElement): void;
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
  initDialogDrag: typeof initDialogDrag;
  destroyDialogDrag: typeof destroyDialogDrag;
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
