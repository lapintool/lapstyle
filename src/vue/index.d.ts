import type { App, Component, ComponentOptionsMixin, DefineComponent, EmitsOptions, EmitsToProps, PublicProps, SlotsType, VNodeChild } from "vue";

type LapstyleComponent<Props, Events extends EmitsOptions, Slots extends Record<string, any>> = DefineComponent<
  Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin,
  Events, string, PublicProps, Props & EmitsToProps<Events>, {}, SlotsType<Slots>
>;

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
  default?: () => VNodeChild;
}

type LsBtnEventMap = {
  "click": (value: MouseEvent) => void;
};
export declare const LsBtn: LapstyleComponent<LsBtnProps, LsBtnEventMap, LsBtnSlots>;

export interface LsBtnGroupProps {
  spread?: boolean;
  outline?: boolean;
  vertical?: boolean;
  dense?: boolean;
}

export type LsBtnGroupEmits = Record<string, never>;

export interface LsBtnGroupSlots {
  default?: () => VNodeChild;
}

type LsBtnGroupEventMap = {

};
export declare const LsBtnGroup: LapstyleComponent<LsBtnGroupProps, LsBtnGroupEventMap, LsBtnGroupSlots>;

export interface LsBtnDropdownProps {
  split?: boolean;
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
  variant?: "" | "fill" | "push" | "flat" | "ghost" | "outline";
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  label?: string;
  arrow?: "chevron" | "triangle";
  borderless?: boolean;
  noArrow?: boolean;
  disabled?: boolean;
}

export type LsBtnDropdownEmits = {
  (e: "select", value: { value: string | number; label: string; item: HTMLElement; menu?: HTMLElement }): void;
  (e: "click", value: MouseEvent): void;
};

export interface LsBtnDropdownSlots {
  default?: () => VNodeChild;
  label?: () => VNodeChild;
}

type LsBtnDropdownEventMap = {
  "select": (value: { value: string | number; label: string; item: HTMLElement; menu?: HTMLElement }) => void;
  "click": (value: MouseEvent) => void;
};
export declare const LsBtnDropdown: LapstyleComponent<LsBtnDropdownProps, LsBtnDropdownEventMap, LsBtnDropdownSlots>;

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

}

type LsInputEventMap = {
  "update:modelValue": (value: string | number) => void;
};
export declare const LsInput: LapstyleComponent<LsInputProps, LsInputEventMap, LsInputSlots>;

export interface LsFieldProps {
  label?: string;
  size?: "" | "sm" | "md" | "lg";
  forId?: string;
}

export type LsFieldEmits = Record<string, never>;

export interface LsFieldSlots {
  default?: () => VNodeChild;
  label?: () => VNodeChild;
}

type LsFieldEventMap = {

};
export declare const LsField: LapstyleComponent<LsFieldProps, LsFieldEventMap, LsFieldSlots>;

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
  default?: () => VNodeChild;
}

type LsRadioEventMap = {
  "update:modelValue": (value: string | number | boolean) => void;
};
export declare const LsRadio: LapstyleComponent<LsRadioProps, LsRadioEventMap, LsRadioSlots>;

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
  default?: () => VNodeChild;
}

type LsCheckboxEventMap = {
  "update:modelValue": (value: boolean | unknown[]) => void;
};
export declare const LsCheckbox: LapstyleComponent<LsCheckboxProps, LsCheckboxEventMap, LsCheckboxSlots>;

export interface LsTabsProps {
  modelValue?: string | number | null;
  barOnly?: boolean;
  color?: "" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black";
}

export type LsTabsEmits = {
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: { value: string | number; tab: HTMLElement; index: number }): void;
  (e: "close", value: { value: string | number; tab: HTMLElement; index: number; event: CustomEvent }): void;
};

export interface LsTabsSlots {
  default?: () => VNodeChild;
  tabs?: () => VNodeChild;
  panels?: () => VNodeChild;
}

type LsTabsEventMap = {
  "update:modelValue": (value: string | number) => void;
  "change": (value: { value: string | number; tab: HTMLElement; index: number }) => void;
  "close": (value: { value: string | number; tab: HTMLElement; index: number; event: CustomEvent }) => void;
};
export declare const LsTabs: LapstyleComponent<LsTabsProps, LsTabsEventMap, LsTabsSlots>;

export interface LsTabProps {
  value: string | number;
  label?: string;
  closable?: boolean;
  disabled?: boolean;
}

export type LsTabEmits = Record<string, never>;

export interface LsTabSlots {
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
}

type LsTabEventMap = {

};
export declare const LsTab: LapstyleComponent<LsTabProps, LsTabEventMap, LsTabSlots>;

export interface LsDropdownProps {
  modelValue?: string | number | null;
  options?: Array<string | number | { value?: string | number, label?: string | number }> | null;
  placeholder?: string;
  editable?: boolean;
  arrow?: "chevron" | "triangle";
  borderless?: boolean;
  noArrow?: boolean;
  split?: boolean;
  disabled?: boolean;
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  end?: boolean;
  menuClass?: string;
}

export type LsDropdownEmits = {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "select", value: { value: string | number; label: string; item: HTMLElement; menu?: HTMLElement }): void;
};

export interface LsDropdownSlots {
  default?: () => VNodeChild;
}

type LsDropdownEventMap = {
  "update:modelValue": (value: string | number | null) => void;
  "select": (value: { value: string | number; label: string; item: HTMLElement; menu?: HTMLElement }) => void;
};
export declare const LsDropdown: LapstyleComponent<LsDropdownProps, LsDropdownEventMap, LsDropdownSlots>;

export interface LsDatePickerProps {
  modelValue?: string;
  mode?: "date" | "datetime" | "time";
  locale?: string;
  size?: "" | "sm" | "md" | "lg";
  dense?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  clearable?: boolean;
}

export type LsDatePickerEmits = {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "open"): void;
  (e: "close"): void;
};

export interface LsDatePickerSlots {

}

type LsDatePickerEventMap = {
  "update:modelValue": (value: string) => void;
  "change": (value: string) => void;
  "open": () => void;
  "close": () => void;
};
export declare const LsDatePicker: LapstyleComponent<LsDatePickerProps, LsDatePickerEventMap, LsDatePickerSlots>;

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
  (e: "action", value: { button: HTMLElement; dialog: HTMLElement; event: CustomEvent; preventDefault: () => void }): void;
  (e: "close"): void;
};

export interface LsDialogSlots {
  default?: () => VNodeChild;
  head?: () => VNodeChild;
  actions?: () => VNodeChild;
}

type LsDialogEventMap = {
  "update:modelValue": (value: boolean) => void;
  "action": (value: { button: HTMLElement; dialog: HTMLElement; event: CustomEvent; preventDefault: () => void }) => void;
  "close": () => void;
};
export declare const LsDialog: LapstyleComponent<LsDialogProps, LsDialogEventMap, LsDialogSlots>;

export interface LsTooltipProps {
  text?: string;
  placement?: "" | "top" | "bottom" | "left" | "right";
}

export type LsTooltipEmits = Record<string, never>;

export interface LsTooltipSlots {
  default?: () => VNodeChild;
}

type LsTooltipEventMap = {

};
export declare const LsTooltip: LapstyleComponent<LsTooltipProps, LsTooltipEventMap, LsTooltipSlots>;

export interface LsIconProps {
  name?: string;
  size?: "" | "sm" | "md" | "lg";
  filled?: boolean;
}

export type LsIconEmits = Record<string, never>;

export interface LsIconSlots {
  default?: () => VNodeChild;
}

type LsIconEventMap = {

};
export declare const LsIcon: LapstyleComponent<LsIconProps, LsIconEventMap, LsIconSlots>;

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
  (e: "select", value: { value: string | number; label: string; item: HTMLElement; menu?: HTMLElement }): void;
};

export interface LsMenuSlots {
  default?: () => VNodeChild;
}

type LsMenuEventMap = {
  "update:modelValue": (value: string | number | null) => void;
  "select": (value: { value: string | number; label: string; item: HTMLElement; menu?: HTMLElement }) => void;
};
export declare const LsMenu: LapstyleComponent<LsMenuProps, LsMenuEventMap, LsMenuSlots>;

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
  default?: () => VNodeChild;
  label?: () => VNodeChild;
  icon?: () => VNodeChild;
}

type LsMenuGroupEventMap = {
  "update:open": (value: boolean) => void;
};
export declare const LsMenuGroup: LapstyleComponent<LsMenuGroupProps, LsMenuGroupEventMap, LsMenuGroupSlots>;

export interface LsMenuItemProps {
  label?: string;
  value?: string | number | null;
  icon?: string | Component | null;
  href?: string;
  disabled?: boolean;
}

export type LsMenuItemEmits = Record<string, never>;

export interface LsMenuItemSlots {
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
}

type LsMenuItemEventMap = {

};
export declare const LsMenuItem: LapstyleComponent<LsMenuItemProps, LsMenuItemEventMap, LsMenuItemSlots>;

export interface LsCardProps {
  note?: boolean;
  dense?: boolean;
  flat?: boolean;
  tag?: string;
}

export type LsCardEmits = Record<string, never>;

export interface LsCardSlots {
  default?: () => VNodeChild;
}

type LsCardEventMap = {

};
export declare const LsCard: LapstyleComponent<LsCardProps, LsCardEventMap, LsCardSlots>;

export interface LsTableProps {
  dense?: boolean;
  hover?: boolean;
  plain?: boolean;
  noFrame?: boolean;
  fixed?: boolean;
  square?: boolean;
  kv?: boolean;
}

export type LsTableEmits = Record<string, never>;

export interface LsTableSlots {
  default?: () => VNodeChild;
}

type LsTableEventMap = {

};
export declare const LsTable: LapstyleComponent<LsTableProps, LsTableEventMap, LsTableSlots>;

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

}

type LsSliderEventMap = {
  "update:modelValue": (value: number) => void;
  "input": (value: number) => void;
  "change": (value: number) => void;
};
export declare const LsSlider: LapstyleComponent<LsSliderProps, LsSliderEventMap, LsSliderSlots>;

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

}

type LsProgressEventMap = {
  "update:modelValue": (value: number | null) => void;
};
export declare const LsProgress: LapstyleComponent<LsProgressProps, LsProgressEventMap, LsProgressSlots>;

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
  icon?: () => VNodeChild;
  head?: () => VNodeChild;
  default?: () => VNodeChild;
}

type LsExpandEventMap = {
  "update:modelValue": (value: boolean) => void;
  "change": (value: boolean) => void;
};
export declare const LsExpand: LapstyleComponent<LsExpandProps, LsExpandEventMap, LsExpandSlots>;

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
  default?: () => VNodeChild;
}

type LsSplitterEventMap = {
  "update:modelValue": (value: number) => void;
  "resize": (value: number) => void;
};
export declare const LsSplitter: LapstyleComponent<LsSplitterProps, LsSplitterEventMap, LsSplitterSlots>;

export interface LsColorPickerProps {
  modelValue?: string;
}

export type LsColorPickerEmits = {
  (e: "update:modelValue", value: string): void;
  (e: "input", value: string): void;
  (e: "change", value: string): void;
};

export interface LsColorPickerSlots {
  default?: () => VNodeChild;
}

type LsColorPickerEventMap = {
  "update:modelValue": (value: string) => void;
  "input": (value: string) => void;
  "change": (value: string) => void;
};
export declare const LsColorPicker: LapstyleComponent<LsColorPickerProps, LsColorPickerEventMap, LsColorPickerSlots>;

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
  LsDatePicker: typeof LsDatePicker;
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

declare module "vue" {
  export interface GlobalComponents {
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
    LsDatePicker: typeof LsDatePicker;
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
  }
}

export declare const LapstyleVue: {
  install(app: App): void;
};

export default LapstyleVue;
