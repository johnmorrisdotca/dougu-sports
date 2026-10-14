import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { EMBLEM_STYLES } from "../src/index.ts";
import { wellFormed } from "./helpers.ts";

test("every emblem draws well-formed SVG in every style, and the same call gives the same string", () => {
  for (const id of D.EMBLEM_IDS) {
    for (const style of EMBLEM_STYLES) {
      const svg = D.renderEmblem(id, { style });
      assert.equal(wellFormed(svg), null, `${id} ${style}`);
      assert.ok(svg.startsWith("<svg "), id);
      assert.equal(svg, D.renderEmblem(id, { style }), id);
      assert.ok(svg.includes(`<title>${D.emblemName(id)}</title>`), id);
      assert.match(svg, /role="img"/);
    }
  }
});

test("the three styles differ: metal has a gradient, line has no fill, color is flat", () => {
  for (const id of D.EMBLEM_IDS) {
    const metal = D.renderEmblem(id, { style: "metal" });
    const line = D.renderEmblem(id, { style: "line" });
    const color = D.renderEmblem(id, { style: "color" });
    assert.match(metal, /Gradient id="dgs/, id);
    assert.doesNotMatch(line, /Gradient|url\(#/, id);
    assert.doesNotMatch(color, /Gradient|url\(#/, id);
    assert.notEqual(line, color);
    assert.notEqual(metal, color);
    assert.equal(D.renderEmblem(id), metal, "metal is the default");
    assert.equal(D.renderEmblem(`${id}/line`), line, "a style can ride on the id");
  }
});

test("size, tint and theme are options, and a hostile one does nothing", () => {
  const id = "award:medal";
  assert.match(D.renderEmblem(id), /width="64" height="64"/);
  assert.match(D.renderEmblem(id, { size: 20 }), /width="20" height="20"/);
  assert.match(D.renderEmblem(id, { size: -4 }), /width="64"/);
  assert.match(D.renderEmblem(id, { size: Number.NaN }), /width="64"/);
  assert.match(D.renderEmblem(id, { size: 1e9 }), /width="4096"/);
  assert.match(D.renderEmblem(id, { style: "color", tint: "#c8102e" }), /#c8102e/);
  assert.match(D.renderEmblem(id, { style: "color", tint: "rgb(200, 16, 46)" }), /#c8102e/);
  const hostile = D.renderEmblem(id, { style: "color", tint: '"><script>alert(1)</script>' });
  assert.equal(hostile, D.renderEmblem(id, { style: "color" }));
  assert.doesNotMatch(hostile, /script/);
  assert.equal(D.renderEmblem(id, { style: "wild" as never }), D.renderEmblem(id));
  assert.doesNotMatch(D.renderEmblem(id), / color="/, "inherit leaves the colour to the page");
  assert.match(D.renderEmblem(id, { theme: "dark" }), / color="#eef1f3"/);
  assert.match(D.renderEmblem(id, { theme: "light" }), / color="#20262d"/);
  assert.match(D.renderEmblem(id, { theme: "auto" }), /prefers-color-scheme:dark/);
});

test("a reference is an id, an id with a style, or the emblem; anything else is an error that says what an id looks like", () => {
  assert.deepEqual(D.parseEmblem("award:medal/line"), { id: "award:medal", style: "line" });
  assert.deepEqual(D.parseEmblem(" ball:soccer "), { id: "ball:soccer", style: undefined });
  for (const bad of ["", "medal", "award:medal/neon", "award:medal/", "__proto__", "constructor", "toString", 7, null, undefined, "x".repeat(200)]) assert.equal(D.parseEmblem(bad), undefined, String(bad));
  assert.equal(D.isEmblemId("ball:soccer"), true);
  assert.equal(D.isEmblemId("ball:soccer/line"), false);
  assert.throws(() => D.renderEmblem("ball:nonesuch"), /Unknown emblem "ball:nonesuch".*"award:medal"/);
  assert.equal(D.renderEmblem(D.AWARD_MEDAL), D.renderEmblem("award:medal"));
  assert.equal(D.emblemSvg("ball:soccer"), D.renderEmblem("ball:soccer"));
});

test("the registry, the names and the info agree", () => {
  assert.deepEqual(Object.keys(D.EMBLEMS), [...D.EMBLEM_IDS]);
  for (const id of D.EMBLEM_IDS) {
    const info = D.emblemInfo(id);
    assert.equal(info.id, id);
    assert.match(info.en, /^[A-Z]/);
    assert.match(info.ja, /\S/);
    assert.equal(D.emblemName(id, "ja"), info.ja);
    assert.equal(D.EMBLEMS[id], D.renderEmblem(id));
    assert.ok(D.emblemModel(id) !== undefined);
    assert.equal(D.EMBLEM_TABLE[id].id, id);
  }
});
