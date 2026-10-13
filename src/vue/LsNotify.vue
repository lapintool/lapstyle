<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useSlots, watch } from "vue";
import LsBtn from "./LsBtn.vue";
import LsIcon from "./LsIcon.vue";
import { acquireNotifyHost, notifyMembers, registerNotify, unregisterNotify } from "./notifyHosts.js";

defineOptions({ inheritAttrs: false });
const open = defineModel({ type: Boolean, default: false });
const props = defineProps({
  message: { type: String, default: "" },
  icon: { type: String, default: "" },
  html: { type: Boolean, default: false },
  caption: { type: String, default: "" },
  position: { type: String, default: "top" },
  timeout: { type: Number, default: 3000 },
  closable: { type: Boolean, default: true },
  closeLabel: { type: String, default: "Close" },
  type: { type: String, default: "info" },
  pauseOnHover: { type: Boolean, default: true },
  group: { type: [Boolean, String], default: true },
});
const emit = defineEmits(["show", "close"]);
const positions = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "center"];
const position = computed(() => positions.includes(props.position) ? props.position : "top");
const kind = computed(() => ["info", "success", "warning", "error"].includes(props.type) ? props.type : "info");
const anchor = ref(null);
const host = ref(null);
const slots = useSlots();
const lease = shallowRef(null);
const record = shallowRef(null);
const leases = new Map();
const members = computed(() => notifyMembers(lease.value, record.value));
const visible = computed(() => open.value && record.value && members.value[0] === record.value);
const count = computed(() => members.value.reduce((sum, item) => sum + item.count, 0));
let timer;
let started = 0;
let remaining = 0;
let hovering = false;
let focused = false;
let reason = "model";

function stopTimer() { clearTimeout(timer); timer = undefined; }
function dismissLocal(why) {
  if (!open.value) return;
  reason = why;
  stopTimer();
  open.value = false;
}
function dismiss(why = "close") {
  for (const member of members.value) member.dismiss(why);
}
function closeFromAction() { dismiss("close"); }
function show() {
  if (!open.value) { open.value = true; return; }
  if (record.value) {
    if (props.group !== false) record.value.count++;
    members.value[0]?.restart();
  }
}
defineExpose({ show, close: closeFromAction });
function resume() {
  if (!visible.value || !(remaining > 0) || focused || (props.pauseOnHover && hovering)) return;
  stopTimer();
  started = Date.now();
  timer = setTimeout(() => dismiss("timeout"), remaining);
}
function pause() {
  if (timer !== undefined) remaining = Math.max(1, remaining - (Date.now() - started));
  stopTimer();
}
function restartTimer() {
  stopTimer();
  remaining = Number.isFinite(props.timeout) ? Math.max(0, props.timeout) : 0;
  resume();
}
function setHost() {
  if (!anchor.value) return;
  const key = position.value;
  if (!leases.has(key)) leases.set(key, acquireNotifyHost(anchor.value.ownerDocument, key));
  lease.value = leases.get(key);
  host.value = lease.value.element;
}
function unregister() {
  unregisterNotify(lease.value, record.value);
  record.value = null;
}
function register(order) {
  if (!lease.value || !open.value) return;
  const key = typeof props.group === "string" ? `custom:${props.group}`
    : props.group && !slots.default && !slots.actions
      ? JSON.stringify([props.message, props.caption, props.html]) : Symbol();
  record.value = registerNotify(lease.value, { key, order, restart: restartTimer, dismiss: dismissLocal });
}
function onMouseEnter() { hovering = true; if (props.pauseOnHover) pause(); }
function onMouseLeave() { hovering = false; resume(); }
function onFocusOut(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  focused = false;
  resume();
}

watch(position, () => {
  stopTimer(); unregister(); setHost(); register();
}, { flush: "post" });
watch(() => [props.message, props.caption, props.html, props.group], () => {
  const order = record.value?.order;
  stopTimer(); unregister(); register(order);
  if (visible.value) restartTimer();
}, { flush: "post" });
watch(visible, (shown) => { if (shown) restartTimer(); else stopTimer(); }, { flush: "post" });
watch(open, (visible) => {
  if (!host.value) return;
  if (visible) {
    reason = "model";
    hovering = false;
    focused = false;
    register();
    emit("show");
  } else {
    stopTimer();
    unregister();
    emit("close", reason);
    reason = "model";
  }
}, { flush: "post" });
watch(() => props.timeout, restartTimer);
watch(() => props.pauseOnHover, (enabled) => { if (enabled && hovering) pause(); else resume(); });
onMounted(() => {
  setHost();
  if (open.value) { register(); emit("show"); }
});
onBeforeUnmount(() => {
  stopTimer();
  unregister();
  for (const lease of leases.values()) lease.release();
});
</script>

<template>
  <span ref="anchor" hidden aria-hidden="true"></span>
  <Teleport v-if="host" :to="host">
    <Transition name="ls-notify" appear>
      <article
        v-if="visible"
        v-bind="$attrs"
        class="ls-notify"
        :data-type="kind"
        :style="{ order: record?.order }"
        :class="{ closable }"
        :role="kind === 'error' ? 'alert' : 'status'"
        aria-atomic="true"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @focusin="focused = true; pause()"
        @focusout="onFocusOut"
      >
        <span v-if="count > 1" class="count" :aria-label="String(count)">{{ count }}</span>
        <LsIcon v-if="icon || $slots.icon" class="icon" :name="$slots.icon ? '' : icon"><slot name="icon" /></LsIcon>
        <div class="content">
          <div v-if="$slots.default" class="message"><slot /></div>
          <div v-else-if="html" class="message" v-html="message"></div>
          <div v-else class="message">{{ message }}</div>
          <div v-if="caption" class="caption">{{ caption }}</div>
        </div>
        <div v-if="$slots.actions" class="actions"><slot name="actions" :close="closeFromAction" /></div>
        <LsBtn v-if="closable" class="close" variant="flat" size="sm" icon :aria-label="closeLabel" @click="dismiss('close')">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </LsBtn>
      </article>
    </Transition>
  </Teleport>
</template>
