import type { App, Component, DefineComponent } from "vue";

export interface LsBtnProps {
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
  variant?: "" | "fill" | "push" | "flat" | "ghost" | "outline";
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  rounded?: boolean;
  round?: boolean;
  icon?: boolean;
  stack?: boolean;
  noCaps?: boolean;
  type?: string;
  disabled?: boolean;
  href?: string;
  tag?: string;
}

export type LsBtnEmits = {
  (e: "click", value: MouseEvent): void;
};

export interface LsBtnSlots {
  default?: () => unknown;
}

export declare const LsBtn: DefineComponent<LsBtnProps>;

export interface LsBtnGroupProps {
  spread?: boolean;
  outline?: boolean;
  vertical?: boolean;
  dense?: boolean;
}

export type LsBtnGroupEmits = Record<string, never>;

export interface LsBtnGroupSlots {
  default?: () => unknown;
}

export declare const LsBtnGroup: DefineComponent<LsBtnGroupProps>;

export interface LsBtnDropdownProps {
  split?: boolean;
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
  variant?: "" | "fill" | "push" | "flat" | "ghost" | "outline";
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  label?: string;
  disabled?: boolean;
}

export type LsBtnDropdownEmits = {
  (e: "select", value: Record<string, unknown>): void;
  (e: "click", value: MouseEvent): void;
};

export interface LsBtnDropdownSlots {
  default?: () => unknown;
  label?: () => unknown;
}

export declare const LsBtnDropdown: DefineComponent<LsBtnDropdownProps>;

export interface LsInputProps {
  modelValue?: string | number;
  type?: string;
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  outlined?: boolean;
  filled?: boolean;
  borderless?: boolean;
  clearable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  autocomplete?: string;
}

export type LsInputEmits = {
  (e: "update:modelValue", value: string | number): void;
};

export interface LsInputSlots {
  default?: () => unknown;
}

export declare const LsInput: DefineComponent<LsInputProps>;

export interface LsFieldProps {
  label?: string;
  size?: "" | "sm" | "md" | "lg";
  forId?: string;
}

export type LsFieldEmits = Record<string, never>;

export interface LsFieldSlots {
  default?: () => unknown;
  label?: () => unknown;
}

export declare const LsField: DefineComponent<LsFieldProps>;

export interface LsRadioProps {
  modelValue?: string | number | boolean | null;
  value: string | number | boolean;
  label?: string;
  name?: string;
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  disabled?: boolean;
}

export type LsRadioEmits = {
  (e: "update:modelValue", value: string | number | boolean): void;
};

export interface LsRadioSlots {
  default?: () => unknown;
}

export declare const LsRadio: DefineComponent<LsRadioProps>;

export interface LsCheckboxProps {
  modelValue?: boolean | unknown[];
  value?: string | number | boolean;
  label?: string;
  name?: string;
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  disabled?: boolean;
}

export type LsCheckboxEmits = {
  (e: "update:modelValue", value: boolean | unknown[]): void;
};

export interface LsCheckboxSlots {
  default?: () => unknown;
}

export declare const LsCheckbox: DefineComponent<LsCheckboxProps>;

export interface LsTabsProps {
  modelValue?: string | number | null;
  barOnly?: boolean;
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
}

export type LsTabsEmits = {
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: Record<string, unknown>): void;
  (e: "close", value: Record<string, unknown>): void;
};

export interface LsTabsSlots {
  default?: () => unknown;
  tabs?: () => unknown;
  panels?: () => unknown;
}

export declare const LsTabs: DefineComponent<LsTabsProps>;

export interface LsTabProps {
  value: string | number;
  label?: string;
  closable?: boolean;
  disabled?: boolean;
}

export type LsTabEmits = Record<string, never>;

export interface LsTabSlots {
  default?: () => unknown;
  icon?: () => unknown;
}

export declare const LsTab: DefineComponent<LsTabProps>;

export interface LsDropdownProps {
  modelValue?: string | number | null;
  options?: Array<string | { value?: unknown, label?: unknown }> | null;
  placeholder?: string;
  disabled?: boolean;
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  end?: boolean;
  menuClass?: string;
}

export type LsDropdownEmits = {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "select", value: Record<string, unknown>): void;
};

export interface LsDropdownSlots {
  default?: () => unknown;
}

export declare const LsDropdown: DefineComponent<LsDropdownProps>;

export interface LsDialogProps {
  modelValue?: boolean;
  title?: string;
  persistent?: boolean;
  modeless?: boolean;
  draggable?: boolean;
  kind?: "" | "warning" | "error";
}

export type LsDialogEmits = {
  (e: "update:modelValue", value: boolean): void;
  (e: "action", value: Record<string, unknown>): void;
  (e: "close"): void;
};

export interface LsDialogSlots {
  default?: () => unknown;
  head?: () => unknown;
  actions?: () => unknown;
}

export declare const LsDialog: DefineComponent<LsDialogProps>;

export interface LsTooltipProps {
  text?: string;
  placement?: "" | "top" | "bottom" | "left" | "right";
}

export type LsTooltipEmits = Record<string, never>;

export interface LsTooltipSlots {
  default?: () => unknown;
}

export declare const LsTooltip: DefineComponent<LsTooltipProps>;

export interface LsIconProps {
  name?: string;
  size?: "" | "sm" | "md" | "lg";
  filled?: boolean;
}

export type LsIconEmits = Record<string, never>;

export interface LsIconSlots {
  default?: () => unknown;
}

export declare const LsIcon: DefineComponent<LsIconProps>;

export interface LsMenuProps {
  modelValue?: string | number | null;
  icons?: boolean;
  fill?: boolean;
  plain?: boolean;
  collapsed?: boolean;
  card?: boolean;
}

export type LsMenuEmits = {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "select", value: Record<string, unknown>): void;
};

export interface LsMenuSlots {
  default?: () => unknown;
}

export declare const LsMenu: DefineComponent<LsMenuProps>;

export interface LsMenuGroupProps {
  open?: boolean;
  label?: string;
  icon?: string | Component | null;
  disabled?: boolean;
}

export type LsMenuGroupEmits = {
  (e: "update:open", value: boolean): void;
};

export interface LsMenuGroupSlots {
  default?: () => unknown;
  label?: () => unknown;
  icon?: () => unknown;
}

export declare const LsMenuGroup: DefineComponent<LsMenuGroupProps>;

export interface LsMenuItemProps {
  label?: string;
  value?: string | number | null;
  icon?: string | Component | null;
  href?: string;
  disabled?: boolean;
}

export type LsMenuItemEmits = Record<string, never>;

export interface LsMenuItemSlots {
  default?: () => unknown;
  icon?: () => unknown;
}

export declare const LsMenuItem: DefineComponent<LsMenuItemProps>;

export interface LsCardProps {
  note?: boolean;
  dense?: boolean;
  flat?: boolean;
  tag?: string;
}

export type LsCardEmits = Record<string, never>;

export interface LsCardSlots {
  default?: () => unknown;
}

export declare const LsCard: DefineComponent<LsCardProps>;

export interface LsTableProps {
  dense?: boolean;
  hover?: boolean;
  plain?: boolean;
  noFrame?: boolean;
}

export type LsTableEmits = Record<string, never>;

export interface LsTableSlots {
  default?: () => unknown;
}

export declare const LsTable: DefineComponent<LsTableProps>;

export interface LsSliderProps {
  modelValue?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  label?: boolean;
  input?: boolean;
  vertical?: boolean;
  reverse?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export type LsSliderEmits = {
  (e: "update:modelValue", value: number): void;
  (e: "input", value: number): void;
  (e: "change", value: number): void;
};

export interface LsSliderSlots {
  default?: () => unknown;
}

export declare const LsSlider: DefineComponent<LsSliderProps>;

export interface LsProgressProps {
  modelValue?: number | null;
  buffer?: number | string | null;
  indeterminate?: boolean;
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
}

export type LsProgressEmits = {
  (e: "update:modelValue", value: number | null): void;
};

export interface LsProgressSlots {
  default?: () => unknown;
}

export declare const LsProgress: DefineComponent<LsProgressProps>;

export interface LsExpandProps {
  modelValue?: boolean;
  collapse?: "" | "tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l" | "float";
  expand?: "" | "tl" | "tr" | "bl" | "br" | "t" | "r" | "b" | "l" | "float";
  floatAnchor?: "" | "tl" | "tr" | "bl" | "br";
  openWidth?: number | string | null;
  openHeight?: number | string | null;
  title?: string;
}

export type LsExpandEmits = {
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
};

export interface LsExpandSlots {
  icon?: () => unknown;
  head?: () => unknown;
  default?: () => unknown;
}

export declare const LsExpand: DefineComponent<LsExpandProps>;

export interface LsSplitterProps {
  modelValue?: number | null;
  vertical?: boolean;
  min?: number | string;
  max?: number | string;
}

export type LsSplitterEmits = {
  (e: "update:modelValue", value: number): void;
  (e: "resize", value: number): void;
};

export interface LsSplitterSlots {
  default?: () => unknown;
}

export declare const LsSplitter: DefineComponent<LsSplitterProps>;

export interface LsColorPickerProps {
  modelValue?: string;
}

export type LsColorPickerEmits = {
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
  (e: "change", value: string): void;
};

export interface LsColorPickerSlots {
  default?: () => unknown;
}

export declare const LsColorPicker: DefineComponent<LsColorPickerProps>;

export declare const components: {
  LsBtn: typeof LsBtn;
  LsBtnGroup: typeof LsBtnGroup;
  LsBtnDropdown: typeof LsBtnDropdown;
  LsInput: typeof LsInput;
  LsField: typeof LsField;
  LsRadio: typeof LsRadio;
  LsCheckbox: typeof LsCheckbox;
  LsTabs: typeof LsTabs;
  LsTab: typeof LsTab;
  LsDropdown: typeof LsDropdown;
  LsDialog: typeof LsDialog;
  LsTooltip: typeof LsTooltip;
  LsIcon: typeof LsIcon;
  LsMenu: typeof LsMenu;
  LsMenuGroup: typeof LsMenuGroup;
  LsMenuItem: typeof LsMenuItem;
  LsCard: typeof LsCard;
  LsTable: typeof LsTable;
  LsSlider: typeof LsSlider;
  LsProgress: typeof LsProgress;
  LsExpand: typeof LsExpand;
  LsSplitter: typeof LsSplitter;
  LsColorPicker: typeof LsColorPicker;
};

export declare const LapstyleVue: {
  install(app: App): void;
};

export default LapstyleVue;
