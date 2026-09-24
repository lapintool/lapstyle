<script setup>
import { computed, ref, useSlots, watch } from "vue";
import LsIcon from "./LsIcon.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  open: { type: Boolean, default: false },
  label: { type: String, default: "" },
  icon: { type: [String, Object, Function], default: null },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open"]);

// 只写 open 时是初始状态，之后可自由开合；v-model:open 时跟随外部
const open = ref(props.open);
watch(
  () => props.open,
  (next) => {
    open.value = next;
  },
);

const slots = useSlots();
const hasIcon = computed(() => Boolean(props.icon || slots.icon));

// menu.js 已切换 DOM，这里只同步状态，避免重复切换
function onToggle(ev) {
  if (ev.detail?.item !== ev.currentTarget) return;
  open.value = Boolean(ev.detail.open);
  emit("update:open", open.value);
}
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    class="item"
    :class="{ 'is-expanded': open }"
    :aria-expanded="open ? 'true' : 'false'"
    :disabled="disabled || undefined"
    @ls-menu:toggle="onToggle"
  >
    <LsIcon v-if="hasIcon" size="sm" :name="typeof icon === 'string' ? icon : ''">
      <slot name="icon">
        <component :is="icon" v-if="icon && typeof icon !== 'string'" />
      </slot>
    </LsIcon>
    <span class="label"><slot name="label">{{ label }}</slot></span>
    <span class="caret" aria-hidden="true"></span>
  </button>
  <div class="sub" :hidden="!open || undefined">
    <div class="sub-inner">
      <slot />
    </div>
  </div>
</template>
