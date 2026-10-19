// A wide silver bowl with a plain rim and a smooth round body, on a short stem and a stepped foot over a dark plinth, standing on three broad tiers of dark red wood that each step out toward the foot, the upper two with
// a plate and rows of crossed sticks. Drawn for this package from a photograph (docs/likeness.md); the crossed sticks are left out and the plate is left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The William M. Jennings Trophy: a wide silver bowl on a stepped foot over three tiers of dark red wood. */
export const TROPHY_JENNINGS_TROPHY = /* @__PURE__ */ defineLathe("trophy:jennings-trophy", "Jennings Trophy", "ジェニングス賞", "ours", {
  metal: "silver",
  box: "-2.1 -1.7 68.2 68.2",
  turnBox: "-19.5 -14.4 103.1 103.1",
  tones: { wood: "#5a1c16", dark: "#2a2022" },
  tilt: 12,
  solids: [
    {
      open: true,
      p: [
        [3.2, 17, 1], [4.2, 17.1], [6.1, 16.7], [9.9, 14.6], [13.7, 11.5], [16.8, 7.7], [18, 4.6], [19.1, 2.9], [20.7, 3.5, 1], [21.5, 5.2], [23, 5.4], [24.2, 5.5, 1],
        [24.2, 7.2, 1], [25.3, 7.4, 1],
        [25.3, 8.4, 1, "dark"], [28.1, 8.4, 1, "dark"],
      ],
      decor: [["ring", 4.6]],
    },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [
        [28.3, 17.6, 1, "wood"], [37.6, 21.9, 1, "wood"], [37.6, 22.6, 1, "wood"], [47.5, 25, 1, "wood"], [47.5, 25.2, 1, "wood"], [58.3, 27.4, 1, "wood"], [58.3, 27.7, 1, "wood"], [61, 27.7, 1, "wood"],
      ],
    },
  ],
  plate: { y0: 31, y1: 36, tone: "wood", face: 0 },
});
