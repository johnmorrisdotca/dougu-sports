// The Larry O'Brien Championship Trophy as it was given from 1977-78 to 2020-21: a smooth gold basketball with no seams, set forward on the rim of a gold vase that tapers outward to the top, the vase etched with a net over its
// lower half, standing on a short black ring on a flat square gold plinth. Drawn for this package from the published description and the photographs of both designs (docs/likeness.md); the plinth's lettering is left out
// (a plain band that takes the engraving option). The design that replaced it in 2022 has silver seams, a net over the whole vase and round discs for a base: `trophy:larry-obrien-trophy`.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_EXTRAS } from "../lathe.extras.ts";

/** The Larry O'Brien Championship Trophy as given up to 2021: a smooth gold ball on a tapering gold vase with a lower net, on a square plinth. */
export const TROPHY_LARRY_OBRIEN_TROPHY_1977 = /* @__PURE__ */ defineLathe("trophy:larry-obrien-trophy-1977", "Larry O'Brien Trophy 1977", "ラリー・オブライエン・トロフィー(旧デザイン)", "ours", {
  extras: LATHE_EXTRAS,
  metal: "gold",
  tones: { dark: "#16171b" },
  turnBox: "-8.6 -5.2 81.2 81.2",
  tilt: 10,
  solids: [
    {
      lean: [0.09, 90, 52],
      p: [[25.2, 9.4, 1], [25.5, 10.6], [26.3, 10.6, 1], [26.3, 10.3], [52, 6.1, 1], [52, 7.6, 1, "dark"], [54, 7.6, 1, "dark"]],
      decor: [["mesh", 37, 51.4, 7, 3]],
    },
    { sides: 4, turn: -45, p: [[54, 17, 1], [58.6, 17, 1]] },
  ],
  balls: [{ kind: "plain", cy: 14.5, r: 10.6, fwd: 8.2, dir: 90 }],
  plate: { y0: 54.4, y1: 58.2, face: 0 },
});
