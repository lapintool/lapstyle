<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const model = defineModel({ type: [String, Number], default: "" });

const props = defineProps({
  type: { type: String, default: "text" },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  outlined: { type: Boolean, default: false },
  filled: { type: Boolean, default: false },
  borderless: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autocomplete: { type: String, default: "off" },
});

const classes = computed(() =>
  classList({
    [props.size]: !!props.size,
    dense: props.dense,
    outlined: props.outlined,
    filled: props.filled,
    borderless: props.borderless,
  }),
);
</script>

<template>
  <input
    v-model="model"
    class="ls-input"
    :class="classes"
    :type="type"
    :placeholder="placeholder || undefined"
    :disabled="disabled"
    :readonly="readonly"
    :autocomplete="autocomplete"
  />
</template>
