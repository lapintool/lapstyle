<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const props = defineProps({
  tag: { type: String, default: "button" },
  type: { type: String, default: "button" },
  color: { type: String, default: "" },
  variant: { type: String, default: "" },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  icon: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  stack: { type: Boolean, default: false },
  noCaps: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  href: { type: String, default: "" },
});

const classes = computed(() =>
  classList({
    [props.color]: !!props.color,
    [props.variant]: !!props.variant,
    [props.size]: !!props.size,
    dense: props.dense,
    rounded: props.rounded,
    icon: props.icon,
    round: props.round,
    stack: props.stack,
    "no-caps": props.noCaps,
  }),
);

const isLink = computed(() => props.tag === "a" || !!props.href);
</script>

<template>
  <component
    :is="isLink ? 'a' : tag"
    class="ls-btn"
    :class="classes"
    :type="isLink ? undefined : type"
    :href="isLink ? href || undefined : undefined"
    :disabled="isLink ? undefined : disabled"
    :aria-disabled="isLink && disabled ? 'true' : undefined"
  >
    <slot />
  </component>
</template>
