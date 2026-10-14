// American football: a pictogram of the ball, drawn for this package from the drawings of the balls (`ball:football`, `ball:football-cfl`, `ball:football-ifaf`), in a 64 by 64 box: a prolate ball whose ends come to
// a blunt point, lying on the diagonal with its laces on the upper side. The Canadian ball has a white stripe all the way round near each end (CFL Rule 1, Section 2); the IFAF ball has a stripe near each end on the
// two panels next to the laces only, which is the upper half of the picture (IFAF Rule 1, Section 3); the NFL ball has none.
import { type FlatModel, type Shape, defineIcon } from "../emblem.shapes.ts";

const f = (n: number): string => String(Math.round(n * 10) / 10);
const TURN = (40 * Math.PI) / 180;
/** A point of the ball's own frame (long axis along x, the laces on the upper side, y negative) put on the picture: turned 40 degrees about the centre of the box. */
const at = (x: number, y: number): string => `${f(32 + x * Math.cos(TURN) - y * Math.sin(TURN))} ${f(32 + x * Math.sin(TURN) + y * Math.cos(TURN))}`;
const HALF = 29.6;
const WIDTH = 17.4;
/** The half width of the ball at `x` along its axis: an ellipse whose ends are drawn out a little, so they come to a blunt point as the real ball's do. */
const half = (x: number): number => WIDTH * (1 - Math.min(1, Math.abs(x / HALF)) ** 2) ** 0.72;

const outline = (): string => {
  const xs = Array.from({ length: 33 }, (_, i) => -HALF * Math.cos((Math.PI * i) / 32));
  return `M${xs.map((x) => at(x, -half(x))).join("L")}L${[...xs].reverse().map((x) => at(x, half(x))).join("L")}z`;
};
/** The ball between `x0` and `x1` along its axis, over the part of its width from `y0` to `y1` (as fractions of the half width, -1 the upper edge): a stripe. */
const band = (x0: number, x1: number, y0: number, y1: number): string => {
  const xs = Array.from({ length: 7 }, (_, i) => x0 + ((x1 - x0) * i) / 6);
  return `M${xs.map((x) => at(x, y0 * half(x))).join("L")}L${[...xs].reverse().map((x) => at(x, y1 * half(x))).join("L")}z`;
};

/** The football pictogram: no stripes (the NFL), a ring near each end (the CFL) or the arcs on the laces' side only (IFAF). */
export function footballModel(stripes: "none" | "ring" | "top"): FlatModel {
  const front: Shape[] = [["m", outline()]];
  if (stripes !== "none") for (const sign of [-1, 1]) front.push(["f", band(sign * 15.6, sign * 20.6, stripes === "ring" ? -1 : -1, stripes === "ring" ? 1 : 0.05), "#f4f0e6"]);
  // the laces: a row of short bars across a line, on the upper side of the middle
  const rungs = [-8, -4.8, -1.6, 1.6, 4.8, 8].map((x) => `M${at(x, -9.4)}L${at(x, -3)}`).join("");
  front.push(["t", `M${at(-9.6, -6.2)}L${at(9.6, -6.2)}${rungs}`]);
  return { metal: "flat", ink: true, front };
}

/** American football. */
export const SPORT_NFL = /* @__PURE__ */ defineIcon("sport:nfl", "American football", "アメリカンフットボール", "ours", footballModel("none"));
