/** Restore Vue option values after the framework-free DOM layer emits a string. */
export function readOptionValue(item, value) {
  if (item?.dataset?.lsValueType === "number" && value != null) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return value;
}
