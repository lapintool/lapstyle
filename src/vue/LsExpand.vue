<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
  destroy,
  enhance,
  normalizeExpandConfig,
  refreshExpand,
  setExpandOpen,
  warnExpandIssues,
} from "../lapstyle.js";

const open = defineModel({ type: Boolean, default: false });

const props = defineProps({
  expand: { type: String, default: "" },
  collapse: { type: String, default: "" },
  floatAnchor: { type: String, default: "" },
  openWidth: { type: [Number, String], default: null },
  openHeight: { type: [Number, String], default: null },
  title: { type: String, default: "" },
});

const emit = defineEmits(["change"]);

const root = ref(null);
let syncing = false;

const config = computed(() =>
  normalizeExpandConfig({
    expand: props.expand,
    collapse: props.collapse,
    floatAnchor: props.floatAnchor,
    openWidth: props.openWidth,
    openHeight: props.openHeight,
  }),
);

const attrs = computed(() => {
  const c = config.value;
  const out = {
    "data-expand": c.expand,
    "data-collapse": c.collapse,
  };
  if (c.floatAnchor) out["data-ls-float-anchor"] = c.floatAnchor;
  if (c.openWidth != null) out["data-open-width"] = String(c.openWidth);
  if (c.openHeight != null) out["data-open-height"] = String(c.openHeight);
  if (open.value) out["data-expanded"] = "";
  return out;
});

function onToggle(ev) {
  const next = Boolean(ev.detail?.open);
  if (next === open.value) return;
  syncing = true;
  open.value = next;
  emit("change", next);
  queueMicrotask(() => {
    syncing = false;
  });
}

watch(open, (next) => {
  if (syncing || !(root.value instanceof HTMLElement)) return;
  setExpandOpen(root.value, next);
  emit("change", next);
});

watch(
  () => config.value.issues,
  (issues) => {
    if (root.value) warnExpandIssues(root.value, issues);
  },
  { flush: "post" },
);

watch(
  () => [config.value.expand, config.value.collapse, config.value.floatAnchor],
  () => {
    if (root.value instanceof HTMLElement) refreshExpand(root.value);
  },
  { flush: "post" },
);

watch(
  () => [config.value.openWidth, config.value.openHeight],
  () => {
    if (root.value instanceof HTMLElement) setExpandOpen(root.value, open.value);
  },
  { flush: "post" },
);

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  warnExpandIssues(root.value, config.value.issues);
  enhance(root.value);
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <div ref="root" class="ls-expand" v-bind="attrs" @ls-expand:toggle="onToggle">
    <div class="frame">
      <button
        type="button"
        class="head"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-label="title || undefined"
      >
        <slot name="head">
          <span v-if="title" class="title">{{ title }}</span>
          <span class="icon" aria-hidden="true">
            <slot name="icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
            </slot>
          </span>
        </slot>
      </button>
      <div class="body">
        <slot />
      </div>
    </div>
  </div>
</template>
