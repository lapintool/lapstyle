<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { destroy, enhance, setDropdownOpen } from "../lapstyle.js";
import { classList } from "./classNames.js";
import { readOptionValue } from "./value.js";

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
  arrow: { type: String, default: "chevron" },
  split: { type: Boolean, default: false },
  borderless: { type: Boolean, default: false },
  noArrow: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(["select"]);

const root = ref(null);
const selected = ref(null);
const typed = ref(null);

const normalized = computed(() => {
  if (!props.options) return null;
  return props.options.map((item) => {
    if (item != null && typeof item === "object") {
      return {
        value: item.value ?? item.label ?? "",
        label: String(item.label ?? item.value ?? ""),
      };
    }
    return { value: item, label: String(item) };
  });
});

const display = computed(() => {
  if (typed.value?.value === model.value) return typed.value.value;
  const list = normalized.value;
  if (list) {
    const hit = list.find((item) => item.value === model.value);
    if (hit) return hit.label;
  }
  if (selected.value?.value === model.value) return selected.value.label;
  if (model.value == null || model.value === "") return props.editable ? "" : props.placeholder;
  return String(model.value);
});

const hostClass = computed(() =>
  classList({
    [props.size]: !!props.size,
    dense: props.dense,
    split: props.split,
    borderless: props.borderless,
    "no-arrow": props.noArrow,
    editable: props.editable,
    "is-disabled": props.disabled,
  }),
);

const menuClasses = computed(() =>
  ["ls-card", "ls-menu", "ls-scroll", props.end ? "end" : "", props.menuClass]
    .filter(Boolean)
    .join(" "),
);

function onSelect(ev) {
  const detail = { ...ev.detail, value: readOptionValue(ev.detail?.item, ev.detail?.value) };
  const value = detail.value;
  typed.value = null;
  selected.value = { value, label: detail.label ?? detail.item?.textContent?.trim() ?? String(value) };
  model.value = value;
  emit("select", detail);
}

function onInput(event) {
  selected.value = null;
  typed.value = { value: event.target.value };
  model.value = event.target.value;
}

onMounted(() => {
  if (root.value) enhance(root.value);
});

onBeforeUnmount(() => {
  if (root.value) destroy(root.value);
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && root.value) setDropdownOpen(root.value, false);
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
    <div v-if="editable" class="trigger" aria-expanded="false" :aria-disabled="disabled">
      <input
        class="editor"
        type="text"
        role="combobox"
        aria-expanded="false"
        aria-autocomplete="none"
        aria-haspopup="menu"
        :value="display"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
      />
      <button v-if="!noArrow" type="button" class="caret" :class="{ triangle: arrow === 'triangle' }" :disabled="disabled" :aria-label="placeholder" tabindex="-1"></button>
    </div>
    <button
      v-else
      type="button"
      class="trigger"
      aria-expanded="false"
      :disabled="disabled"
    >
      <span>{{ display }}</span>
      <span v-if="!noArrow" class="caret" :class="{ triangle: arrow === 'triangle' }" aria-hidden="true"></span>
    </button>
    <nav :class="menuClasses" hidden>
      <slot>
        <template v-if="normalized">
          <button
            v-for="item in normalized"
            :key="`${typeof item.value}:${String(item.value)}`"
            type="button"
            class="item"
            :class="{ 'is-active': model === item.value }"
            :data-value="item.value"
            :data-ls-value-type="typeof item.value"
          >
            <span class="label">{{ item.label }}</span>
          </button>
        </template>
      </slot>
    </nav>
  </div>
</template>
