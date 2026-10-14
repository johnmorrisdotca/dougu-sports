import { describe, expect, it } from "./vitest-shim.ts";
import { absolutize, iconPath, minify, parsePath } from "../scripts/dougu/svgmin.mjs";

describe("the minifier of the copied artwork", () => {
  it("writes relative paths absolute, without drift", () => {
    expect(absolutize("m1 1l2 0 0 3h-2z", 1)).toBe("M1 1L3 1L3 4H1Z");
    expect(absolutize("M0 0c1 1 2 1 3 0s2-1 3 0", 1)).toBe("M0 0C1 1 2 1 3 0C4 -1 5 -1 6 0");
    // Many small relative steps must end where the exact sum does.
    const steps = "m0 0" + "l.04 .04".repeat(500);
    expect(absolutize(steps, 1).endsWith("L20 20")).toBe(true);
  });

  it("reads arc flags that run into the numbers after them", () => {
    const parsed = parsePath("M0 0a1 1 0 011 1");
    expect(parsed[1].args).toEqual([1, 1, 0, 0, 1, 1, 1]);
    expect(absolutize("M0 0a2 2 0 1 0 4 0", 1)).toBe("M0 0A2 2 0 1 0 4 0");
  });

  it("drops an editor's wrapper, metadata and unused ids, keeps the ids that gradients use, and turns styles into attributes", () => {
    const source = `<?xml version="1.0"?><!DOCTYPE svg PUBLIC "x" [<!ENTITY a "b">]><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" id="top"><switch><foreignObject x="0">z</foreignObject><g i:extraneous="self"><defs><linearGradient id="g1"><stop offset=".50000" style="stop-color:#ff0000"/></linearGradient></defs><path id="p" style="fill:url(#g1);stroke-width:2" d="m0.123456 0.654321l10.123456 0"/><metadata>m</metadata></g></switch></svg>`;
    const { box, markup } = minify(source, "q");
    expect(box).toBe("0 0 128 128");
    expect(markup).not.toMatch(/DOCTYPE|foreignObject|switch|metadata|i:extraneous|id="p"|id="top"|style=/);
    expect(markup).toContain('id="q0"');
    expect(markup).toContain('fill="url(#q0)"');
    expect(markup).toContain('stop-color="#ff0000"');
    expect(markup).toContain('d="M0.1 0.7L10.2 0.7"');
  });

  it("refuses artwork that carries a script, an image or an outside reference", () => {
    expect(() => minify('<svg viewBox="0 0 10 10"><script>x</script></svg>', "q")).toThrow();
    expect(() => minify('<svg viewBox="0 0 10 10"><image href="data:image/png;base64,AA"/></svg>', "q")).toThrow();
    expect(() => minify('<svg viewBox="0 0 10 10"><use href="https://example.com/a.svg#x"/></svg>', "q")).toThrow();
  });

  it("reads a one-path icon and leaves a background out when asked", () => {
    const icon = iconPath('<svg viewBox="0 0 512 512"><path d="M0 0h512v512H0z"/><path fill="#fff" d="M10 10h20v20z"/></svg>', ["M0 0h512v512H0z"]);
    expect(icon.box).toBe("0 0 512 512");
    expect(icon.d).toBe("M10 10H30V30Z");
  });
});
