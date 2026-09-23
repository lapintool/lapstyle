<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { destroy, enhance } from "../lapstyle.js";
import { classList } from "./classNames.js";

const props = defineProps({
  split: { type: Boolean, default: false },
  color: { type: String, default: "" },
  variant: { type: String, default: "" },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  label: { type: String, default: "Dropdown" },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["select", "click"]);

const root = ref(null);

const hostClass = computed(() =>
  classList({
    simple: !props.split,
    split: props.split,
    "ls-btn-group": props.split,
    [props.size]: !!props.size,
    dense: props.dense,
  }),
);

const btnClass = computed(() =>
  ["ls-btn", props.color, props.variant, props.size, props.dense ? "dense" : ""]
    .filter(Boolean)
    .join(" "),
);

function onSelect(ev) {
  emit("select", ev.detail);
}

onMounted(() => {
  if (root.value) enhance(root.value);
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <div
    ref="root"
    class="ls-btn-dropdown"
    :class="hostClass"
    @ls-menu:select="onSelect"
  >
    <template v-if="split">
      <button
        type="button"
        :class="btnClass"
        :disabled="disabled"
        @click="emit('click', $event)"
      >
        <slot name="label">{{ label }}</slot>
      </button>
      <button
        type="button"
        :class="[btnClass, 'arrow-btn']"
        aria-expanded="false"
        :disabled="disabled"
        aria-label="Open menu"
      >
        <i class="arrow" aria-hidden="true"></i>
      </button>
    </template>
    <button
      v-else
      type="button"
      :class="btnClass"
      aria-expanded="false"
      :disabled="disabled"
    >
      <slot name="label">{{ label }}</slot>
      <i class="arrow" aria-hidden="true"></i>
    </button>
    <nav class="ls-card ls-menu end ls-scroll" hidden>
      <slot />
    </nav>
  </div>
</template>
