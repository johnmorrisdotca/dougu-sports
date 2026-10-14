import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { lum, readColour } from "../src/emblems/emblem.core.ts";
import { wellFormed } from "./helpers.ts";

type Rgb = readonly [number, number, number];
const contrast = (a: string, b: string): number => {
  const [la, lb] = [lum(readColour(a) as Rgb), lum(readColour(b) as Rgb)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const texts = (svg: string): string[] => [...new Set([...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1] as string))];
/** The fill of the first piece of text: the number on the front, the name on the back. */
const textFill = (svg: string): string => /<text[^>]* fill="(#[0-9a-f]{6})"/.exec(svg)?.[1] as string;
const CUTS = D.JERSEY_CUTS;

test("there are five cuts, one for each sport, and each is an emblem of its own", () => {
  assert.deepEqual([...CUTS], ["hockey", "basketball", "soccer", "baseball", "football"]);
  assert.deepEqual(D.JERSEY_IDS, CUTS.map((c) => `jersey:${c}`));
  for (const cut of CUTS) {
    assert.equal(D.emblemInfo(`jersey:${cut}`).kind, "flat");
    assert.equal(D.emblemInfo(`jersey:${cut}`).source, "ours");
    assert.ok(D.emblemName(`jersey:${cut}`, "ja").length > 3);
  }
  assert.deepEqual([...D.JERSEY_PATTERNS], ["solid", "stripes", "hoops", "halves", "sash", "yoke", "pinstripes"]);
});

test("jersey() takes the cut as `style`, or the finish there and the cut in `cut`, and colours as a list or one colour", () => {
  for (const cut of CUTS) assert.equal(D.jersey({ style: cut }), D.renderEmblem(`jersey:${cut}`), cut);
  assert.equal(D.jersey(), D.renderEmblem("jersey:hockey"));
  assert.equal(D.jersey({ style: "nonesuch" as never }), D.jersey());
  assert.equal(D.jersey({ style: "line" }), D.renderEmblem("jersey:hockey", { style: "line" }));
  assert.equal(D.jersey({ style: "line", cut: "soccer" }), D.renderEmblem("jersey:soccer", { style: "line" }));
  assert.equal(D.jersey({ style: "baseball", render: "color" }), D.renderEmblem("jersey:baseball", { style: "color" }));
  const dressed = D.jersey({ style: "soccer", colors: ["#c8102e", "#f4f0e4", "#102030"], number: 9 });
  assert.ok(dressed.includes('fill="#c8102e"') && dressed.includes("#f4f0e4") && !dressed.includes("#102030"), "the colours reach the drawing (the third only if it reads)");
  assert.ok(D.jersey({ style: "soccer", colors: ["#c8102e", "#f4f0e4", "#ffffff"], number: 9 }).includes('fill="#ffffff"'), "a number colour that reads is used");
  assert.equal(D.jersey({ colors: "#c8102e" }), D.jersey({ colors: ["#c8102e"] }));
  assert.equal(D.jersey({ colors: ["not a colour", "red;fill:url(x)"] }), D.jersey());
  assert.ok(D.jersey({ size: 30 }).includes('width="30"'));
  assert.equal(D.jersey({ yaw: 0 }), D.jersey());
  assert.notEqual(D.jersey({ yaw: 120 }), D.jersey());
  assert.equal(D.jersey({ yaw: 120, number: 5 }), D.emblemFrame("jersey:hockey", { yaw: 120, number: 5 }));
  assert.equal(D.jersey({ view: "back", number: 5 }), D.renderEmblem("jersey:hockey", { view: "back", number: 5 }));
});

test("a number is up to two digits, front and back, and a name is on the back only", () => {
  for (const cut of CUTS) {
    const front = D.renderEmblem(`jersey:${cut}`, { number: 23, name: "Tanaka" });
    const back = D.renderEmblem(`jersey:${cut}`, { number: 23, name: "Tanaka", view: "back" });
    assert.deepEqual(texts(front), ["23"], `${cut}: the front has the number only`);
    assert.deepEqual(texts(back), ["TANAKA", "23"], `${cut}: the back has the name above the number`);
    assert.deepEqual(texts(D.renderEmblem(`jersey:${cut}`)), [], `${cut}: no number, no text`);
  }
  assert.deepEqual(texts(D.renderEmblem("jersey:soccer", { number: "007" })), ["00"], "two digits at most");
  assert.deepEqual(texts(D.renderEmblem("jersey:soccer", { number: "A7B" })), ["7"], "digits only");
  assert.deepEqual(texts(D.renderEmblem("jersey:soccer", { number: "XYZ" })), []);
  assert.deepEqual(texts(D.renderEmblem("jersey:soccer", { number: 0 })), ["0"]);
  assert.deepEqual(texts(D.renderEmblem("jersey:soccer", { number: {} as never, name: 5 as never, view: "back" })), ["5"]);
  assert.deepEqual(texts(D.renderEmblem("jersey:soccer", { name: "田中", view: "back" })), ["田中"], "Japanese names are kept");
  const hostile = D.renderEmblem("jersey:hockey", { number: '<script>alert(1)</script>', name: '<script>alert(1)</script>"&', view: "back" });
  assert.doesNotMatch(hostile, /<script/);
  assert.equal(wellFormed(hostile), null);
  assert.ok(texts(D.renderEmblem("jersey:hockey", { name: "x".repeat(80), view: "back" }))[0]?.length === 24, "a name is 24 letters at most");
});

test("the number reads at 4.5 to 1 on the shirt: the colour asked for if it does, else the best of black, white and a tone of the shirt", () => {
  const shirts = ["#000000", "#ffffff", "#808080", "#777777", "#c8102e", "#0b6e4f", "#f2c230", "#1f4e8c", "#ff00ff", "#00ffff", "#333333", "#a0a0a0"];
  for (const main of shirts) {
    for (const given of [undefined, "#f4f0e4", "#c8102e", "#777777", "#000000", "#ffffff"]) {
      for (const cut of CUTS) {
        const svg = D.renderEmblem(`jersey:${cut}`, { tint: main, accent: "#f4f0e4", numberColor: given, number: 88, style: "color" });
        assert.ok(contrast(textFill(svg), main) >= 4.5, `${cut} ${main} with ${given}: ${textFill(svg)} is ${contrast(textFill(svg), main).toFixed(2)} to 1`);
      }
    }
  }
  assert.equal(textFill(D.renderEmblem("jersey:hockey", { tint: "#1f4e8c", numberColor: "#ffffff", number: 7 })), "#ffffff", "a colour that reads is kept");
  assert.equal(textFill(D.renderEmblem("jersey:hockey", { tint: "#1f4e8c", accent: "#f2c230", number: 7 })), "#f2c230", "the trim is the default when it reads");
  assert.notEqual(textFill(D.renderEmblem("jersey:hockey", { tint: "#1f4e8c", numberColor: "#203060", number: 7 })), "#203060", "one that does not is replaced");
  assert.match(D.renderEmblem("jersey:hockey", { number: 7, style: "line" }), /<text[^>]* fill="currentColor"/, "the line style is the page's ink");
});

test("a pattern is one of seven, in the second colour, clipped to the shirt, under the trim and the number", () => {
  const solid = D.renderEmblem("jersey:soccer");
  assert.equal(D.renderEmblem("jersey:soccer", { stripes: "solid" }), solid);
  assert.equal(D.renderEmblem("jersey:soccer", { stripes: false }), solid);
  assert.equal(D.renderEmblem("jersey:soccer", { stripes: true }), D.renderEmblem("jersey:soccer", { stripes: "stripes" }));
  assert.equal(D.renderEmblem("jersey:soccer", { stripes: "nonesuch" as never }), solid);
  const seen = new Set<string>();
  for (const cut of CUTS) {
    for (const pattern of D.JERSEY_PATTERNS) {
      for (const style of D.EMBLEM_STYLES) {
        const svg = D.renderEmblem(`jersey:${cut}`, { stripes: pattern, style, tint: "#1f4e8c", accent: "#f2c230", number: 12, name: "Ono" });
        assert.equal(wellFormed(svg), null, `${cut} ${pattern} ${style}`);
        if (pattern !== "solid") assert.notEqual(svg, D.renderEmblem(`jersey:${cut}`, { style, tint: "#1f4e8c", accent: "#f2c230", number: 12, name: "Ono" }), `${cut} ${pattern} ${style}`);
        assert.ok(svg.length < 5600, `${cut} ${pattern} ${style} is ${svg.length} bytes`);
        // Every clip a shape names is defined.
        for (const ref of svg.matchAll(/clip-path="url\(#([^)]+)\)"/g)) assert.ok(svg.includes(`<clipPath id="${ref[1]}"`), `${cut} ${pattern}`);
        if (style === "color") seen.add(svg);
      }
    }
  }
  assert.ok(seen.size === CUTS.length * D.JERSEY_PATTERNS.length, "every cut and pattern is its own drawing");
  assert.ok(D.renderEmblem("jersey:hockey", { stripes: "halves", accent: "#f2c230", style: "color" }).includes('d="M0 0H32V64H0Z" fill="#f2c230"'), "halves are one half in the second colour");
  assert.ok((D.renderEmblem("jersey:hockey", { stripes: "pinstripes", style: "color" }).match(/M\d+(\.\d)? 6V58/g) ?? []).length === 14, "fourteen pinstripes");
});

test("the trim is the cut's own bands in the second colour, on by default for four cuts, and the option turns it on or off", () => {
  for (const cut of ["hockey", "basketball", "baseball", "football"] as const) assert.notEqual(D.renderEmblem(`jersey:${cut}`), D.renderEmblem(`jersey:${cut}`, { trim: false }), cut);
  assert.equal(D.renderEmblem("jersey:soccer"), D.renderEmblem("jersey:soccer", { trim: false }), "soccer's is off by default");
  assert.notEqual(D.renderEmblem("jersey:soccer"), D.renderEmblem("jersey:soccer", { trim: true }));
  assert.equal(D.jersey({ style: "football", trim: false }), D.renderEmblem("jersey:football", { trim: false }));
});

test("the front of a jersey and its back are different drawings, and a baseball jersey has its buttons on the front only", () => {
  for (const cut of CUTS) assert.notEqual(D.renderEmblem(`jersey:${cut}`), D.renderEmblem(`jersey:${cut}`, { view: "back" }), cut);
  const buttons = (svg: string): boolean => svg.includes("a.9 .9 0 1 0 0 .01Z");
  assert.ok(buttons(D.renderEmblem("jersey:baseball")));
  assert.ok(!buttons(D.renderEmblem("jersey:baseball", { view: "back" })));
  assert.ok(!buttons(D.renderEmblem("jersey:baseball", { style: "line" })), "the line style leaves the small details out");
  // The neck is another opening in front and behind.
  const neck = (cut: string, view: "front" | "back"): string => /<path d="([^"]*)" fill="#[0-9a-f]{6}" stroke="none"\/><path d="[^"]*" fill="none" stroke="#f4f0e4"/.exec(D.renderEmblem(`jersey:${cut}` as D.EmblemId, { view, style: "color" }))?.[1] as string;
  for (const cut of CUTS) assert.ok(neck(cut, "front") !== undefined && neck(cut, "front") !== neck(cut, "back"), cut);
});

test("a jersey is generic: its titles name a sport and a garment, never a team, a league or a maker", () => {
  const text = JSON.stringify(D.JERSEY_IDS.map((id) => D.emblemInfo(id)));
  for (const real of [/maple/i, /yankee/i, /lakers/i, /manchester/i, /nike/i, /adidas/i, /canadiens/i, /bruins/i, /nhl/i, /nba/i, /mlb/i, /nfl/i]) assert.doesNotMatch(text, real);
});
