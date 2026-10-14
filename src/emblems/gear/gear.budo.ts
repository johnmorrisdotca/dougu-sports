// Judo and karate gear, drawn for this package: the heavy jacket and trousers with a belt tied at the waist, the lighter karate suit, and the belt on its own in the colours of the ranks.
import type { PieceOptions } from "../ball/ball.core.ts";
import { drawn, seg } from "./gear.core.ts";

/** The colours of a judo belt from the first rank to the black belt, in order, which `tint` takes. */
export const OBI_RANKS = {
  white: "#f2efe8",
  yellow: "#f2c21b",
  orange: "#ee8a1c",
  green: "#2f9a52",
  blue: "#2b64c8",
  brown: "#7a4a24",
  black: "#1f2228",
} as const;
export type ObiRank = keyof typeof OBI_RANKS;

const CLOTH = "#f4f2ec";
const EDGE = "#7b8491";

/** A belt tied at the waist (a flat band, a knot, two ends hanging) from `x0` to `x1` at height `y`. */
const tied = (x0: number, x1: number, y: number): string => {
  const c = (x0 + x1) / 2;
  return `M${x0} ${y}H${x1}V${y + 4}H${x0}zM${c - 3} ${y - 0.6}h6v5.2h-6zM${c - 1.4} ${y + 4.6}L${c - 4.6} ${y + 14}h3.4L${c + 0.4} ${y + 4.6}zM${c + 1.4} ${y + 4.6}L${c + 4.8} ${y + 13.4}h-3.4L${c - 0.4} ${y + 4.6}z`;
};

export const GEAR_JUDOGI = /* @__PURE__ */ drawn("gear:judogi", "Judo suit", "柔道衣", {
  main: CLOTH,
  accent: "#1f2228",
  parts: [
    { d: "M22.4 44.4H31.6L30.8 61H21.2ZM32.4 44.4H41.6L42.8 61H33.2Z", fill: "$main", cyl: 0.6, shade: 0.3 },
    { d: "M23.6 9.4L8 36.4Q6.6 39.4 9.4 41.4L14.6 45Q17.4 46.4 19 43.4L29 27.4Z", fill: "$main", cyl: 0.5, shade: 0.4 },
    { d: "M40.4 9.4L56 36.4Q57.4 39.4 54.6 41.4L49.4 45Q46.6 46.4 45 43.4L35 27.4Z", fill: "$main", cyl: 0.5, shade: 0.4 },
    { d: "M23.6 9.4Q32 7 40.4 9.4L45 27.4V46H19V27.4Z", fill: "$main", cyl: 0.6, shade: 0.4 },
    { d: "M26 8.6L35.4 31M38 8.6L28.6 31", fill: "none", stroke: "#cfc8b8", w: 3.6, line: "none" },
    { d: "M26 8.6L35.4 31M38 8.6L28.6 31", fill: "none", stroke: "#8f98a3", w: 0.7, line: "stroke" },
    { d: "M29.2 9.4Q32 12 34.8 9.4L32 16Z", fill: "#3a414b", stroke: "none", op: 0.5, line: "none", fx: true },
    { d: "M13 31L19.4 39.4M11.4 34.4L17.6 42.4M47 31L40.6 39.4M48.6 34.4L42.4 42.4", fill: "none", stroke: "#a9b1bb", w: 0.7, line: "none" },
    { d: tied(19, 45, 40.4), fill: "$accent", stroke: EDGE, cyl: 0.8, shade: 0.2 },
  ],
});

export const GEAR_KARATE_GI = /* @__PURE__ */ drawn("gear:karate-gi", "Karate suit", "空手衣", {
  main: CLOTH,
  accent: "#1f2228",
  parts: [
    { d: "M20.4 46H31.4L28.4 61H17.8ZM32.6 46H43.6L46.2 61H35.6Z", fill: "$main", cyl: 0.6, shade: 0.3 },
    { d: "M22.6 9.6L9 27.4Q7 30.4 9.6 32.4L13 34.6Q15.6 36.6 17.6 33.6L26 22Z", fill: "$main", cyl: 0.5, shade: 0.4 },
    { d: "M41.4 9.6L55 27.4Q57 30.4 54.4 32.4L51 34.6Q48.4 36.6 46.4 33.6L38 22Z", fill: "$main", cyl: 0.5, shade: 0.4 },
    { d: "M22.6 9.6Q32 7.4 41.4 9.6L44.8 28V48H19.2V28Z", fill: "$main", cyl: 0.6, shade: 0.4 },
    { d: "M25.4 8.8L37 37M38.6 8.8L27 37", fill: "none", stroke: "#8f98a3", w: 0.9, line: "stroke" },
    { d: "M28.8 9.6Q32 13 35.2 9.6L32 19Z", fill: "#3a414b", stroke: "none", op: 0.5, line: "none", fx: true },
    { d: tied(19.2, 44.8, 40), fill: "$accent", stroke: EDGE, cyl: 0.8, shade: 0.2 },
  ],
});

export const GEAR_OBI = /* @__PURE__ */ drawn("gear:obi", "Belt", "武道の帯", {
  main: OBI_RANKS.black,
  parts: [
    { d: "M35 34L24.4 57.6L30 61L40.6 36Z", fill: "$main", stroke: EDGE, cyl: 0.7, shade: 0.3 },
    { d: "M29 34L40.4 57.6L46 55.4L34.6 34Z", fill: "$main", stroke: EDGE, cyl: 0.7, shade: 0.3 },
    { d: seg(27.4, 55.6, 31.4, 58.4) + seg(38.4, 54.6, 42.4, 53), fill: "none", stroke: "$accent", w: 1.6, line: "none" },
    { d: "M2.6 23.4Q32 27.6 61.4 23.4V34.4Q32 38.6 2.6 34.4Z", fill: "$main", stroke: EDGE, cyl: 0.7, shade: 0.3 },
    { d: "M2.6 27.2Q32 31.4 61.4 27.2", fill: "none", stroke: "$accent", w: 1.4, line: "none" },
    { d: "M25.4 22.4h13.2v15.6H25.4z", fill: "$main", stroke: EDGE, cyl: 1, shade: 0.3 },
    { d: "M25.4 27.6h13.2M25.4 32.6h13.2", fill: "none", stroke: "$accent", w: 0.8, line: "none" },
  ],
});

/** The belt of a rank, `"white"` to `"black"`: the same as `GEAR_OBI.svg({ ...options, tint: OBI_RANKS[rank] })`. An unknown rank is the black belt. */
export const obi = (rank: ObiRank, options?: PieceOptions): string => GEAR_OBI.svg({ ...options, tint: Object.hasOwn(OBI_RANKS, rank) ? OBI_RANKS[rank] : OBI_RANKS.black });
