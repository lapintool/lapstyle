<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { destroy, enhance } from "../lapstyle.js";

const props = defineProps({
  text: { type: String, default: "" },
  placement: { type: String, default: "" },
});

const root = ref(null);
const fixedPlacement = computed(() =>
  ["top", "bottom", "left", "right"].includes(props.placement) ? props.placement : "",
);

watch(fixedPlacement, () => {
  if (root.value) {
    destroy(root.value);
    enhance(root.value);
  }
}, { flush: "post" });

onMounted(() => {
  if (root.value) enhance(root.value);
});

onBeforeUnmount(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <span
    ref="root"
    class="ls-tooltip"
    :class="fixedPlacement"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
