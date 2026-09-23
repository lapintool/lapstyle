<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { destroy, enhance } from "../lapstyle.js";

const props = defineProps({
  text: { type: String, default: "" },
  placement: { type: String, default: "" },
});

const root = ref(null);

onMounted(() => {
  if (root.value) enhance(root.value);
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <span
    ref="root"
    class="ls-tooltip"
    :data-placement="placement || undefined"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
