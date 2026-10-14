// Soccer: a pictogram of the ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon, polygon } from "../emblem.shapes.ts";


/** The seams from each corner of the middle patch out to a smaller patch at the edge. */
const SEAMS = ((): string => {
  let d = "";
  for (let i = 0; i < 5; i++) {
    const a = ((72 * i - 90) * Math.PI) / 180;
    d += `M${(32 + 9.4 * Math.cos(a)).toFixed(1)} ${(32 + 9.4 * Math.sin(a)).toFixed(1)}L${(32 + 15.4 * Math.cos(a)).toFixed(1)} ${(32 + 15.4 * Math.sin(a)).toFixed(1)}`;
  }
  return d;
})();
const EDGE = ((): string => {
  let d = "";
  for (let i = 0; i < 5; i++) {
    const a = 72 * i;
    const r = (a * Math.PI) / 180;
    d += polygon(32 + 19.6 * Math.sin(r), 32 - 19.6 * Math.cos(r), 4.6, 5, a + 180);
  }
  return d;
})();

/** Soccer. */
export const SPORT_SOCCER = /* @__PURE__ */ defineIcon("sport:soccer", "Soccer", "サッカー", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", circ(32, 32, 24)],
    ["k", polygon(32, 32, 9.4, 5)],
    ["t", SEAMS],
    ["k", EDGE],
  ],
});
