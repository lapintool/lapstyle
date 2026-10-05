<script setup>
import { computed, onMounted, onBeforeUnmount, provide, ref, watch } from "vue";
import { destroy, enhance } from "../lapstyle.js";
import { readOptionValue } from "./value.js";

const model = defineModel({ type: [String, Number], default: null });

const props = defineProps({
  barOnly: { type: Boolean, default: false },
  color: { type: String, default: "" },
});

const emit = defineEmits(["change", "close"]);

const root = ref(null);
const panels = ref(/** @type {Map<string, any>} */ (new Map()));

provide("lsTabs", {
  model,
  registerPanel(value, vnode) {
    panels.value.set(String(value), vnode);
  },
  unregisterPanel(value) {
    panels.value.delete(String(value));
  },
});

const hostClass = computed(() => ({
  "bar-only": props.barOnly,
}));

function onChange(ev) {
  const tab = ev.detail?.tab;
  const value = readOptionValue(tab, tab?.getAttribute?.("data-tab"));
  if (value != null) {
    model.value = value;
    emit("change", { value, tab, index: ev.detail?.index });
  }
}

function onClose(ev) {
  const tab = ev.detail?.tab;
  const value = readOptionValue(tab, tab?.getAttribute?.("data-tab"));
  emit("close", { value, tab, index: ev.detail?.index, event: ev });
}

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
  root.value.addEventListener("ls-tabs:change", onChange);
  root.value.addEventListener("ls-tabs:close", onClose);
});

onBeforeUnmount(() => {
  if (!(root.value instanceof HTMLElement)) return;
  root.value.removeEventListener("ls-tabs:change", onChange);
  root.value.removeEventListener("ls-tabs:close", onClose);
  destroy(root.value);
});

watch(
  model,
  (next) => {
    if (!(root.value instanceof HTMLElement) || next == null) return;
    const tab = [...root.value.querySelectorAll(":scope > .bar > .tab")].find(
      (item) => readOptionValue(item, item.getAttribute("data-tab")) === next,
    );
    if (tab instanceof HTMLElement && !tab.classList.contains("is-active")) {
      tab.click();
    }
  },
);
</script>

<template>
  <div ref="root" class="ls-tabs" :class="hostClass">
    <div class="bar" :class="color || undefined" role="tablist">
      <slot name="tabs" />
      <slot />
    </div>
    <slot name="panels" />
  </div>
</template>
