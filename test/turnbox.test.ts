// Nothing is cut off. Every emblem is drawn in a view box; a still drawing fits the box it is drawn in, and so does every frame of a turn, at every yaw, pitch and roll, in every style, and the box is the same
// for every frame of one emblem, so the drawing does not change size or jump as it turns. The ink is measured from the finished SVG (test/svgbox.ts: every path, circle and ellipse with its stroke, its
// transforms, its clip and the rim a flip adds), never from the numbers the emblems were drawn from.
import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { bindTurn, type TurnContainer } from "../src/turn-control.ts";
import { type Box, inkBox, pathPoints, viewBoxOf } from "./svgbox.ts";

/** How far the ink may go past the box, as a fraction of the box's side: half a percent, which is the antialiasing of a stroke on the edge. */
const MARGIN = 0.005;
const STYLES = ["metal", "line", "color"] as const;
const range = (from: number, to: number, step: number): number[] => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
const kindOf = (id: D.EmblemId): D.EmblemKind => D.emblemInfo(id).kind;
const box = (svg: string): string => /^<svg[^>]*?\sviewBox="([^"]*)"/.exec(svg)?.[1] as string;
const side = (b: Box): number => Math.max(b.x1 - b.x0, b.y1 - b.y0);
const past = (ink: Box, view: Box): number => Math.max(0, view.x0 - ink.x0, view.y0 - ink.y0, ink.x1 - view.x1, ink.y1 - view.y1);
const union = (boxes: readonly Box[]): Box => boxes.reduce((a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) }));

/** The orientations a kind is sampled at: a body of revolution at every 10 degrees of yaw and the whole of its tilt, a flip at the angles where its rim and its squeeze are most, a ball over its sphere and its roll. */
function turns(id: D.EmblemId): { yaw: number; pitch: number; roll: number }[] {
  const kind = kindOf(id);
  const out: { yaw: number; pitch: number; roll: number }[] = [];
  const yaws = kind === "lathe" ? range(0, 350, 10) : kind === "ball" ? range(0, 315, 45) : [0, 5, 10, 25, 45, 80, 90, 100, 135, 170, 180, 190, 225, 270, 315, 355];
  const pitches = kind === "lathe" ? [-90, -60, -40, -20, 0, 12, 30, 45, 60, 90] : kind === "ball" ? [-60, 0, 60] : [-60, -30, 0, 30, 60, 89];
  const rolls = kind === "ball" ? [0, 60, -120] : [0];
  for (const yaw of yaws) for (const pitch of pitches) for (const roll of rolls) out.push({ yaw, pitch, roll });
  return out;
}

test("the ink of a drawing is measured from its paths, strokes, transforms and clips", () => {
  const wrap = (body: string, view = "0 0 64 64"): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}"><g fill="none" stroke="#000" stroke-width="2">${body}</g></svg>`;
  const near = (a: number, b: number): void => assert.ok(Math.abs(a - b) < 0.05, `${a} is not ${b}`);
  // A circle and the half of its stroke.
  let ink = inkBox(wrap('<circle cx="32" cy="32" r="10"/>')) as Box;
  [ink.x0, ink.y0, ink.x1, ink.y1].forEach((v, i) => near(v, [21, 21, 43, 43][i] as number));
  // A curve is measured at its bend, not at its control point: a quadratic from (0,0) over (10,20) to (20,0) rises to y = 10.
  ink = inkBox(wrap('<path d="M0 0Q10 20 20 0"/>')) as Box;
  near(ink.y1, 11);
  // An arc of 22: M10 32 a22 22 0 0 1 44 0 reaches up to y = 10.
  ink = inkBox(wrap('<path d="M10 32a22 22 0 0 1 44 0"/>')) as Box;
  near(ink.y0, 9);
  near(ink.x0, 9);
  assert.deepEqual(pathPoints("M1 2H5V7h-2v-1z").slice(0, 4), [[1, 2], [5, 2], [5, 7], [3, 7]]);
  // A transform moves and scales the stroke with the shape; a squeeze leaves the stroke thin in that direction.
  ink = inkBox(wrap('<g transform="translate(10 0) scale(0.5 1)"><path d="M0 10H40"/></g>')) as Box;
  near(ink.x0, 10 - 0.5);
  near(ink.x1, 30 + 0.5);
  // A clip path cuts a group; a fill of none and a stroke of none paints nothing.
  ink = inkBox(`<svg viewBox="0 0 64 64"><defs><clipPath id="c"><circle cx="32" cy="32" r="8"/></clipPath></defs><g clip-path="url(#c)"><rect x="0" y="0" width="64" height="64" fill="#000"/></g></svg>`) as Box;
  [ink.x0, ink.x1].forEach((v, i) => near(v, [24, 40][i] as number));
  assert.equal(inkBox(`<svg viewBox="0 0 64 64"><path d="M0 0H64" fill="none" stroke="none"/></svg>`), undefined);
  // The rim of a flip: a filter that offsets a copy widens the box on that side.
  ink = inkBox(`<svg viewBox="0 0 64 64"><defs><filter id="f" x="-10" y="0" width="100" height="64" filterUnits="userSpaceOnUse"><feOffset dx="-3" dy="0"/></filter></defs><g filter="url(#f)"><rect x="20" y="20" width="10" height="10" fill="#000"/></g></svg>`) as Box;
  near(ink.x0, 17);
  near(ink.x1, 30);
});

test("no still drawing is cut off by its view box, in any style", () => {
  const cut: string[] = [];
  for (const id of D.EMBLEM_IDS) {
    for (const style of STYLES) {
      const svg = D.renderEmblem(id, { style, grain: false });
      const view = viewBoxOf(svg);
      const ink = inkBox(svg);
      assert.ok(ink !== undefined, id);
      const over = past(ink, view);
      if (over > MARGIN * side(view)) cut.push(`${id} ${style}: ${over.toFixed(2)} past ${box(svg)}`);
    }
  }
  assert.deepEqual(cut, []);
});

test("no turned frame is cut off, at any yaw, pitch or roll, in any style, and every frame of an emblem has one box", () => {
  const cut: string[] = [];
  const boxes = new Map<string, Set<string>>();
  for (const id of D.EMBLEM_IDS) {
    const ball = kindOf(id) === "ball";
    let worst = 0;
    let at = "";
    for (const style of ball ? (["metal", "line"] as const) : STYLES) {
      for (const turn of turns(id)) {
        const svg = D.emblemFrame(id, { ...turn, style });
        const view = viewBoxOf(svg);
        const ink = inkBox(svg);
        if (ink === undefined) continue;
        const over = past(ink, view) - MARGIN * side(view);
        if (over > worst) {
          worst = over;
          at = `${style} yaw ${turn.yaw} pitch ${turn.pitch} roll ${turn.roll}`;
        }
        const seen = boxes.get(id) ?? new Set<string>();
        seen.add(box(svg));
        boxes.set(id, seen);
      }
    }
    if (worst > 0) cut.push(`${id}: ${worst.toFixed(2)} past the margin at ${at}`);
  }
  assert.deepEqual(cut, []);
  for (const [id, seen] of boxes) assert.equal(seen.size, 1, `${id} changes its box as it turns: ${[...seen].join(" | ")}`);
});

test("a frame is in the box of the turn, the same box as the still drawing asked for it, and a frame can ask for the still's own box", () => {
  for (const id of D.EMBLEM_IDS) {
    const turned = box(D.emblemFrame(id, { yaw: 70, pitch: 20 }));
    assert.equal(box(D.emblemFrame(id, { yaw: 0, pitch: 0 })), turned, `${id}: no turn is the same box as a turn`);
    assert.equal(box(D.renderEmblem(id, { turnBox: true })), turned, `${id}: the still in the box of the turn`);
    assert.equal(box(D.emblemFrame(id, { yaw: 70, pitch: 20, turnBox: false })), box(D.renderEmblem(id)), `${id}: the still's own box`);
    // A box is square, so that an emblem is as wide as it is tall and a page does not change when it swaps one emblem for another.
    const view = viewBoxOf(D.emblemFrame(id, { yaw: 70 }));
    assert.ok(Math.abs(view.x1 - view.x0 - (view.y1 - view.y0)) < 1e-6, `${id} ${box(D.emblemFrame(id, { yaw: 70 }))}`);
  }
  // The cups tilt toward the eye by up to 60 degrees: their turn needs room the still does not, and a ball and a flat medal need none.
  assert.notEqual(box(D.emblemFrame("trophy:sumo-cup", { yaw: 10 })), box(D.renderEmblem("trophy:sumo-cup")));
  assert.equal(box(D.emblemFrame("medal:gold", { yaw: 10 })), box(D.renderEmblem("medal:gold")));
  assert.equal(box(D.ballFrame("ball:soccer", { yaw: 10 })), box(D.renderEmblem("ball:soccer")));
});

test("a box a model declares is needed and is no bigger than its drawings need", () => {
  const declared: string[] = [];
  for (const id of D.EMBLEM_IDS) {
    const model = D.emblemModel(id) as { box?: string; turnBox?: string } | null;
    const own = model?.turnBox ?? model?.box;
    if (own === undefined) continue;
    declared.push(id);
    const view = viewBoxOf(`<svg viewBox="${own}">`);
    const ink = union(
      turns(id)
        .flatMap((turn) => STYLES.map((style) => inkBox(D.emblemFrame(id, { ...turn, style }))))
        .concat(STYLES.map((style) => inkBox(D.renderEmblem(id, { style }))))
        .filter((b): b is Box => b !== undefined),
    );
    // It holds the ink ...
    assert.ok(past(ink, view) <= MARGIN * side(view), `${id}: ${past(ink, view).toFixed(2)} of the ink is past ${own}`);
    // ... and the usual box did not (otherwise the declaration is not needed) ...
    const usual = kindOf(id) === "ball" ? 100 : 64;
    assert.ok(past(ink, { x0: 0, y0: 0, x1: usual, y1: usual }) > MARGIN * usual || view.x1 - view.x0 > usual, `${id} does not need ${own}`);
    // ... and it is no roomier than the ink and the usual box together need (the sample is coarser than the script's sweep, which adds 0.2 round the ink, so there is a unit to spare).
    const hull = union([ink, { x0: 0, y0: 0, x1: usual, y1: usual }]);
    assert.ok(side(view) <= side(hull) + 1.5, `${id}: ${own} is roomier than its drawings need (${side(hull).toFixed(1)})`);
  }
  // Every cup that is a body of revolution has a turn box, and the ones that are not have none to speak of.
  for (const id of D.EMBLEM_IDS.filter((x) => kindOf(x) === "lathe")) assert.ok(declared.includes(id), `${id} has no turn box`);
  assert.ok(declared.length >= 20, declared.join(" "));
});

/** A small fake element, as in turn-control.test.ts. */
class Fake implements TurnContainer {
  innerHTML = "";
  style = { touchAction: "", userSelect: "", cursor: "", webkitUserSelect: "" };
  attributes = new Map<string, string>();
  addEventListener(): void {}
  removeEventListener(): void {}
  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
}

test("bindTurn sizes its element from the box of the turn, at rest and at every angle", () => {
  for (const id of ["trophy:sumo-cup", "trophy:hockey-cup", "trophy:bowl", "gear:swim-goggles", "medal:gold", "ball:soccer"] as const) {
    const element = new Fake();
    const turner = bindTurn(element, id, { size: 160 });
    const rest = element.innerHTML;
    const wanted = box(D.emblemFrame(id, { yaw: 33 }));
    assert.equal(box(rest), wanted, `${id} at rest`);
    assert.match(rest, /width="160" height="160"/, id);
    for (const [yaw, pitch] of [[40, 0], [-120, 60], [175, -60], [0, 60]] as const) {
      turner.setAngles({ yaw, pitch });
      // A frame is drawn on the next animation frame in a page; without one it is drawn at once.
      assert.equal(box(element.innerHTML), wanted, `${id} ${yaw} ${pitch}`);
      assert.match(element.innerHTML, /width="160" height="160"/, id);
      const ink = inkBox(element.innerHTML) as Box;
      assert.ok(past(ink, viewBoxOf(element.innerHTML)) <= MARGIN * 160, `${id} ${yaw} ${pitch}`);
    }
    turner.destroy();
  }
});

test("the displays, the sprite and the data address carry each emblem's own box, so a still is whole in them", () => {
  const sprite = D.emblemSprite(D.EMBLEM_IDS as readonly string[]);
  for (const id of D.EMBLEM_IDS) {
    const own = box(D.renderEmblem(id, { theme: "inherit", title: false, grain: false }));
    assert.ok(sprite.sheet.includes(`viewBox="${own}"`), `${id} in the sprite`);
    assert.ok(D.podium([{ emblem: id }]).includes(`viewBox="${own}"`), `${id} on the podium`);
    assert.ok(D.awardCase([{ emblem: id }]).includes(`viewBox="${own}"`), `${id} in the award case`);
    assert.ok(decodeURIComponent(D.emblemDataUri(id)).includes(`viewBox="${own}"`), `${id} as a data address`);
  }
});
