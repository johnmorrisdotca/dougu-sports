import { describe, expect, it } from "./vitest-shim.ts";
import { galleryHtml } from "../scripts/dougu/gallery-page.mjs";
import { BALLS, lineup } from "../src/emblems/ball/ball.index.ts";
import { GEARS } from "../src/emblems/gear/gear.index.ts";

describe("the gallery page", () => {
  const html = galleryHtml({ BALLS, GEARS, lineup });

  it("shows every ball and every piece of gear with its id and names", () => {
    for (const piece of [...BALLS, ...GEARS]) {
      expect(html, piece.id).toContain(`<code>${piece.id}</code>`);
      expect(html, piece.id).toContain(piece.ja);
    }
  });

  it("draws both styles of each, and gives a ball a button that turns it", () => {
    expect((html.match(/<button type="button" class="turn"/g) ?? []).length).toBe(BALLS.length);
    expect((html.match(/class="line"/g) ?? []).length).toBe(BALLS.length + GEARS.length);
    expect(html).toContain("true relative sizes");
    expect(html).toContain("ballFrame");
  });

  it("is a document that needs no stylesheet from outside and names the library it imports", () => {
    expect(html.startsWith("<!doctype html>")).toBe(true);
    const withoutCredits = html.replace(/<desc>[^<]*<\/desc>/g, "");
    expect(withoutCredits).not.toMatch(/<link |<script src|https?:\/\/(?!www\.w3\.org)/);
    expect(html).toContain('from "./dist/emblems/ball/ball.index.js"');
    expect(galleryHtml({ BALLS, GEARS, lineup }, "../lib")).toContain('from "../lib/emblems/ball/ball.index.js"');
    expect(html).toContain("prefers-reduced-motion");
  });
});
