import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { EMBLEM_STYLES } from "../src/index.ts";
import { lum, readColour } from "../src/emblems/emblem.core.ts";
import { wellFormed } from "./helpers.ts";

const contrast = (a: string, b: string): number => {
  const [la, lb] = [lum(readColour(a) as [number, number, number]), lum(readColour(b) as [number, number, number])];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
/** Nothing that can run, load or link: an emblem is shapes, a title and (for a crest) letters. */
const UNSAFE = /<script|<foreignObject|<image|<a[\s>]|<iframe|\son[a-z]+\s*=|javascript:|data:|https?:|url\((?!#)|@import|<!\[CDATA/i;
const THEMES = ["inherit", "auto", "light", "dark"] as const;
// The aim is 3 kB of markup for an emblem in the metal style; the most detailed trophies are over it, and this is the limit they must stay under.
const METAL_LIMIT = 4500;
const LINE_LIMIT = 2600;
const COLOR_LIMIT = 3200;
// A ball is drawn in 3D with its own panels, seams and shading, and a piece of gear is a detailed drawing in layers: they are bigger, and are held to limits of their own.
const BIG_LIMIT = { metal: 14000, line: 13000, color: 14000 } as const;
const isPiece = (id: D.EmblemId): boolean => D.emblemInfo(id).kind === "ball" || D.emblemInfo(id).kind === "gear";

test("the ids number 261 in their groups, with no id twice, and the groups hold what they say", () => {
  assert.equal(new Set(D.EMBLEM_IDS).size, D.EMBLEM_IDS.length);
  assert.equal(D.EMBLEM_IDS.length, 261);
  assert.deepEqual(Object.fromEntries(Object.entries(D.EMBLEM_GROUPS).map(([group, ids]) => [group, ids.length])), { award: 5, trophy: 24, medal: 6, crest: 4, ball: 116, puck: 8, gear: 59, sport: 38, pennant: 1 });
});

test("no id, title or name is a real trophy, mark or competition", () => {
  const text = JSON.stringify(D.EMBLEM_IDS.map((id) => D.emblemInfo(id)));
  for (const real of [/stanley/i, /lombardi/i, /grey cup/i, /fifa/i, /world cup/i, /world series/i, /olympic/i, /larry/i, /o'brien/i, /commissioner/i, /nhl cup/i, /davis/i, /ashes/i, /webb ellis/i, /wimbledon/i, /rosewater/i, /\bnike\b/i, /adidas/i]) assert.doesNotMatch(text, real);
});

test("a trophy or an award has a short name, and the short name is the full id", () => {
  assert.equal(D.EMBLEM_ALIASES.cup, "trophy:cup");
  assert.equal(D.EMBLEM_ALIASES.crown, "award:crown");
  assert.equal(Object.keys(D.EMBLEM_ALIASES).length, D.TROPHY_IDS.length + D.AWARD_IDS.length);
  assert.equal(D.renderEmblem("cup"), D.renderEmblem("trophy:cup"));
  assert.equal(D.renderEmblem("crown/line"), D.renderEmblem("award:crown", { style: "line" }));
});

test("every emblem draws well-formed, titled, safe SVG in every style and theme, and the same call gives the same string", () => {
  for (const id of D.EMBLEM_IDS) {
    const info = D.emblemInfo(id);
    assert.ok(info.en.length > 2 && info.ja.length > 0, id);
    for (const style of EMBLEM_STYLES) {
      for (const theme of THEMES) {
        const svg = D.renderEmblem(id, { style, theme });
        const where = `${id} ${style} ${theme}`;
        assert.equal(wellFormed(svg), null, where);
        assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="'), where);
        assert.equal(svg, D.renderEmblem(id, { style, theme }), where);
        assert.ok(svg.includes(`<title>${info.en}</title>`), where);
        assert.match(svg, /role="img"/);
        assert.doesNotMatch(svg.replace(' xmlns="http://www.w3.org/2000/svg"', ""), UNSAFE, where);
        assert.doesNotMatch(svg, /NaN|undefined|Infinity|null/, where);
      }
      const size = D.renderEmblem(id, { style }).length;
      assert.ok(size < (isPiece(id) ? BIG_LIMIT[style] : style === "metal" ? METAL_LIMIT : style === "line" ? LINE_LIMIT : COLOR_LIMIT), `${id} ${style} is ${size} bytes`);
    }
  }
});

test("the three styles differ: metal has a gradient, line has no fill, color is flat", () => {
  for (const id of D.EMBLEM_IDS) {
    const metal = D.renderEmblem(id, { style: "metal" });
    const line = D.renderEmblem(id, { style: "line" });
    const color = D.renderEmblem(id, { style: "color" });
    // A pictogram of a sport is drawn in the page's ink and a few flat colours, so it has no gradient. A ball and a piece of gear are shaded drawings in `metal` and in `color` alike (their gradients have ids of their own).
    if (!isPiece(id)) {
      if (D.emblemInfo(id).kind !== "icon") assert.match(metal, /Gradient id="dgs/, id);
      assert.doesNotMatch(color.replace(/<clipPath[\s\S]*?<\/clipPath>|clip-path="url\(#[^)]*\)"/g, ""), /Gradient|url\(#/, id);
      if (D.emblemInfo(id).kind !== "icon") assert.notEqual(metal, color, id);
    }
    assert.doesNotMatch(line.replace(/<clipPath[\s\S]*?<\/clipPath>|clip-path="url\(#[^)]*\)"/g, ""), /Gradient|url\(#/, id);
    assert.notEqual(line, color, id);
    assert.equal(D.renderEmblem(id), metal, "metal is the default");
    assert.equal(D.renderEmblem(`${id}/line`), line, "a style can ride on the id");
  }
});

test("the line style is one colour, the page's, so it reads at 14 pixels on any page", () => {
  for (const id of D.EMBLEM_IDS) {
    const svg = D.renderEmblem(id, { style: "line", size: 14 });
    assert.ok(svg.includes('width="14" height="14"'));
    assert.ok(svg.replace(/<title>.*<\/title>/, "").match(/#[0-9a-f]{6}/i) === null || D.emblemInfo(id).kind === "ball" || /stroke="#20262d"/.test(svg), `${id} has a colour in the line style`);
    assert.ok(svg.includes('stroke="currentColor"') || svg.includes("fill=\"currentColor\""), id);
  }
});

test("a metal emblem has no heavy ink outline: its edge is a darker tone of its own metal", () => {
  for (const id of D.EMBLEM_IDS.filter((x) => ["lathe", "flat"].includes(D.emblemInfo(x).kind))) {
    const svg = D.renderEmblem(id);
    const group = /<g fill="none" stroke="([^"]+)" stroke-width="([\d.]+)"/.exec(svg);
    assert.ok(group, id);
    assert.notEqual(group[1], "currentColor", id);
    assert.ok(Number(group[2]) <= 1, `${id} outline is ${group[2]}`);
  }
});

test("size, tint, accent and theme are options, and a hostile one does nothing", () => {
  const id = "trophy:hockey-cup";
  assert.match(D.renderEmblem(id), /width="64" height="64"/);
  assert.match(D.renderEmblem(id, { size: 20 }), /width="20" height="20"/);
  assert.match(D.renderEmblem(id, { size: -4 }), /width="64"/);
  assert.match(D.renderEmblem(id, { size: Number.NaN }), /width="64"/);
  assert.match(D.renderEmblem(id, { size: 1e9 }), /width="4096"/);
  assert.match(D.renderEmblem(id, { style: "color", tint: "#c8102e" }), /#c8102e/);
  assert.match(D.renderEmblem(id, { style: "color", tint: "rgb(200, 16, 46)" }), /#c8102e/);
  const hostile = D.renderEmblem(id, { style: "color", tint: '"><script>alert(1)</script>', accent: "red;fill:url(x)" });
  assert.equal(hostile, D.renderEmblem(id, { style: "color" }));
  assert.doesNotMatch(hostile, /script/);
  assert.equal(D.renderEmblem(id, { style: "wild" as never }), D.renderEmblem(id));
  assert.doesNotMatch(D.renderEmblem(id), / color="/, "inherit leaves the colour to the page");
  assert.match(D.renderEmblem(id, { theme: "dark" }), / color="#eef1f3"/);
  assert.match(D.renderEmblem(id, { theme: "light" }), / color="#20262d"/);
  assert.match(D.renderEmblem(id, { theme: "auto" }), /prefers-color-scheme:dark/);
  assert.match(D.renderEmblem("medal:gold", { style: "color", accent: "#1f5fa8" }), /^(?!.*\bundefined\b)/);
  assert.match(D.renderEmblem("trophy:rosette", { style: "color", accent: "#1f5fa8" }), /fill="#1f5fa8"/);
  assert.notEqual(D.renderEmblem(id, { tint: "#c8102e" }), D.renderEmblem(id, { tint: "#1f5fa8" }));
});

test("a tint is the colour of the metal's gradient, so two tints in a page do not share one", () => {
  const ids = (svg: string): string[] => [...svg.matchAll(/id="(dgs[a-z0-9]+)"/g)].map((m) => m[1] as string);
  assert.notDeepEqual(ids(D.renderEmblem("trophy:hockey-cup", { tint: "#c8102e" })), ids(D.renderEmblem("trophy:hockey-cup", { tint: "#1f5fa8" })));
  assert.deepEqual(ids(D.renderEmblem("trophy:hockey-cup")), ids(D.renderEmblem("trophy:hockey-cup")));
});

test("ink reads on its page at 4.5 to 1 or better, in both themes", () => {
  assert.ok(contrast(D.EMBLEM_INK.light, D.EMBLEM_PAGE.light) > 4.5);
  assert.ok(contrast(D.EMBLEM_INK.dark, D.EMBLEM_PAGE.dark) > 4.5);
});

test("a reference is an id, a short name, either with a style, or the emblem; anything else is an error that says what an id looks like", () => {
  assert.deepEqual(D.parseEmblem("medal:gold/line"), { id: "medal:gold", style: "line" });
  assert.deepEqual(D.parseEmblem(" ball:soccer "), { id: "ball:soccer", style: undefined });
  assert.deepEqual(D.parseEmblem("crown/metal"), { id: "award:crown", style: "metal" });
  for (const bad of ["", "gold", "medals", "award:medal/neon", "award:medal/", "/award:medal", "__proto__", "constructor", "toString", "trophy:cup;<script>", 7, null, undefined, "x".repeat(200)]) assert.equal(D.parseEmblem(bad), undefined, String(bad));
  assert.equal(D.isEmblemId("ball:soccer"), true);
  assert.equal(D.isEmblemId("ball:soccer/line"), false);
  assert.equal(D.isEmblemId("cup"), false);
  assert.throws(() => D.renderEmblem("ball:nonesuch"), /Unknown emblem "ball:nonesuch".*"trophy:cup"/);
  assert.equal(D.renderEmblem(D.MEDAL_GOLD), D.renderEmblem("medal:gold"));
  assert.equal(D.emblemSvg("ball:soccer"), D.renderEmblem("ball:soccer"));
});

test("the registry, the names and the info agree, in English and in Japanese", () => {
  assert.deepEqual(Object.keys(D.EMBLEMS), [...D.EMBLEM_IDS]);
  for (const id of D.EMBLEM_IDS) {
    const info = D.emblemInfo(id);
    assert.equal(info.id, id);
    assert.match(info.en, /^[A-Z]/);
    assert.match(info.ja, /\S/);
    assert.equal(D.emblemName(id, "ja"), info.ja);
    assert.equal(D.emblemName(id), info.en);
    assert.equal(D.EMBLEMS[id], D.renderEmblem(id));
    assert.ok(D.emblemModel(id) !== undefined);
    assert.equal(D.EMBLEM_TABLE[id].id, id);
  }
});

test("the helpers draw a crest of each shape with the colours and the letters, a medal of each kind, and an icon for each sport", () => {
  for (const shape of D.CREST_SHAPES) {
    const svg = D.crest({ shape, colors: ["#c8102e", "#f4f0e4"], initials: "no" });
    assert.ok(svg.includes("#c8102e") && svg.includes("#f4f0e4"), shape);
    assert.ok(svg.includes(">NO<"), shape);
    assert.ok(!D.crest({ shape }).includes("<text"), shape);
  }
  assert.equal(D.crest(), D.renderEmblem("crest:shield"));
  assert.ok(!D.crest({ initials: "<b>" }).includes("<b>"));
  assert.ok(D.crest({ initials: "ABCDE" }).includes(">ABC<"));
  assert.equal(D.crest({ shape: "nope" as never }), D.renderEmblem("crest:shield"));
  for (const kind of D.MEDAL_KINDS) assert.equal(D.medal(kind), D.renderEmblem(`medal:${kind}`));
  assert.equal(D.medal("nope" as never), D.renderEmblem("medal:gold"));
  for (const sport of D.SPORT_NAMES) assert.equal(D.sportIcon(sport), D.renderEmblem(`sport:${sport}`));
  assert.throws(() => D.sportIcon("quidditch" as never), /Unknown sport/);
  assert.throws(() => D.sportIcon("__proto__" as never), /Unknown sport/);
});

test("the letters of a crest read on its colour whatever the colour is", () => {
  for (const colour of ["#c8102e", "#f4f0e4", "#14233f", "#f2c230", "#1f8a5b", "#ffffff", "#000000", "#7a7a7a", "rgb(200, 30, 30)"]) {
    for (const shape of D.CREST_SHAPES) {
      const svg = D.crest({ shape, colors: colour, initials: "ab" });
      const fill = /<text[^>]*fill="(#[0-9a-f]{6})"/.exec(svg)?.[1] as string;
      assert.ok(contrast(fill, colour) > 4.5, `${shape} ${colour}`);
    }
  }
});
