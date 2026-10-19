// A tall silver cup in two parts: a bowl that flares to a wide rim and narrows to a waist, then swells into a rounded belly with a ring of ribs under it, over a short waisted stem and a wide stepped foot; the bowl is
// closed by a lid that rises in tiers to a long pointed finial; two ear handles scroll out from under the lid and sweep down to the waist. Drawn for this package from a photograph (docs/likeness.md); the relief on the lid and the
// belly and the lettering are left out, and the waist takes the engraving option. The ribbons the cup is shown with are not drawn.
import { defineLathe } from "../emblem.lathe.ts";

/** The FA Cup: a tall lidded silver cup with scrolled ear handles, a rounded belly and a wide foot. */
export const TROPHY_FA_CUP = /* @__PURE__ */ defineLathe("trophy:fa-cup", "FA Cup", "FAカップ", "ours", {
  metal: "silver",
  turnBox: "-5.2 0 74.4 74.4",
  tilt: 9,
  solids: [
    {
      p: [
        [3, 0.4, 1], [5, 1.8], [7.8, 1.3], [10.1, 1.5], [11.7, 3.6], [13.7, 5.9], [16.1, 9.1], [17.3, 10.4, 1], [17.7, 9.9], [19.2, 8.5], [24, 7.1], [30.3, 6.7], [34.3, 8.4], [38.2, 9.9], [40.6, 9.3], [42.2, 5.5, 1], [44.2, 5.1],
        [47.4, 9.1, 1], [50.1, 9.8], [54.1, 13.1, 1], [58, 13.3], [60.4, 13.5, 1],
      ],
      decor: [["ring", 17.6], ["ring", 40.2], ["ring", 38.6], ["mer", 35, 40, 18]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.5, pts: [[10.1, 18.4], [13.5, 17.3], [15.2, 20], [14.7, 25.6], [12.3, 29.5], [9.3, 31.1]] as const })),
  plate: { y0: 21, y1: 29 },
});
