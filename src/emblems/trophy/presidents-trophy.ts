// A wide shallow silver dish with two crossed hockey sticks over it, held up by three tall slender columns that stand between a dark square cap and a dark plinth with a silver plate, on a wider dark slab. Drawn for this
// package from photographs (docs/likeness.md); the sticks are curves in the plane that faces the eye, the shield on the cap is left out, and the plate is left plain.
import { defineLathe } from "../emblem.lathe.ts";

const STICK = [[-9, 13.2], [-8.5, 12.3], [-4, 10.5], [0, 9.3], [4.6, 5.2]] as const;

/** The Presidents' Trophy: a shallow dish and crossed sticks on three columns, over a dark plinth. */
export const TROPHY_PRESIDENTS_TROPHY = /* @__PURE__ */ defineLathe("trophy:presidents-trophy", "Presidents' Trophy", "プレジデンツ・トロフィー", "ours", {
  metal: "silver",
  box: "-0.4 -0.6 64.9 64.9",
  turnBox: "-15.4 -14.6 94.8 94.8",
  tones: { dark: "#23252a" },
  tilt: 8,
  solids: [
    { open: true, p: [[3.3, 17.8, 1], [3.9, 17.9], [4.8, 16.2], [5.9, 12], [6.9, 6.5], [7.7, 1.5], [8, 0.4, 1]] },
    { sides: 4, turn: -45, tone: "dark", p: [[14.3, 10.5, 1, "dark"], [15.2, 14.8, 1, "dark"], [18.4, 14.8, 1, "dark"]] },
    { sides: 4, turn: -45, tone: "dark", p: [[49.6, 11.6, 1, "main"], [50.9, 14.2, 1, "main"], [50.9, 14.2, 1, "dark"], [58.1, 15.6, 1, "dark"], [58.1, 19, 1, "dark"], [61, 19.2, 1, "dark"]] },
  ],
  handles: [
    ...[0, 120, 240].map((a) => ({ a, w: 2, pts: [[6.6, 18.2], [6.6, 49.6]] as const })),
    { a: 90, w: 0.4, pts: STICK },
    { a: 90, w: 0.4, pts: STICK.map(([r, y]) => [-r, y] as const) },
  ],
  plate: { y0: 53, y1: 57.5, tone: "dark", face: 0 },
});
