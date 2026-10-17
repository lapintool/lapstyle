<script setup>
import { ref } from "vue";
import { refreshScroll } from "../lapstyle.js";
import { useEnhance } from "./useEnhance.js";

defineProps({
  overlay: { type: Boolean, default: false },
  verticalLabel: { type: String, default: "Scroll vertically" },
  horizontalLabel: { type: String, default: "Scroll horizontally" },
});
const emit = defineEmits(["scroll"]);
const root = useEnhance();
const viewport = ref(null);
defineExpose({ viewport, refresh: () => refreshScroll(root.value) });
</script>

<template>
  <div ref="root" class="ls-scroll" :class="{ overlay }" :data-vertical-label="verticalLabel" :data-horizontal-label="horizontalLabel">
    <div ref="viewport" class="ls-scroll__viewport ls-scroll" tabindex="0" @scroll="emit('scroll', $event)">
      <div class="ls-scroll__content"><slot /></div>
    </div>
  </div>
</template>
