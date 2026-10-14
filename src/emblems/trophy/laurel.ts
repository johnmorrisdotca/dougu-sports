// Two branches of laurel leaves that curve round and stay open at the top. Drawn for this package.
import { defineFlat } from "../emblem.shapes.ts";

const round = (n: number): number => Math.round(n * 2) / 2;
/** A leaf at a point, pointing along an angle (degrees from the x axis). */
function leaf(x: number, y: number, angle: number, length: number, width: number): string {
  const a = (angle * Math.PI) / 180;
  const ex = x + Math.cos(a) * length;
  const ey = y + Math.sin(a) * length;
  const nx = -Math.sin(a) * width;
  const ny = Math.cos(a) * width;
  const mx = (x + ex) / 2;
  const my = (y + ey) / 2;
  return `M${round(x)} ${round(y)}Q${round(mx + nx)} ${round(my + ny)} ${round(ex)} ${round(ey)}Q${round(mx - nx)} ${round(my - ny)} ${round(x)} ${round(y)}z`;
}

/** The leaves and stems of a wreath: two branches along an ellipse from the bottom up to the top corners, a pair of leaves at each step. */
function wreath(): { leaves: string; stems: string } {
  let leaves = "";
  let stems = "";
  const [cx, cy, rx, ry] = [32, 33, 20, 22];
  for (const side of [-1, 1]) {
    let stem = "";
    for (let i = 0; i < 5; i++) {
      const phi = ((24 + i * 32) * Math.PI) / 180;
      const x = cx + side * rx * Math.sin(phi);
      const y = cy + ry * Math.cos(phi);
      const run = (Math.atan2(-ry * Math.sin(phi), -side * rx * Math.cos(phi)) * 180) / Math.PI;
      stem += `${i === 0 ? "M" : "L"}${round(x)} ${round(y)}`;
      leaves += leaf(x, y, run - 38, 11, 4.2) + leaf(x, y, run + 38, 11, 4.2);
    }
    stems += stem;
  }
  return { leaves, stems };
}
const W = /* @__PURE__ */ wreath();

/** Two branches of leaves that curve round, open at the top. */
export const TROPHY_LAUREL = /* @__PURE__ */ defineFlat("trophy:laurel", "Laurel wreath", "月桂樹の冠", "ours", {
  metal: "gold",
  front: [["t", W.stems], ["m", W.leaves]],
  rim: 2,
});
