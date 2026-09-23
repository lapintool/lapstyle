/**
 * Vue component API spec — source of truth for AI docs, demo tables, and index.d.ts.
 * After edits: `node scripts/render-ai-docs.mjs`
 *
 * Not exported from `lapstyle/vue` (runtime). Import `lapstyle/vue/api-spec.js` if needed.
 */

/** @typedef {{ name: string, type: string, default?: string, required?: boolean, desc: string }} ApiProp */
/** @typedef {{ name: string, payload?: string, desc: string }} ApiEvent */
/** @typedef {{ name: string, desc: string }} ApiSlot */
/** @typedef {{
 *   name: string,
 *   tag: string,
 *   page: string,
 *   summary: string,
 *   cssRoot: string,
 *   minimal: string,
 *   props: ApiProp[],
 *   events: ApiEvent[],
 *   slots: ApiSlot[],
 *   patterns?: string[],
 * }} VueComponentSpec */

const COLOR =
  'Omit for theme accent. Else: blue | cyan | magenta | green | red | yellow | dark | gray | white | black';
const SIZE = 'sm | md | lg (empty = md)';
const VARIANT = 'fill | push | flat | ghost | outline (empty = outline)';
const COLOR_TYPE =
  '"" | "blue" | "cyan" | "magenta" | "green" | "red" | "yellow" | "dark" | "gray" | "white" | "black"';
const SIZE_TYPE = '"" | "sm" | "md" | "lg"';
const VARIANT_TYPE = '"" | "fill" | "push" | "flat" | "ghost" | "outline"';

/** @type {Record<string, VueComponentSpec>} */
export const vueComponents = {
  LsBtn: {
    name: "LsBtn",
    tag: "ls-btn",
    page: "button",
    summary: "Button. Props map to the same modifier classes as .ls-btn.",
    cssRoot: ".ls-btn",
    minimal: `<ls-btn color="blue">Save</ls-btn>
<ls-btn color="cyan" variant="fill">Fill</ls-btn>
<ls-btn size="sm" dense>Dense</ls-btn>`,
    props: [
      { name: "color", type: COLOR_TYPE, default: '""', desc: COLOR },
      { name: "variant", type: VARIANT_TYPE, default: '""', desc: VARIANT },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact padding" },
      { name: "rounded", type: "boolean", default: "false", desc: "Pill radius" },
      { name: "round", type: "boolean", default: "false", desc: "Circle" },
      { name: "icon", type: "boolean", default: "false", desc: "Square icon button" },
      { name: "stack", type: "boolean", default: "false", desc: "Icon above, label below" },
      { name: "noCaps", type: "boolean", default: "false", desc: "Disable uppercase" },
      { name: "type", type: "string", default: '"button"', desc: "Native button type" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled state" },
      { name: "href", type: "string", default: '""', desc: "Render as <a> when set" },
      { name: "tag", type: "string", default: '"button"', desc: 'Root tag; "a" also forces a link' },
    ],
    events: [{ name: "click", payload: "MouseEvent", desc: "Native click (bubbles)" }],
    slots: [{ name: "default", desc: "Label, icons" }],
  },
  LsGroup: {
    name: "LsGroup",
    tag: "ls-group",
    page: "btngroup",
    summary: "Join adjacent buttons into one group.",
    cssRoot: ".ls-btn-group",
    minimal: `<ls-group>
  <ls-btn>One</ls-btn>
  <ls-btn>Two</ls-btn>
</ls-group>`,
    props: [
      { name: "spread", type: "boolean", default: "false", desc: "Equal-width children" },
      { name: "outline", type: "boolean", default: "false", desc: "Shared outline on the group" },
      { name: "vertical", type: "boolean", default: "false", desc: "Stack vertically" },
      { name: "dense", type: "boolean", default: "false", desc: "Compact padding" },
    ],
    events: [],
    slots: [{ name: "default", desc: "ls-btn (or other) children" }],
  },
  LsBtnDropdown: {
    name: "LsBtnDropdown",
    tag: "ls-btn-dropdown",
    page: "btngroup",
    summary: "Menu button: simple (one trigger) or split (main + arrow).",
    cssRoot: ".ls-btn-dropdown",
    minimal: `<ls-btn-dropdown color="blue" label="Actions">
  <button type="button" class="item" data-value="new"><span class="label">New</span></button>
</ls-btn-dropdown>`,
    props: [
      { name: "split", type: "boolean", default: "false", desc: "Main button + separate arrow" },
      { name: "color", type: COLOR_TYPE, default: '""', desc: COLOR },
      { name: "variant", type: VARIANT_TYPE, default: '""', desc: VARIANT },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact padding" },
      { name: "label", type: "string", default: '"Dropdown"', desc: "Trigger text when #label is empty" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled state" },
    ],
    events: [
      { name: "select", payload: "{ value, label, item }", desc: "Menu leaf selected" },
      { name: "click", payload: "MouseEvent", desc: "Main button click when split" },
    ],
    slots: [
      { name: "default", desc: "Menu .item buttons" },
      { name: "label", desc: "Trigger label" },
    ],
  },
  LsInput: {
    name: "LsInput",
    tag: "ls-input",
    page: "input",
    summary: "Text field with v-model.",
    cssRoot: ".ls-input",
    minimal: `<ls-input v-model="name" placeholder="Enter a name" />`,
    props: [
      { name: "modelValue", type: "string | number", default: '""', desc: "v-model" },
      { name: "type", type: "string", default: '"text"', desc: "Native input type" },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact padding" },
      { name: "outlined", type: "boolean", default: "false", desc: "Outline look" },
      { name: "filled", type: "boolean", default: "false", desc: "Filled look" },
      { name: "borderless", type: "boolean", default: "false", desc: "No border" },
      { name: "clearable", type: "boolean", default: "false", desc: "Reserved; not yet wired in the wrapper" },
      { name: "placeholder", type: "string", default: '""', desc: "Placeholder" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled" },
      { name: "readonly", type: "boolean", default: "false", desc: "Read-only" },
      { name: "autocomplete", type: "string", default: '"off"', desc: "autocomplete attribute" },
    ],
    events: [{ name: "update:modelValue", payload: "string | number", desc: "v-model" }],
    slots: [],
  },
  LsField: {
    name: "LsField",
    tag: "ls-field",
    page: "input",
    summary: "Label wrapper around a control (usually ls-input).",
    cssRoot: ".ls-field",
    minimal: `<ls-field label="Name">
  <ls-input v-model="name" />
</ls-field>`,
    props: [
      { name: "label", type: "string", default: '""', desc: "Label text" },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "forId", type: "string", default: '""', desc: "for= on the label" },
    ],
    events: [],
    slots: [
      { name: "default", desc: "Control inside the field" },
      { name: "label", desc: "Custom label" },
    ],
  },
  LsRadio: {
    name: "LsRadio",
    tag: "ls-radio",
    page: "radio",
    summary: "Radio with shared v-model across the group.",
    cssRoot: ".ls-radio",
    minimal: `<ls-radio v-model="choice" value="a" label="Option A" name="demo" />
<ls-radio v-model="choice" value="b" label="Option B" name="demo" />`,
    props: [
      { name: "modelValue", type: "string | number | boolean | null", desc: "v-model (group)" },
      { name: "value", type: "string | number | boolean", required: true, desc: "Option value" },
      { name: "label", type: "string", default: '""', desc: "Label text" },
      { name: "name", type: "string", default: '""', desc: "Native name (group)" },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled" },
    ],
    events: [{ name: "update:modelValue", payload: "string | number | boolean", desc: "v-model" }],
    slots: [{ name: "default", desc: "Label content" }],
  },
  LsCheckbox: {
    name: "LsCheckbox",
    tag: "ls-checkbox",
    page: "checkbox",
    summary: "Checkbox. Switch / round / button looks are extra classes on the host.",
    cssRoot: ".ls-checkbox",
    minimal: `<ls-checkbox v-model="on" label="Enable" />
<ls-checkbox v-model="on" class="switch cyan" label="Switch" />`,
    props: [
      { name: "modelValue", type: "boolean | unknown[]", default: "false", desc: "v-model (boolean or array)" },
      { name: "value", type: "string | number | boolean", default: "true", desc: "Value when used in array mode" },
      { name: "label", type: "string", default: '""', desc: "Label text" },
      { name: "name", type: "string", default: '""', desc: "Native name" },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled" },
    ],
    events: [{ name: "update:modelValue", payload: "boolean | unknown[]", desc: "v-model" }],
    slots: [{ name: "default", desc: "Label content" }],
    patterns: ['Add class="switch" / "round" / "btn" / a color word on <ls-checkbox>.'],
  },
  LsTabs: {
    name: "LsTabs",
    tag: "ls-tabs",
    page: "tabs",
    summary: "Tab bar. v-model is the active LsTab value.",
    cssRoot: ".ls-tabs",
    minimal: `<ls-tabs v-model="tab">
  <ls-tab value="a" label="Overview" />
  <ls-tab value="b" label="Files" closable />
  <template #panels>
    <div class="panel" role="tabpanel">Panel for {{ tab }}</div>
  </template>
</ls-tabs>`,
    props: [
      { name: "modelValue", type: "string | number | null", desc: "Active tab value" },
      { name: "barOnly", type: "boolean", default: "false", desc: "Bar only, no panels region" },
      { name: "color", type: COLOR_TYPE, default: '""', desc: "Accent class on the bar" },
    ],
    events: [
      { name: "update:modelValue", payload: "string | number", desc: "Active tab changed" },
      { name: "change", payload: "{ value, tab, index }", desc: "After switch" },
      {
        name: "close",
        payload: "{ value, tab, index, event }",
        desc: "Close clicked; event.preventDefault() keeps the tab",
      },
    ],
    slots: [
      { name: "default", desc: "LsTab items (also #tabs)" },
      { name: "tabs", desc: "Alias for tab items" },
      { name: "panels", desc: "Tab panels" },
    ],
  },
  LsTab: {
    name: "LsTab",
    tag: "ls-tab",
    page: "tabs",
    summary: "One tab inside LsTabs.",
    cssRoot: ".ls-tabs .tab",
    minimal: `<ls-tab value="a" label="Overview" />`,
    props: [
      { name: "value", type: "string | number", required: true, desc: "Tab id (v-model of LsTabs)" },
      { name: "label", type: "string", default: '""', desc: "Tab text" },
      { name: "closable", type: "boolean", default: "false", desc: "Show close control" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled tab" },
    ],
    events: [],
    slots: [
      { name: "default", desc: "Label override" },
      { name: "icon", desc: "Leading icon" },
    ],
  },
  LsDropdown: {
    name: "LsDropdown",
    tag: "ls-dropdown",
    page: "dropdown",
    summary: "Select-style dropdown. v-model + options, or slot .item rows.",
    cssRoot: ".ls-dropdown",
    minimal: `<ls-dropdown
  v-model="lang"
  :options="['JavaScript', 'TypeScript', 'Python']"
/>`,
    props: [
      { name: "modelValue", type: "string | number | null", desc: "Selected value (v-model)" },
      {
        name: "options",
        type: "Array<string | { value?: unknown, label?: unknown }> | null",
        default: "null",
        desc: "Data-driven items; omit when using the default slot",
      },
      { name: "placeholder", type: "string", default: '"Select"', desc: "Trigger text when empty" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled" },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact" },
      { name: "end", type: "boolean", default: "false", desc: "Align menu to the right" },
      { name: "menuClass", type: "string", default: '""', desc: "Extra classes on the menu" },
    ],
    events: [
      { name: "update:modelValue", payload: "string | number | null", desc: "Selection changed" },
      { name: "select", payload: "{ value, label, item }", desc: "Leaf item selected" },
    ],
    slots: [{ name: "default", desc: "Custom .item buttons instead of options" }],
    patterns: [
      'Custom menu: omit options and put <button type="button" class="item" data-value="…"> in the default slot.',
    ],
  },
  LsDialog: {
    name: "LsDialog",
    tag: "ls-dialog",
    page: "dialog",
    summary: "Modal / modeless dialog. v-model is open. Action buttons close by default.",
    cssRoot: ".ls-dialog",
    minimal: `<ls-btn color="blue" @click="open = true">Open</ls-btn>
<ls-dialog v-model="open" title="New file">
  <ls-field label="File name">
    <ls-input v-model="name" />
  </ls-field>
  <template #actions>
    <ls-btn color="red">Cancel</ls-btn>
    <ls-btn color="blue">OK</ls-btn>
  </template>
</ls-dialog>`,
    props: [
      { name: "modelValue", type: "boolean", default: "false", desc: "Open state (v-model)" },
      { name: "title", type: "string", default: '""', desc: "Default head title" },
      { name: "persistent", type: "boolean", default: "false", desc: "Backdrop / Esc do not close" },
      { name: "modeless", type: "boolean", default: "false", desc: "No overlay; page stays clickable" },
      { name: "draggable", type: "boolean", default: "false", desc: "Drag from the title band" },
      { name: "kind", type: '"" | "warning" | "error"', default: '""', desc: "warning | error (title icon color)" },
    ],
    events: [
      { name: "update:modelValue", payload: "boolean", desc: "Open / close" },
      {
        name: "action",
        payload: "{ button, dialog }",
        desc: "Before close from #actions; preventDefault() to keep open",
      },
      { name: "close", desc: "After the dialog becomes hidden" },
    ],
    slots: [
      { name: "default", desc: "Body" },
      { name: "head", desc: "Custom header (overrides title)" },
      { name: "actions", desc: "Footer buttons; clicks close unless prevented" },
    ],
    patterns: [
      "Validate on OK: @action — if the OK button is invalid, call event.preventDefault().",
    ],
  },
  LsTooltip: {
    name: "LsTooltip",
    tag: "ls-tooltip",
    page: "tooltip",
    summary: "Tooltip inside a hoverable host. Prefers top and flips to stay in view.",
    cssRoot: ".ls-tooltip",
    minimal: `<ls-btn color="blue">
  Hover
  <ls-tooltip>Shown on hover</ls-tooltip>
</ls-btn>`,
    props: [
      { name: "text", type: "string", default: '""', desc: "Fallback text when the slot is empty" },
      { name: "placement", type: '"" | "top" | "bottom" | "left" | "right"', default: '""', desc: "Optional lock: top | bottom | left | right" },
    ],
    events: [],
    slots: [{ name: "default", desc: "Tooltip content" }],
  },
  LsIcon: {
    name: "LsIcon",
    tag: "ls-icon",
    page: "icon",
    summary: "Icon host. Lapstyle does not ship fonts; put SVG or glyphs in the slot.",
    cssRoot: ".ls-icon",
    minimal: `<ls-icon size="sm" name="close" />
<ls-icon><svg viewBox="0 0 24 24" width="24" height="24">…</svg></ls-icon>`,
    props: [
      { name: "name", type: "string", default: '""', desc: "Optional built-in glyph class (e.g. close)" },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "filled", type: "boolean", default: "false", desc: "Filled variant when applicable" },
    ],
    events: [],
    slots: [{ name: "default", desc: "Custom SVG / font glyph" }],
    patterns: ["The kit does not bundle icon fonts. Import Material Symbols / your SVG yourself."],
  },
  LsMenu: {
    name: "LsMenu",
    tag: "ls-menu",
    page: "menu",
    summary: "Standalone menu. Leaf clicks emit select and update v-model when data-value is set.",
    cssRoot: ".ls-menu",
    minimal: `<ls-menu v-model="sel" icons fill>
  <button type="button" class="item" data-value="a"><span class="label">A</span></button>
  <button type="button" class="item" data-value="b"><span class="label">B</span></button>
</ls-menu>`,
    props: [
      { name: "modelValue", type: "string | number | null", desc: "Selected value" },
      { name: "icons", type: "boolean", default: "false", desc: "Reserve icon column" },
      { name: "fill", type: "boolean", default: "false", desc: "Filled items" },
      { name: "plain", type: "boolean", default: "false", desc: "No card chrome" },
      { name: "collapsed", type: "boolean", default: "false", desc: "Collapsed / rail" },
      { name: "card", type: "boolean", default: "true", desc: "Wrap with .ls-card" },
    ],
    events: [
      { name: "update:modelValue", payload: "string | number | null", desc: "Selection" },
      { name: "select", payload: "{ value, label, item }", desc: "Leaf selected" },
    ],
    slots: [{ name: "default", desc: ".item rows and nested structure" }],
  },
  LsCard: {
    name: "LsCard",
    tag: "ls-card",
    page: "card",
    summary: "Surface container. note is a dashed callout.",
    cssRoot: ".ls-card",
    minimal: `<ls-card>Content</ls-card>
<ls-card note>Hint text</ls-card>`,
    props: [
      { name: "note", type: "boolean", default: "false", desc: "Dashed callout" },
      { name: "dense", type: "boolean", default: "false", desc: "Compact padding" },
      { name: "flat", type: "boolean", default: "false", desc: "No elevation" },
      { name: "tag", type: "string", default: '"div"', desc: "Root element" },
    ],
    events: [],
    slots: [{ name: "default", desc: "Card body" }],
  },
  LsTable: {
    name: "LsTable",
    tag: "ls-table",
    page: "table",
    summary: "Table shell. Put a native <table> inside.",
    cssRoot: ".ls-table",
    minimal: `<ls-table dense hover>
  <table>
    <thead><tr><th>A</th><th>B</th></tr></thead>
    <tbody><tr><td>1</td><td>2</td></tr></tbody>
  </table>
</ls-table>`,
    props: [
      { name: "dense", type: "boolean", default: "false", desc: "Tighten cell padding" },
      { name: "hover", type: "boolean", default: "false", desc: "Highlight the body row under the pointer" },
      { name: "plain", type: "boolean", default: "false", desc: "No cell or shell lines" },
      { name: "noFrame", type: "boolean", default: "false", desc: "Drop the outer border; inner lines stay" },
    ],
    events: [],
    slots: [{ name: "default", desc: "Native <table> markup" }],
  },
  LsSlider: {
    name: "LsSlider",
    tag: "ls-slider",
    page: "slider",
    summary: "Range control. Track UI is built by enhance inside the component.",
    cssRoot: ".ls-slider",
    minimal: `<ls-slider v-model="n" :min="0" :max="100" label />`,
    props: [
      { name: "modelValue", type: "number", default: "0", desc: "Current value (v-model)" },
      { name: "min", type: "number | string", default: "0", desc: "Minimum" },
      { name: "max", type: "number | string", default: "100", desc: "Maximum" },
      { name: "step", type: "number | string", default: "1", desc: "Step" },
      { name: "color", type: COLOR_TYPE, default: '""', desc: COLOR },
      { name: "size", type: SIZE_TYPE, default: '""', desc: SIZE },
      { name: "dense", type: "boolean", default: "false", desc: "Compact" },
      { name: "label", type: "boolean", default: "false", desc: "Show value label" },
      { name: "input", type: "boolean", default: "false", desc: "Numeric input beside the track" },
      { name: "vertical", type: "boolean", default: "false", desc: "Vertical orientation" },
      { name: "reverse", type: "boolean", default: "false", desc: "Reverse direction" },
      { name: "disabled", type: "boolean", default: "false", desc: "Disabled" },
      { name: "ariaLabel", type: "string", default: '""', desc: "Accessibility label" },
    ],
    events: [
      { name: "update:modelValue", payload: "number", desc: "While dragging / stepping" },
      { name: "input", payload: "number", desc: "Same as continuous update" },
      { name: "change", payload: "number", desc: "Committed value" },
    ],
    slots: [],
  },
  LsProgress: {
    name: "LsProgress",
    tag: "ls-progress",
    page: "progress",
    summary: "Linear progress. v-model sets aria-valuenow / --ls-progress.",
    cssRoot: ".ls-progress",
    minimal: `<ls-progress v-model="pct" color="cyan" />
<ls-progress indeterminate />`,
    props: [
      { name: "modelValue", type: "number | null", desc: "0–100 (or null for CSS-only)" },
      { name: "buffer", type: "number | string | null", desc: "Buffer percent" },
      { name: "indeterminate", type: "boolean", default: "false", desc: "Indeterminate animation" },
      { name: "color", type: COLOR_TYPE, default: '""', desc: COLOR },
    ],
    events: [{ name: "update:modelValue", payload: "number | null", desc: "When the value is written" }],
    slots: [],
  },
  LsExpand: {
    name: "LsExpand",
    tag: "ls-expand",
    page: "expand",
    summary: "Corner / edge / float expand panel. v-model is expanded state.",
    cssRoot: ".ls-expand",
    minimal: `<ls-expand v-model="open" expand="tr" title="Panel">
  <p>Body</p>
</ls-expand>`,
    props: [
      { name: "modelValue", type: "boolean", default: "false", desc: "Expanded (v-model)" },
      {
        name: "expand",
        type: '"tr" | "tl" | "br" | "bl" | "t" | "b" | "l" | "r"',
        default: '"tr"',
        desc: "Dock: tr | tl | br | bl | t | b | l | r",
      },
      { name: "collapse", type: "string", default: '""', desc: "Collapsed-edge target" },
      { name: "floatAnchor", type: "string", default: '""', desc: "Float pin (data-ls-float-anchor)" },
      { name: "title", type: "string", default: '""', desc: "Head title" },
    ],
    events: [
      { name: "update:modelValue", payload: "boolean", desc: "Open state" },
      { name: "change", payload: "boolean", desc: "After toggle" },
    ],
    slots: [
      { name: "head", desc: "Custom head content" },
      { name: "default", desc: "Panel body" },
    ],
  },
  LsSplitter: {
    name: "LsSplitter",
    tag: "ls-splitter",
    page: "splitter",
    summary: "Two-pane splitter. Put two .pane children in the default slot.",
    cssRoot: ".ls-splitter",
    minimal: `<ls-splitter v-model="size" :min="20" :max="80">
  <div class="pane">Left</div>
  <div class="pane">Right</div>
</ls-splitter>`,
    props: [
      { name: "modelValue", type: "number | null", desc: "First pane size %" },
      { name: "vertical", type: "boolean", default: "false", desc: "Stack panes vertically" },
      { name: "min", type: "number | string", default: "0", desc: "Percent lower bound" },
      { name: "max", type: "number | string", default: "100", desc: "Percent upper bound" },
    ],
    events: [
      { name: "update:modelValue", payload: "number", desc: "While resizing" },
      { name: "resize", payload: "number", desc: "Size changed" },
    ],
    slots: [{ name: "default", desc: "Two .pane children" }],
  },
  LsColorPicker: {
    name: "LsColorPicker",
    tag: "ls-color-picker",
    page: "color-picker",
    summary: "SV + hue + HEX. v-model is the hex string.",
    cssRoot: ".ls-color-picker",
    minimal: `<ls-color-picker v-model="hex" />`,
    props: [
      { name: "modelValue", type: "string", default: '"#248df4"', desc: "HEX color (v-model)" },
    ],
    events: [
      { name: "update:modelValue", payload: "string", desc: "While dragging" },
      { name: "input", payload: "string", desc: "Same as continuous update" },
      { name: "change", payload: "string", desc: "Committed color" },
    ],
    slots: [{ name: "default", desc: "Optional; overrides the built-in SV panel, hue bar and HEX field markup" }],
  },
};

/** Demo-page extras (summary / combined minimal). */
export const pages = {
  button: { id: "button", title: "Button", components: ["LsBtn"] },
  btngroup: {
    id: "btngroup",
    title: "Button group",
    components: ["LsGroup", "LsBtnDropdown"],
    summary: "Join buttons (LsGroup) or a menu button (LsBtnDropdown simple / split).",
    minimal: `${vueComponents.LsGroup.minimal}
${vueComponents.LsBtnDropdown.minimal}`,
  },
  input: {
    id: "input",
    title: "Input",
    components: ["LsInput", "LsField"],
    summary: "Text field with v-model. Wrap with LsField for a label.",
    minimal: vueComponents.LsField.minimal,
  },
  radio: { id: "radio", title: "Radio", components: ["LsRadio"] },
  checkbox: { id: "checkbox", title: "Checkbox", components: ["LsCheckbox"] },
  tabs: {
    id: "tabs",
    title: "Tabs",
    components: ["LsTabs", "LsTab"],
    summary: "Tab bar with optional closable tabs. v-model is the active LsTab value.",
    minimal: vueComponents.LsTabs.minimal,
  },
  dropdown: { id: "dropdown", title: "Dropdown", components: ["LsDropdown"] },
  dialog: { id: "dialog", title: "Dialog", components: ["LsDialog"] },
  tooltip: { id: "tooltip", title: "Tooltip", components: ["LsTooltip"] },
  icon: { id: "icon", title: "Icon", components: ["LsIcon"] },
  menu: { id: "menu", title: "Menu", components: ["LsMenu"] },
  card: { id: "card", title: "Card", components: ["LsCard"] },
  table: { id: "table", title: "Table", components: ["LsTable"] },
  slider: { id: "slider", title: "Slider", components: ["LsSlider"] },
  progress: { id: "progress", title: "Progress", components: ["LsProgress"] },
  expand: { id: "expand", title: "Expand", components: ["LsExpand"] },
  splitter: { id: "splitter", title: "Splitter", components: ["LsSplitter"] },
  "color-picker": { id: "color-picker", title: "Color picker", components: ["LsColorPicker"] },
};

export const COMPONENT_ORDER = [
  "LsBtn",
  "LsGroup",
  "LsBtnDropdown",
  "LsInput",
  "LsField",
  "LsRadio",
  "LsCheckbox",
  "LsTabs",
  "LsTab",
  "LsDropdown",
  "LsDialog",
  "LsTooltip",
  "LsIcon",
  "LsMenu",
  "LsCard",
  "LsTable",
  "LsSlider",
  "LsProgress",
  "LsExpand",
  "LsSplitter",
  "LsColorPicker",
];

function prefixRows(comp, rows, key) {
  if (!rows.length) return [];
  return rows.map((row) => ({ ...row, [key]: `${comp.name}: ${row[key]}` }));
}

/**
 * Page-level API used by the human demo tables (may merge several Ls* components).
 * @param {string} id
 */
export function apiFor(id) {
  const page = pages[id];
  if (!page?.components?.length) return undefined;
  const comps = page.components.map((name) => vueComponents[name]).filter(Boolean);
  if (!comps.length) return undefined;
  const many = comps.length > 1;
  const first = comps[0];
  return {
    tag: comps.map((c) => c.tag).join(" / "),
    component: comps.map((c) => c.name).join(", "),
    summary: page.summary || first.summary,
    minimal: page.minimal || first.minimal,
    props: many ? comps.flatMap((c) => prefixRows(c, c.props, "name")) : first.props,
    events: many ? comps.flatMap((c) => prefixRows(c, c.events, "name")) : first.events,
    slots: many ? comps.flatMap((c) => prefixRows(c, c.slots, "name")) : first.slots,
    cssRoot: [...new Set(comps.map((c) => c.cssRoot))].join(" / "),
    patterns: comps.flatMap((c) => c.patterns || []),
  };
}

/** @deprecated use apiFor — kept for callers that imported componentApis */
export const componentApis = new Proxy(
  {},
  {
    get(_, id) {
      if (typeof id !== "string") return undefined;
      return apiFor(id);
    },
    has(_, id) {
      return typeof id === "string" && Boolean(pages[id]?.components?.length);
    },
    ownKeys() {
      return Object.keys(pages);
    },
    getOwnPropertyDescriptor(_, id) {
      if (typeof id !== "string" || !pages[id]) return undefined;
      return { enumerable: true, configurable: true, value: apiFor(id) };
    },
  },
);
