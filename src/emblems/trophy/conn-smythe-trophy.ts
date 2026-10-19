// A fan of silver maple leaves rising from a silver building with rows of tall windows, on a block of honey-brown wood with a large plate, over tall tapering tiers that widen to a moulded foot, the upper tiers set with
// four and the lower with five maple-leaf plates. Drawn for this package from a photograph (docs/likeness.md); the fan of leaves is one flared silver body with its veins marked, the building is a plain drum with its
// windows left out, and the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Conn Smythe Trophy: a fan of maple leaves over a silver building on tiers of honey-brown wood. */
export const TROPHY_CONN_SMYTHE_TROPHY = /* @__PURE__ */ defineLathe("trophy:conn-smythe-trophy", "Conn Smythe Trophy", "コーン・スマイス賞", "ours", {
  metal: "silver",
  box: "-0.8 0 65.5 65.5",
  turnBox: "-11.2 0 86.3 86.3",
  tones: { wood: "#b8782c", copper: "#a4642a" },
  tilt: 10,
  solids: [
    { open: true, p: [[3, 0.9, 1], [5.5, 5.5], [8.6, 11.9], [11.7, 13.2], [16.4, 11.9], [19.8, 10.1], [22.3, 9.3, 1]], decor: [["mer", 4, 21, 16]] },
    { p: [[22.3, 9.3, 1], [31.4, 9.3, 1]], decor: [["mer", 24, 30, 24], ["ring", 26.8], ["ring", 29]] },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [
        [31.7, 14.1, 1, "wood"], [41, 15.7, 1, "wood"], [41, 17.8, 1, "copper"], [42.6, 17.8, 1, "copper"], [42.6, 17.6, 1, "wood"], [49.7, 20.3, 1, "wood"], [49.7, 19.8, 1, "wood"], [58.5, 23.4, 1, "wood"],
        [58.8, 25.4, 1, "copper"], [61, 25.4, 1, "copper"],
      ],
    },
  ],
  plate: { y0: 33, y1: 39, tone: "wood", face: 0 },
});
