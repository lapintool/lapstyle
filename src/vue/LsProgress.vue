<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance, setProgressValue } from "../lapstyle.js";
import { classList } from "./classNames.js";

const model = defineModel({ type: Number, default: null });

const props = defineProps({
  color: { type: String, default: "" },
  buffer: { type: [Number, String], default: null },
  indeterminate: { type: Boolean, default: false },
});

const root = ref(null);

const hostClass = computed(() =>
  classList({
    [props.color]: !!props.color,
    indeterminate: props.indeterminate,
  }),
);

watch(model, (next) => {
  if (!(root.value instanceof HTMLElement) || next == null) return;
  setProgressValue(root.value, next, { silent: true });
});

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
  if (model.value != null) setProgressValue(root.value, model.value, { silent: true });
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <div
    ref="root"
    class="ls-progress"
    :class="hostClass"
    role="progressbar"
    :aria-valuenow="model == null ? undefined : model"
    :style="buffer != null ? { '--ls-progress-buffer': `${buffer}%` } : undefined"
  />
</template>
