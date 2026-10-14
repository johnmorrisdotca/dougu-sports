import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { ICOSAHEDRON, turn } from "../src/emblems/emblem.ball.ts";
import { BALL_SOCCER } from "../src/emblems/ball/soccer.ts";
import { wellFormed } from "./helpers.ts";

const patches = (svg: string): number => (svg.match(/<path /g) ?? []).length;

test("the soccer ball is a ball emblem with twelve pentagons on the corners of an icosahedron", () => {
  assert.equal(BALL_SOCCER.id, "ball:soccer");
  assert.equal(BALL_SOCCER.kind, "ball");
  assert.equal(BALL_SOCCER.ja, "サッカーボール");
  assert.equal(ICOSAHEDRON.length, 12);
  for (const v of ICOSAHEDRON) assert.ok(Math.abs(Math.hypot(...v) - 1) < 1e-12);
  assert.equal(BALL_SOCCER.model.marks.length, 12);
});

test("about half of the pentagons face the eye at rest, and a ball that is rolled shows others", () => {
  const rest = BALL_SOCCER.svg();
  assert.ok(patches(rest) >= 5 && patches(rest) <= 9, String(patches(rest)));
  assert.notEqual(BALL_SOCCER.frame({ yaw: 30 }), rest);
  assert.notEqual(BALL_SOCCER.frame({ pitch: 30 }), rest);
  assert.equal(BALL_SOCCER.frame({ yaw: 0, pitch: 0 }), rest);
  assert.equal(BALL_SOCCER.frame({ yaw: 360 }), rest);
  for (let yaw = 0; yaw < 360; yaw += 10) for (const pitch of [-60, 0, 45]) assert.equal(wellFormed(BALL_SOCCER.frame({ yaw, pitch })), null, `${yaw} ${pitch}`);
});

test("the projection keeps a point on the sphere and brings the front round", () => {
  const front = turn([0, 0, 1], 0, 0);
  assert.deepEqual(front.map((x) => Math.round(x * 1e9) / 1e9), [0, 0, 1]);
  const right = turn([0, 0, 1], 90, 0);
  assert.ok(Math.abs(right[0] - 1) < 1e-12 && Math.abs(right[2]) < 1e-12);
  const tilted = turn([0.3, 0.5, 0.81], 33, -20);
  assert.ok(Math.abs(Math.hypot(...tilted) - Math.hypot(0.3, 0.5, 0.81)) < 1e-12);
});

test("every point drawn stays inside the ball", () => {
  for (let yaw = 0; yaw < 360; yaw += 7) {
    const svg = BALL_SOCCER.frame({ yaw, pitch: yaw / 5 - 30 });
    for (const [x, y] of [...svg.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)(?=[LZ])/g)].map((m) => [Number(m[1]), Number(m[2])] as const)) {
      assert.ok(Math.hypot(x - 32, y - 32) <= 28.05, `${yaw}: ${x} ${y}`);
    }
  }
});

test("tint paints the patches, line draws the outline only, and ballFrame is the frame of a ball", () => {
  assert.match(D.renderEmblem("ball:soccer", { tint: "#0b6e4f" }), /fill="#0b6e4f"/);
  assert.doesNotMatch(D.renderEmblem("ball:soccer", { style: "line" }), /fill="#/);
  assert.equal(D.ballFrame("ball:soccer", { yaw: 50 }), BALL_SOCCER.frame({ yaw: 50 }));
  assert.equal(D.emblemFrame("ball:soccer/line", { yaw: 50 }), BALL_SOCCER.frame({ yaw: 50, style: "line" }));
  assert.throws(() => D.ballFrame("award:medal" as never), /not a ball/);
  assert.equal(D.isBallId("ball:soccer"), true);
  assert.equal(D.isBallId("award:medal"), false);
});
