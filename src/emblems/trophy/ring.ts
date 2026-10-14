// A championship ring seen face on: a thick band, a wide faceted head with a gem in a bezel, and a flat on each shoulder of the head for the team and the year. It turns like a coin, with its rim, and shows
// the plain back of the head. Drawn for this package: generic, no team's or league's ring.
import { type Shape, circlePath, defineFlat } from "../emblem.shapes.ts";

const poly = (...p: readonly (readonly [number, number])[]): string => `M${p.map((q) => q.join(" ")).join("L")}Z`;
/** A band: a disc with a round hole, wound the other way so that it is cut out. */
const annulus = (cx: number, cy: number, R: number, r: number): string =>
  `M${cx - R} ${cy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0ZM${cx - r} ${cy}a${r} ${r} 0 1 1 ${2 * r} 0a${r} ${r} 0 1 1 ${-2 * r} 0Z`;

const HEAD = poly([16, 5], [48, 5], [58, 14], [58, 26], [48, 35], [16, 35], [6, 26], [6, 14]);
const BEZEL = poly([17.5, 8], [46.5, 8], [54.5, 15], [54.5, 25], [46.5, 32], [17.5, 32], [9.5, 25], [9.5, 15]);
const GEM = poly([24, 11], [40, 11], [47, 17], [47, 23], [40, 29], [24, 29], [17, 23], [17, 17]);
/** The facets: the table, and a line from each corner of the gem to the nearest corner of the table. */
const FACETS = `${poly([27.5, 15.5], [36.5, 15.5], [40.5, 18.5], [40.5, 21.5], [36.5, 24.5], [27.5, 24.5], [23.5, 21.5], [23.5, 18.5])}M24 11L27.5 15.5M40 11L36.5 15.5M47 17L40.5 18.5M47 23L40.5 21.5M40 29L36.5 24.5M24 29L27.5 24.5M17 23L23.5 21.5M17 17L23.5 18.5`;

const front: readonly Shape[] = [
  ["o", annulus(32, 44, 19, 11)],
  ["t", circlePath(32, 44, 15)],
  ["o", HEAD],
  ["e", BEZEL, "1.6"],
  ["r", GEM],
  ["t", FACETS],
  ["l", "M24 11L40 11L36.5 15.5L27.5 15.5ZM17 17L24 11L27.5 15.5L23.5 18.5Z"],
];
const back: readonly Shape[] = [["o", annulus(32, 44, 19, 11)], ["o", HEAD], ["e", BEZEL, "1.6"]];

/** A championship ring. */
export const TROPHY_RING = /* @__PURE__ */ defineFlat("trophy:ring", "Championship ring", "優勝記念リング", "ours", {
  metal: "gold",
  ribbon: "#b3262e",
  front,
  back,
  rim: 5,
  engrave: { front: { x: 12.4, y: 20, w: 19, h: 7, rot: -90 }, year: { x: 51.6, y: 20, w: 19, h: 7, rot: 90 }, back: { x: 32, y: 20, w: 30, h: 12 } },
});
