// A scalloped rosette with a centre and two tails of ribbon. Drawn for this package.
import { circlePath, defineFlat, starPath } from "../emblem.shapes.ts";

/** The scalloped edge of a rosette. */
function scallops(cx: number, cy: number, r: number, n: number): string {
  const round = (v: number): number => Math.round(v * 2) / 2;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = round(cx + r * Math.cos(a));
    const y = round(cy + r * Math.sin(a));
    d += i === 0 ? `M${x} ${y}` : `A${round((Math.PI * r) / n)} ${round((Math.PI * r) / n)} 0 0 1 ${x} ${y}`;
  }
  return `${d}z`;
}

/** A scalloped rosette with a centre and two tails of ribbon. */
export const TROPHY_ROSETTE = /* @__PURE__ */ defineFlat("trophy:rosette", "Rosette with ribbons", "リボン付きのロゼット", "ours", {
  metal: "gold",
  ribbon: "#2f6fb3",
  front: [
    ["r", "M22 38L12 62l11-5 6 6 4-24zM42 38l10 24-11-5-6 6-4-24z"],
    ["o", scallops(32, 24, 19, 14)],
    ["e", circlePath(32, 24, 13), "1.8"],
    ["m", starPath(32, 24, 9, 3.8)],
    ["l", "M18 22a14 14 0 0 1 9-9 16 16 0 0 0-9 14z"],
  ],
  rim: 3,
});
