import LsBtn from "./LsBtn.vue";
import LsBtnDropdown from "./LsBtnDropdown.vue";
import LsCard from "./LsCard.vue";
import LsCheckbox from "./LsCheckbox.vue";
import LsColorPicker from "./LsColorPicker.vue";
import LsDialog from "./LsDialog.vue";
import LsDropdown from "./LsDropdown.vue";
import LsExpand from "./LsExpand.vue";
import LsField from "./LsField.vue";
import LsBtnGroup from "./LsBtnGroup.vue";
import LsIcon from "./LsIcon.vue";
import LsInput from "./LsInput.vue";
import LsMenu from "./LsMenu.vue";
import LsMenuGroup from "./LsMenuGroup.vue";
import LsMenuItem from "./LsMenuItem.vue";
import LsProgress from "./LsProgress.vue";
import LsRadio from "./LsRadio.vue";
import LsSlider from "./LsSlider.vue";
import LsSplitter from "./LsSplitter.vue";
import LsTab from "./LsTab.vue";
import LsTable from "./LsTable.vue";
import LsTabs from "./LsTabs.vue";
import LsTooltip from "./LsTooltip.vue";

export {
  LsBtn,
  LsBtnDropdown,
  LsCard,
  LsCheckbox,
  LsColorPicker,
  LsDialog,
  LsDropdown,
  LsExpand,
  LsField,
  LsBtnGroup,
  LsIcon,
  LsInput,
  LsMenu,
  LsMenuGroup,
  LsMenuItem,
  LsProgress,
  LsRadio,
  LsSlider,
  LsSplitter,
  LsTab,
  LsTable,
  LsTabs,
  LsTooltip,
};

/** All Ls* components for app.use(LapstyleVue) */
export const components = {
  LsBtn,
  LsBtnDropdown,
  LsCard,
  LsCheckbox,
  LsColorPicker,
  LsDialog,
  LsDropdown,
  LsExpand,
  LsField,
  LsBtnGroup,
  LsIcon,
  LsInput,
  LsMenu,
  LsMenuGroup,
  LsMenuItem,
  LsProgress,
  LsRadio,
  LsSlider,
  LsSplitter,
  LsTab,
  LsTable,
  LsTabs,
  LsTooltip,
};

/**
 * Vue plugin — globally registers every Ls* component.
 * @type {import("vue").Plugin}
 */
export const LapstyleVue = {
  install(app) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component);
    }
  },
};

export default LapstyleVue;
