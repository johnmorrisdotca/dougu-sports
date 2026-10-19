// A silver pavilion: a round dark finial on a small baluster over a domed roof, four slender columns standing on a floor ring over a flared bell, on a tall stepped square base of dark red wood with rows of plates.
// Drawn for this package from photographs (docs/likeness.md); the columns are tubes placed round the axis, and the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Vezina Trophy: a pavilion of four columns under a dome and a dark ball, on a bell and a stepped wooden base. */
export const TROPHY_VEZINA_TROPHY = /* @__PURE__ */ defineLathe("trophy:vezina-trophy", "Vezina Trophy", "ベジーナ賞", "ours", {
  metal: "silver",
  turnBox: "-7.9 0 79.8 79.8",
  tones: { dark: "#25282d", wood: "#5b2c1f" },
  tilt: 10,
  solids: [
    {
      p: [[7.9, 1.15, 1], [9.6, 1.3], [10.1, 2.3, 1], [11, 2.3], [12.2, 3.6], [13.4, 4.6], [14.5, 5.9], [15.4, 6.9], [16.1, 7.2, 1], [16.7, 7, 1]],
    },
    {
      p: [[25.4, 7.8, 1], [27.5, 8.6], [27.8, 8.6, 1], [28, 6.9, 1], [30.5, 7], [32.2, 7.9], [33.6, 9.3], [34.7, 10.1, 1]],
    },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [[34.9, 14.6, 1, "wood"], [36.3, 14.6, 1, "wood"], [36.3, 18.3, 1, "wood"], [38, 18.3, 1, "wood"], [38, 15.9, 1, "wood"], [46.4, 15.9, 1, "wood"], [46.4, 19.9, 1, "wood"], [59.3, 20.3, 1, "wood"]],
    },
  ],
  handles: [45, 135, 225, 315].map((a) => ({ a, w: 2.3, pts: [[6.1, 16.8], [6.1, 25.6]] as const })),
  balls: [{ kind: "plain", cy: 5.6, r: 2.2, tone: "dark" }],
  plate: { y0: 51.6, y1: 58, tone: "wood", face: 0 },
});
