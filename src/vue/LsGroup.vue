<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const props = defineProps({
  spread: { type: Boolean, default: false },
  outline: { type: Boolean, default: false },
  vertical: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
});

const classes = computed(() =>
  classList({
    spread: props.spread,
    outline: props.outline,
    vertical: props.vertical,
    dense: props.dense,
  }),
);
</script>

<template>
  <div class="ls-btn-group" :class="classes" role="group">
    <slot />
  </div>
</template>
