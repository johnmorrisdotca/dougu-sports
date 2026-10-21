// A golf ball has to read as a golf ball at every size: white, a dense even pattern of dimples, each with a shadow on one wall and a bright edge on the other. Its colour is fixed by the rules of the sport,
// so `tint` does not recolour it, and neither does it recolour a baseball (the pickleballs, whose real colours vary, still take one).
import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { BALL_GOLF } from "../src/emblems/ball/ball.golf.ts";

/** How many dimples a drawing has: the ellipses of the one path every layer uses. */
const dimples = (svg: string): number => (/<path id="dm[^"]*" d="([^"]*)"/.exec(svg)?.[1].match(/M/g) ?? []).length;

test("a golf ball is covered in dimples, a few hundred round it and enough of them facing you to read as dimpled", () => {
  const svg = BALL_GOLF.svg({ size: 256 });
  assert.ok(dimples(svg) >= 110, `${dimples(svg)} dimples face the eye`);
  // The bowls are lit from the upper left: the shadow, the ball's own colour moved over it, and the bright edge, all three the one path.
  assert.equal((svg.match(/<use href="#dm/g) ?? []).length, 3);
  assert.ok(svg.includes('stroke="#fff"'), "the bright edge");
  for (const yaw of [0, 60, 130, 250]) assert.ok(dimples(BALL_GOLF.frame({ size: 256, yaw, pitch: 40 })) >= 110, `turned ${yaw}`);
});

test("a golf ball is white, and a tint does not recolour it", () => {
  const plain = D.renderEmblem("ball:golf", { size: 128 });
  assert.equal(D.renderEmblem("ball:golf", { size: 128, tint: "#2e9e4a" }), plain);
  assert.equal(D.emblemFrame("ball:golf", { size: 128, tint: "#2e9e4a", yaw: 50, pitch: 60 }), D.emblemFrame("ball:golf", { size: 128, yaw: 50, pitch: 60 }));
  assert.ok(!plain.includes("#2e9e4a"));
  assert.equal(D.renderEmblem("ball:baseball", { tint: "#2e9e4a" }), D.renderEmblem("ball:baseball"));
});

test("a tint still recolours the balls whose colours vary, and the line style still draws the marks of a golf ball", () => {
  assert.notEqual(D.renderEmblem("ball:soccer", { tint: "#2e9e4a" }), D.renderEmblem("ball:soccer"));
  assert.notEqual(D.renderEmblem("ball:pickleball-outdoor", { tint: "#2e9e4a" }), D.renderEmblem("ball:pickleball-outdoor"));
  const line = BALL_GOLF.svg({ size: 128, style: "line" });
  assert.ok(line.includes("currentColor") && !line.includes("<use"));
});
