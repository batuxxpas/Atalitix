/**
 * Decides once per page load whether the 3D scenes should be used.
 * Kept free of three.js so the check costs nothing; three.js loads only when 3D is used.
 */
let cached: "3d" | "svg" | null = null;

export function visualMode(): "3d" | "svg" {
  if (cached) return cached;
  try {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    cached = !reduce && gl ? "3d" : "svg";
  } catch {
    cached = "svg";
  }
  return cached;
}

const noop = () => () => {};
export const subscribeNoop = noop;
