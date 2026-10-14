import { describe, expect, it } from "./vitest-shim.ts";
import { GEAR_IDS, GEARS, gearOf, isGearId, renderGear } from "../src/emblems/gear/gear.index.ts";
import { GEAR_BASEBALL_GLOVE } from "../src/emblems/gear/gear.baseballglove.ts";
import { GEAR_SQUASH_RACKET } from "../src/emblems/gear/gear.rackets.ts";
import { capsule, monoOf, rect, strings } from "../src/emblems/gear/gear.core.ts";

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
  it("has thirty-three ids, each once, in the form gear:name", () => {
    expect(GEARS.length).toBe(33);
    expect(new Set(GEAR_IDS).size).toBe(33);
    for (const id of GEAR_IDS) expect(id).toMatch(/^gear:[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("names each piece in English and Japanese and says where it comes from", () => {
    for (const g of GEARS) {
      expect(g.en.length).toBeGreaterThan(3);
      expect(g.ja).toMatch(/[\u3040-\u30ff\u4e00-\u9fff]/);
      expect(["drawn", "noto", "commons", "gameicons"]).toContain(g.source);
      expect(g.kind).toBe("gear");
    }
    expect(GEARS.filter((g) => g.source === "drawn").length).toBe(22);
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
      const limit = g.source === "drawn" ? 6000 : 16000;
      for (const style of ["colour", "line"] as const) expect(g.svg({ style }).length, `${g.id} ${style}`).toBeLessThanOrEqual(limit);
    }
  });

  it("carries the credit its licence asks for inside every copied piece", () => {
    for (const g of GEARS.filter((p) => p.source !== "drawn")) {
      const svg = g.svg();
      expect(svg, g.id).toContain("<desc>");
      if (g.source === "noto") expect(svg).toContain("Copyright 2013 Google, Inc.");
      if (g.source === "noto") expect(svg).toContain("Apache-2.0");
      if (g.source === "gameicons") {
        expect(svg).toContain("Delapouite");
        expect(svg).toContain("CC BY 3.0");
      }
      if (g.source === "commons") expect(svg).toMatch(/CC0|Public domain/);
    }
  });
});

describe("the drawing helpers", () => {
  it("writes shapes as paths", () => {
    expect(rect(1, 2, 3, 4)).toBe("M1 2h3v4h-3z");
    expect(capsule(0, 0, 10, 0, 4)).toMatch(/^M0 2L10 2A2 2/);
    expect(strings(32, 20, 10, 14, 4)).toMatch(/^M/);
  });

  it("turns a colour drawing into ink: dark parts become the ink, light parts are left out", () => {
    const out = monoOf('<linearGradient id="a"><stop/></linearGradient><path fill="#101010" d="M0 0"/><path fill="#ffffff" d="M1 1"/><path stroke="#ff0000" fill="url(#a)" d="M2 2"/>');
    expect(out).toContain('fill="currentColor"');
    expect(out).toContain('fill="none"');
    expect(out).toContain('stroke="currentColor"');
    expect(out).not.toContain("linearGradient");
  });
});
