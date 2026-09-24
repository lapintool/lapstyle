<script setup>
import { computed, nextTick, onMounted, onUnmounted, provide, ref } from "vue";
import { destroy, enhance } from "../lapstyle.js";
import { classList } from "./classNames.js";
import { menuSelectedKey } from "./menuContext.js";

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
// 任意一项带图标就进入图标模式，不必手写 icons
const autoIcons = ref(false);

provide(menuSelectedKey, model);

const hostClass = computed(() =>
  classList({
    "ls-card": props.card,
    "ls-menu": true,
    icons: props.icons || autoIcons.value,
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

onMounted(async () => {
  if (!root.value) return;
  autoIcons.value = Boolean(root.value.querySelector(".item > .ls-icon"));
  // 图标模式的收起动画在 enhance 时才绑定，要等 class 落到 DOM 上
  await nextTick();
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
