<script setup>
import { computed, inject } from "vue";

const props = defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, default: "" },
  closable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const tabs = inject("lsTabs", null);

const active = computed(() => String(tabs?.model?.value ?? "") === String(props.value));
const tag = computed(() => (props.closable ? "div" : "button"));
</script>

<template>
  <component
    :is="tag"
    class="tab"
    :class="{ 'is-active': active }"
    role="tab"
    :aria-selected="active ? 'true' : 'false'"
    :data-tab="String(value)"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="tag !== 'button' && disabled ? 'true' : undefined"
  >
    <slot name="icon" />
    <span class="label"><slot>{{ label || value }}</slot></span>
    <button
      v-if="closable"
      type="button"
      class="close"
      aria-label="Close tab"
    >
      <span class="ls-icon sm close" aria-hidden="true"></span>
    </button>
  </component>
</template>
