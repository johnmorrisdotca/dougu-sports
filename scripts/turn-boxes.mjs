// Prints the view box every emblem needs so that nothing is cut off: the box of its still drawing, and the box that holds every turn of it. It measures the drawings themselves (every path, circle and ellipse
// of the finished SVG, with its stroke, run through its transforms: test/svgbox.ts), over a full sweep of yaw, pitch and roll in all three styles, and names only the emblems whose ink goes past the usual box
// (64 by 64, 100 by 100 for a ball) by more than half a percent. Put what it prints in the emblem's model as `box` (the still) and `turnBox` (every turned frame); `pnpm test` holds the numbers.
//
//   node scripts/turn-boxes.mjs            the emblems that need a box, and the box
//   node scripts/turn-boxes.mjs --all      every emblem, with how far its ink goes past the usual box
//   node scripts/turn-boxes.mjs <id>...    only these ids (a prefix such as trophy: takes the group)
import process from "node:process";
import { inkBox } from "../test/svgbox.ts";
import { EMBLEM_IDS, emblemFrame, emblemInfo, renderEmblem } from "../src/index.ts";

const MARGIN = 0.005;
const PAD = 0.2;
const STYLES = ["metal", "line", "color"];
const range = (from, to, step) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

const args = process.argv.slice(2);
const all = args.includes("--all");
const wanted = args.filter((a) => !a.startsWith("--"));
const ids = EMBLEM_IDS.filter((id) => wanted.length === 0 || wanted.some((w) => id.startsWith(w)));

const union = (boxes) => boxes.reduce((a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) }));
const num = (v) => String(Math.round(v * 10) / 10 + 0);

/**
 * The smallest square that holds a box and some ink, when the ink goes past the box by more than the margin (otherwise `undefined`): it grows only as far as the ink, with a little to spare, and it stays centred
 * on what it holds. A square, so that the element stays `size` by `size` and an emblem does not change the layout of the page it is in.
 */
const grown = (base, ink) => {
  const side = Math.max(base.x1 - base.x0, base.y1 - base.y0);
  const limit = MARGIN * side;
  if (!(base.x0 - ink.x0 > limit || base.y0 - ink.y0 > limit || ink.x1 - base.x1 > limit || ink.y1 - base.y1 > limit)) return undefined;
  const hull = union([base, { x0: ink.x0 - PAD, y0: ink.y0 - PAD, x1: ink.x1 + PAD, y1: ink.y1 + PAD }]);
  const round = (v) => Math.floor(v * 10) / 10;
  const x0 = round((hull.x0 + hull.x1) / 2 - Math.max(hull.x1 - hull.x0, hull.y1 - hull.y0) / 2);
  const y0 = round((hull.y0 + hull.y1) / 2 - Math.max(hull.x1 - hull.x0, hull.y1 - hull.y0) / 2);
  const s = Math.ceil(Math.max(hull.x1 - x0, hull.y1 - y0) * 10) / 10;
  return { x0, y0, x1: x0 + s, y1: y0 + s };
};
const text = (b) => `"${num(b.x0)} ${num(b.y0)} ${num(b.x1 - b.x0)} ${num(b.y1 - b.y0)}"`;

const rows = [];
for (const id of ids) {
  const kind = emblemInfo(id).kind;
  const usual = kind === "ball" ? { x0: 0, y0: 0, x1: 100, y1: 100 } : { x0: 0, y0: 0, x1: 64, y1: 64 };
  const still = union(STYLES.map((style) => inkBox(renderEmblem(id, { style, grain: false }))));
  // A body of revolution has a still box and a box of the turn; everything else flips like a coin, which only squeezes the drawing and adds a thin rim, so its one box holds both.
  const lathe = kind === "lathe";
  let rest = lathe ? grown(usual, still) : undefined;
  let base = rest ?? usual;
  // Every turn: the whole circle of yaw in 5 degree steps and the tilt from straight down to straight up. A ball is a sphere, so it is sampled more coarsely, and rolled about the line of sight as well.
  const ball = kind === "ball";
  const yaws = range(0, 355, ball ? 30 : 5);
  const pitches = range(-90, 90, ball ? 30 : 5);
  const rolls = ball ? range(-180, 150, 30) : [0];
  const frames = [];
  for (const style of ball ? ["metal", "line"] : STYLES) for (const yaw of yaws) for (const pitch of pitches) for (const roll of rolls) frames.push(inkBox(emblemFrame(id, { yaw, pitch, roll, style, turnBox: false })));
  const turned = union(frames.filter(Boolean));
  if (!lathe) rest = grown(usual, union([still, turned]));
  base = rest ?? usual;
  const turn = lathe ? grown(base, turned) : undefined;
  rows.push({ id, kind, still, turned, rest, turn });
}

for (const r of rows) {
  const past = (ink, box) => Math.max(0, box.x0 - ink.x0, box.y0 - ink.y0, ink.x1 - box.x1, ink.y1 - box.y1);
  const usual = r.kind === "ball" ? { x0: 0, y0: 0, x1: 100, y1: 100 } : { x0: 0, y0: 0, x1: 64, y1: 64 };
  if (!all && r.rest === undefined && r.turn === undefined) continue;
  const parts = [`${r.id.padEnd(26)} ${r.kind.padEnd(6)}`, `still past ${past(r.still, usual).toFixed(2)}`.padEnd(18), `turn past ${past(r.turned, usual).toFixed(2)}`.padEnd(18)];
  if (r.rest !== undefined) parts.push(`box: ${text(r.rest)}`);
  if (r.turn !== undefined) parts.push(`turnBox: ${text(r.turn)}`);
  console.log(parts.join("  "));
}
