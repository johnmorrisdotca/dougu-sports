// A wide silver bowl with a crown of scrolled leaves round its rim, garlands swagged round its body, ring handles at the sides and a band of gadroons below, on a beaded stem and a flared silver foot, standing on a dark
// hexagonal base of wood with a plate on each face and a moulded copper foot. Drawn for this package from a photograph (docs/likeness.md); the leaves of the crown are a plain band with their divisions marked, and the
// plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Frank J. Selke Trophy: a crowned silver bowl with garlands and ring handles over a flared foot and a dark hexagonal base. */
export const TROPHY_SELKE_TROPHY = /* @__PURE__ */ defineLathe("trophy:selke-trophy", "Selke Trophy", "セルキー賞", "ours", {
  metal: "silver",
  box: "-2.3 -1.6 68.5 68.5",
  turnBox: "-18.8 -15.4 101.6 101.6",
  tones: { wood: "#2c1814", copper: "#9a5a2a" },
  tilt: 12,
  solids: [
    {
      open: true,
      p: [
        [3.7, 18.6, 1], [8, 19.2], [10.2, 20.2], [11.2, 20.2, 1], [14.9, 19.8], [17.4, 18.5], [19.8, 16.8], [22.7, 12.9], [25.5, 10.8], [27.5, 9.5, 1],
        [28, 7.7, 1], [29, 7.7], [30.3, 10.9], [31.6, 11.3], [33.1, 11.3], [34.5, 13.7], [36.2, 15.3], [38, 16.8, 1],
      ],
      decor: [["mer", 4.2, 10.4, 16], ["ring", 11.2], ["ring", 23.5], ["dots", 31.6, 36, 0.8], ["mer", 24, 27, 28]],
    },
    {
      sides: 6,
      turn: -30,
      tone: "wood",
      p: [[38.3, 18.9, 1, "wood"], [54.7, 22.2, 1, "wood"], [54.7, 22.9, 1, "copper"], [58, 23.7, 1, "copper"], [58, 24.2, 1, "copper"], [61, 25, 1, "copper"]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 0.9, pts: [[19.8, 11.8], [22.1, 12.4], [22.9, 14.3], [21.7, 16.3], [19.5, 16.8]] as const })),
  plate: { y0: 44, y1: 50, tone: "wood", face: 0 },
});
