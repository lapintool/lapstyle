/** Shared class tokens for size / color / button variants. */

export const SIZE_CLASS = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

export const COLOR_CLASS = [
  "blue",
  "cyan",
  "magenta",
  "green",
  "red",
  "yellow",
  "dark",
  "gray",
  "white",
  "black",
];

/**
 * @param {Record<string, unknown>} flags
 * @returns {(string | false | null | undefined)[]}
 */
export function classList(flags) {
  return Object.entries(flags)
    .filter(([, on]) => Boolean(on))
    .map(([name]) => name);
}
