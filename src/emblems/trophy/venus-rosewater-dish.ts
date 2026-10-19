// A large round silver-gilt dish seen face on: a broad rim with a beaded edge and a ring of relief scenes, a plain band, a wide field of relief scenes in a ring, a narrow beaded ring and a round central boss. Drawn for this
// package from a photograph (docs/likeness.md); the relief figures are left out and are drawn as rings of ornaments, and there is no lettering.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** A ring of `n` small circles of radius `r` at `radius` from the centre. */
const ring = (n: number, radius: number, r: number): string => Array.from({ length: n }, (_, i) => circlePath(32 + radius * Math.cos((2 * Math.PI * i) / n), 32 + radius * Math.sin((2 * Math.PI * i) / n), r)).join("");

/** The Venus Rosewater Dish of the Wimbledon ladies' singles: a broad round dish of relief rings and a central boss. */
export const TROPHY_VENUS_ROSEWATER_DISH = /* @__PURE__ */ defineFlat("trophy:venus-rosewater-dish", "Venus Rosewater Dish", "ウィンブルドン女子", "ours", {
  metal: "silver",
  front: [
    ["o", circlePath(32, 32, 30.4)],
    ["e", circlePath(32, 32, 29.4), "1.1"],
    ["t", ring(40, 27.4, 0.7)],
    ["e", circlePath(32, 32, 25.4), "1.4"],
    ["t", ring(14, 21.4, 2.2)],
    ["e", circlePath(32, 32, 17.2), "1.6"],
    ["t", ring(10, 13.2, 1.8)],
    ["e", circlePath(32, 32, 9.4), "1.4"],
    ["m", circlePath(32, 32, 7.2)],
    ["e", circlePath(32, 32, 7.2), "1"],
    ["l", "M13 20a22 22 0 0 1 14-10l-9 14z"],
  ],
  rim: 2,
  engrave: { front: { x: 32, y: 32, w: 11, h: 6 } },
});
