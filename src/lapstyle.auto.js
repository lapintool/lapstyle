/* Auto-enhance entry: mounts window.Lapstyle and enhances document on load.
 * Skip with <html data-ls-no-auto>. Bundle apps should prefer:
 *   import { enhance } from "lapstyle"; enhance(document);
 */
import Lapstyle, { enhance } from "./lapstyle.js";

if (typeof window !== "undefined") {
  window.Lapstyle = Lapstyle;
  const skip = document.documentElement?.hasAttribute("data-ls-no-auto");
  if (!skip) {
    if (document.readyState !== "loading") enhance(document);
    else document.addEventListener("DOMContentLoaded", () => enhance(document));
  }
}

export * from "./lapstyle.js";
export { default } from "./lapstyle.js";
