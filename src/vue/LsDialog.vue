<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance, setDialogOpen } from "../lapstyle.js";

const open = defineModel({ type: Boolean, default: false });

const props = defineProps({
  kind: { type: String, default: "" },
  persistent: { type: Boolean, default: false },
  modeless: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  title: { type: String, default: "" },
});

const emit = defineEmits(["action", "close"]);

const root = ref(null);
/** @type {MutationObserver | null} */
let mo = null;
let syncing = false;

function applyOpen(next) {
  if (!(root.value instanceof HTMLElement)) return;
  syncing = true;
  setDialogOpen(root.value, next);
  queueMicrotask(() => {
    syncing = false;
  });
}

function onAction(ev) {
  emit("action", ev.detail);
}

function onHiddenChange() {
  if (syncing || !(root.value instanceof HTMLElement)) return;
  const next = !root.value.hidden;
  if (open.value !== next) {
    open.value = next;
    if (!next) emit("close");
  }
}

watch(open, (next) => applyOpen(next));

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
  applyOpen(open.value);
  mo = new MutationObserver(onHiddenChange);
  mo.observe(root.value, { attributes: true, attributeFilter: ["hidden"] });
  root.value.addEventListener("ls-dialog:action", onAction);
});

onUnmounted(() => {
  mo?.disconnect();
  mo = null;
  if (root.value instanceof HTMLElement) {
    root.value.removeEventListener("ls-dialog:action", onAction);
    destroy(root.value);
  }
});
</script>

<template>
  <div
    ref="root"
    class="ls-dialog"
    :class="{ modeless }"
    :data-kind="kind || undefined"
    :data-persistent="persistent ? '' : undefined"
    role="presentation"
    hidden
  >
    <div
      class="panel"
      :class="{ draggable }"
      role="dialog"
      :aria-modal="modeless ? 'false' : 'true'"
    >
      <div v-if="$slots.head || title" class="head" :class="{ 'drag-handle': draggable }">
        <slot name="head">
          <h2 v-if="title" class="title">{{ title }}</h2>
        </slot>
      </div>
      <slot />
      <div v-if="$slots.actions" class="actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
