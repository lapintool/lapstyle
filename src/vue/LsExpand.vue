<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance, setExpandOpen } from "../lapstyle.js";

const open = defineModel({ type: Boolean, default: false });

const props = defineProps({
  expand: { type: String, default: "tr" },
  collapse: { type: String, default: "" },
  floatAnchor: { type: String, default: "" },
  title: { type: String, default: "" },
});

const emit = defineEmits(["change"]);

const root = ref(null);
let syncing = false;

const attrs = computed(() => {
  const out = {
    "data-expand": props.expand,
  };
  if (props.collapse) out["data-collapse"] = props.collapse;
  if (props.floatAnchor) out["data-ls-float-anchor"] = props.floatAnchor;
  if (open.value) out["data-expanded"] = "";
  return out;
});

watch(open, (next) => {
  if (syncing || !(root.value instanceof HTMLElement)) return;
  setExpandOpen(root.value, next);
  emit("change", next);
});

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
  const head = root.value.querySelector(".head");
  if (head) {
    head.addEventListener("click", () => {
      syncing = true;
      open.value = root.value.classList.contains("is-expanded");
      emit("change", open.value);
      queueMicrotask(() => {
        syncing = false;
      });
    });
  }
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <div ref="root" class="ls-expand" v-bind="attrs">
    <button type="button" class="head" :aria-expanded="open ? 'true' : 'false'">
      <slot name="head">{{ title }}</slot>
    </button>
    <slot />
  </div>
</template>
