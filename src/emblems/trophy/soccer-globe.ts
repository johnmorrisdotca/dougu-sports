// A globe held up by figures that spiral round a column flaring out from a slim waist, over a base with bands of green. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** Gold spiral figures rising to hold up a globe, with green bands at the base. */
export const TROPHY_SOCCER_GLOBE = /* @__PURE__ */ defineLathe("trophy:soccer-globe", "Globe on a column", "柱の上の地球儀", "ours", {
  metal: "gold",
  tones: { green: "#1f8a5b" },
  solids: [
    {
      p: [
        [17, 10.4, 1], [21, 9.6], [27, 6.4], [35, 4.6], [41, 5.2], [45.4, 7.4, 1],
        [45.4, 9.4, 1], [47, 9.4, 1], [47, 10.2, 1, "green"], [50.6, 10.2, 1, "green"], [50.6, 10.6, 1], [52.2, 10.6, 1], [52.2, 11.4, 1, "green"], [57, 11.4, 1, "green"], [57, 11.8, 1], [58.6, 11.8, 1],
      ],
      decor: [["helix", 19, 44, 3, 0.55]],
    },
  ],
  balls: [{ kind: "globe", cy: 11, r: 10 }],
  plate: { y0: 52.4, y1: 56.8, tone: "green" },
});
