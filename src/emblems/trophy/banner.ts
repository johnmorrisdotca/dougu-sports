// A rafter banner: a vertical banner with a pointed foot, hung from a rod by two cords, in a team's colour with a stripe of its second colour, the words on its face and the year under them. It flips as a flat
// item and shows its plain back. Drawn for this package: generic, no team's or league's banner (the fringed championship flag is another emblem).
import { type Shape, circlePath, defineFlat } from "../emblem.shapes.ts";

const WOOD = "#7a5230";
const hang: readonly Shape[] = [["f", "M5 3.4h54v3.6H5z", WOOD], ["f", circlePath(5, 5.2, 2.6), WOOD], ["f", circlePath(59, 5.2, 2.6), WOOD], ["t", "M18 7L18 12M46 7L46 12"]];
const cloth: readonly Shape[] = [
  ["m", "M13 9h38v37L32 59L13 46z"],
  ["r", "M13 9h38v4.6H13z"],
  ["r", "M13 46L32 59L51 46L51 42.4L32 55.4L13 42.4z"],
];

/** A rafter banner. */
export const TROPHY_BANNER = /* @__PURE__ */ defineFlat("trophy:banner", "Rafter banner", "垂れ幕", "ours", {
  metal: "flat",
  color: "#1f4e8c",
  ribbon: "#f4f0e4",
  front: [...hang, ...cloth, ["e", "M16.6 16.6h30.8v24.6", "1.2"], ["l", "M13 14h8l-8 14z"]],
  back: [...hang, ...cloth],
  rim: 1.6,
  engrave: { front: { x: 32, y: 27.5, w: 27, h: 19 }, year: { x: 32, y: 46.5, w: 17, h: 5.5 }, back: { x: 32, y: 30, w: 27, h: 14 } },
});
