// The turning entry point: an emblem at an angle. `emblemFrame` turns any emblem about its vertical axis and tilts it; `ballFrame` rolls a ball. Each frame is plain SVG, so a turn is a loop over
// the angle, drawn by the caller (a slider, a requestAnimationFrame, a CSS-free animation).
export { ballFrame, emblemFrame } from "./emblems/emblem.api.ts";
export type { FrameOptions } from "./emblems/emblem.core.ts";
