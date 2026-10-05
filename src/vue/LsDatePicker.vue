<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import LsBtn from "./LsBtn.vue";
import LsInput from "./LsInput.vue";
import { placeDatePicker } from "../js/date-picker.js";

const model = defineModel({ type: String, default: "" });

const props = defineProps({
  mode: { type: String, default: "date" },
  locale: { type: String, default: "zh-CN" },
  size: { type: String, default: "" },
  dense: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  clearable: { type: Boolean, default: true },
});

const emit = defineEmits(["change", "open", "close"]);
const root = ref(null);
const panel = ref(null);
const placement = ref("bottom-start");
const panelStyle = ref({});
const isOpen = ref(false);
const animations = new Map();
let inheritedStyle = {};
const draft = reactive({ year: 0, month: 0, day: 1, hour: 0, minute: 0 });
const validModes = ["date", "datetime", "time"];
const mode = computed(() => validModes.includes(props.mode) ? props.mode : "date");
const hasDate = computed(() => mode.value !== "time");
const hasTime = computed(() => mode.value !== "date");
const pad2 = (value) => String(value).padStart(2, "0");

function parseModel(value) {
  const now = new Date();
  const result = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
  const text = String(value ?? "").trim();
  if (mode.value === "time") {
    const time = /^(\d{1,2}):(\d{2})/.exec(text);
    if (time && Number(time[1]) < 24 && Number(time[2]) < 60) {
      result.hour = Number(time[1]);
      result.minute = Number(time[2]);
    }
    return result;
  }

  const date = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (date) {
    const year = Number(date[1]);
    const month = Number(date[2]) - 1;
    const day = Number(date[3]);
    const check = new Date(year, month, day);
    if (check.getFullYear() === year && check.getMonth() === month && check.getDate() === day) {
      result.year = year;
      result.month = month;
      result.day = day;
    }
  }
  if (mode.value === "datetime") {
    const time = /(?:T|\s)(\d{1,2}):(\d{2})/.exec(text);
    if (time && Number(time[1]) < 24 && Number(time[2]) < 60) {
      result.hour = Number(time[1]);
      result.minute = Number(time[2]);
    }
  }
  return result;
}

function syncDraft(value = model.value) {
  Object.assign(draft, parseModel(value));
}

const monthLabel = computed(() => new Intl.DateTimeFormat(props.locale, {
  year: "numeric",
  month: "long",
}).format(new Date(draft.year, draft.month, 1)));

const weekdays = computed(() => {
  const fmt = new Intl.DateTimeFormat(props.locale, { weekday: "short" });
  return Array.from({ length: 7 }, (_, index) => fmt.format(new Date(2024, 0, index + 1)));
});

const calendarCells = computed(() => {
  const firstDay = new Date(draft.year, draft.month, 1);
  const leading = (firstDay.getDay() + 6) % 7;
  const total = new Date(draft.year, draft.month + 1, 0).getDate();
  const cells = Array.from({ length: leading }, (_, index) => ({ key: `before-${index}`, day: 0 }));
  for (let day = 1; day <= total; day += 1) cells.push({ key: String(day), day });
  while (cells.length % 7) cells.push({ key: `after-${cells.length}`, day: 0 });
  return cells;
});

const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);
const isChinese = computed(() => props.locale.toLowerCase().startsWith("zh"));
const labels = computed(() => isChinese.value
  ? { clear: "清除", today: mode.value === "time" ? "现在" : "今天", cancel: "取消", confirm: "确定", open: "打开日期选择器" }
  : { clear: "Clear", today: mode.value === "time" ? "Now" : "Today", cancel: "Cancel", confirm: "OK", open: "Open date picker" });
const actualPlaceholder = computed(() => props.placeholder || (
  mode.value === "date" ? (isChinese.value ? "选择日期" : "Select date")
    : mode.value === "time" ? (isChinese.value ? "选择时间" : "Select time")
      : (isChinese.value ? "选择日期和时间" : "Select date and time")
));

function setMonth(delta) {
  const next = new Date(draft.year, draft.month + delta, 1);
  draft.year = next.getFullYear();
  draft.month = next.getMonth();
  draft.day = Math.min(draft.day, new Date(draft.year, draft.month + 1, 0).getDate());
}

function pickToday() {
  const now = new Date();
  draft.year = now.getFullYear();
  draft.month = now.getMonth();
  draft.day = now.getDate();
  if (hasTime.value) {
    draft.hour = now.getHours();
    draft.minute = now.getMinutes();
    scrollTimeColumns();
  }
}

function scrollTimeColumns() {
  nextTick(() => {
    panel.value?.querySelectorAll("[data-ls-time-column]").forEach((column) => {
      const active = column.querySelector("[aria-selected='true']");
      if (active) column.scrollTop += active.getBoundingClientRect().top - column.getBoundingClientRect().top - (column.clientHeight - active.clientHeight) / 2;
    });
  });
}

function positionPanel(element) {
  if (!isOpen.value || !root.value) return;
  if (element?.type === "scroll" && panel.value?.contains(element.target)) return;
  const popup = element instanceof HTMLElement ? element : panel.value;
  if (!popup) return;
  const trigger = root.value.querySelector(".ls-date-picker__control");
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  const viewport = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
  if (rect.width > 0 && rect.height > 0 && (
    rect.bottom <= 0 || rect.top >= viewport.height || rect.right <= 0 || rect.left >= viewport.width
  )) {
    closePicker();
    return;
  }
  popup.style.removeProperty("width");
  popup.style.removeProperty("max-height");
  const placed = placeDatePicker(rect, { width: popup.offsetWidth, height: popup.offsetHeight }, viewport);
  placement.value = placed.placement;
  panelStyle.value = {
    ...inheritedStyle,
    position: "fixed",
    top: `${placed.top}px`,
    left: `${placed.left}px`,
    width: `${placed.width}px`,
    maxHeight: `${placed.maxHeight}px`,
  };
  // Place before starting the enter animation; do not paint an unpositioned frame.
  for (const [name, value] of Object.entries(panelStyle.value)) {
    popup.style.setProperty(name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), value);
  }
}

function animatePanel(element, opening, done) {
  if (opening) positionPanel(element);
  const style = getComputedStyle(element);
  const currentOpacity = style.opacity;
  animations.get(element)?.cancel();
  element.style.pointerEvents = opening ? "auto" : "none";
  element.setAttribute("data-ls-animation", opening ? "enter" : "leave");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const configured = style.getPropertyValue("--ls-date-picker-duration").trim();
  const duration = configured ? parseFloat(configured) * (configured.endsWith("ms") ? 1 : 1000) : 160;
  const animation = element.animate?.([
    { opacity: opening ? 0 : currentOpacity },
    { opacity: opening ? 1 : 0 },
  ], { duration: reduced ? 0 : Math.max(0, Number.isFinite(duration) ? duration : 160), easing: "ease-out" });
  if (!animation) {
    element.removeAttribute("data-ls-animation");
    return done();
  }
  animations.set(element, animation);
  const finish = () => {
    if (animations.get(element) === animation) {
      animations.delete(element);
      element.removeAttribute("data-ls-animation");
    }
    done();
  };
  animation.finished.then(finish, finish);
}

function openPicker() {
  if (props.disabled || isOpen.value) return;
  syncDraft();
  panelStyle.value = {};
  inheritedStyle = {};
  const style = getComputedStyle(root.value);
  const propertyCount = style.length;
  for (let index = 0; index < propertyCount; index += 1) {
    const name = style[index];
    if (name.startsWith("--ls-")) inheritedStyle[name] = style.getPropertyValue(name);
  }
  inheritedStyle.fontSize = style.fontSize;
  isOpen.value = true;
  emit("open");
}

function closePicker() {
  if (!isOpen.value) return;
  isOpen.value = false;
  emit("close");
}

function formatValue() {
  if (mode.value === "time") return `${pad2(draft.hour)}:${pad2(draft.minute)}`;
  const date = `${String(draft.year).padStart(4, "0")}-${pad2(draft.month + 1)}-${pad2(draft.day)}`;
  return mode.value === "datetime" ? `${date} ${pad2(draft.hour)}:${pad2(draft.minute)}` : date;
}

function confirm() {
  const value = formatValue();
  model.value = value;
  emit("change", value);
  closePicker();
}

function clear() {
  model.value = "";
  emit("change", "");
  closePicker();
}

function onOutsidePointer(event) {
  if (!isOpen.value || !root.value) return;
  if (panel.value?.contains(event.target)) return;
  if (root.value.querySelector(".ls-date-picker__control")?.contains(event.target)) return;
  closePicker();
}

function onKeydown(event) {
  if (event.key === "Escape" && isOpen.value) {
    event.preventDefault();
    closePicker();
    root.value?.querySelector("input")?.focus();
  }
}

watch(() => model.value, (value) => {
  if (!isOpen.value) syncDraft(value);
});

watch(isOpen, (open) => {
  if (open) nextTick(() => {
    positionPanel();
    if (hasTime.value) scrollTimeColumns();
  });
});

watch(mode, () => syncDraft());
watch(() => [props.mode, props.locale, props.size], () => nextTick(positionPanel));
watch(() => props.disabled, (disabled) => { if (disabled) closePicker(); });

onMounted(() => {
  document.addEventListener("pointerdown", onOutsidePointer, true);
  document.addEventListener("click", onOutsidePointer, true);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", positionPanel);
  window.addEventListener("scroll", positionPanel, true);
});

onBeforeUnmount(() => {
  for (const animation of animations.values()) animation.cancel();
  document.removeEventListener("pointerdown", onOutsidePointer, true);
  document.removeEventListener("click", onOutsidePointer, true);
  document.removeEventListener("keydown", onKeydown);
  window.removeEventListener("resize", positionPanel);
  window.removeEventListener("scroll", positionPanel, true);
});
</script>

<template>
  <div
    ref="root"
    class="ls-date-picker"
    :class="[size, { dense, 'is-open': isOpen, 'is-disabled': disabled }]"
    :data-mode="mode"
    :data-ls-locale="locale"
    :data-placement="placement"
    @pointerdown.stop
  >
    <div class="ls-date-picker__control">
      <LsInput
        v-model="model"
        class="ls-date-picker__input"
        type="text"
        :size="size"
        :dense="dense"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="actualPlaceholder"
        autocomplete="off"
        @click="openPicker"
        @keydown.down.prevent="openPicker"
      />
      <LsBtn
        class="ls-date-picker__trigger"
        icon
        variant="ghost"
        :size="size || 'md'"
        :disabled="disabled"
        :aria-label="labels.open"
        :aria-expanded="isOpen"
        aria-haspopup="dialog"
        @click="isOpen ? closePicker() : openPicker()"
      >
        <svg v-if="mode === 'time'" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <circle cx="10" cy="10" r="7.25" />
          <path d="M10 5.5v4.8l3.2 1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <rect x="2.5" y="4" width="15" height="13" rx="2" />
          <path d="M2.5 8h15M6 2.5v3M14 2.5v3" stroke-linecap="round" />
        </svg>
      </LsBtn>
    </div>

    <Teleport to="body">
    <Transition :css="false" @enter="(element, done) => animatePanel(element, true, done)" @leave="(element, done) => animatePanel(element, false, done)">
    <div v-if="isOpen" ref="panel" class="ls-card ls-date-picker__panel ls-scroll" :class="size" :data-mode="mode" :data-placement="placement" :style="panelStyle" role="dialog" aria-modal="false">
      <div class="ls-date-picker__body">
        <section v-if="hasDate" class="ls-date-picker__calendar" :aria-label="monthLabel">
          <header class="ls-date-picker__month">
            <strong>{{ monthLabel }}</strong>
            <div class="ls-date-picker__month-nav">
              <LsBtn icon variant="ghost" size="sm" :aria-label="isChinese ? '上一月' : 'Previous month'" @click="setMonth(-1)">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </LsBtn>
              <LsBtn icon variant="ghost" size="sm" :aria-label="isChinese ? '下一月' : 'Next month'" @click="setMonth(1)">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </LsBtn>
            </div>
          </header>
          <div class="ls-date-picker__weekdays" role="row">
            <span v-for="weekday in weekdays" :key="weekday" role="columnheader">{{ weekday }}</span>
          </div>
          <div class="ls-date-picker__days" role="grid">
            <template v-for="cell in calendarCells" :key="cell.key">
              <span v-if="!cell.day" aria-hidden="true"></span>
              <LsBtn
                v-else
                class="ls-date-picker__day"
                :size="size || 'sm'"
                :variant="cell.day === draft.day ? 'fill' : 'ghost'"
                :aria-label="`${draft.year}-${pad2(draft.month + 1)}-${pad2(cell.day)}`"
                :aria-selected="cell.day === draft.day"
                role="gridcell"
                @click="draft.day = cell.day"
              >
                {{ cell.day }}
              </LsBtn>
            </template>
          </div>
        </section>

        <section v-if="hasTime" class="ls-date-picker__time" :aria-label="isChinese ? '时间' : 'Time'">
          <div class="ls-date-picker__time-col ls-scroll" data-ls-time-column :aria-label="isChinese ? '小时' : 'Hours'" role="listbox">
            <LsBtn
              v-for="hour in hours"
              :key="hour"
              class="ls-date-picker__time-option"
              :size="size || 'sm'"
              :variant="hour === draft.hour ? 'fill' : 'ghost'"
              :aria-selected="hour === draft.hour"
              role="option"
              @click="draft.hour = hour"
            >{{ pad2(hour) }}</LsBtn>
          </div>
          <div class="ls-date-picker__time-col ls-scroll" data-ls-time-column :aria-label="isChinese ? '分钟' : 'Minutes'" role="listbox">
            <LsBtn
              v-for="minute in minutes"
              :key="minute"
              class="ls-date-picker__time-option"
              :size="size || 'sm'"
              :variant="minute === draft.minute ? 'fill' : 'ghost'"
              :aria-selected="minute === draft.minute"
              role="option"
              @click="draft.minute = minute"
            >{{ pad2(minute) }}</LsBtn>
          </div>
        </section>
      </div>

      <footer class="ls-date-picker__footer">
        <div class="ls-date-picker__shortcuts">
          <LsBtn v-if="clearable" variant="ghost" size="sm" @click="clear">{{ labels.clear }}</LsBtn>
          <LsBtn variant="ghost" size="sm" @click="pickToday">{{ labels.today }}</LsBtn>
        </div>
        <div class="ls-date-picker__actions">
          <LsBtn variant="outline" size="sm" @click="closePicker">{{ labels.cancel }}</LsBtn>
          <LsBtn color="blue" size="sm" @click="confirm">{{ labels.confirm }}</LsBtn>
        </div>
      </footer>
    </div>
    </Transition>
    </Teleport>
  </div>
</template>
