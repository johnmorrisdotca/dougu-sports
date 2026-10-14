import { readFileSync } from "node:fs";
import { describe, expect, it } from "./vitest-shim.ts";
import { GEAR_IDS, GEARS } from "../src/emblems/gear/gear.index.ts";

const manifest = JSON.parse(readFileSync("scripts/dougu/gear-assets.json", "utf8"));

describe("the copied artwork", () => {
  it("is pinned: a full commit for each repository, a SHA-256 for each file, and a licence we may use", () => {
    expect(manifest.assets.length).toBeGreaterThanOrEqual(18);
    for (const a of manifest.assets) {
      expect(a.sha256, a.key).toMatch(/^[0-9a-f]{64}$/);
      expect(["Apache-2.0", "CC0", "CC BY 3.0", "Public domain"], a.key).toContain(a.license);
      expect(a.url, a.key).toMatch(/^https:\/\//);
      if (a.source !== "commons") expect(a.pin, a.key).toMatch(/^[0-9a-f]{40}$/);
      if (a.source !== "commons") expect(a.url, a.key).toContain(a.pin);
      if (a.source === "gameicons") expect(a.license).toBe("CC BY 3.0");
      if (a.source === "noto" || a.source === "mdi") expect(a.license).toBe("Apache-2.0");
      if (a.source === "commons") expect(["CC0", "Public domain"]).toContain(a.license);
    }
    expect(new Set(manifest.assets.map((a) => a.key)).size).toBe(manifest.assets.length);
  });

  it("is what every copied module says it is made from", () => {
    const byKey = new Map(manifest.assets.map((a) => [a.key, a]));
    for (const piece of manifest.pieces) {
      const colour = byKey.get(piece.colour);
      expect(colour, piece.id).toBeDefined();
      if (piece.line !== "derived") expect(byKey.has(piece.line), piece.id).toBe(true);
      const source = readFileSync(`src/emblems/gear/gear.${piece.module}.ts`, "utf8");
      expect(source, piece.id).toContain(colour.sha256);
      expect(source, piece.id).toContain("Copied, with changes");
      expect(source, piece.id).toContain(colour.license);
      expect(GEAR_IDS, piece.id).toContain(piece.id);
    }
  });

  it("is not in the package's drawn pieces and not under any other licence", () => {
    const drawn = GEARS.filter((g) => g.source === "drawn").map((g) => g.id);
    const copiedIds = manifest.pieces.map((p) => p.id);
    expect(drawn.filter((id) => copiedIds.includes(id))).toEqual([]);
    expect(drawn.length + copiedIds.length).toBe(GEARS.length);
  });
});

