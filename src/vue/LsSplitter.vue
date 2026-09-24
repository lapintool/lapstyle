<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance, setSplitterSize } from "../lapstyle.js";

const model = defineModel({ type: Number, default: null });

const props = defineProps({
  vertical: { type: Boolean, default: false },
  min: { type: [Number, String], default: undefined },
  max: { type: [Number, String], default: undefined },
});

const emit = defineEmits(["resize"]);

const root = ref(null);
let syncing = false;

const hostClass = computed(() => ({
  vertical: props.vertical,
}));

function onResize(ev) {
  const size = ev.detail?.size;
  if (typeof size !== "number") return;
  syncing = true;
  model.value = size;
  emit("resize", size);
  queueMicrotask(() => {
    syncing = false;
  });
}

watch(model, (next) => {
  if (syncing || !(root.value instanceof HTMLElement) || next == null) return;
  const applied = setSplitterSize(root.value, next, { silent: true });
  if (typeof applied === "number" && applied !== next) {
    syncing = true;
    model.value = applied;
    queueMicrotask(() => {
      syncing = false;
    });
  }
});

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  // 双击复位回到挂载时的 v-model 值
  if (model.value != null && root.value.dataset.initial === undefined) {
    root.value.dataset.initial = String(model.value);
  }
  enhance(root.value);
  if (model.value != null) setSplitterSize(root.value, model.value, { silent: true });
  root.value.addEventListener("ls-splitter:resize", onResize);
});

onUnmounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  root.value.removeEventListener("ls-splitter:resize", onResize);
  destroy(root.value);
});
</script>

<template>
  <div
    ref="root"
    class="ls-splitter"
    :class="hostClass"
    :data-min="min"
    :data-max="max"
  >
    <slot />
  </div>
</template>
