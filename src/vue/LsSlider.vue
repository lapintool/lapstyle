<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance, setSliderValue } from "../lapstyle.js";
import { classList } from "./classNames.js";

const model = defineModel({ type: Number, default: 0 });

const props = defineProps({
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 100 },
  step: { type: [Number, String], default: 1 },
  color: { type: String, default: "" },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  label: { type: Boolean, default: false },
  input: { type: Boolean, default: false },
  vertical: { type: Boolean, default: false },
  reverse: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits(["input", "change"]);

const root = ref(null);
let syncing = false;

const hostClass = computed(() =>
  classList({
    [props.color]: !!props.color,
    [props.size]: !!props.size,
    dense: props.dense,
    label: props.label,
    input: props.input,
    vertical: props.vertical,
    reverse: props.reverse,
  }),
);

function onInput(ev) {
  const value = ev.detail?.value;
  if (typeof value !== "number") return;
  syncing = true;
  model.value = value;
  emit("input", value);
  queueMicrotask(() => {
    syncing = false;
  });
}

function onChange(ev) {
  const value = ev.detail?.value;
  if (typeof value === "number") emit("change", value);
}

watch(model, (next) => {
  if (syncing || !(root.value instanceof HTMLElement)) return;
  setSliderValue(root.value, next, { silent: true });
});

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
  setSliderValue(root.value, model.value, { silent: true });
  root.value.addEventListener("ls-slider:input", onInput);
  root.value.addEventListener("ls-slider:change", onChange);
});

onUnmounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  root.value.removeEventListener("ls-slider:input", onInput);
  root.value.removeEventListener("ls-slider:change", onChange);
  destroy(root.value);
});
</script>

<template>
  <div
    ref="root"
    class="ls-slider"
    :class="hostClass"
    :data-value="model"
    :data-min="min"
    :data-max="max"
    :data-step="step"
    :aria-label="ariaLabel || undefined"
    :aria-disabled="disabled ? 'true' : undefined"
  />
</template>
