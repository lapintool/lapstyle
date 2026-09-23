<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const props = defineProps({
  dense: { type: Boolean, default: false },
  hover: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  noFrame: { type: Boolean, default: false },
});

const classes = computed(() =>
  classList({
    dense: props.dense,
    hover: props.hover,
    plain: props.plain,
    "no-frame": props.noFrame,
  }),
);
</script>

<template>
  <div class="ls-table" :class="classes">
    <slot />
  </div>
</template>
