<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { destroy, enhance } from "../lapstyle.js";
import { classList } from "./classNames.js";

const model = defineModel({ type: [String, Number], default: null });

const props = defineProps({
  /** string[] or { value, label }[] */
  options: { type: Array, default: null },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  placeholder: { type: String, default: "Select" },
  menuClass: { type: String, default: "" },
  end: { type: Boolean, default: false },
});

const emit = defineEmits(["select"]);

const root = ref(null);

const normalized = computed(() => {
  if (!props.options) return null;
  return props.options.map((item) => {
    if (item != null && typeof item === "object") {
      return {
        value: String(item.value ?? item.label ?? ""),
        label: String(item.label ?? item.value ?? ""),
      };
    }
    return { value: String(item), label: String(item) };
  });
});

const display = computed(() => {
  const list = normalized.value;
  if (list) {
    const hit = list.find((item) => item.value === String(model.value ?? ""));
    if (hit) return hit.label;
  }
  if (model.value == null || model.value === "") return props.placeholder;
  return String(model.value);
});

const hostClass = computed(() =>
  classList({
    [props.size]: !!props.size,
    dense: props.dense,
  }),
);

const menuClasses = computed(() =>
  ["ls-card", "ls-menu", "ls-scroll", props.end ? "end" : "", props.menuClass]
    .filter(Boolean)
    .join(" "),
);

function onSelect(ev) {
  const detail = ev.detail || {};
  const value = detail.value;
  model.value = value;
  emit("select", detail);
}

onMounted(() => {
  if (root.value) enhance(root.value);
});

onUnmounted(() => {
  if (root.value) destroy(root.value);
});

watch(
  () => model.value,
  () => {
    /* trigger label is bound via display; enhance syncs on select */
  },
);
</script>

<template>
  <div
    ref="root"
    class="ls-dropdown"
    :class="hostClass"
    @ls-menu:select="onSelect"
  >
    <button
      type="button"
      class="trigger"
      aria-expanded="false"
      :disabled="disabled"
    >
      <span>{{ display }}</span>
      <span class="caret" aria-hidden="true"></span>
    </button>
    <nav :class="menuClasses" hidden>
      <slot>
        <template v-if="normalized">
          <button
            v-for="item in normalized"
            :key="item.value"
            type="button"
            class="item"
            :class="{ 'is-active': String(model ?? '') === item.value }"
            :data-value="item.value"
          >
            <span class="label">{{ item.label }}</span>
          </button>
        </template>
      </slot>
    </nav>
  </div>
</template>
