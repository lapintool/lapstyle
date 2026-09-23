<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const props = defineProps({
  tag: { type: String, default: "div" },
  note: { type: Boolean, default: false },
  dense: { type: Boolean, default: false },
  flat: { type: Boolean, default: false },
});

const classes = computed(() =>
  classList({
    note: props.note,
    dense: props.dense,
    flat: props.flat,
  }),
);
</script>

<template>
  <component :is="tag" class="ls-card" :class="classes">
    <slot />
  </component>
</template>
