<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const model = defineModel({ type: [String, Number, Boolean], default: null });

const props = defineProps({
  value: { type: [String, Number, Boolean], required: true },
  label: { type: String, default: "" },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: "" },
});

const classes = computed(() =>
  classList({
    [props.size]: !!props.size,
    dense: props.dense,
  }),
);
</script>

<template>
  <label class="ls-radio" :class="classes">
    <input
      v-model="model"
      type="radio"
      :value="value"
      :name="name || undefined"
      :disabled="disabled"
    />
    <span class="box" aria-hidden="true"></span>
    <span v-if="label || $slots.default" class="label"><slot>{{ label }}</slot></span>
  </label>
</template>
