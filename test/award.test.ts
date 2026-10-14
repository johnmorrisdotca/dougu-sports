import assert from "node:assert/strict";
import { test } from "node:test";

import { AWARD_MEDAL } from "../src/emblems/award/medal.ts";
import { wellFormed } from "./helpers.ts";

test("the medal is a flat emblem named in two languages, drawn for this package", () => {
  assert.equal(AWARD_MEDAL.id, "award:medal");
  assert.equal(AWARD_MEDAL.kind, "flat");
  assert.equal(AWARD_MEDAL.source, "ours");
  assert.equal(AWARD_MEDAL.en, "Medal");
  assert.equal(AWARD_MEDAL.ja, "メダル");
});

test("the medal's face has a star and its back has none", () => {
  const model = AWARD_MEDAL.model;
  assert.equal(model.front.length, model.back.length + 1);
  const front = AWARD_MEDAL.svg();
  const back = AWARD_MEDAL.frame({ yaw: 180 });
  assert.notEqual(front, back);
  assert.equal((front.match(/<path /g) ?? []).length, model.front.length);
  assert.equal((back.match(/<path /g) ?? []).length, model.back.length);
});

test("turning: no turn is the still drawing, a half turn shows the back flat, a quarter turn is edge on, and the turn repeats every 360", () => {
  assert.equal(AWARD_MEDAL.frame({ yaw: 0, pitch: 0 }), AWARD_MEDAL.svg());
  assert.equal(AWARD_MEDAL.frame(), AWARD_MEDAL.svg());
  assert.equal(AWARD_MEDAL.frame({ yaw: 360 }), AWARD_MEDAL.svg());
  assert.equal(AWARD_MEDAL.frame({ yaw: 40 }), AWARD_MEDAL.frame({ yaw: 400 }));
  assert.match(AWARD_MEDAL.frame({ yaw: 180 }), /scale\(-1 1\)/);
  assert.match(AWARD_MEDAL.frame({ yaw: 90 }), /scale\(0\.02 1\)/);
  assert.match(AWARD_MEDAL.frame({ pitch: 60 }), /scale\(1 0\.5\)/);
  for (let yaw = -180; yaw <= 180; yaw += 15) assert.equal(wellFormed(AWARD_MEDAL.frame({ yaw, pitch: yaw / 6, style: "color" })), null, String(yaw));
});

test("a turn that is not a number is no turn", () => {
  assert.equal(AWARD_MEDAL.frame({ yaw: Number.NaN, pitch: Infinity }), AWARD_MEDAL.svg());
  assert.equal(AWARD_MEDAL.frame({ yaw: "90" as never }), AWARD_MEDAL.svg());
});
