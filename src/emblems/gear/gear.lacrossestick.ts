// A lacrosse stick and ball, drawn for this package: a metal shaft with a plastic head that widens to a scoop, a netted pocket, and an orange ball.
import { capsule, circle, drawn } from "./gear.core.ts";

const T = "rotate(30 32 32)";
/** The net of the pocket: crossing strings inside the head. */
const NET = ((): string => {
  const half = (y: number): number => (y >= 13 ? 6.2 - (y - 13) * 0.3 : 6.2 - (13 - y) * 0.55) - 0.6;
  let d = "";
  for (let y = 7; y <= 25; y += 3) d += `M${32 - half(y)} ${y}H${32 + half(y)}`;
  for (const x of [-3.2, 0, 3.2]) d += `M${32 + x} 6.5V${x === 0 ? 26 : 22}`;
  return d;
})();

export const GEAR_LACROSSE_STICK = /* @__PURE__ */ drawn("gear:lacrosse-stick", "Lacrosse stick and ball", "ラクロスのクロスとボール", {
  main: "#aeb6c0",
  accent: "#1f4f9c",
  parts: [
    { d: capsule(32, 22, 32, 61, 3.4), fill: "$main", t: T, cyl: 1, shade: 0 },
    { d: capsule(32, 56, 32, 61, 3.8), fill: "#2a2f38", t: T, line: "stroke", shade: 0.3 },
    { d: NET, fill: "none", stroke: "#8f98a3", w: 0.6, t: T },
    { d: "M29.4 27L25.4 13Q22.6 3.4 32 2.6Q41.4 3.4 38.6 13L34.6 27Z", fill: "none", stroke: "$accent", w: 3.2, t: T },
    { d: "M29.2 28.6h5.6v3.4h-5.6z", fill: "$accent", t: T, cyl: 0.9, shade: 0 },
    { d: circle(53, 52.6, 5.8), fill: "#f0701e", stroke: "#8a3a0a", shade: 0.8 },
    { d: "M49.4 49.2a5.8 5.8 0 0 1 3.2-1.8", fill: "none", stroke: "#fff", w: 1.1, line: "none", fx: true, op: 0.6 },
  ],
});
