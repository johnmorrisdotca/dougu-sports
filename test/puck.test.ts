// The printed pucks: the face is drawn on the top of the puck in 3D (it foreshortens, turns with the puck and is gone when the top is turned away), the text is our own vector lettering, an image from outside is
// made safe, a signature is a pure function of its seed, and nothing the caller gives can break out of the markup or leave the box.
import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { arcPath, glyphOf, linePath, textWidth } from "../src/emblems/ball/ball.letters.ts";
import { safeImage } from "../src/emblems/ball/ball.image.ts";
import { signaturePath } from "../src/emblems/ball/ball.signature.ts";
import { type Box, inkBox, viewBoxOf } from "./svgbox.ts";

const PUCKS = D.PUCK_IDS;
/** A drawing with its id prefix (which names the face it was made from) made the same, so two faces that draw the same compare equal. */
const sameIds = (svg: string): string => {
  const prefix = /id="(k[0-9a-z]+)pclip"/.exec(svg)?.[1];
  return prefix === undefined ? svg : svg.replaceAll(prefix, "K");
};
const printedIn = (svg: string): boolean => svg.includes("matrix(");
/** The determinant of the matrix that lays the face on the top: the area of the face on the screen, a fraction of its flat size. */
function faceArea(svg: string): number {
  const m = /<g transform="matrix\(([^)]+)\)">/.exec(svg);
  assert.ok(m !== null, "no print");
  const [a, b, c, d] = (m[1] as string).split(" ").map(Number) as [number, number, number, number];
  return Math.abs(a * d - b * c);
}
const past = (ink: Box, view: Box): number => Math.max(0, view.x0 - ink.x0, view.y0 - ink.y0, ink.x1 - view.x1, ink.y1 - view.y1);

test("there are eight printed pucks, each a piece with its own id, name in two languages and the plain puck's size", () => {
  assert.deepEqual([...PUCKS], ["puck:canada", "puck:canada-red", "puck:canada-white", "puck:usa", "puck:usa-navy", "puck:player", "puck:signed", "puck:souvenir"]);
  const plain = D.emblemInfo("ball:puck");
  for (const id of PUCKS) {
    const info = D.emblemInfo(id);
    assert.equal(info.kind, "ball");
    assert.deepEqual(info.size, plain.size, id);
    assert.ok(info.en.length <= 26 && info.ja.length <= 12, `${id}: ${info.en} / ${info.ja}`);
    assert.ok(D.renderEmblem(id).includes(`<title>${info.en}</title>`), id);
    assert.ok(D.renderEmblem(id, { locale: "ja" }).includes(`<title>${info.ja}</title>`), id);
    assert.ok(info.description !== undefined, `${id} has no description`);
  }
  assert.ok(D.isBallId("puck:canada") && D.isBallId("ball:puck") && !D.isBallId("puck:nothing"));
  assert.ok(D.ballFrame("puck:usa", { yaw: 30 }).startsWith("<svg"));
  assert.ok(D.lineup(["ball:puck", "puck:canada", "puck:usa"], { height: 60 }).includes("<title>Balls at their true relative sizes"));
});

test("the plain puck stays plain; a printed puck has its print on the top, in colour, and the line style leaves it out", () => {
  assert.ok(!printedIn(D.renderEmblem("ball:puck")));
  for (const id of PUCKS) {
    const svg = D.renderEmblem(id, { size: 128 });
    assert.ok(printedIn(svg), id);
    assert.ok(svg.includes("<clipPath"), id);
    assert.ok(!printedIn(D.renderEmblem(id, { style: "line" })), `${id} in line`);
    assert.equal(D.renderEmblem(id, { size: 128 }), svg, `${id} is a pure function`);
  }
  // The designs say what they are: the flag with its leaf and CANADA below, the stripes, a number.
  assert.ok(D.renderEmblem("puck:canada").includes("#d52b1e"));
  assert.ok(D.renderEmblem("puck:usa").includes("#b31942"));
  assert.ok(D.renderEmblem("puck:usa").includes("<polygon"), "stars");
  assert.ok(D.renderEmblem("puck:player").includes("#f2b705"));
});

test("the print turns with the puck: it foreshortens as the top tips, and is gone when the top is turned away", () => {
  for (const id of PUCKS) {
    const flat = faceArea(D.emblemFrame(id, { pitch: 40 }));
    const tipped = faceArea(D.emblemFrame(id, { pitch: 10 }));
    const nearly = faceArea(D.emblemFrame(id, { pitch: -10 }));
    assert.ok(flat > tipped && tipped > nearly && nearly > 0, `${id}: ${flat} ${tipped} ${nearly}`);
    // Yaw turns the face about its own axis: a quarter turn puts what was at the top at the side, so the text's matrix changes while its area does not.
    const a = D.emblemFrame(id, { pitch: 40, yaw: 0 }), b = D.emblemFrame(id, { pitch: 40, yaw: 90 });
    assert.notEqual(a, b);
    assert.ok(Math.abs(faceArea(a) / faceArea(b) - 1) < 1e-3, `${id}: yaw keeps the face's area`);
    // Turned over, the bottom is plain rubber.
    assert.ok(!printedIn(D.emblemFrame(id, { pitch: -70 })), `${id}: the bottom has no print`);
    assert.ok(!printedIn(D.emblemFrame(id, { yaw: 200, pitch: -70 })), `${id}: nor on a yaw of 200`);
  }
});

test("no frame of a printed puck is cut off, with the default print and with a face that asks for the most", () => {
  const faces = [
    undefined,
    { image: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#123456"/></svg>`, ringText: "A VERY LONG LINE OF WORDS ROUND THE EDGE OF IT", text: "MMMMMMMMMMMMMMMMMMMMMMMM", number: 888, name: "WWWWWWWWWWWWWW", signature: "x" },
  ];
  for (const id of PUCKS) {
    for (const face of faces) {
      let worst = 0;
      const sizes = new Set<string>();
      for (const yaw of [0, 45, 90, 135, 180, 225, 270, 315]) {
        for (const pitch of [-60, -20, 0, 20, 60]) {
          for (const roll of [0, 60, -120]) {
            const svg = D.emblemFrame(id, { yaw, pitch, roll, face });
            assert.ok(!svg.includes("NaN") && !svg.includes("undefined"), `${id}`);
            const ink = inkBox(svg);
            assert.ok(ink !== undefined);
            const view = viewBoxOf(svg);
            sizes.add(`${view.x0} ${view.x1}`);
            worst = Math.max(worst, past(ink, view) - 0.005 * (view.x1 - view.x0));
          }
        }
      }
      assert.ok(worst <= 0, `${id}: ${worst.toFixed(2)} past the box`);
      assert.equal(sizes.size, 1, `${id} changes its box as it turns`);
    }
  }
});

test("the lettering is our own glyphs: strokes with no font, wide, on a line or on an arc, and a character with no glyph is left out", () => {
  const A = glyphOf("a"), a = glyphOf("A");
  assert.ok(A !== undefined && A === a, "a lower-case letter is its capital");
  assert.equal(glyphOf("é"), glyphOf("E"));
  assert.equal(glyphOf("カ"), undefined);
  assert.equal(glyphOf("•"), glyphOf("·"));
  const o = { size: 0.2, weight: 0.2 };
  assert.equal(linePath("カナダ", o, 0, 0), "");
  assert.ok(textWidth("CANADA", { ...o, wide: 1.4 }) > textWidth("CANADA", { ...o, wide: 1 }));
  assert.ok(linePath("CANADA", o, 0, 0).startsWith("M"));
  assert.ok(!/NaN|undefined/.test(linePath("A-Z 0-9 . , ' / : & ·", o, 0, 0)));
  // Centred: the middle of the points of a straight line is the point asked for.
  const nums = (linePath("HH", { size: 0.2, weight: 0.12 }, 0.3, 0.1).match(/-?\d+\.?\d*/g) ?? []).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
  assert.ok(Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - 0.3) < 0.02);
  assert.ok(Math.abs((Math.min(...ys) + Math.max(...ys)) / 2 - 0.1) < 0.02);
  // An arc keeps every point within the ring's band, on the top (reading outward) and on the bottom.
  for (const inside of [false, true]) {
    const pts = (arcPath("ICE HOCKEY", { size: 0.1, weight: 0.17 }, 0.85, inside ? 180 : 0, inside) .match(/-?\d+\.?\d*/g) ?? []).map(Number);
    for (let i = 0; i + 1 < pts.length; i += 2) {
      const r = Math.hypot(pts[i] as number, pts[i + 1] as number);
      assert.ok(r > 0.78 && r < 0.92, `${inside}: radius ${r}`);
      // The top text is in the upper half and the bottom text in the lower.
      assert.ok(inside ? (pts[i + 1] as number) > 0 : (pts[i + 1] as number) < 0.05, `${inside}: y ${pts[i + 1]}`);
    }
  }
});

test("a signature is made by a seeded pen: the same seed draws the same stroke, another seed another, and a stroke is a path with no real hand in it", () => {
  assert.equal(signaturePath(7), signaturePath(7));
  assert.equal(signaturePath("Ace"), signaturePath("Ace"));
  assert.notEqual(signaturePath(7), signaturePath(8));
  assert.notEqual(signaturePath("a"), signaturePath("b"));
  for (const seed of [0, 1, -3, 99999, "", "日本", 0.5]) {
    const d = signaturePath(seed);
    assert.match(d, /^M[-\d. C]+/, String(seed));
    assert.ok(!/NaN/.test(d), String(seed));
  }
  // It sits in the face: every point of the stroke, scaled and turned as the face does it, stays inside the print's disc.
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const pts = (signaturePath(seed).match(/-?\d+\.?\d*/g) ?? []).map(Number);
    for (let i = 0; i + 1 < pts.length; i += 2) assert.ok(Math.hypot((pts[i] as number) * 1.12, (pts[i + 1] as number) * 1.12 + 0.2) < 0.97, `seed ${seed}`);
  }
  // On the puck: the same seed gives the same print, `false` and no seed give none, and the colour is the caller's.
  const signed = (face: D.PuckFace): string => D.renderEmblem("puck:souvenir", { face });
  assert.equal(signed({ signature: 5 }), signed({ signature: 5 }));
  assert.notEqual(signed({ signature: 5 }), signed({ signature: 6 }));
  assert.ok(signed({ signature: 5 }).includes("stroke-linecap=\"round\""));
  assert.ok(!signed({ signature: false }).includes("stroke-linecap=\"round\""));
  assert.equal(sameIds(signed({ signature: false })), sameIds(signed({})));
  assert.ok(signed({ signature: 5, colors: { signature: "#112233" } }).includes("#112233"));
  assert.ok(D.renderEmblem("puck:signed").includes("#e8b923"), "gold by default");
  assert.notEqual(D.renderEmblem("puck:signed"), D.renderEmblem("puck:usa-navy"));
});

test("whatever the caller gives is escaped or dropped: text is only ever drawn as strokes, and a title is escaped", () => {
  const evil = `"><script>alert(1)</script><svg onload="alert(2)">&amp; ' \u0000 \n`;
  for (const id of PUCKS) {
    const svg = D.renderEmblem(id, { title: evil, face: { text: evil, ringText: [evil, evil], name: evil, number: evil, signature: evil, flag: evil, emblem: evil, colors: [evil, evil, evil, evil, evil] } });
    assert.ok(!/<script|onload=|<svg[^>]*onload/i.test(svg.replace(/<title>[^<]*<\/title>/, "")), id);
    assert.ok(!/<script/.test(svg), id);
    assert.ok(!svg.includes("NaN"), id);
    const inner = svg.slice(svg.indexOf("</title>"));
    assert.ok(!inner.includes("<text"), `${id}: the lettering is paths`);
    assert.match(svg, /<title>[^<]*&lt;script&gt;/);
  }
  // A colour that is not a colour is ignored, so it cannot carry anything either.
  const svg = D.renderEmblem("puck:canada", { face: { colors: { field: "red;}</style><script>", ring: "url(javascript:alert(1))" } } });
  assert.ok(!svg.includes("javascript") && !svg.includes("<script"));
  assert.equal(sameIds(svg), sameIds(D.renderEmblem("puck:canada")), "an invalid colour changes nothing");
  // Control characters and runaway lengths are cut.
  const long = D.renderEmblem("puck:souvenir", { face: { ringText: "X".repeat(5000), text: "Y".repeat(5000) } });
  assert.ok(long.length < 40000);
});

test("an image from outside is made safe: shapes, gradients and clip paths stay, and nothing that runs, loads or links does", () => {
  const dirty = `<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY x "y">]><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20" onload="alert(1)">
    <script>alert(1)</script><style>@import url(http://evil.example/x.css); circle{fill:red}</style>
    <defs><linearGradient id="g"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#00f" onclick="x()"/></linearGradient></defs>
    <a href="javascript:alert(1)"><rect width="10" height="10" fill="url(#g)" onmouseover="alert(3)"/></a><rect width="3" height="3" fill="url(#g)"/>
    <image href="http://evil.example/p.png" width="5" height="5"/><use href="#g"/><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">hi</div></foreignObject>
    <g style="fill:#0a0;stroke:url(http://evil.example/#a);background:url(x)"><circle cx="20" cy="10" r="5" style="opacity:.5"/></g>
    <path d="M0 0L10 10" fill="javascript:alert(1)" stroke="&#106;avascript:1"/><text x="1" y="1">Hello</text>
    <filter id="f"><feImage href="http://evil.example/"/></filter><path id="bad id" d="M0 0" filter="url(#f)"/></svg>`;
  const safe = safeImage(dirty, "p-");
  assert.ok(safe !== undefined);
  assert.deepEqual(safe.box, [0, 0, 40, 20]);
  const m = safe.markup;
  for (const bad of ["script", "onload", "onclick", "onmouseover", "javascript", "evil.example", "<style", "<image", "<use", "foreignObject", "<text", "<a ", "<filter", "feImage", "href", "&#", "@import", "DOCTYPE", "ENTITY", "style="]) assert.ok(!m.includes(bad), `${bad} survived: ${m}`);
  // What is good stays: the gradient with its stops, the shapes, the colours, the group's fill, and the ids are renamed with their references.
  assert.ok(m.includes('<linearGradient id="p-g">') && m.includes('fill="url(#p-g)"') && m.includes("<circle") && m.includes('fill="#0a0"') && m.includes('opacity=".5"'));
  assert.ok(!m.includes('id="g"'));
  // It is balanced: every tag opened is closed.
  const opens = (m.match(/<(?!\/)[A-Za-z][^>]*[^/]>/g) ?? []).length;
  assert.equal((m.match(/<\/[A-Za-z]+>/g) ?? []).length, opens);
  // Not an SVG, nothing drawable, a root that is not svg, too long, or not text: nothing.
  for (const none of [undefined, null, 5, {}, "", "hello", "<svg></svg>", `<svg><text>x</text></svg>`, `<div><circle r="1"/></div>`, `<svg><script><circle r="1"/></script></svg>`, `<svg><circle r="1"/>${" ".repeat(70000)}</svg>`]) assert.equal(safeImage(none, "p-"), undefined, String(none).slice(0, 40));
  // A box is read from the width and height when there is no viewBox, and is 100 by 100 when there is neither.
  assert.deepEqual(safeImage(`<svg width="30" height="10"><rect width="3" height="3"/></svg>`, "")?.box, [0, 0, 30, 10]);
  assert.deepEqual(safeImage(`<svg><rect width="3" height="3"/></svg>`, "")?.box, [0, 0, 100, 100]);
  // Two faces in one page cannot reach each other's gradients: the prefix differs, and so do the ids of two pucks with two images.
  const g1 = D.renderEmblem("puck:souvenir", { face: { image: `<svg viewBox="0 0 10 10"><defs><linearGradient id="a"><stop stop-color="red"/></linearGradient></defs><rect width="10" height="10" fill="url(#a)"/></svg>` } });
  const g2 = D.renderEmblem("puck:souvenir", { face: { image: `<svg viewBox="0 0 10 10"><defs><linearGradient id="a"><stop stop-color="blue"/></linearGradient></defs><rect width="10" height="10" fill="url(#a)"/></svg>` } });
  const ids = (svg: string): string[] => [...svg.matchAll(/ id="([^"]+)"/g)].map((x) => x[1] as string);
  assert.equal(new Set(ids(g1)).size, ids(g1).length, "ids are unique in a drawing");
  assert.ok(ids(g1).every((id) => !ids(g2).includes(id)), "two pucks with two images share no id");
});

test("the face option: an image, an emblem id, a flag code with or without a renderer, text, ring text, a number, a name and colours", () => {
  const puck = (face: D.PuckFace, id: D.PuckId = "puck:souvenir", flags?: D.FlagRenderer): string => D.renderEmblem(id, { face, ...(flags === undefined ? {} : { flags }) });
  const logo = `<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#7a1fa2"/></svg>`;
  assert.ok(puck({ image: logo }).includes("#7a1fa2"));
  // An image replaces the design's own picture.
  assert.ok(puck({ image: logo }, "puck:canada").includes("#7a1fa2"));
  assert.ok(puck({ image: logo }, "puck:usa").includes("#7a1fa2") && !puck({ image: logo }, "puck:usa").includes("<polygon"), "the stars and stripes make way for the picture");
  assert.ok(puck({ flag: "ca" }, "puck:usa").includes("#d52b1e") && !puck({ flag: "ca" }, "puck:usa").includes("<polygon"));
  // An emblem id is drawn into the middle (here a cup), by renderEmblem, emblemFrame and ballFrame alike; a puck module alone takes `image`.
  const cup = puck({ emblem: "trophy:cup" });
  assert.notEqual(cup, puck({}));
  assert.ok(cup.length > puck({}).length);
  assert.equal(D.emblemFrame("puck:souvenir", { face: { emblem: "trophy:cup" } }), D.ballFrame("puck:souvenir", { face: { emblem: "trophy:cup" } }));
  assert.equal(sameIds(puck({ emblem: "nothing:here" })), sameIds(puck({})), "an unknown emblem is ignored");
  assert.equal(puck({ emblem: "puck:usa" }).includes("undefined"), false);
  // Flags: ca and us are drawn here; another code goes through the caller's renderer, which is given the code and a request (a shape, a size and a theme).
  const calls: unknown[][] = [];
  const flags: D.FlagRenderer = (code, o) => {
    calls.push([code, o]);
    return `<svg viewBox="0 0 4 3"><rect width="4" height="3" fill="#ffffff"/><circle cx="2" cy="1.5" r="0.9" fill="#bc002d"/></svg>`;
  };
  const jp = puck({ flag: "jp", text: "JAPAN" }, "puck:souvenir", flags);
  assert.ok(jp.includes("#bc002d"));
  assert.deepEqual(calls[0]?.[0], "jp");
  assert.deepEqual(Object.keys(calls[0]?.[1] as object).sort(), ["shape", "size", "theme"]);
  // The request is the one taisen-brackets makes: a shape of round, square or rect, a size, and a theme of inherit, light or dark.
  assert.ok(["round", "square", "rect"].includes((calls[0]?.[1] as { shape: string }).shape));
  assert.equal(typeof (calls[0]?.[1] as { size: number }).size, "number");
  assert.equal((calls[0]?.[1] as { theme: string }).theme, "inherit");
  D.renderEmblem("puck:souvenir", { face: { flag: "jp" }, flags, theme: "dark" });
  assert.equal((calls.at(-1)?.[1] as { theme: string }).theme, "dark");
  D.renderEmblem("puck:souvenir", { face: { flag: "jp" }, flags, theme: "auto" });
  assert.equal((calls.at(-1)?.[1] as { theme: string }).theme, "inherit");
  // A renderer returns null or undefined for a code it has no flag for: the built-in flag, or none.
  assert.ok(D.renderEmblem("puck:souvenir", { face: { flag: "ca" }, flags: () => null }).includes("#d52b1e"));
  assert.ok(!D.renderEmblem("puck:souvenir", { face: { flag: "jp" }, flags: () => undefined }).includes("#bc002d"));
  // It is a render option, on emblemFrame and ballFrame too, and a different renderer draws different ids.
  assert.ok(D.emblemFrame("puck:souvenir", { face: { flag: "jp" }, flags, yaw: 20 }).includes("#bc002d"));
  assert.ok(D.ballFrame("puck:souvenir", { face: { flag: "jp" }, flags }).includes("#bc002d"));
  assert.ok(puck({ flag: "ca" }).includes("#d52b1e"));
  assert.ok(puck({ flag: "us" }).includes("#b31942"));
  assert.ok(sameIds(puck({ flag: "CA" })) === sameIds(puck({ flag: "ca" })), "a code in capitals is the same");
  // No renderer and a code we do not draw: no picture and no error. A renderer that throws, or returns something unsafe, changes nothing worse.
  assert.ok(!puck({ flag: "jp" }).includes("#bc002d"));
  assert.doesNotThrow(() => puck({ flag: "jp" }, "puck:souvenir", () => { throw new Error("no"); }));
  assert.doesNotThrow(() => puck({ flag: "jp" }, "puck:souvenir", (() => 5) as unknown as D.FlagRenderer));
  assert.ok(!puck({ flag: "jp" }, "puck:souvenir", () => `<svg><script>alert(1)</script><circle r="1" fill="#abcdef"/></svg>`).includes("<script"));
  // The renderer is used before the built-in flag for "ca" too, so a caller's own flags win everywhere.
  assert.ok(puck({ flag: "ca" }, "puck:souvenir", flags).includes("#bc002d"));
  // Text, ring text (one string is the top, a pair is top and bottom, false is none), a number, a name.
  assert.notEqual(puck({ text: "HELLO" }), puck({ text: "WORLD" }));
  assert.notEqual(puck({ ringText: "ONE" }), puck({ ringText: ["ONE", "TWO"] }));
  assert.notEqual(puck({ ringText: false }), puck({}));
  assert.ok(puck({ ringText: false }).length < puck({}).length);
  assert.notEqual(puck({ number: 7 }), puck({ number: 8 }));
  assert.equal(sameIds(puck({ number: "z-9!" })), sameIds(puck({ number: "Z9" })), "a number is up to three letters and digits");
  assert.notEqual(puck({ name: "ONO" }, "puck:player"), puck({ name: "SATO" }, "puck:player"));
  assert.notEqual(puck({}, "puck:player"), puck({ number: 99 }, "puck:player"));
  // Colours: by name, or an array in the order field, ring, ink, accent, signature.
  assert.ok(puck({ colors: { field: "#010203" } }).includes("#010203"));
  assert.equal(sameIds(puck({ colors: ["#010203", "#040506", "#070809", "#0a0b0c", "#0d0e0f"] })), sameIds(puck({ colors: { field: "#010203", ring: "#040506", ink: "#070809", accent: "#0a0b0c", signature: "#0d0e0f" } })));
  assert.ok(puck({ colors: ["rgb(1,2,3)"] }).includes("#010203"));
  // A design from the face makes any puck any design; the plain puck, given a face, is the souvenir puck with it.
  assert.equal(sameIds(puck({ design: "usa" })), sameIds(D.renderEmblem("puck:usa", { title: "Souvenir puck" })));
  const plain = D.renderEmblem("ball:puck", { face: { text: "HI" } });
  assert.ok(plain.includes("<title>Souvenir puck</title>") && printedIn(plain));
  assert.ok(D.emblemFrame("ball:puck", { face: { text: "HI" }, yaw: 20 }).includes("matrix("));
  assert.ok(D.ballFrame("ball:puck", { face: { text: "HI" } }).includes("matrix("));
  assert.ok(!printedIn(D.renderEmblem("ball:puck")) && !printedIn(D.renderEmblem("ball:soccer", { face: { text: "HI" } })));
  // Two different faces draw different ids; the same face the same ones.
  const idsOf = (svg: string): string => [...svg.matchAll(/ id="([^"]+)"/g)].map((x) => x[1]).join();
  assert.notEqual(idsOf(puck({ text: "A" })), idsOf(puck({ text: "B" })));
  assert.equal(idsOf(puck({ text: "A" })), idsOf(puck({ text: "A" })));
  // Nonsense is survived: the wrong types, NaN, a face that is not an object.
  for (const face of [null, 5, "x", [], { text: 5 }, { number: NaN }, { signature: NaN }, { design: "nope" }, { colors: 5 }, { ringText: 7 }, { flag: 9 }, { image: 9 }, { colors: [null, 4] }] as unknown as D.PuckFace[]) {
    const svg = D.renderEmblem("puck:canada", { face });
    assert.ok(svg.startsWith("<svg") && !svg.includes("NaN"), JSON.stringify(face));
  }
});

test("the design names: the ids start from a design, and `design` swaps it; the signed puck is the navy one with a signature", () => {
  assert.equal(sameIds(D.renderEmblem("puck:signed", { face: { signature: false, text: "USA" }, title: "Signed puck" })), sameIds(D.renderEmblem("puck:usa-navy", { title: "Signed puck" })));
  assert.equal(sameIds(D.renderEmblem("puck:souvenir", { face: { design: "player" }, title: "Player number puck" })), sameIds(D.renderEmblem("puck:player")));
});
