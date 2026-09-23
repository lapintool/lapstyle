<script setup>
import { computed } from "vue";
import { classList } from "./classNames.js";

const model = defineModel({ type: [Boolean, Array], default: false });

const props = defineProps({
  value: { type: [String, Number, Boolean], default: true },
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
  <label class="ls-checkbox" :class="classes">
    <input
      v-model="model"
      type="checkbox"
      :value="value"
      :name="name || undefined"
      :disabled="disabled"
    />
    <span class="box" aria-hidden="true"></span>
    <span v-if="label || $slots.default" class="label"><slot>{{ label }}</slot></span>
  </label>
</template>
