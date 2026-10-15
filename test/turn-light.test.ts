// The light `bindTurn` of `./turn`: it takes an emblem object and needs nothing else, and loads the registry on demand for an id. A small fake element, no DOM.
import assert from "node:assert/strict";
import { test } from "node:test";

import { TROPHY_HOCKEY_CUP } from "../src/emblems/trophy/hockey-cup.ts";
import { TROPHY_TENNIS_CUP } from "../src/emblems/trophy/tennis-cup.ts";
import { MEDAL_GOLD } from "../src/emblems/medal/gold.ts";
import { BALL_SOCCER } from "../src/emblems/ball/ball.soccer.ts";
import { emblemFrame, renderEmblem } from "../src/index.ts";
import { bindTurn, type TurnContainer, type TurnEvent } from "../src/turn-control.ts";
import { bindTurn as bindTurnFull } from "../src/turn-full.ts";

class Fake implements TurnContainer {
  innerHTML = "";
  style = { touchAction: "", userSelect: "", cursor: "", webkitUserSelect: "" };
  attributes = new Map<string, string>();
  listeners = new Map<string, (event: TurnEvent) => void>();
  addEventListener(type: string, listener: (event: TurnEvent) => void): void {
    this.listeners.set(type, listener);
  }
  removeEventListener(type: string): void {
    this.listeners.delete(type);
  }
  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
  key(key: string): void {
    this.listeners.get("keydown")?.({ key, preventDefault() {} });
  }
}

test("an emblem object is drawn at once, at rest in the box of the turn and turned as a frame, with no registry", () => {
  const el = new Fake();
  const turner = bindTurn(el, TROPHY_HOCKEY_CUP, { size: 120 });
  assert.equal(el.innerHTML, renderEmblem("trophy:hockey-cup", { size: 120, turnBox: true }));
  assert.equal(turner.turnable, true);
  turner.setAngles({ yaw: 70, pitch: 15 });
  assert.equal(el.innerHTML, emblemFrame("trophy:hockey-cup", { size: 120, yaw: 70, pitch: 15 }));
  el.key("ArrowRight");
  assert.equal(turner.angles.yaw, 75);
  turner.destroy();
  assert.equal(el.listeners.size, 0);
  assert.equal(el.attributes.size, 0);
});

test("its ready is already resolved for an emblem object", async () => {
  const turner = bindTurn(new Fake(), TROPHY_TENNIS_CUP);
  await turner.ready;
  turner.destroy();
});

test("update takes another emblem object and keeps the angles; a ball turns by Shift-drag roll", () => {
  const el = new Fake();
  const turner = bindTurn(el, TROPHY_HOCKEY_CUP, { size: 64 });
  turner.setAngles({ yaw: 40 });
  turner.update(MEDAL_GOLD, { size: 64 });
  assert.equal(el.innerHTML, emblemFrame("medal:gold", { size: 64, yaw: 40 }));
  turner.update(BALL_SOCCER, { size: 64 });
  assert.equal(el.innerHTML, emblemFrame("ball:soccer", { size: 64, yaw: 40 }));
  turner.destroy();
});

// These two run before any other id is bound: the registry loads once for the whole process, and a bind that finds it loaded draws at once.
test("a bind destroyed while its registry loads draws nothing, and an id that names nothing is an error", async () => {
  const gone = new Fake();
  const second = bindTurn(gone, "trophy:tennis-cup");
  second.destroy();
  await second.ready;
  assert.equal(gone.innerHTML, "");
  // The error comes from `ready` while the registry loads, and from the call itself after it, as it does from the main entry's; either way it is a rejection here.
  await assert.rejects(async () => bindTurn(new Fake(), "trophy:no-such-thing").ready, /Unknown emblem/);
});

test("an id loads the registry first: the element is drawn when ready resolves, and the angles are there at once", async () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { size: 96, yaw: 20 });
  assert.deepEqual(turner.angles, { yaw: 20, pitch: 0, roll: 0 });
  await turner.ready;
  assert.equal(turner.turnable, true);
  assert.equal(el.innerHTML, emblemFrame("trophy:tennis-cup", { size: 96, yaw: 20 }));
  el.key("ArrowLeft");
  assert.equal(turner.angles.yaw, 15);
  turner.destroy();
});

test("once the registry has loaded, an id is bound at once, a style after the id is read, and update takes an id", async () => {
  await bindTurn(new Fake(), "medal:gold").ready;
  const el = new Fake();
  const turner = bindTurn(el, "trophy:cup/line", { size: 48 });
  assert.equal(el.innerHTML, renderEmblem("trophy:cup/line", { size: 48, turnBox: true }));
  turner.update("trophy:hockey-cup", { size: 48 });
  assert.equal(el.innerHTML, renderEmblem("trophy:hockey-cup", { size: 48, turnBox: true }));
  turner.destroy();
});

test("the main entry's bindTurn draws an id at once, and takes an emblem object too", () => {
  const el = new Fake();
  const turner = bindTurnFull(el, "trophy:tennis-cup", { size: 96 });
  assert.equal(el.innerHTML, renderEmblem("trophy:tennis-cup", { size: 96, turnBox: true }));
  turner.update(TROPHY_HOCKEY_CUP, { size: 96 });
  assert.equal(el.innerHTML, renderEmblem("trophy:hockey-cup", { size: 96, turnBox: true }));
  turner.destroy();
});
