// A Material Symbols icon (Google, Apache License 2.0; see NOTICE.md): the filled symbol is the metal style (with a gradient and a darker edge), the outlined symbol is the line style, and the `color` style
// is the filled symbol in one flat colour. The paths are data in emblem.material.data.ts, one constant each, so an icon's module takes only its own. Imports only the core.
import { flipSvg } from "./emblem.flip.ts";
import { type Emblem, type EmblemOptions, type FrameOptions, type Metal, defsOf, degrees, hexOf, mainOf, mix, resolve, sheetGradient, wrap } from "./emblem.core.ts";

/** What a Material icon is drawn from: its two paths, in a 960 box whose top is at -960, and the metal that paints it. */
export interface MaterialModel {
  outlined: string;
  filled: string;
  metal: Metal;
}

/** An icon from Material Symbols. A `flat` icon is drawn in the page's ink unless it is tinted. */
export function defineMaterial(id: string, en: string, ja: string, paths: readonly [outlined: string, filled: string], metal: Metal): Emblem<MaterialModel> {
  const model: MaterialModel = { outlined: paths[0], filled: paths[1], metal };
  const svg = (o?: EmblemOptions): string => {
    const r = resolve(o);
    const main = mainOf(metal, r.tint);
    const coloured = r.tint !== undefined || metal !== "flat";
    const gradient = sheetGradient(main);
    const edge = mix(main, -0.45);
    let body: string;
    if (r.style === "line") body = `<path d="${paths[0]}" fill="currentColor" stroke="none"/>`;
    else if (!coloured) body = `<path d="${paths[1]}" fill="currentColor" stroke="none"/>`;
    else body = `<path d="${paths[1]}" fill="${r.style === "metal" ? gradient.fill : hexOf(main)}" stroke="${edge}" stroke-width="12"/>`;
    return wrap({ box: "0 -960 960 960", title: en, size: r.size, style: r.style, theme: r.theme, defs: r.style === "metal" && coloured ? defsOf([gradient]) : "", body });
  };
  const frame = (o?: FrameOptions): string => flipSvg(svg(o), { yaw: degrees(o?.yaw), pitch: degrees(o?.pitch), line: o?.style === "line", thick: 0.03 });
  return { id, en, ja, source: "material", kind: "icon", model, svg, frame };
}
