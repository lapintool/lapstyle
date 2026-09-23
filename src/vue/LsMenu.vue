<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { destroy, enhance } from "../lapstyle.js";
import { classList } from "./classNames.js";

const model = defineModel({ type: [String, Number], default: null });

const props = defineProps({
  icons: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
  plain: { type: Boolean, default: false },
  collapsed: { type: Boolean, default: false },
  card: { type: Boolean, default: true },
});

const emit = defineEmits(["select"]);

const root = ref(null);

const hostClass = computed(() =>
  classList({
    "ls-card": props.card,
    "ls-menu": true,
    icons: props.icons,
    fill: props.fill,
    plain: props.plain,
    collapsed: props.collapsed,
  }),
);

function onSelect(ev) {
  const detail = ev.detail || {};
  if (detail.value != null) model.value = detail.value;
  emit("select", detail);
}

onMounted(() => {
  if (root.value) enhance(root.value);
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});
</script>

<template>
  <nav ref="root" :class="hostClass" @ls-menu:select="onSelect">
    <slot />
  </nav>
</template>
