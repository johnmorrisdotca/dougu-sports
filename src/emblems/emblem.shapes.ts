// A flat object or an icon: a list of shapes, each with a role (the metal, its shade, a glint, a second colour, a fixed colour, ink, a line), drawn with gradients in the metal style, in flat fills in the
// `color` style and as one outline in the `line` style. A flat object (a medal, a crest, a plaque) also has a back face and a rim, so the turning view flips it like a coin; an icon (a sport's pictogram)
// is drawn as it is. Imports only the core.
import {
  type Emblem, type EmblemOptions, type Engraving, type EmblemSource, type FrameOptions, type Gradient, type Metal, type Resolved, type Rgb,
  bevelGradient, defsOf, degrees, escape, hexOf, mainOf, mix, n2, onColour, orbGradient, readColour, resolve, sheetGradient, wrap,
} from "./emblem.core.ts";
import { type Plate, engravingOf, linesOf, plateMarkup } from "./emblem.engrave.ts";
import { flipSvg } from "./emblem.flip.ts";

/**
 * What a shape is for. `m` the main metal, shaded across a sheet; `o` the main metal on a round, lit from a corner; `e` a bevelled ring (a line the width of the third item, bright on one side and dark on
 * the other); `s` its shade; `l` a glint (a fill with no outline, left out of the line style); `r` the second colour (a ribbon, a band: the `accent` option); `f` a fixed colour (the third item); `p` white
 * ink at a tenth; `k` ink; `n` an outline with no fill; `t` a thin line (a detail); `b` a bold line in ink (a limb, a shaft); `d` a bold line in a fixed dark colour (a numeral on a medal).
 */
export type Role = DropRole | "m" | "o" | "e" | "s" | "l" | "r" | "f" | "p" | "k" | "n" | "t" | "b" | "d";
/** A role in capitals is the same shape, left out of a face that is engraved (the star of a medal, the numeral of a place badge, the lines of a plaque). */
type DropRole = "M" | "D" | "T" | "E";
/** A path, its role, and for `f` its colour and for `e` its width. */
export type Shape = readonly [Role, string, string?];

/** A flat object or an icon. */
export interface FlatModel {
  /** The view box; "0 0 64 64" unless the drawing came from elsewhere. */
  box?: string;
  metal: Metal;
  front: readonly Shape[];
  /** The back face, for an object that flips; the front's `m`, `o` and `s` shapes with no detail when missing. */
  back?: readonly Shape[];
  /** The main colour of a `flat` object when the caller gives no tint (a crest's blue). */
  color?: string;
  /** The second colour when the caller gives none: a ribbon, a band, a board. */
  ribbon?: string;
  /** The thickness of the rim in the box's units, for an object that flips. */
  rim?: number;
  /** The outline is the page's ink (a pictogram) and not a darker tone of the metal. */
  ink?: boolean;
  /** Shapes drawn when there are no initials, for a crest (and only then). */
  blank?: readonly Shape[];
  /** Where an engraving goes: the plate of the front (and of the year when a plate of its own holds it) and of the back, and the rank the front takes when it is engraved and none is given (a place badge's own place). */
  engrave?: { front: Plate; year?: Plate; back?: Plate; rank?: string };
  /** Where a crest's letters go: the centre's x and y, and the size for one letter. */
  letters?: readonly [x: number, y: number, size: number];
}

/** The paints of a drawing: the colour of the main part and the gradients it can be painted with. */
interface Ctx {
  main: Rgb;
  style: Resolved["style"];
  sheet: Gradient;
  orb: Gradient;
  bevel: Gradient;
  ribbon: string;
  initials: string;
  engrave: Engraving;
  used: Gradient[];
}

const use = (ctx: Ctx, g: Gradient): string => {
  ctx.used.push(g);
  return g.fill;
};

/** The attributes of one shape. In the metal style the fills are gradients, in `color` flat colours. */
function attrs(shape: Shape, ctx: Ctx): string {
  const metal = ctx.style === "metal";
  const flatMain = hexOf(ctx.main);
  switch (shape[0]) {
    case "m": return `fill="${metal ? use(ctx, ctx.sheet) : flatMain}"`;
    case "o": return `fill="${metal ? use(ctx, ctx.orb) : flatMain}"`;
    case "e": return `fill="none" stroke="${metal ? use(ctx, ctx.bevel) : mix(ctx.main, 0.4)}" stroke-width="${shape[2] ?? "2"}"`;
    case "s": return `fill="${mix(ctx.main, -0.28)}"`;
    case "l": return `fill="${mix(ctx.main, 0.55)}" fill-opacity="${metal ? ".55" : "1"}" stroke="none"`;
    case "r": return `fill="${ctx.ribbon}"`;
    case "f": return `fill="${shape[2] ?? "#ffffff"}"`;
    case "p": return 'fill="currentColor" fill-opacity=".1"';
    case "k": return 'fill="currentColor"';
    case "t": return 'fill="none" stroke-width="1.5"';
    case "b": return 'fill="none" stroke-width="4.4"';
    case "d": return 'fill="none" stroke="#20262d" stroke-width="4.2"';
    default: return 'fill="none"';
  }
}

/** The shapes as markup: consecutive shapes of one role (and colour) are one path. In the line style everything is one outline (the details a little thinner), and the glints are left out. */
function shapesMarkup(shapes: readonly Shape[], ctx: Ctx): string {
  if (ctx.style === "line") {
    const join = (roles: string): string => shapes.filter((s) => roles.includes(s[0])).map((s) => s[1]).join("");
    const main = join("mosrfpkn");
    const thin = join("te");
    const bold = join("bd");
    return (main === "" ? "" : `<path d="${main}"/>`) + (thin === "" ? "" : `<path d="${thin}" stroke-width="2"/>`) + (bold === "" ? "" : `<path d="${bold}"/>`);
  }
  let out = "";
  let i = 0;
  while (i < shapes.length) {
    const [role, , extra] = shapes[i];
    let d = "";
    while (i < shapes.length && shapes[i][0] === role && shapes[i][2] === extra) d += shapes[i++][1];
    out += `<path d="${d}" ${attrs([role, d, extra], ctx)}/>`;
  }
  return out;
}

/** The letters of a crest. */
function letters(model: FlatModel, ctx: Ctx): string {
  if (model.letters === undefined || ctx.initials === "") return "";
  const [x, y, size] = model.letters;
  const n = [...ctx.initials].length;
  const fs = n === 1 ? size : n === 2 ? size * 0.82 : size * 0.64;
  return `<text x="${x}" y="${n2(y + fs * 0.36)}" font-size="${n2(fs)}" font-weight="800" font-family="system-ui,sans-serif" text-anchor="middle" fill="${ctx.style === "line" ? "currentColor" : onColour(ctx.main)}" stroke="none">${escape(ctx.initials)}</text>`;
}

/** The lines cut into the face on `side`, as markup, or an empty string when there is nothing to cut or nowhere to cut it. */
function engraved(model: FlatModel, ctx: Ctx, side: "front" | "back"): string {
  const e = ctx.engrave;
  const plates = model.engrave;
  if (plates === undefined) return "";
  if (side === "back") return plates.back === undefined || e.back === undefined ? "" : plateMarkup(linesOf({ free: e.back }).main, plates.back, ctx.main, ctx.style);
  if (e.free === undefined && e.label === undefined && e.year === undefined && e.rank === undefined) return "";
  const { main, year } = linesOf(e, { rank: plates.rank, yearApart: plates.year !== undefined });
  return plateMarkup(main, plates.front, ctx.main, ctx.style) + (year === undefined || plates.year === undefined ? "" : plateMarkup([[{ text: year, weight: 1 }]], plates.year, ctx.main, ctx.style));
}

/** One face of an object as markup: its shapes (the ones an engraving replaces left out when there is one), then the engraving, and a crest's letters. */
function face(model: FlatModel, shapes: readonly Shape[], ctx: Ctx, text = ""): string {
  const shown = shapes.filter((x) => text === "" || x[0] === x[0].toLowerCase()).map((x) => (x[0] === x[0].toLowerCase() ? x : ([x[0].toLowerCase(), x[1], x[2]] as unknown as Shape)));
  const blank = ctx.initials === "" && model.blank !== undefined ? shapesMarkup(model.blank, ctx) : "";
  return shapesMarkup(shown, ctx) + blank + letters(model, ctx) + text;
}

function context(model: FlatModel, r: Resolved): Ctx {
  const main = r.tint ?? (model.color === undefined ? mainOf(model.metal, undefined) : (readColour(model.color) as Rgb));
  return { main, style: r.style, sheet: sheetGradient(main), orb: orbGradient(main), bevel: bevelGradient(main), ribbon: r.accent ?? model.ribbon ?? "#c0392b", initials: r.initials, engrave: {}, used: [] };
}

function document(title: string, model: FlatModel, r: Resolved, ctx: Ctx, body: string): string {
  return wrap({ title, size: r.size, style: r.style, theme: r.theme, defs: r.style === "metal" ? defsOf(ctx.used) : "", body, box: model.box, edge: model.ink === true ? undefined : mix(ctx.main, -0.5), width: model.ink === true ? undefined : 0.8 });
}

/** A flat object (a medal, a crest, a plaque): drawn as it is by `svg`; turned about its vertical axis it flips like a coin and shows its back, with its rim for a moment edge on. */
export function defineFlat(id: string, en: string, ja: string, source: EmblemSource, model: FlatModel): Emblem<FlatModel> {
  const draw = (o: FrameOptions | undefined, yaw: number, pitch: number): string => {
    const r = resolve(o);
    const ctx = context(model, r);
    ctx.engrave = engravingOf(o);
    if (yaw === 0 && pitch === 0) return document(en, model, r, ctx, face(model, model.front, ctx, engraved(model, ctx, "front")));
    const across = Math.cos((yaw * Math.PI) / 180);
    const tilt = Math.cos((pitch * Math.PI) / 180);
    const shown = across >= 0 ? model.front : (model.back ?? model.front.filter((x) => x[0] === "m" || x[0] === "o" || x[0] === "s"));
    const sx = Math.max(Math.abs(across), 0.02);
    const sy = Math.max(Math.abs(tilt), 0.02);
    const rim = (model.rim ?? 0) * Math.sin((yaw * Math.PI) / 180);
    const [x0, y0, w, h] = (model.box ?? "0 0 64 64").split(" ").map(Number) as [number, number, number, number];
    const thick = rim === 0 ? "" : `<g transform="translate(${n2(rim)} 0)">${shapesMarkup(model.front.filter((x) => x[0] === "m" || x[0] === "o").map((x) => ["s", x[1]] as const), ctx)}</g>`;
    return document(en, model, r, ctx, `<g transform="translate(${n2(x0 + w / 2)} ${n2(y0 + h / 2)}) scale(${n2(sx)} ${n2(sy)}) translate(${n2(-x0 - w / 2)} ${n2(-y0 - h / 2)})">${thick}${face(model, shown, ctx, engraved(model, ctx, across >= 0 ? "front" : "back"))}</g>`);
  };
  return { id, en, ja, source, kind: "flat", model, svg: (o?: EmblemOptions) => draw(o, 0, 0), frame: (o?: FrameOptions) => draw(o, degrees(o?.yaw), degrees(o?.pitch)) };
}

/** An icon: one drawing from shapes. Turned, it is a thin cut-out: it squeezes like a coin, shows its front mirrored and a little darker past a quarter turn, and has a dark rim. */
export function defineIcon(id: string, en: string, ja: string, source: EmblemSource, model: FlatModel): Emblem<FlatModel> {
  const svg = (o?: EmblemOptions): string => {
    const r = resolve(o);
    const ctx = context(model, r);
    return document(en, model, r, ctx, face(model, model.front, ctx));
  };
  const frame = (o?: FrameOptions): string => flipSvg(svg(o), { yaw: degrees(o?.yaw), pitch: degrees(o?.pitch), line: o?.style === "line", thick: 0.03 });
  return { id, en, ja, source, kind: "icon", model, svg, frame };
}

/** A circle as a path, so every shape is one kind of thing. */
export const circlePath = (cx: number, cy: number, r: number): string => `M${n2(cx - r)} ${n2(cy)}a${n2(r)} ${n2(r)} 0 1 0 ${n2(2 * r)} 0a${n2(r)} ${n2(r)} 0 1 0 ${n2(-2 * r)} 0Z`;
/** An ellipse as a path. */
export const ellipsePath = (cx: number, cy: number, rx: number, ry: number): string => `M${n2(cx - rx)} ${n2(cy)}a${n2(rx)} ${n2(ry)} 0 1 0 ${n2(2 * rx)} 0a${n2(rx)} ${n2(ry)} 0 1 0 ${n2(-2 * rx)} 0Z`;

/** A star as a path, one point up. */
export function starPath(cx: number, cy: number, outer: number, inner: number, points = 5): string {
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    parts.push(`${i === 0 ? "M" : "L"}${n2(cx + r * Math.cos(angle))} ${n2(cy + r * Math.sin(angle))}`);
  }
  return `${parts.join("")}Z`;
}
