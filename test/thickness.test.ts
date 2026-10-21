// A flat piece that turns is a slab, never a sheet: at every angle it has a body and an edge, edge on it is a band a few pixels wide and not a hairline, and from behind it is not an empty drawing.
// Pixels are counted for real in a browser by e2e/silhouette.demo.ts; here the drawings are held to what makes them: the slices of the edge, their width on the screen, and what is on the back.
import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";

const FLAT = D.EMBLEM_IDS.filter((id) => ["flat", "icon", "gear"].includes(D.emblemOf(id).emblem.kind));

/** The edge's total width on the screen, in pixels: the offsets of its slices, across the box, at the size the drawing is made. */
function edgePixels(svg: string): number {
  const size = Number(/ width="([\d.]+)"/.exec(svg)?.[1]);
  const box = Number((/viewBox="[^"]*?\s([\d.]+)\s[\d.]+"/.exec(svg)?.[1]));
  const dx = [...svg.matchAll(/<feOffset in="s" dx="(-?[\d.]+)" dy="(-?[\d.]+)"/g)].map((m) => Math.hypot(Number(m[1]), Number(m[2])));
  return (Math.max(0, ...dx) * size) / box;
}

test("every flat piece is edge on a band at least two pixels wide, at an icon's size and a large one", () => {
  assert.ok(FLAT.length > 140, `${FLAT.length} flat pieces`);
  for (const id of FLAT) {
    for (const size of [24, 64, 256]) {
      for (const yaw of [90, -90]) {
        const svg = D.emblemFrame(id, { yaw, size });
        assert.ok(edgePixels(svg) >= 2.3, `${id} at ${size}px, yaw ${yaw}: its edge is ${edgePixels(svg).toFixed(2)} px`);
        assert.equal((svg.match(/<feOffset /g) ?? []).length, 8, `${id}: the edge is eight slices`);
      }
    }
  }
});

test("the edge is as wide on the screen whatever the turn does to the face, and runs to the other side past a quarter turn", () => {
  for (const id of ["medal:gold", "crest:shield", "gear:hockey-stick", "sport:nhl"] as const) {
    const at = (yaw: number): number => Number(/<feOffset in="s" dx="(-?[\d.]+)"[^>]*result="o8"/.exec(D.emblemFrame(id, { yaw, size: 128 }))?.[1]);
    assert.ok(Math.abs(at(80)) > Math.abs(at(40)) && Math.abs(at(90)) >= Math.abs(at(80)) - 1e-9, `${id}: the edge grows to a quarter turn`);
    assert.ok(at(60) < 0 && at(120) > 0 && at(-60) > 0 && at(-120) < 0, `${id}: it switches sides when the back comes round`);
  }
});

test("from behind a flat piece is not empty: it is drawn, it is not the front, and what hangs from it is there", () => {
  for (const id of FLAT) {
    const back = D.emblemFrame(id, { yaw: 180, size: 64 });
    assert.ok((back.match(/<path |<rect |<circle |<ellipse |<polygon |<line |<text /g) ?? []).length >= 1, `${id}: the back draws nothing`);
    assert.notEqual(back, D.renderEmblem(id, { size: 64 }), `${id}: the back is the front`);
  }
  // A medal's ribbon, a flag's pole and a pennant's dowel are seen from behind too, on the other side.
  const medal = D.emblemFrame("medal:gold", { yaw: 180 });
  for (const stripe of ["#0085c7", "#f4c300", "#1b1b1b", "#009f3d", "#df0024"]) assert.ok(medal.includes(stripe), `the ribbon from behind: ${stripe}`);
  assert.match(D.emblemFrame("trophy:championship-banner", { yaw: 180 }), /translate\(\d+(\.\d+)? 0\) scale\(-1 1\)/, "the pole on the other side");
  assert.match(D.emblemFrame("crest:pennant", { yaw: 180 }), /scale\(-1 1\)/);
});

test("a puck is a straight cylinder: its wall runs top to bottom, ends in the curve of the lower rim, and is knurled all round", () => {
  for (const id of ["ball:puck", "puck:usa"] as const) {
    for (const pitch of [-36, -6, 24, 54]) {
      const svg = D.emblemFrame(id, { yaw: 30, pitch, size: 160 });
      const wall = /<path d="(M[^"]+Z)" fill="url\(#[^)]*s0\)"\/>/.exec(svg)?.[1] ?? "";
      assert.ok(wall.includes("A"), `${id} at ${pitch}: the wall ends in the lower rim's arc`);
      const knurl = /<path d="(M[^"]+)" stroke="#000" stroke-width="[^"]+" opacity="0?\.7"/.exec(svg)?.[1] ?? "";
      assert.ok(pitch === 54 || (knurl.match(/M/g) ?? []).length >= 20, `${id} at ${pitch}: the knurl covers the wall (${(knurl.match(/M/g) ?? []).length} runs)`);
    }
  }
  // Seen from the side the puck is one third as thick as it is wide, and the knurl turns with it.
  const knurl = (yaw: number): string => /stroke="#000" stroke-width="[^"]+" opacity="0?\.7"/.test(D.emblemFrame("ball:puck", { yaw, pitch: -36 })) ? D.emblemFrame("ball:puck", { yaw, pitch: -36 }) : "";
  assert.notEqual(knurl(0), knurl(7));
});
