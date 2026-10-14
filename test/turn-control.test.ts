// bindTurn, with a small fake element and a fake clock: no DOM, no timers, no dependency.
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { bindTurn, wrapAngle, type TurnContainer, type TurnEvent } from "../src/turn-control.ts";
import { emblemFrame, renderEmblem } from "../src/index.ts";

class Fake implements TurnContainer {
  innerHTML = "";
  style = { touchAction: "", userSelect: "", cursor: "", webkitUserSelect: "" };
  attributes = new Map<string, string>();
  listeners = new Map<string, Set<(event: TurnEvent) => void>>();
  captured: number[] = [];
  released: number[] = [];
  addEventListener(type: string, listener: (event: TurnEvent) => void): void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)?.add(listener);
  }
  removeEventListener(type: string, listener: (event: TurnEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
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
  setPointerCapture(id: number): void {
    this.captured.push(id);
  }
  releasePointerCapture(id: number): void {
    this.released.push(id);
  }
  count(): number {
    return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0);
  }
  fire(type: string, init: Partial<TurnEvent> = {}): { prevented: boolean } {
    const state = { prevented: false };
    const event: TurnEvent = { preventDefault: () => void (state.prevented = true), ...init };
    for (const listener of this.listeners.get(type) ?? []) listener(event);
    return state;
  }
}

/** A clock that runs animation frames when told to. */
const g = globalThis as unknown as Record<string, unknown>;
let frames = new Map<number, (time: number) => void>();
let next = 1;
let now = 0;
g.requestAnimationFrame = (callback: (time: number) => void): number => {
  frames.set(next, callback);
  return next++;
};
g.cancelAnimationFrame = (id: number): void => void frames.delete(id);
/** Runs the frames waiting now, once, with the clock advanced by `ms`. */
function frame(ms = 16): void {
  now += ms;
  const waiting = [...frames.entries()];
  frames = new Map();
  for (const [, callback] of waiting) callback(now);
}
const waiting = (): number => frames.size;
afterEach(() => {
  frames = new Map();
  delete g.document;
  delete g.matchMedia;
});

const drag = (el: Fake, from: [number, number], to: [number, number], extra: Partial<TurnEvent> = {}): void => {
  el.fire("pointerdown", { button: 0, isPrimary: true, pointerId: 7, clientX: from[0], clientY: from[1], ...extra });
  el.fire("pointermove", { pointerId: 7, clientX: to[0], clientY: to[1], ...extra });
  el.fire("pointerup", { pointerId: 7, clientX: to[0], clientY: to[1] });
};

test("the angle maths: a yaw wraps into -180 (excluded) to 180, as the slider's range does", () => {
  assert.equal(wrapAngle(0), 0);
  assert.equal(wrapAngle(180), 180);
  assert.equal(wrapAngle(181), -179);
  assert.equal(wrapAngle(-180), 180);
  assert.equal(wrapAngle(-181), 179);
  assert.equal(wrapAngle(720 + 30), 30);
  assert.equal(wrapAngle(-720 - 30), -30);
});

test("it draws the emblem, at rest as the still drawing and turned as a frame", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { size: 96 });
  assert.equal(el.innerHTML, renderEmblem("trophy:tennis-cup", { size: 96 }));
  turner.setAngles({ yaw: 100, pitch: 20 });
  assert.equal(el.innerHTML, emblemFrame("trophy:tennis-cup", { size: 96, yaw: 100, pitch: 20 }));
  assert.deepEqual(turner.angles, { yaw: 100, pitch: 20, roll: 0 });
  assert.deepEqual(bindTurn(new Fake(), "medal:gold", { yaw: 30, pitch: 10, roll: 5 }).angles, { yaw: 30, pitch: 10, roll: 5 });
  turner.destroy();
});

test("a drag turns the yaw by dx, the pitch by -dy, wraps, and clamps the pitch", () => {
  const el = new Fake();
  const turns: number[] = [];
  const turner = bindTurn(el, "ball:soccer", { onTurn: (a) => turns.push(a.yaw) });
  drag(el, [100, 100], [120, 90]);
  assert.deepEqual(turner.angles, { yaw: 30, pitch: 15, roll: 0 }, "20 px at 1.5 degrees a pixel, and up is more pitch");
  assert.deepEqual(turns, [30]);
  drag(el, [0, 0], [100, 0]);
  assert.equal(turner.angles.yaw, wrapAngle(30 + 150), "150 degrees on from 30 is 180");
  drag(el, [0, 0], [100, 0]);
  assert.equal(turner.angles.yaw, wrapAngle(330), "past 180 it wraps");
  drag(el, [0, 0], [0, -1000]);
  assert.equal(turner.angles.pitch, 60, "the pitch stops at the top of its range");
  drag(el, [0, 0], [0, 1000]);
  assert.equal(turner.angles.pitch, -60);
  assert.deepEqual(el.captured.slice(0, 1), [7]);
  assert.deepEqual(el.released.slice(0, 1), [7]);
  // Each change is drawn on a frame, however many moves there were.
  const before = el.innerHTML;
  el.fire("pointerdown", { button: 0, isPrimary: true, pointerId: 7, clientX: 0, clientY: 0 });
  el.fire("pointermove", { pointerId: 7, clientX: 4, clientY: 0 });
  el.fire("pointermove", { pointerId: 7, clientX: 9, clientY: 0 });
  assert.equal(el.innerHTML, before);
  assert.equal(waiting(), 1);
  frame();
  assert.notEqual(el.innerHTML, before);
  el.fire("pointerup", { pointerId: 7 });
  turner.destroy();
});

test("sensitivity and pitchRange are options, and a bad value falls back", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { sensitivity: 3, pitchRange: [-10, 10] });
  drag(el, [0, 0], [10, -100]);
  assert.deepEqual(turner.angles, { yaw: 30, pitch: 10, roll: 0 });
  const odd = bindTurn(new Fake(), "trophy:tennis-cup", { sensitivity: Number.NaN, pitchRange: [Number.NaN, 5] });
  odd.setAngles({ pitch: 99 });
  assert.equal(odd.angles.pitch, 5);
  const swapped = bindTurn(new Fake(), "trophy:tennis-cup", { pitchRange: [20, -20] });
  swapped.setAngles({ pitch: -99 });
  assert.equal(swapped.angles.pitch, -20);
});

test("only the primary button drags, and a pointer that is not the dragging one is ignored", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup");
  el.fire("pointerdown", { button: 2, isPrimary: true, pointerId: 1, clientX: 0, clientY: 0 });
  el.fire("pointermove", { pointerId: 1, clientX: 50, clientY: 0 });
  el.fire("pointerdown", { button: 0, isPrimary: false, pointerId: 2, clientX: 0, clientY: 0 });
  el.fire("pointermove", { pointerId: 2, clientX: 50, clientY: 0 });
  assert.equal(turner.angles.yaw, 0);
  assert.deepEqual(el.captured, []);
  el.fire("pointerdown", { button: 0, isPrimary: true, pointerId: 3, clientX: 0, clientY: 0 });
  el.fire("pointermove", { pointerId: 4, clientX: 50, clientY: 0 });
  assert.equal(turner.angles.yaw, 0);
  assert.equal(el.style.cursor, "grabbing");
  el.fire("pointercancel", { pointerId: 3 });
  assert.equal(el.style.cursor, "grab");
});

test("on a ball, Shift turns the roll; on a cup it does not", () => {
  const ball = new Fake();
  const b = bindTurn(ball, "ball:soccer");
  drag(ball, [0, 0], [20, 0], { shiftKey: true });
  assert.deepEqual(b.angles, { yaw: 0, pitch: 0, roll: 30 });
  const cup = new Fake();
  const c = bindTurn(cup, "trophy:tennis-cup");
  drag(cup, [0, 0], [20, 0], { shiftKey: true });
  assert.deepEqual(c.angles, { yaw: 30, pitch: 0, roll: 0 });
});

test("the arrow keys turn it, Shift takes a bigger step, Home and 0 put it back, and other keys are left alone", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { onTurn: () => undefined });
  assert.ok(el.fire("keydown", { key: "ArrowRight" }).prevented);
  assert.equal(turner.angles.yaw, 5);
  el.fire("keydown", { key: "ArrowLeft" });
  el.fire("keydown", { key: "ArrowLeft" });
  assert.equal(turner.angles.yaw, -5);
  el.fire("keydown", { key: "ArrowLeft", shiftKey: true });
  assert.equal(turner.angles.yaw, -20);
  el.fire("keydown", { key: "ArrowUp" });
  el.fire("keydown", { key: "ArrowUp", shiftKey: true });
  assert.equal(turner.angles.pitch, 20);
  for (let i = 0; i < 10; i++) el.fire("keydown", { key: "ArrowUp", shiftKey: true });
  assert.equal(turner.angles.pitch, 60);
  el.fire("keydown", { key: "ArrowDown" });
  assert.equal(turner.angles.pitch, 55);
  assert.ok(el.fire("keydown", { key: "Home" }).prevented);
  assert.deepEqual(turner.angles, { yaw: 0, pitch: 0, roll: 0 });
  turner.setAngles({ yaw: 40 });
  el.fire("keydown", { key: "0" });
  assert.equal(turner.angles.yaw, 0);
  for (const key of ["a", "Tab", "Enter", "Escape"]) assert.equal(el.fire("keydown", { key }).prevented, false, key);
  for (const mod of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }]) {
    assert.equal(el.fire("keydown", { key: "ArrowRight", ...mod }).prevented, false);
  }
  assert.equal(turner.angles.yaw, 0);
  assert.equal(bindTurn(new Fake(), "ball:soccer", { keyStep: 10 }).angles.yaw, 0);
  const wide = new Fake();
  const w = bindTurn(wide, "ball:soccer", { keyStep: 10 });
  wide.fire("keydown", { key: "ArrowRight" });
  wide.fire("keydown", { key: "ArrowRight", shiftKey: true });
  assert.equal(w.angles.yaw, 40);
});

test("setAngles wraps, clamps and draws at once; update keeps the angles and swaps the drawing", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { size: 64 });
  turner.setAngles({ yaw: 270, pitch: 400 });
  assert.deepEqual(turner.angles, { yaw: -90, pitch: 60, roll: 0 });
  turner.setAngles({ roll: 190 });
  assert.equal(turner.angles.roll, -170);
  assert.deepEqual(turner.angles, { yaw: -90, pitch: 60, roll: -170 });
  turner.setAngles({ yaw: Number.NaN });
  assert.equal(turner.angles.yaw, -90);
  const copy = turner.angles;
  copy.yaw = 5;
  assert.equal(turner.angles.yaw, -90, "angles is a copy");
  turner.setAngles({ yaw: 80, pitch: 10, roll: 0 });
  turner.update("medal:gold", { size: 32, style: "line" });
  assert.deepEqual(turner.angles, { yaw: 80, pitch: 10, roll: 0 });
  assert.equal(el.innerHTML, emblemFrame("medal:gold", { size: 32, style: "line", yaw: 80, pitch: 10 }));
  turner.update("medal:gold", { yaw: 0, pitch: 0 });
  assert.equal(el.innerHTML, renderEmblem("medal:gold"));
  assert.throws(() => turner.update("nonesuch"), /Unknown emblem/);
});

test("it marks the element, and destroy puts back what it added and leaves what the page had", () => {
  const el = new Fake();
  el.setAttribute("tabindex", "3");
  el.setAttribute("aria-label", "Cup");
  el.style.cursor = "pointer";
  const turner = bindTurn(el, "trophy:tennis-cup");
  assert.equal(el.getAttribute("tabindex"), "3", "a tab stop the page set stays");
  assert.equal(el.getAttribute("role"), "group");
  assert.match(el.getAttribute("aria-roledescription") ?? "", /turnable/);
  assert.match(el.getAttribute("aria-description") ?? "", /arrow keys/);
  assert.equal(el.getAttribute("aria-label"), "Cup");
  assert.deepEqual([el.style.touchAction, el.style.userSelect, el.style.cursor], ["none", "none", "grab"]);
  assert.ok(el.count() > 0);
  const html = el.innerHTML;
  turner.destroy();
  assert.equal(el.count(), 0);
  assert.equal(el.getAttribute("tabindex"), "3");
  assert.equal(el.getAttribute("role"), null);
  assert.equal(el.getAttribute("aria-roledescription"), null);
  assert.equal(el.getAttribute("aria-description"), null);
  assert.deepEqual([el.style.touchAction, el.style.userSelect, el.style.cursor], ["", "", "pointer"]);
  assert.equal(el.innerHTML, html, "the last drawing stays");
  // After destroy nothing listens and nothing draws.
  turner.setAngles({ yaw: 50 });
  turner.update("medal:gold");
  assert.equal(el.innerHTML, html);
  assert.equal(turner.play(), false);
  turner.destroy();
  const fresh = new Fake();
  bindTurn(fresh, "ball:soccer").destroy();
  assert.equal(fresh.getAttribute("tabindex"), null);
  assert.equal(fresh.attributes.size, 0);
});

test("the Japanese words come with locale: ja", () => {
  const el = new Fake();
  bindTurn(el, "ball:soccer", { locale: "ja" });
  assert.match(el.getAttribute("aria-roledescription") ?? "", /回せる/);
  assert.match(el.innerHTML, /<title>サッカーボール<\/title>/);
});

test("an emblem that cannot turn is drawn as it is, and drag, keys and play do nothing", () => {
  const el = new Fake();
  const turns: unknown[] = [];
  const plays: boolean[] = [];
  const turner = bindTurn(el, "sport:nhl", { onTurn: (a) => turns.push(a), onPlayChange: (p) => plays.push(p) });
  assert.equal(el.innerHTML, renderEmblem("sport:nhl"));
  assert.equal(el.count(), 0);
  assert.equal(el.attributes.size, 0);
  assert.deepEqual([el.style.touchAction, el.style.cursor], ["", ""]);
  drag(el, [0, 0], [50, 50]);
  el.fire("keydown", { key: "ArrowRight" });
  assert.equal(turner.play(), false);
  assert.equal(turner.togglePlay(), false);
  assert.equal(turner.playing, false);
  assert.deepEqual(turns, []);
  assert.deepEqual(plays, []);
  // Even its angles can be set, and it still draws as it is.
  turner.setAngles({ yaw: 90 });
  assert.equal(el.innerHTML, renderEmblem("sport:nhl"));
  // Turnability is read from the registry's frames: each kind that turns does, and an icon does not.
  for (const id of ["trophy:hockey-cup", "medal:gold", "crest:shield", "ball:rugby"]) {
    const e = new Fake();
    bindTurn(e, id);
    assert.ok(e.count() > 0, id);
  }
  for (const id of ["sport:soccer", "award:crown"]) {
    const e = new Fake();
    bindTurn(e, id);
    assert.equal(e.count(), 0, id);
  }
  // Updating to an emblem that turns binds it, and back to one that does not unbinds it.
  turner.update("trophy:tennis-cup");
  assert.ok(el.count() > 0 && el.getAttribute("tabindex") === "0");
  turner.update("sport:nhl");
  assert.equal(el.count(), 0);
  assert.equal(el.getAttribute("tabindex"), null);
});

test("nothing moves by itself: no frame is asked for until play()", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup");
  assert.equal(turner.playing, false);
  assert.equal(waiting(), 0);
  frame(1000);
  assert.equal(turner.angles.yaw, 0);
  turner.destroy();
});

test("play advances the yaw by speed and elapsed time, calls onTurn each frame and onPlayChange on each change", () => {
  const el = new Fake();
  const turns: number[] = [];
  const plays: boolean[] = [];
  const turner = bindTurn(el, "trophy:tennis-cup", { speed: 90, onTurn: (a) => turns.push(a.yaw), onPlayChange: (p) => plays.push(p) });
  assert.equal(turner.play(), true);
  assert.equal(turner.play(), true, "playing twice is one start");
  assert.deepEqual(plays, [true]);
  frame(16);
  assert.equal(turner.angles.yaw, 0, "the first frame only starts the clock");
  frame(100);
  assert.equal(turner.angles.yaw, 9);
  frame(500);
  assert.equal(turner.angles.yaw, 18, "a long gap is cut to 0.1 s");
  assert.equal(turns.length, 2);
  assert.equal(el.innerHTML, emblemFrame("trophy:tennis-cup", { yaw: 18 }));
  turner.pause();
  assert.equal(turner.playing, false);
  assert.equal(waiting(), 0, "pause cancels the frame");
  turner.pause();
  assert.deepEqual(plays, [true, false]);
  frame(100);
  assert.equal(turner.angles.yaw, 18);
  assert.equal(turner.togglePlay(), true);
  assert.equal(turner.togglePlay(), false);
  assert.deepEqual(plays, [true, false, true, false]);
  turner.destroy();
});

test("the auto-turn wraps its yaw the way the slider does, and a negative speed turns the other way", () => {
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { speed: 9999, yaw: 170 });
  turner.play();
  frame(16);
  frame(100);
  assert.equal(turner.angles.yaw, -118, "the speed stops at 720 degrees a second: 72 degrees in a tenth, past 180");
  const back = bindTurn(new Fake(), "trophy:tennis-cup", { speed: -100, yaw: 0 });
  back.play();
  frame(16);
  frame(100);
  assert.equal(back.angles.yaw, -10);
});

test("a hidden page does not tick, and a page that shows again starts from a fresh clock", () => {
  const listeners = new Set<() => void>();
  const doc = { hidden: false, addEventListener: (_: string, l: () => void) => listeners.add(l), removeEventListener: (_: string, l: () => void) => listeners.delete(l) };
  g.document = doc;
  const el = new Fake();
  const turner = bindTurn(el, "trophy:tennis-cup", { speed: 100 });
  turner.play();
  frame(16);
  frame(100);
  assert.equal(turner.angles.yaw, 10);
  doc.hidden = true;
  frame(100);
  assert.equal(waiting(), 0, "no frame is asked for while hidden");
  assert.equal(turner.angles.yaw, 10);
  doc.hidden = false;
  for (const l of listeners) l();
  assert.equal(waiting(), 1);
  frame(5000);
  assert.equal(turner.angles.yaw, 10, "the first frame back has no elapsed time");
  frame(100);
  assert.equal(turner.angles.yaw, 20);
  turner.destroy();
  assert.equal(listeners.size, 0);
});

test("a drag holds the auto-turn while the pointer is down and it goes on from the new angle", () => {
  const el = new Fake();
  const plays: boolean[] = [];
  const turner = bindTurn(el, "trophy:tennis-cup", { speed: 100, onPlayChange: (p) => plays.push(p) });
  turner.play();
  frame(16);
  frame(100);
  assert.equal(turner.angles.yaw, 10);
  el.fire("pointerdown", { button: 0, isPrimary: true, pointerId: 1, clientX: 0, clientY: 0 });
  frame(100);
  frame(100);
  assert.equal(turner.angles.yaw, 10, "held");
  el.fire("pointermove", { pointerId: 1, clientX: 20, clientY: 0 });
  assert.equal(turner.angles.yaw, 40);
  frame(100);
  assert.equal(turner.angles.yaw, 40);
  el.fire("pointerup", { pointerId: 1 });
  assert.equal(turner.playing, true);
  frame(3000);
  assert.equal(turner.angles.yaw, 40, "no jump from the time spent held");
  frame(100);
  assert.equal(turner.angles.yaw, 50);
  assert.deepEqual(plays, [true]);
  // With pauseOnInteract off a drag does not hold it.
  const free = bindTurn(new Fake(), "trophy:tennis-cup", { speed: 100, pauseOnInteract: false });
  free.play();
  frame(16);
  frame(100);
  assert.equal(free.angles.yaw, 10);
});

test("keys, Home and setAngles pause the auto-turn, unless pauseOnInteract is off", () => {
  for (const act of [(el: Fake) => el.fire("keydown", { key: "ArrowLeft" }), (el: Fake) => el.fire("keydown", { key: "Home" }), (_: Fake, t: ReturnType<typeof bindTurn>) => t.setAngles({ yaw: 5 })]) {
    const el = new Fake();
    const plays: boolean[] = [];
    const turner = bindTurn(el, "trophy:tennis-cup", { onPlayChange: (p) => plays.push(p) });
    turner.play();
    act(el, turner);
    assert.equal(turner.playing, false);
    assert.deepEqual(plays, [true, false]);
    const stay = new Fake();
    const s = bindTurn(stay, "trophy:tennis-cup", { pauseOnInteract: false });
    s.play();
    act(stay, s);
    assert.equal(s.playing, true);
  }
});

test("Space starts and stops it, and the page's other keys are left alone", () => {
  const el = new Fake();
  const plays: boolean[] = [];
  const turner = bindTurn(el, "ball:soccer", { onPlayChange: (p) => plays.push(p) });
  assert.ok(el.fire("keydown", { key: " " }).prevented);
  assert.equal(turner.playing, true);
  assert.ok(el.fire("keydown", { key: " " }).prevented);
  assert.equal(turner.playing, false);
  assert.deepEqual(plays, [true, false]);
  assert.equal(el.fire("keydown", { key: "Enter" }).prevented, false);
  turner.destroy();
});

test("autoPlay starts at once, but under reduced motion only when forced", () => {
  const on = bindTurn(new Fake(), "trophy:tennis-cup", { autoPlay: true });
  assert.equal(on.playing, true);
  assert.equal(waiting(), 1);
  g.matchMedia = (query: string) => ({ matches: /reduce/.test(query) });
  const reduced = bindTurn(new Fake(), "trophy:tennis-cup", { autoPlay: true });
  assert.equal(reduced.playing, false, "starts paused");
  assert.equal(reduced.play(), true, "and a user action starts it");
  const forced = bindTurn(new Fake(), "trophy:tennis-cup", { autoPlay: "force" });
  assert.equal(forced.playing, true);
  g.matchMedia = () => ({ matches: false });
  assert.equal(bindTurn(new Fake(), "trophy:tennis-cup", { autoPlay: true }).playing, true);
  assert.equal(bindTurn(new Fake(), "trophy:tennis-cup", { autoPlay: false }).playing, false);
  assert.equal(bindTurn(new Fake(), "sport:nhl", { autoPlay: "force" }).playing, false, "an emblem that cannot turn does not play");
});

test("destroy stops the loop and cancels its frame, and update to an emblem that cannot turn stops it", () => {
  const el = new Fake();
  const plays: boolean[] = [];
  const turner = bindTurn(el, "trophy:tennis-cup", { onPlayChange: (p) => plays.push(p) });
  turner.play();
  assert.equal(waiting(), 1);
  turner.destroy();
  assert.equal(waiting(), 0);
  assert.equal(turner.playing, false);
  assert.deepEqual(plays, [true, false]);
  const again = bindTurn(new Fake(), "trophy:tennis-cup");
  again.play();
  again.update("sport:nhl");
  assert.equal(again.playing, false);
  assert.equal(waiting(), 0);
  const kept = bindTurn(new Fake(), "trophy:tennis-cup");
  kept.play();
  kept.update("medal:gold", { size: 40 });
  assert.equal(kept.playing, true, "a turning emblem goes on turning when another is drawn");
  kept.destroy();
});

test("without requestAnimationFrame a change is drawn at once", () => {
  const saved = g.requestAnimationFrame;
  delete g.requestAnimationFrame;
  try {
    const el = new Fake();
    const turner = bindTurn(el, "trophy:tennis-cup");
    el.fire("keydown", { key: "ArrowRight" });
    assert.equal(el.innerHTML, emblemFrame("trophy:tennis-cup", { yaw: 5 }));
    assert.equal(turner.play(), true, "and it plays nothing, having no clock");
  } finally {
    g.requestAnimationFrame = saved;
  }
});
