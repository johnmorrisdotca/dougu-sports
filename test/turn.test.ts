import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { wellFormed } from "./helpers.ts";

const YAWS = [-180, -135, -90, -45, 0, 30, 45, 90, 135, 180, 270, 360, 1000];
const lathe = D.EMBLEM_IDS.filter((id) => D.emblemInfo(id).kind === "lathe");

/** The body pieces of a drawing: the paths filled from a gradient, which are the silhouette of a cup at every yaw. */
const pieces = (svg: string): string[] => [...svg.matchAll(/<path d="(M[^"]*Q[^"]*z)" fill="url\(#dgsc/g)].map((m) => m[1] as string);

test("every emblem is finite and well formed at every yaw and pitch, in every style", () => {
  for (const id of D.EMBLEM_IDS) {
    for (const style of D.EMBLEM_STYLES) {
      for (const yaw of YAWS) {
        for (const pitch of [0, 12, 40, -20, 1000]) {
          const svg = D.emblemFrame(id, { yaw, pitch, style });
          assert.doesNotMatch(svg, /NaN|undefined|Infinity/, `${id} ${style} ${yaw} ${pitch}`);
          assert.equal(wellFormed(svg), null, `${id} ${style} ${yaw} ${pitch}`);
        }
      }
    }
  }
});

test("no turn is the still drawing for every emblem that turns, and a turn that is not a number is no turn", () => {
  for (const id of D.EMBLEM_IDS) {
    // A ball that is turning has no grain, so its resting turn is the still drawing with the grain left out.
    const still = D.emblemInfo(id).kind === "ball" ? D.renderEmblem(id, { grain: false }) : D.renderEmblem(id);
    assert.equal(D.emblemFrame(id, { yaw: 0, pitch: 0 }), still, id);
    assert.equal(D.emblemFrame(id, { yaw: Number.NaN, pitch: Infinity }), still, id);
    assert.equal(D.emblemFrame(id, { yaw: "90" as never }), still, id);
  }
});

test("a body of revolution keeps its outline at every yaw and moves its light", () => {
  assert.ok(lathe.length >= 12, "the trophies that are bodies of revolution");
  for (const id of lathe) {
    const still = pieces(D.renderEmblem(id));
    // A stand with flat faces has no round pieces: its faces are tested below.
    if (id === "trophy:football") continue;
    assert.ok(still.length > 0, id);
    for (const yaw of [20, 90, 200]) {
      assert.deepEqual(pieces(D.emblemFrame(id, { yaw })), still, `${id} ${yaw}`);
      assert.notEqual(D.emblemFrame(id, { yaw }), D.renderEmblem(id), `${id} ${yaw}`);
    }
    assert.equal(D.emblemFrame(id, { yaw: 360 }), D.renderEmblem(id), id);
  }
});

test("the light slides with the yaw: the gradient of a turned cup is another gradient", () => {
  const gradient = (svg: string): string => /<linearGradient id="(dgsc[a-z0-9]+)"/.exec(svg)?.[1] as string;
  const a = gradient(D.emblemFrame("trophy:hockey-cup", { yaw: 0 }));
  const b = gradient(D.emblemFrame("trophy:hockey-cup", { yaw: 90 }));
  const c = gradient(D.emblemFrame("trophy:hockey-cup", { yaw: -90 }));
  assert.equal(new Set([a, b, c]).size, 3);
});

test("a handle goes to the side it is turned toward, and is drawn behind the cup when it is on the far side", () => {
  const handles = (svg: string): string[] => [...svg.matchAll(/<path d="(M[\d. ]+C[^"]*)" stroke-width/g)].map((m) => m[1] as string);
  const still = handles(D.renderEmblem("trophy:tennis-cup"));
  assert.equal(still.length, 2, "one outer stroke for each of two handles");
  assert.notDeepEqual(handles(D.emblemFrame("trophy:tennis-cup", { yaw: 90 })), still);
  // At a half turn the handles are the other way round, so they are the same two shapes mirrored in a different order.
  const behind = D.emblemFrame("trophy:tennis-cup", { yaw: 120 });
  assert.ok(behind.indexOf("C") < behind.indexOf('fill="url(#dgsc'), "a handle on the far side comes before the body");
});

test("a stand with flat faces shows the faces that look toward the eye, lit by which way they face", () => {
  const faces = (svg: string): string[] => [...svg.matchAll(/<path d="(M[\d. ]+L[\d. ]+L[\d. ]+L[\d. ]+z)" fill="(#[0-9a-f]{6})"/g)].map((m) => m[2] as string);
  const rest = faces(D.renderEmblem("trophy:football"));
  assert.ok(rest.length >= 4, "two faces for each of the stand and its steps");
  assert.notDeepEqual(faces(D.emblemFrame("trophy:football", { yaw: 60 })), rest);
  assert.ok(new Set(rest).size > 1, "the faces are lit differently");
});

test("the baseball trophy has thirty poles, half of them behind the ball and half in front", () => {
  const svg = D.renderEmblem("trophy:baseball", { style: "line" });
  const poles = [...svg.matchAll(/<path d="((?:M[\d. ]+L[\d. ]+){3,})" stroke="currentColor" stroke-width="1.2"\/>/g)].map((m) => (m[1] as string).split("M").length - 1);
  assert.equal(poles.reduce((a, b) => a + b, 0), 30);
  assert.equal(poles.length, 2);
  assert.ok(poles.every((n) => n >= 10 && n <= 20), poles.join(" "));
});

test("a ball on a stand turns its seams: the net of the basketball and the globe's meridians move", () => {
  assert.notEqual(D.emblemFrame("trophy:basketball", { yaw: 45 }), D.renderEmblem("trophy:basketball"));
  assert.notEqual(D.emblemFrame("trophy:globe", { yaw: 45 }), D.renderEmblem("trophy:globe"));
  assert.notEqual(D.emblemFrame("trophy:soccer-ball", { yaw: 45 }), D.renderEmblem("trophy:soccer-ball"));
});

test("a tilt shows more of the top of a dish and less of it when it is lowered", () => {
  const rim = (svg: string): number => Number(/<ellipse cx="32" cy="[\d.]+" rx="[\d.]+" ry="([\d.]+)" fill="#[0-9a-f]{6}"\/><ellipse/.exec(svg)?.[1]);
  assert.ok(rim(D.emblemFrame("trophy:bowl", { pitch: 30 })) > rim(D.emblemFrame("trophy:bowl", { pitch: 0 })));
  assert.ok(rim(D.emblemFrame("trophy:bowl", { pitch: -10 })) < rim(D.emblemFrame("trophy:bowl", { pitch: 0 })));
});

test("a medal flips like a coin: its back is plain, it is edge on at a quarter turn, and it repeats every 360", () => {
  const front = D.renderEmblem("medal:gold");
  const back = D.emblemFrame("medal:gold", { yaw: 180 });
  assert.notEqual(front, back);
  assert.ok((back.match(/<path /g) ?? []).length < (front.match(/<path /g) ?? []).length, "the back has no ribbon and no star");
  assert.match(D.emblemFrame("medal:gold", { yaw: 90 }), /scale\(0\.02 1\)/);
  assert.match(D.emblemFrame("medal:gold", { pitch: 60 }), /scale\(1 0\.5\)/);
  assert.equal(D.emblemFrame("medal:gold", { yaw: 40 }), D.emblemFrame("medal:gold", { yaw: 400 }));
  assert.match(D.emblemFrame("medal:gold", { yaw: 45 }), /translate\(2\.12 0\)/, "the rim shows as it turns");
});

test("the ribbon of a medal has the five stripes of a games and draws no rings", () => {
  const svg = D.renderEmblem("medal:silver");
  for (const stripe of ["#0085c7", "#f4c300", "#1b1b1b", "#009f3d", "#df0024"]) assert.ok(svg.includes(stripe), stripe);
  // The only round shapes are the disc, its bevel, and the inner ring of the back: no interlocking circles.
  assert.equal((svg.match(/a[\d.]+ [\d.]+ 0 1 0/g) ?? []).length, 2 * 2 + 0, "the disc and its bevel, two arcs each");
});

test("a rolling ball and a flipping medal are different kinds, and the kinds are named", () => {
  assert.equal(D.emblemInfo("medal:gold").kind, "flat");
  assert.equal(D.emblemInfo("ball:soccer").kind, "ball");
  assert.equal(D.emblemInfo("trophy:hockey-cup").kind, "lathe");
  assert.equal(D.emblemInfo("sport:nhl").kind, "icon");
  assert.equal(D.emblemInfo("trophy:cup").source, "material");
  assert.equal(D.emblemInfo("trophy:hockey-cup").source, "ours");
});

const flatTurned = D.EMBLEM_IDS.filter((id) => ["flat", "icon", "gear"].includes(D.emblemInfo(id).kind));

test("every flat emblem, pictogram, award, piece of gear, jersey and pennant turns like a coin: squeezed, with a back, and a rim", () => {
  assert.ok(flatTurned.length >= 90, `${flatTurned.length} ids turn as flat things`);
  for (const id of flatTurned) {
    const still = D.renderEmblem(id);
    for (const style of D.EMBLEM_STYLES) {
      const at = (yaw: number, pitch = 0): string => D.emblemFrame(id, { yaw, pitch, style });
      assert.notEqual(at(60), D.renderEmblem(id, { style }), `${id} ${style} 60`);
      assert.notEqual(at(180), D.renderEmblem(id, { style }), `${id} ${style} 180 is its back`);
      assert.notEqual(at(60), at(-60), `${id} ${style}: the rim is on the side that turns away`);
      assert.equal(at(360), D.renderEmblem(id, { style }), `${id} ${style} 360`);
      assert.equal(at(400), at(40), `${id} ${style} 400 is 40`);
      // Edge on, the face is a sliver and never zero wide, so it cannot divide by nothing.
      assert.doesNotMatch(at(90), /scale\(0 |scale\(-0 /, `${id} ${style} 90`);
      assert.notEqual(at(0, 50), D.renderEmblem(id, { style }), `${id} ${style}: a tilt squeezes it`);
    }
    assert.ok(still.length > 0);
  }
});

test("a turned gear, icon or award squeezes by the cosine, mirrors its back, and has a thin dark rim that is widest edge on", () => {
  for (const id of ["gear:hurley", "gear:tennis-racket", "sport:nhl", "award:crown", "trophy:cup"] as const) {
    const scale = (svg: string): number => Number(/scale\((-?[\d.]+) /.exec(svg)?.[1]);
    assert.equal(scale(D.emblemFrame(id, { yaw: 60 })), 0.5, id);
    assert.equal(scale(D.emblemFrame(id, { yaw: 120 })), -0.5, `${id}: the back is mirrored`);
    assert.equal(scale(D.emblemFrame(id, { yaw: 90 })), 0.02, id);
    const rim = (svg: string): number => Math.abs(Number(/<feOffset in="s" dx="(-?[\d.]+)"[^>]*result="o3"/.exec(svg)?.[1]));
    assert.ok(rim(D.emblemFrame(id, { yaw: 90 })) > rim(D.emblemFrame(id, { yaw: 30 })), `${id}: the rim is widest edge on`);
    assert.match(D.emblemFrame(id, { yaw: 120 }), /<feColorMatrix/, `${id}: the back is a little darker`);
    assert.doesNotMatch(D.emblemFrame(id, { yaw: 60 }), /<feColorMatrix/, `${id}: the front is not`);
    assert.match(D.emblemFrame(id, { yaw: 60, style: "line" }), /flood-color="currentColor"/, `${id}: the rim of a line drawing is the page's ink`);
  }
});

test("a jersey and a pennant show their own back, not a mirror of the front", () => {
  const front = D.emblemFrame("jersey:soccer", { yaw: 20, number: 7, name: "Ono" });
  const back = D.emblemFrame("jersey:soccer", { yaw: 160, number: 7, name: "Ono" });
  assert.ok(front.includes(">7<") && !front.includes(">ONO<"), "the front has the number and no name");
  assert.ok(back.includes(">7<") && back.includes(">ONO<"), "the back has the name and the number");
  assert.match(back, /scale\(0\.94 /, "the back is not mirrored");
  const flag = D.emblemFrame("pennant:championship", { yaw: 160, engrave: "Champions", year: 2026 });
  assert.ok(!flag.includes("CHAMPIONS") && !flag.includes(">2026<"), "the back of a pennant is plain felt");
  assert.match(flag, /translate\(64 0\) scale\(-1 1\)/, "with the dowel on the other side");
});
