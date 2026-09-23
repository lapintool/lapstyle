<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance, setPickerValue } from "../lapstyle.js";

const model = defineModel({ type: String, default: "#248df4" });

const emit = defineEmits(["input", "change"]);

const root = ref(null);
let syncing = false;

function onInput(ev) {
  const value = ev.detail?.value;
  if (typeof value !== "string") return;
  syncing = true;
  model.value = value;
  emit("input", value);
  queueMicrotask(() => {
    syncing = false;
  });
}

function onChange(ev) {
  const value = ev.detail?.value;
  if (typeof value === "string") emit("change", value);
}

watch(model, (next) => {
  if (syncing || !(root.value instanceof HTMLElement)) return;
  setPickerValue(root.value, next, { silent: true });
});

onMounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  enhance(root.value);
  setPickerValue(root.value, model.value, { silent: true });
  root.value.addEventListener("ls-color-picker:input", onInput);
  root.value.addEventListener("ls-color-picker:change", onChange);
});

onUnmounted(() => {
  if (!(root.value instanceof HTMLElement)) return;
  root.value.removeEventListener("ls-color-picker:input", onInput);
  root.value.removeEventListener("ls-color-picker:change", onChange);
  destroy(root.value);
});
</script>

<template>
  <div ref="root" class="ls-color-picker" :data-value="model" :style="{ '--ls-cp-value': model }">
    <slot>
      <div class="sv"><div class="thumb"></div></div>
      <div class="hue"><div class="thumb"></div></div>
      <div class="fields">
        <input class="ls-input hex" type="text" spellcheck="false" autocomplete="off" aria-label="HEX color" />
        <div class="preview" aria-hidden="true"></div>
      </div>
    </slot>
  </div>
</template>
