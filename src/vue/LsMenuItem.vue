<script setup>
import { computed, inject, useSlots } from "vue";
import LsIcon from "./LsIcon.vue";
import { menuSelectedKey } from "./menuContext.js";

const props = defineProps({
  label: { type: String, default: "" },
  value: { type: [String, Number], default: null },
  icon: { type: [String, Object, Function], default: null },
  href: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
});

const slots = useSlots();
const selected = inject(menuSelectedKey, null);

// 与 menu.js 一致：没写 value 时用文字标签当选中值
const itemValue = computed(() => (props.value != null ? String(props.value) : props.label));
const active = computed(
  () => selected?.value != null && itemValue.value !== "" && String(selected.value) === itemValue.value,
);
const hasIcon = computed(() => Boolean(props.icon || slots.icon));
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="item"
    :class="{ 'is-active': active }"
    :type="href ? undefined : 'button'"
    :href="href || undefined"
    :disabled="!href && disabled ? true : undefined"
    :aria-disabled="href && disabled ? 'true' : undefined"
    :data-value="props.value != null ? String(props.value) : undefined"
  >
    <LsIcon v-if="hasIcon" size="sm" :name="typeof icon === 'string' ? icon : ''">
      <slot name="icon">
        <component :is="icon" v-if="icon && typeof icon !== 'string'" />
      </slot>
    </LsIcon>
    <span class="label"><slot>{{ label }}</slot></span>
  </component>
</template>
