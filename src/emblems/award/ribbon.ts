// Ribbon: a banner ribbon, a gold band with two red notched tails hanging behind it, drawn for this package, in metal, line and flat colour. It stands alone (a prize ribbon without a rosette); `trophy:rosette` is the one with ribbons.
import { defineFlat } from "../emblem.shapes.ts";

/** Ribbon. */
export const AWARD_RIBBON = /* @__PURE__ */ defineFlat("award:ribbon", "Ribbon", "リボン", "ours", {
  metal: "gold",
  ribbon: "#c0392b",
  front: [
    // The two tails hang from behind the band, each ending in a notch.
    ["r", "M13 34H29V57L21 49L13 57z"],
    ["r", "M35 34H51V57L43 49L35 57z"],
    // The band.
    ["m", "M5 10H59V34H5z"],
    ["e", "M9 14H55V30H9z", "1.6"],
    ["l", "M5 10H59V14H5z"],
  ],
  rim: 2,
});
