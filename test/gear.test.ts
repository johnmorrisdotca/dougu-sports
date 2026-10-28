import { describe, expect, it } from "./vitest-shim.ts";
import { GEAR_IDS, GEARS, gearOf, isGearId, renderGear } from "../src/emblems/gear/gear.index.ts";
import { GEAR_BASEBALL_GLOVE } from "../src/emblems/gear/gear.baseballglove.ts";
import { GEAR_SQUASH_RACKET } from "../src/emblems/gear/gear.rackets.ts";
import { capsule, rect, strings, swell } from "../src/emblems/gear/gear.core.ts";

function balanced(svg: string): boolean {
  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    if (m[4] === "/") continue;
    if (m[1] === "/") {
      if (stack.pop() !== m[2]) return false;
    } else stack.push(m[2]);
  }
  return stack.length === 0;
}

describe("the gear", () => {
  it("has seventy ids, each once, in the form gear:name", () => {
    expect(GEARS.length).toBe(70);
    expect(new Set(GEAR_IDS).size).toBe(70);
    for (const id of GEAR_IDS) expect(id).toMatch(/^gear:[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("names each piece in English and Japanese and says where it comes from", () => {
    for (const g of GEARS) {
      expect(g.en.length).toBeGreaterThan(3);
      expect(g.ja).toMatch(/[\u3040-\u30ff\u4e00-\u9fff]/);
      expect(g.source).toBe("drawn");
      expect(g.kind).toBe("gear");
    }
  });

  it("draws every piece in both styles as a well-formed safe document", () => {
    for (const g of GEARS) {
      for (const style of ["colour", "line"] as const) {
        for (const svg of [g.svg({ style }), g.svg({ style, size: 16 }), g.frame({ style })]) {
          expect(svg.startsWith("<svg "), g.id).toBe(true);
          expect(svg.endsWith("</svg>"), g.id).toBe(true);
          expect(balanced(svg), `${g.id} ${style}`).toBe(true);
          expect(svg, g.id).toContain(`<title>${g.en}</title>`);
          expect(svg, g.id).not.toMatch(/<script|<foreignObject|<image|javascript:|\son\w+=|href="https?:|<!DOCTYPE|<!ENTITY|<i:/i);
          expect(svg, g.id).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
    }
  });

  it("draws the line style in the page's ink alone", () => {
    for (const g of GEARS) {
      const svg = g.svg({ style: "line" });
      expect(svg, g.id).toContain("currentColor");
      expect(svg.replace(/url\(#[^)]*\)/g, ""), g.id).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    }
  });

  it("is pure and takes a size and a theme", () => {
    for (const g of GEARS) expect(g.svg({ size: 40 })).toBe(g.svg({ size: 40 }));
    expect(renderGear("hockey-stick", { size: 33 })).toContain('width="33"');
    expect(renderGear("hockey-stick", { theme: "dark", style: "line" })).toContain('color="#eef1f3"');
    expect(renderGear("hockey-stick", { theme: "auto" })).toContain("prefers-color-scheme:dark");
  });

  it("is safe with hostile options and names", () => {
    expect(GEAR_SQUASH_RACKET.svg({ tint: '"><script>alert(1)</script>', accent: "x", size: -3 })).not.toContain("<script");
    expect(GEAR_SQUASH_RACKET.svg({ size: Number.NaN })).toContain('width="64"');
    expect(() => gearOf('"><script>')).toThrow(/Unknown gear/);
    expect(isGearId("gear:hurley")).toBe(true);
    expect(isGearId("hurley")).toBe(true);
    expect(isGearId("ball:soccer")).toBe(false);
  });

  it("takes a tint where a drawn piece has a main colour", () => {
    expect(GEAR_SQUASH_RACKET.svg({ tint: "#118833" })).toContain("#118833");
    expect(GEAR_BASEBALL_GLOVE.svg({ tint: "#118833" })).toContain("#118833");
  });

  it("holds its size budgets", () => {
    for (const g of GEARS) {
      // The judo and karate suits and belts are layered drawings (quilting, stitching, a knot), so they have a larger budget.
      const limit = /^gear:(judogi|obi|karate-gi)/.test(g.id) ? 14000 : 6000;
      for (const style of ["colour", "line"] as const) expect(g.svg({ style }).length, `${g.id} ${style}`).toBeLessThanOrEqual(limit);
    }
  });
});

describe("the styles and the turn of the gear", () => {
  it("draws the color style flat and the metal style shaded, as the trophies are", () => {
    for (const g of GEARS) {
      const flat = g.svg({ style: "color" } as never);
      expect(flat, g.id).not.toMatch(/Gradient|url\(#/);
      expect(g.svg({ style: "metal" } as never), g.id).toBe(g.svg());
    }
    expect(GEAR_BASEBALL_GLOVE.svg()).toContain("linearGradient");
    expect(GEAR_BASEBALL_GLOVE.svg({ style: "color" } as never)).not.toBe(GEAR_BASEBALL_GLOVE.svg());
  });

  it("flips like a coin when turned: no turn is the still drawing, a quarter turn is edge on, a half turn is mirrored", () => {
    for (const g of GEARS) {
      expect(g.frame({ yaw: 0, pitch: 0 }), g.id).toBe(g.svg());
      expect(g.frame({ yaw: 360 }), g.id).toBe(g.svg());
      expect(g.frame({ yaw: Number.NaN }), g.id).toBe(g.svg());
      expect(g.frame({ yaw: 90 }), g.id).toMatch(/scale\(0\.02 1\)/);
      expect(g.frame({ yaw: 180 }), g.id).toMatch(/scale\(-1 1\)/);
      expect(g.frame({ pitch: 60 }), g.id).toMatch(/scale\(1 0\.5\)/);
      for (const yaw of [-170, -45, 30, 135, 1000]) expect(g.frame({ yaw, pitch: 20, style: "line" }), `${g.id} ${yaw}`).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
});

describe("the drawing helpers", () => {
  it("writes shapes as paths", () => {
    expect(rect(1, 2, 3, 4)).toBe("M1 2h3v4h-3z");
    expect(capsule(0, 0, 10, 0, 4)).toMatch(/^M0 2L10 2A2 2/);
    expect(strings(32, 20, 10, 14, 4)).toMatch(/^M/);
  });

  it("draws a shape of varying width along a curve as a closed path", () => {
    const d = swell([10, 10], [20, 0], [40, 20], [50, 10], (t) => 2 + 4 * t, 8);
    expect(d).toMatch(/^M[\d. L-]+z$/);
    expect(d).not.toMatch(/NaN/);
    expect(d.split("L").length).toBe(2 * 9);
  });
});
