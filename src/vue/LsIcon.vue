<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const props = defineProps({
  name: { type: String, default: "" },
  size: { type: String, default: "" },
  filled: { type: Boolean, default: false },
});

const classes = computed(() =>
  classList({
    [props.name]: !!props.name,
    [props.size]: !!props.size,
    filled: props.filled,
  }),
);
</script>

<template>
  <span class="ls-icon" :class="classes" aria-hidden="true">
    <slot />
  </span>
</template>
