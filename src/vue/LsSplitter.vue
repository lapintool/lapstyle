<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance } from "../lapstyle.js";

const model = defineModel({ type: Number, default: null });

const props = defineProps({
  vertical: { type: Boolean, default: false },
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 100 },
});

const emit = defineEmits(["resize"]);

const root = ref(null);

const hostClass = computed(() => ({
  vertical: props.vertical,
}));

function onResize(ev) {
  const size = ev.detail?.size;
  if (typeof size === "number") {
    model.value = size;
    emit("resize", size);
  }
}

watch(model, (next) => {
  if (!(root.value instanceof HTMLElement) || next == null) return;
  root.value.style.setProperty("--ls-splitter-size", `${next}%`);
});

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
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
    :style="model != null ? { '--ls-splitter-size': `${model}%` } : undefined"
  >
    <slot />
  </div>
</template>
