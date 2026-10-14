// Ice hockey: a pictogram of two crossed sticks and a puck, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { bar, defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";


/** Ice hockey. */
export const SPORT_NHL = /* @__PURE__ */ defineIcon("sport:nhl", "Ice hockey", "アイスホッケー", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", `${bar(10, 6, 36, 44, 4.4)}M34.6 41.6L40 45.6H55V51H34Z`],
    ["m", `${bar(54, 6, 28, 44, 4.4)}M29.4 41.6L24 45.6H9V51H30Z`],
    ["k", `M20 54.6v3.4a12 4 0 0 0 24 0v-3.4a12 4 0 0 0-24 0z`],
    ["p", ell(32, 54.6, 12, 4)],
  ],
});
