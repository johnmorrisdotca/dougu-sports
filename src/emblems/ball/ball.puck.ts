// Ice hockey puck: vulcanised black rubber, 76.2 mm across and 25.4 mm thick (so 1 : 3), with a ridged edge. Drawn as a cylinder in true 3D, so it turns. The stack's y is in units of the radius, so the half thickness is 12.7 / 38.1, one third.
import { drawStack, type StackSpec } from "./ball.stack.ts";
import { type PieceSize } from "./ball.core.ts";
import { defineObject } from "./ball.object.ts";

/** Half the puck's thickness in units of its radius: 12.7 mm over 38.1 mm, one third. */
export const PUCK_H = 25.4 / 76.2;

/** The puck's size and the rule it comes from: the printed pucks are the same puck. */
export const PUCK_SIZE: PieceSize = { extentMm: 76, diameterMm: 76, thicknessMm: 25, massG: [156, 170], rule: "IIHF Official Rule Book, Rule 13 Puck, 13.1 Dimensions (the puck is Rule 13, not Rule 1)", note: "IIHF figures, rounded as the rule rounds them (the NHL puck is 3 in by 1 in). Colour is not stated in the rule." };

/** The plain puck's drawing: black rubber, a ridged edge, and the ring a moulded top face has. A printed puck is this drawing with its print laid over the ring's place (ball.puck.print.ts). */
export const puckSpec = (extra?: Partial<StackSpec>): StackSpec => ({
  slices: [{ y0: -PUCK_H, y1: PUCK_H, r: 1, colour: "#26282d", outline: true }],
  top: "#2e3036",
  bottom: "#2e3036",
  gloss: 0.5,
  shade: "#000",
  grain: { f: 1.6, a: 0.25 },
  grooves: { count: 30, slices: [0], colour: "#000", opacity: 0.5 },
  topRing: { r: 0.9, colour: "#4a4d56" },
  ...extra,
});

export const BALL_PUCK = /* @__PURE__ */ defineObject({
  id: "ball:puck",
  en: "Hockey puck",
  ja: "アイスホッケーのパック",
  size: PUCK_SIZE,
  view: { yaw: 0, pitch: 36, roll: -8 },
  model: { slices: 1 },
  draw: (c) => drawStack(c, puckSpec()),
});
