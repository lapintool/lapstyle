import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { destroy, enhance } from "../lapstyle.js";

/**
 * Bind Lapstyle enhance/destroy to a root element ref.
 * Call once per component host that needs progressive enhancement.
 */
export function useEnhance() {
  const root = ref(/** @type {HTMLElement | null} */ (null));
  const bound = shallowRef(/** @type {HTMLElement | null} */ (null));

  onMounted(() => {
    const el = root.value;
    if (!(el instanceof HTMLElement)) return;
    enhance(el);
    bound.value = el;
  });

  onUnmounted(() => {
    const el = bound.value;
    if (el instanceof HTMLElement) destroy(el);
    bound.value = null;
  });

  return root;
}
