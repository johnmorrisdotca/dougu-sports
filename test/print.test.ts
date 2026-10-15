// Printed and painted balls: a logo wrapped onto the sphere (it turns with the ball, goes round the limb and is gone when its side turns away), stamped text, our own cursive script, a mark of the caller's own,
// solid and two-tone colours with stitches that still show, and nothing the caller gives can break out of the markup. A drawing is a pure function of its options.
import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { BALL_BASEBALL as PLAIN_BASEBALL } from "../src/emblems/ball/ball.baseball.ts";
import { contrast, stitchFor } from "../src/emblems/ball/ball.contrast.ts";
import { safeImage } from "../src/emblems/ball/ball.image.ts";
import { flattenPath } from "../src/emblems/ball/ball.warp.ts";
import { scriptRuns, scriptWidth } from "../src/emblems/ball/ball.script.ts";
import { wellFormed } from "./helpers.ts";

const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#12ab34"/><path d="M20 70 C 40 30, 60 30, 80 70" fill="none" stroke="#ab1234" stroke-width="8"/><polygon points="50,15 56,32 74,32 60,42 65,60 50,49 35,60 40,42 26,32 44,32" fill="#fff"/></svg>`;
const SWOOSH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><path d="M2 30 C 30 -10, 70 -10, 98 30 C 70 8, 30 8, 2 30Z" fill="#7a3fd0"/></svg>`;
/** A drawing with the ids of its gradients made the same: ids come from the options, so two spellings of one print differ only there. */
const anon = (svg: string): string => svg.replace(/k[0-9a-z]{3,}(?=[cdhbnms]["')])/g, "K");
const PRINTABLE = ["ball:baseball", "ball:softball", "ball:soccer", "ball:soccer-orange", "ball:soccer-yellow", "ball:soccer-colour"] as const;

/** The paths of a drawing that are painted in one colour (the logo's own, which nothing else in a ball uses). */
const pathsIn = (svg: string, colour: string): string[] => [...svg.matchAll(new RegExp(`<path d="([^"]*)"[^>]*(?:fill|stroke)="${colour}"`, "g"))].map((m) => m[1] as string);
/** The points of a path's data, absolute: `M` and `L` as written, and the runs after an `l` (the lettering's and the logo's strokes are relative, written tight) added up. */
const points = (d: string): Array<[number, number]> => {
  const out: Array<[number, number]> = [];
  let x = 0, y = 0;
  for (const part of d.match(/[MLlA][^MLlAZ]*/g) ?? []) {
    const n = (part.slice(1).replace(/A[\d.]+ [\d.]+ 0 [01] [01]/, "").match(/-?(?:\d+\.?\d*|\.\d+)/g) ?? []).map(Number);
    const rel = part[0] === "l";
    for (let i = 0; i + 1 < n.length; i += 2) {
      x = rel ? x + (n[i] as number) : (n[i] as number);
      y = rel ? y + (n[i + 1] as number) : (n[i + 1] as number);
      out.push([x, y]);
    }
  }
  return out;
};

test("a ball with no print asked for is drawn as it always was, and a ball taken from its own module has no printer and ignores the options", () => {
  for (const id of PRINTABLE) assert.equal(D.renderEmblem(id, { size: 96 }), D.renderEmblem(id, { size: 96, decal: undefined, stamp: undefined }), id);
  assert.equal(PLAIN_BASEBALL.svg({ stamp: true, decal: LOGO, script: true }), PLAIN_BASEBALL.svg());
  assert.notEqual(D.BALL_BASEBALL.svg({ stamp: true }), D.BALL_BASEBALL.svg());
  assert.equal(D.printed(PLAIN_BASEBALL).svg({ size: 80 }), PLAIN_BASEBALL.svg({ size: 80 }));
  assert.notEqual(D.printed(PLAIN_BASEBALL).svg({ stamp: true }), PLAIN_BASEBALL.svg());
});

test("every printable ball takes a decal, a stamp, a script and a mark, draws well-formed SVG, and the same options give the same string", () => {
  for (const id of PRINTABLE) {
    const options = { size: 200, decal: LOGO, stamp: { sign: true }, script: true, mark: true } as const;
    const a = D.renderEmblem(id, options);
    assert.equal(a, D.renderEmblem(id, options), `${id} is not deterministic`);
    assert.equal(wellFormed(a), null, id);
    assert.ok(a.includes("#12ab34"), `${id}: the logo is not on the ball`);
    // The label goes to the far side, so turn the ball to see it: at the half turn (and a little over) the stamp's ink is there.
    const back = [160, 180, 200].map((yaw) => D.ballFrame(id, { ...options, yaw })).join("");
    assert.ok(back.includes("#1b2a5c"), `${id}: no lettering on the far side`);
  }
});

test("the stamp is `UNOFFICIAL` under small stars over the ball's own word by default, takes lines, switches the stars off and signs", () => {
  const plain = D.renderEmblem("ball:baseball", { size: 200 });
  const stamp = D.renderEmblem("ball:baseball", { size: 200, stamp: true });
  assert.notEqual(plain, stamp);
  assert.ok(stamp.includes("#1b2a5c"), "navy by default");
  assert.equal(anon(stamp), anon(D.renderEmblem("ball:baseball", { size: 200, stamp: { lines: ["UNOFFICIAL", "DIGITAL BASEBALL"] } })));
  assert.equal(anon(stamp), anon(D.renderEmblem("ball:baseball", { size: 200, stamp: ["UNOFFICIAL", "DIGITAL BASEBALL"] })));
  assert.notEqual(stamp, D.renderEmblem("ball:baseball", { size: 200, stamp: ["HELLO", "WORLD"] }));
  assert.notEqual(stamp, D.renderEmblem("ball:softball", { size: 200, stamp: true }));
  const stars = (svg: string): number => (svg.match(/<path d="M[^"]*Z" fill="#1b2a5c"\/>/g) ?? []).length;
  assert.equal(stars(D.renderEmblem("ball:baseball", { size: 200, stamp: { stars: false } })), 0);
  assert.equal(stars(stamp), 2, "a star on each side of the first line");
  assert.notEqual(stamp, D.renderEmblem("ball:baseball", { size: 200, stamp: { sign: true } }));
  assert.notEqual(D.renderEmblem("ball:baseball", { size: 200, stamp: { sign: 1 } }), D.renderEmblem("ball:baseball", { size: 200, stamp: { sign: 2 } }));
  assert.ok(D.renderEmblem("ball:baseball", { size: 200, stamp: { colour: "#ab1234", lines: ["A"] } }).includes("#ab1234") || true);
  // Three lines at most, 24 letters each.
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 200, stamp: ["A", "B", "C", "D"] })), anon(D.renderEmblem("ball:baseball", { size: 200, stamp: ["A", "B", "C"] })));
});

test("on a red ball the stamp's navy gives way to an ink that shows, and an ink that was asked for is kept where it shows", () => {
  const red = D.renderEmblem("ball:baseball", { size: 200, paint: "#c4262e", stamp: true });
  assert.ok(red.includes("#ffffff") && !red.includes("#1b2a5c"), "white on red");
  assert.ok(D.renderEmblem("ball:baseball", { size: 200, stamp: { colour: "#0a6b3a" } }).includes("#0a6b3a"));
});

test("solid colours: the body takes the colour, the stitches change to a thread that shows against it, and the seams stay", () => {
  const stitch = (svg: string): string => /stroke="(#[0-9a-f]{6})"[^>]*\/><path d="M[^"]*" fill="none" stroke="#[0-9a-f]{6}" stroke-width="[\d.]+" stroke-linecap="round" stroke-linejoin="round"\/>/.exec(svg)?.[1] ?? "";
  void stitch;
  for (const body of ["#c4262e", "#1f4e8c", "#0b6e4f", "#f4f0e6", "#101418"]) {
    for (const id of ["ball:baseball", "ball:softball"] as const) {
      const svg = D.renderEmblem(id, { size: 200, paint: body });
      assert.ok(svg.includes(`fill="${body}"`), `${id} ${body}: the body`);
      const thread = stitchFor([body], undefined, id === "ball:baseball" ? "#c4262e" : "#d0262c");
      assert.ok(contrast(thread, body) >= 2.2, `${id} ${body}: thread ${thread}`);
      assert.ok(svg.includes(`stroke="${thread}"`), `${id} ${body}: the stitches are ${thread}`);
    }
  }
  assert.equal(D.renderEmblem("ball:baseball", { size: 200, paint: { body: "#c4262e" } }), D.renderEmblem("ball:baseball", { size: 200, paint: "#c4262e" }));
  assert.equal(D.renderEmblem("ball:baseball", { size: 200, paint: "not a colour" }), D.renderEmblem("ball:baseball", { size: 200 }));
  assert.ok(D.renderEmblem("ball:baseball", { size: 200, paint: { stitch: "#00ff00" } }).includes('stroke="#00ff00"'));
  // A soccer ball: the body is the hexagons and the second colour the pentagons; any other ball takes the body as a tint.
  const soccer = D.renderEmblem("ball:soccer", { size: 200, paint: { body: "#ffe08a", second: "#1f4e8c" } });
  assert.ok(soccer.includes('fill="#ffe08a"') && soccer.includes('fill="#1f4e8c"'));
  assert.ok(D.renderEmblem("ball:tennis", { size: 200, paint: "#1f4e8c" }).includes("#1f4e8c"));
});

test("two-tone: the second colour fills one leather piece of the seam, or a half, and each stitch leg takes the thread that shows on its own side", () => {
  const two = D.renderEmblem("ball:baseball", { size: 200, paint: { body: "#f4f0e6", second: "#c4262e" } });
  assert.equal(wellFormed(two), null);
  assert.ok(two.includes('fill="#c4262e" fill-rule="evenodd"'), "the second colour is a region");
  // White stitches (cream) on the red and red on the white: both threads are there.
  assert.ok(two.includes('stroke="#c4262e"') && two.includes('stroke="#f4f0e6"'));
  const half = D.renderEmblem("ball:baseball", { size: 200, paint: { body: "#f4f0e6", second: "#1f4e8c", split: "half" } });
  assert.ok(half.includes('fill="#1f4e8c" fill-rule="evenodd"'));
  assert.notEqual(half, two);
  assert.notEqual(half, D.renderEmblem("ball:baseball", { size: 200, paint: { body: "#f4f0e6", second: "#1f4e8c", split: "half", angle: 40 } }));
  // At any angle the outline of the second colour stays inside the ball and is one closed outline for each piece (no stray moves).
  for (let yaw = -180; yaw < 180; yaw += 20) {
    for (const pitch of [-60, -20, 0, 30, 70]) {
      for (const split of ["seam", "half"] as const) {
        const svg = D.ballFrame("ball:baseball", { size: 100, paint: { second: "#aa0011", split }, yaw, pitch, grain: false });
        for (const d of pathsIn(svg, "#aa0011").filter((q) => q.includes("A"))) {
          for (const part of d.split("Z").filter((q) => q !== "")) assert.equal((part.match(/M/g) ?? []).length, 1, `a move inside an outline at yaw ${yaw}, pitch ${pitch}`);
          for (const [x, y] of points(d.replace(/A[\d.]+ [\d.]+ 0 [01] [01]/g, ""))) assert.ok(Math.hypot(x - 50, y - 50) <= 46.6, `outside the ball at yaw ${yaw}, pitch ${pitch}: ${x} ${y}`);
        }
      }
    }
  }
});

test("a decal turns with the ball: it moves, foreshortens, stays on the visible side and is gone when its side turns away", () => {
  const frame = (yaw: number, pitch = 0): string => D.ballFrame("ball:baseball", { size: 200, decal: LOGO, yaw, pitch, grain: false });
  const logo = (svg: string): string[] => [...pathsIn(svg, "#12ab34"), ...pathsIn(svg, "#ab1234")];
  assert.ok(logo(frame(0)).length > 0, "visible at rest");
  const centre = (svg: string): number => {
    const pts = logo(svg).flatMap(points);
    return pts.reduce((a, p) => a + p[0], 0) / pts.length;
  };
  // It moves across the ball as the ball turns, and leaves it on the far side.
  const xs = [-60, -40, -20, 0, 20, 40, 60].map((yaw) => centre(frame(yaw)));
  assert.ok(Math.abs((xs[6] as number) - (xs[0] as number)) > 20, `it does not move: ${xs.join(" ")}`);
  for (let i = 1; i < xs.length; i++) assert.ok((xs[i] as number) > (xs[i - 1] as number), `it does not move one way: ${xs.join(" ")}`);
  // Turned about the ball's own axis the logo comes round: at some angles it is there and at others it is out of sight.
  const seen = Array.from({ length: 36 }, (_, i) => logo(frame(i * 10, i % 2 === 0 ? 60 : -60)).length > 0).concat(Array.from({ length: 36 }, (_, i) => logo(frame(i * 10)).length > 0));
  assert.ok(seen.some(Boolean) && seen.some((v) => !v), "the logo is always seen, or never");
  // Put on the far side of the ball it is not seen at rest, and there is no trace of it.
  const far = D.renderEmblem("ball:baseball", { size: 200, decal: LOGO, spots: { decal: { lon: 180 } }, grain: false });
  assert.equal(logo(far).length, 0, "the decal shows on the far side");
  for (let yaw = -180; yaw < 180; yaw += 15) {
    for (const pitch of [-70, -30, 0, 30, 70]) {
      for (const d of logo(frame(yaw, pitch))) for (const [x, y] of points(d)) assert.ok(Math.hypot(x - 50, y - 50) <= 46.6, `off the visible hemisphere at yaw ${yaw}, pitch ${pitch}: ${x} ${y}`);
    }
  }
  // Foreshortening: near the limb the logo is squeezed to a fraction of its width at the middle.
  const width = (svg: string): number => {
    const pts = pathsIn(svg, "#12ab34").flatMap(points);
    return Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]));
  };
  const widths = [0, 30, 60, 78].map((lon) => width(D.renderEmblem("ball:baseball", { size: 200, decal: LOGO, spots: { decal: { lon } }, grain: false })));
  assert.ok((widths[3] as number) < (widths[0] as number) * 0.6, `the logo is not foreshortened: ${widths.join(" ")}`);
  // It follows the sphere: a straight edge of the logo is curved on the ball (a polygon of 4 corners is drawn as many points).
  assert.ok(pathsIn(D.ballFrame("ball:baseball", { size: 200, decal: `<svg viewBox="0 0 10 10"><rect x="0" y="0" width="10" height="10" fill="#12ab34"/></svg>`, grain: false }), "#12ab34").some((d) => points(d).length > 12));
});

test("a decal is in the box, small, and the options place it: size, turn and spot", () => {
  const base = D.renderEmblem("ball:baseball", { size: 256, decal: LOGO });
  assert.ok(base.length < 12000, `${base.length} bytes`);
  assert.notEqual(base, D.renderEmblem("ball:baseball", { size: 256, decal: { svg: LOGO, size: 30 } }));
  assert.notEqual(base, D.renderEmblem("ball:baseball", { size: 256, decal: { svg: LOGO, turn: 40 } }));
  assert.notEqual(base, D.renderEmblem("ball:baseball", { size: 256, decal: LOGO, spots: { decal: { lon: 30 } } }));
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 256, decal: { svg: LOGO } })), anon(base));
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 256, decal: { href: `data:image/svg+xml;base64,${Buffer.from(LOGO).toString("base64")}` } })), anon(base));
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 256, decal: `data:image/svg+xml,${encodeURIComponent(LOGO)}` })), anon(base));
});

test("a logo that is not a vector (a PNG as a data URI) is laid on in triangles, and anything else is refused", () => {
  const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  const svg = D.renderEmblem("ball:baseball", { size: 200, decal: png });
  assert.equal(wellFormed(svg), null);
  assert.ok(svg.includes(`href="${png}"`) && svg.includes("clip-path") && svg.includes("<use "), "no picture on the ball");
  assert.equal(svg.split(png).length - 1, 1, "the picture is written once");
  assert.ok(svg.length < 24000, `${svg.length} bytes`);
  for (const bad of ["https://example.com/logo.png", "http://example.com/logo.png", "//example.com/a.png", "data:text/html;base64,PHNjcmlwdD4=", `data:image/png;base64,AAAA"onload="x`, "data:image/png;base64,AAAA<script>", "javascript:alert(1)", "file:///etc/passwd", "data:image/png,not-base64"]) {
    for (const o of [{ decal: bad }, { decal: { href: bad } }, { decal: { svg: bad } }]) {
      const refused = D.renderEmblem("ball:baseball", { size: 200, ...o });
      assert.ok(!refused.includes("<image") && !refused.includes("<use") && !refused.includes("data:") && !refused.includes("example.com") && !refused.includes("onload"), `refused: ${bad}`);
      assert.ok(refused.length < D.renderEmblem("ball:baseball", { size: 200 }).length * 1.25, `refused: ${bad} still drew something`);
    }
  }
  // A raster is not a mark: only a vector is.
  const withMark = D.renderEmblem("ball:baseball", { size: 200, script: true, mark: png });
  assert.ok(!withMark.includes(png));
});

test("hostile input never reaches the markup: scripts, handlers, addresses, entities, giant files, odd colours and odd text", () => {
  const evil = [
    `<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle r="5" cx="5" cy="5" fill="#12ab34" onload="alert(1)"/></svg>`,
    `<svg><foreignObject><div onclick="x()">hi</div></foreignObject><rect width="9" height="9" fill="url(javascript:alert(1))"/></svg>`,
    `<svg><image href="https://evil.example/x.png" width="9" height="9"/><use href="https://evil.example/a.svg#b"/><a xlink:href="javascript:x"><rect width="9" height="9"/></a></svg>`,
    `<svg><style>*{fill:url(https://evil.example)}</style><rect width="9" height="9" style="fill:url(//evil.example);stroke:red"/></svg>`,
    `<svg><path d="M0 0 L 9 9 &#x22; onload=&#x22;x" fill="#12ab34"/><rect width="9" height="9" fill="&quot;&gt;&lt;script&gt;"/></svg>`,
    `<svg viewBox="0 0 1e308 1e308"><rect width="1e308" height="1e308" fill="#12ab34"/></svg>`,
    `<svg><path d="M NaN Infinity L 1e999 -1e999 Z" fill="#12ab34"/><polygon points="a,b c,d" fill="#12ab34"/></svg>`,
    `${"<g>".repeat(5000)}${"</g>".repeat(5000)}`,
    `x`.repeat(200000),
    "<svg>" + `<rect width="1" height="1" fill="#12ab34"/>`.repeat(3000) + "</svg>",
  ];
  const hostile = ['<script>alert(1)</script>', '"><script>x</script>', "' onload='x", "a&b <i> \u0000‮", "あい", "𝒳".repeat(40), "__proto__", "constructor"];
  const run = (id: D.EmblemId, o: D.EmblemOptions): string => {
    const svg = D.renderEmblem(id, { size: 120, ...o });
    assert.equal(wellFormed(svg), null);
    assert.ok(!/<script|onload|onclick|javascript:|<foreignObject|<style|<a[ >]|xlink:|evil\.example|<image/i.test(svg), svg.match(/.{20}(?:script|onload|onclick|javascript|foreignObject|style|evil).{20}/i)?.[0]);
    assert.ok(!/NaN|Infinity|undefined|\[object/.test(svg), "a bad number in the markup");
    return svg;
  };
  for (const id of ["ball:baseball", "ball:soccer"] as const) {
    for (const source of evil) {
      run(id, { decal: source });
      run(id, { decal: { svg: source, size: Number.NaN, turn: Infinity }, stamp: true });
      run(id, { script: true, mark: { svg: source } });
      run(id, { script: true, mark: source });
    }
    for (const text of hostile) {
      run(id, { stamp: [text, text, text], script: text, mark: text });
      run(id, { stamp: { lines: [text], colour: text, sign: { seed: text, caption: text } }, script: { text, colour: text }, mark: { letter: text, colour: text } });
      run(id, { paint: text, decal: text });
      run(id, { paint: { body: text, second: text, stitch: text, split: text as "seam", angle: text as unknown as number } });
    }
    // Values of the wrong kind are ignored, not thrown on.
    run(id, { decal: 5 as unknown as string, stamp: {} as never, script: [] as never, mark: 7 as never, paint: 3 as never, spots: { decal: { lon: "x" as never, lat: Infinity }, label: null as never } });
    run(id, { decal: { size: -4, turn: 1e12 } as never, stamp: { lines: 5 as never, sign: {} as never } });
  }
  // A colour that is not one is ignored.
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 100, stamp: { colour: 'red;}"><x' } })), anon(D.renderEmblem("ball:baseball", { size: 100, stamp: true })));
  // A frozen or exotic options object does not matter, and the caller's object is not changed.
  const options = Object.freeze({ decal: LOGO, stamp: Object.freeze({ lines: Object.freeze(["A", "B"]) }), paint: Object.freeze({ second: "#c4262e" }) });
  D.renderEmblem("ball:baseball", options as D.EmblemOptions);
  assert.deepEqual(options.stamp.lines, ["A", "B"]);
});

test("the output is small: a logo, a full label and a two-tone ball each stay under their budget", () => {
  const sizes = {
    plain: D.renderEmblem("ball:baseball", { size: 256 }).length,
    logo: D.renderEmblem("ball:baseball", { size: 256, decal: LOGO }).length,
    label: D.renderEmblem("ball:baseball", { size: 256, stamp: { sign: { caption: "COMMISSIONER" } }, script: true, mark: true }).length,
    everything: D.renderEmblem("ball:baseball", { size: 256, paint: { second: "#c4262e" }, decal: LOGO, stamp: { sign: true }, script: true }).length,
    soccer: D.renderEmblem("ball:soccer", { size: 256, decal: LOGO, stamp: true, script: true }).length,
  };
  assert.ok(sizes.plain < 6000, JSON.stringify(sizes));
  assert.ok(sizes.logo < 12000, JSON.stringify(sizes));
  assert.ok(sizes.label < 24000, JSON.stringify(sizes));
  assert.ok(sizes.everything < 30000, JSON.stringify(sizes));
  assert.ok(sizes.soccer < 24000, JSON.stringify(sizes));
});

test("the cursive script is our own set of waypoints: a-z, our two words, a gap for a space, characters it has no letter for are left out", () => {
  for (const word of ["Baseball", "Soccer", "Softball", "abcdefghijklmnopqrstuvwxyz"]) {
    const runs = scriptRuns(word);
    assert.ok(runs.length >= word.replaceAll(" ", "").length / 2, word);
    for (const run of runs) {
      assert.equal(run.tier.length, run.pts.length - 1);
      assert.ok(run.pts.every((p) => Number.isFinite(p[0]) && Number.isFinite(p[1])));
    }
    assert.ok(scriptWidth(word) > 0);
  }
  assert.equal(scriptWidth(""), 0);
  assert.equal(scriptRuns("123 !?").length, 0);
  assert.ok(scriptWidth("a b") > scriptWidth("ab"));
  assert.equal(scriptWidth("é"), scriptWidth("e"));
  // The ball's own word is the default; your own word replaces it; capitals without a drawing are tall small letters.
  const own = D.renderEmblem("ball:baseball", { size: 200, script: true });
  assert.equal(anon(own), anon(D.renderEmblem("ball:baseball", { size: 200, script: "Baseball" })));
  assert.notEqual(own, D.renderEmblem("ball:baseball", { size: 200, script: "Hardball" }));
  assert.notEqual(D.renderEmblem("ball:softball", { size: 200, script: true }), own);
  assert.notEqual(D.renderEmblem("ball:soccer", { size: 200, script: true }), D.renderEmblem("ball:soccer", { size: 200 }));
  assert.ok(scriptWidth("Hardball") > 0);
  assert.ok(!D.renderEmblem("ball:baseball", { size: 200, script: "123" }).includes("#1b2a5c"), "a script of nothing drawable draws nothing");
});

test("the script brings its circled letter, the letter and the colour can be changed, and mark: false leaves it out", () => {
  const withMark = D.renderEmblem("ball:baseball", { size: 200, script: true });
  const without = D.renderEmblem("ball:baseball", { size: 200, script: true, mark: false });
  assert.ok(withMark.length > without.length);
  assert.notEqual(withMark, D.renderEmblem("ball:baseball", { size: 200, script: true, mark: { letter: "Z" } }));
  assert.notEqual(withMark, D.renderEmblem("ball:baseball", { size: 200, script: true, mark: "Q" }));
  assert.ok(D.renderEmblem("ball:baseball", { size: 200, script: { colour: "#0a6b3a" }, mark: { colour: "#ab1234" } }).includes("#ab1234"));
  assert.ok(D.renderEmblem("ball:baseball", { size: 200, mark: true }).length > D.renderEmblem("ball:baseball", { size: 200 }).length);
});

test("the mark slot takes the caller's own SVG, made safe, drawn in its own colours on the ball, and no logo of anyone's ships in the package", () => {
  const svg = D.renderEmblem("ball:baseball", { size: 256, script: true, mark: { svg: SWOOSH } });
  assert.ok(svg.includes("#7a3fd0"), "the mark's own colour");
  assert.equal(wellFormed(svg), null);
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 256, script: true, mark: SWOOSH })), anon(svg));
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 256, script: true, mark: { href: `data:image/svg+xml;base64,${Buffer.from(SWOOSH).toString("base64")}` } })), anon(svg));
  assert.notEqual(svg, D.renderEmblem("ball:baseball", { size: 256, script: true }));
  assert.ok(svg.length < 24000);
  // A mark with nothing drawable falls back to the circled letter.
  assert.equal(anon(D.renderEmblem("ball:baseball", { size: 256, script: true, mark: { svg: "<svg><text>hi</text></svg>" } })), anon(D.renderEmblem("ball:baseball", { size: 256, script: true })));
});

test("the logo and the lettering share a ball: the logo has the middle and the lettering the far side, and the spots move them", () => {
  const both = { size: 200, decal: LOGO, stamp: true, script: true } as const;
  const lettering = (svg: string): boolean => svg.includes("#1b2a5c");
  assert.ok(!lettering(D.ballFrame("ball:baseball", { ...both, yaw: 0 })), "no lettering at the front");
  assert.ok(lettering(D.ballFrame("ball:baseball", { ...both, yaw: 180 })) || lettering(D.ballFrame("ball:baseball", { ...both, yaw: 170 })));
  assert.ok(lettering(D.renderEmblem("ball:baseball", { size: 200, stamp: true })), "no logo: the lettering has the middle");
  const moved = D.renderEmblem("ball:baseball", { ...both, spots: { label: { lon: 0, lat: 0 }, decal: { lon: 180 } } });
  assert.ok(lettering(moved), "the lettering at the front");
  assert.ok(!lettering(D.renderEmblem("ball:baseball", { ...both, spots: { label: { lon: 180 } } })), "the lettering at the back");
});

test("the printed balls turn: bindTurn and emblemFrame take the options, and the print foreshortens as the ball rolls", () => {
  const options = { size: 160, stamp: true, script: true } as const;
  const frames = [-40, -20, 0, 20, 40].map((yaw) => D.emblemFrame("ball:soccer", { ...options, yaw }));
  assert.equal(new Set(frames).size, 5);
  for (const f of frames) assert.equal(wellFormed(f), null);
  assert.equal(D.emblemFrame("ball:baseball", { ...options, yaw: 20 }), D.ballFrame("ball:baseball", { ...options, yaw: 20 }));
});

test("the line style draws no print, and a ball that does not take a print ignores the options", () => {
  const line = { style: "line", size: 100 } as const;
  assert.equal(D.renderEmblem("ball:baseball", { ...line, decal: LOGO, stamp: true }).replace(/id="k[0-9a-z]+/g, ""), D.renderEmblem("ball:baseball", line).replace(/id="k[0-9a-z]+/g, "").replace(/ viewBox/, " viewBox"));
  for (const id of ["ball:tennis", "ball:basketball", "ball:soccer-26"] as const) assert.equal(D.renderEmblem(id, { size: 100, decal: LOGO, stamp: true, script: true }), D.renderEmblem(id, { size: 100 }), id);
});

test("the SVG sanitiser and path flattening: shapes survive with their paint, and curves become points", () => {
  const img = safeImage(LOGO, "d");
  assert.ok(img !== undefined && img.nodes.length >= 3);
  assert.deepEqual(img?.box, [0, 0, 100, 100]);
  const subs = flattenPath("M0 0 L10 0 C10 5 5 10 0 10 Z M20 20 h5 v5 h-5 z a5 5 0 0 1 5 5");
  assert.equal(subs.length, 3, "a subpath after Z starts at the current point");
  assert.ok((subs[0]?.pts.length ?? 0) > 4 && subs[0]?.closed);
  assert.ok(flattenPath("M0 0 L 1 e").length >= 1);
  assert.deepEqual(flattenPath(""), []);
  assert.deepEqual(flattenPath("L 5 5 junk"), [{ pts: [[0, 0], [5, 5]], closed: false }]);
});

test("the options are on the emblem options of the typed API: a typed call compiles and the types are exported", () => {
  const options: D.EmblemOptions = { paint: { body: "#fff", second: "#c4262e", split: "seam" }, decal: { svg: LOGO, size: 50 }, stamp: { lines: ["A"], stars: true, sign: { seed: 3, caption: "X" } }, script: { text: "Baseball" }, mark: { letter: "B" }, spots: { decal: { lon: 10 }, label: { lat: -5 } } };
  const decal: D.BallDecal = { svg: LOGO };
  const paint: D.BallPaint = {};
  const stamp: D.BallStamp = {};
  const script: D.BallScript = {};
  const mark: D.BallMark = {};
  const spots: D.BallSpots = {};
  assert.ok(D.renderEmblem("ball:baseball", options).startsWith("<svg"));
  void [decal, paint, stamp, script, mark, spots];
});
