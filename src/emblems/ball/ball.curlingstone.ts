// Curling stone: a granite drum with a polished striking band round its belly, a narrow running ring under it with the concave recess inside (it shows when the stone is turned over), and a
// handle on top. The slices follow the stone's profile.
import { drawStack } from "./ball.stack.ts";
import { defineObject } from "./ball.object.ts";
import { type V3 } from "./ball.math.ts";
import { num } from "./ball.core.ts";

const GRANITE = "#8d929a";
const POLISHED = "#4d525b";
const HANDLE = "#d4202c";

export const BALL_CURLING_STONE = /* @__PURE__ */ defineObject({
  id: "ball:curling-stone",
  en: "Curling stone",
  ja: "カーリングストーン",
  size: { extentMm: 290.9, diameterMm: 290.9, thicknessMm: 114, circumferenceMm: 914, massG: [17240, 19960], rule: "World Curling The Rules of Curling, R2 Stones (a)-(j); R3(b) handle colour", note: "The largest stone the rule allows: a circumference of at most 914 mm and a height of at least 114 mm; the mass includes the handle." },
  view: { yaw: 0, pitch: 30, roll: -6 },
  model: { slices: 6 },
  draw: (c) =>
    drawStack(c, {
      slices: [
        { y0: -0.2, y1: -0.15, r: [0.74, 0.8], colour: POLISHED, outline: true },
        { y0: -0.15, y1: -0.04, r: [0.8, 0.94], colour: GRANITE },
        { y0: -0.04, y1: 0.08, r: 1, colour: POLISHED, outline: true },
        { y0: 0.08, y1: 0.15, r: [1, 0.9], colour: GRANITE },
        { y0: 0.15, y1: 0.2, r: [0.9, 0.78], colour: GRANITE, outline: true },
      ],
      top: "#9a9fa7",
      bottom: "#6a6f78",
      gloss: 0.5,
      shade: "#000",
      grain: { f: 1.9, a: 0.55 },
      dish: { r: 0.74, colour: "#555a63" },
      extra: (ctx) => {
        // The handle: a post and a bar, a capsule in 3D (a thick line with round ends).
        const post0 = ctx.at([0, 0.2, 0]), post1 = ctx.at([0, 0.34, 0]);
        const a: V3 = [-0.42, 0.4, 0], b: V3 = [0.42, 0.4, 0];
        const p = ctx.at(a), q = ctx.at(b);
        const colour = ctx.opts.style === "line" ? "currentColor" : (ctx.opts.tint ?? HANDLE);
        const line = ctx.opts.style === "line";
        const w = (r: number): number => (line ? Math.max(2.4, ctx.minWidth) : Math.max(92 * r, ctx.minWidth));
        const stroke = (width: number): string => `stroke="${colour}" stroke-width="${num(width, 2)}"`;
        const post = `<path d="M${num(post0[0])} ${num(post0[1])}L${num(post1[0])} ${num(post1[1])}" ${stroke(w(0.075))} stroke-linecap="round" fill="none"/>`;
        const bar = `<path d="M${num(p[0])} ${num(p[1])}L${num(q[0])} ${num(q[1])}" ${stroke(w(0.11))} stroke-linecap="round" fill="none"/>`;
        const sheen = line ? "" : `<path d="M${num(p[0])} ${num(p[1] - 1.2)}L${num(q[0])} ${num(q[1] - 1.2)}" stroke="#fff" stroke-opacity=".35" stroke-width="${num(Math.max(0.8, 46 * 0.03), 2)}" stroke-linecap="round" fill="none"/>`;
        return post + bar + sheen;
      },
    }),
});
