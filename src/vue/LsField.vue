<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const props = defineProps({
  label: { type: String, default: "" },
  size: { type: String, default: "" },
  forId: { type: String, default: "" },
});

const classes = computed(() =>
  classList({
    [props.size]: !!props.size,
  }),
);
</script>

<template>
  <label class="ls-field" :class="classes" :for="forId || undefined">
    <span v-if="label || $slots.label" class="label">
      <slot name="label">{{ label }}</slot>
    </span>
    <slot />
  </label>
</template>
