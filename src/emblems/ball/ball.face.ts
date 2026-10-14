// The print on a puck's top face: the designs (a Canadian flag with its country below it, a red leaf, a white face with red bands, stars and stripes, a navy face with rings, a player's name and number, a made-up
// signature, a generic souvenir) and the options that change them. The face is drawn in its own units, a disc of radius 1 whose up is up, and ball.print.ts lays that disc on the top of the puck in 3D. All of it
// is our own drawing: our own leaf, our own flags, our own lettering (ball.letters.ts) and no mark, name or wordmark of a team, a league or a maker. Imports only this folder's helpers.
import { hexOf, num, readColour } from "./ball.core.ts";
import { FLAG, LEAF_PATH, canadaFlag, star, starsAndStripes, usaFlag } from "./ball.art.ts";
import { safeImage, type SafeImage } from "./ball.image.ts";
import { type Lettering, arcPath, fitSize, linePath } from "./ball.letters.ts";
import { signaturePath } from "./ball.signature.ts";

/** The designs a face starts from. */
export type PuckDesign = "canada" | "canada-red" | "canada-white" | "usa" | "usa-navy" | "player" | "souvenir";

/** What the renderer a caller supplies for a flag is asked: the code, the shape (`"4:3"`, `"1:1"` or `"round"`, the shapes hata draws), a size in pixels and the theme. It returns an SVG document. */
export type FlagRenderer = (code: string, options: { shape: "4:3" | "1:1" | "round"; size: number; theme: "light" | "dark" | "auto" | "inherit" }) => string;

/** The colours of a face, by name. The array form is the same list in this order: field, ring, ink, accent, signature. */
export interface FaceColors {
  /** The disc's own colour. */
  field?: string;
  /** The ring round the edge, where the face has one. */
  ring?: string;
  /** The lettering on the ring, and the main lettering on a dark face. */
  ink?: string;
  /** The second colour: the leaf, a number's fill, the stars. */
  accent?: string;
  /** The marker of a signature. */
  signature?: string;
}

/**
 * The print on a puck's top face. Everything is optional, and what is not given comes from the design (the puck's own id says which, or `design`). Text is cleaned (no control characters, 24 letters a line) and
 * drawn in our own vector lettering, so any letter, digit or `- . , ' / : &` is available and any other character is left out.
 */
export interface PuckFace {
  /** The design to start from. A puck with an id of its own already has one; `puck:souvenir` and `ball:puck` take it from here. */
  design?: PuckDesign;
  /** Any SVG: a logo, a crest, a drawing. Made safe first (see `safeImage`): shapes, gradients and clip paths only. It is fitted into the middle of the face and replaces the design's own picture. */
  image?: string;
  /** A country code (`"ca"` and `"us"` are drawn by this package; another needs `flags`). It replaces the design's own picture. */
  flag?: string;
  /** A renderer for the flag codes this package does not draw: `(code, { shape, size, theme }) => svg`, the shape of the function hata exports. */
  flags?: FlagRenderer;
  /** The id of a dougu emblem (`"trophy:cup"`, `"sport:nhl"`), drawn small in the middle. Resolved by `renderEmblem`, `emblemFrame` and `ballFrame`. */
  emblem?: string;
  /** The words under the picture (`"CANADA"`), one line. */
  text?: string;
  /** The words round the edge. A string is set on the top; a pair is the top and the bottom; `false` leaves the ring out. */
  ringText?: string | readonly [string, string] | false;
  /** A big number, like a jersey's. Up to three characters. */
  number?: string | number;
  /** A surname, set on the ring like a jersey's name. */
  name?: string;
  /** A seed for a made-up signature, or `false` for none. A number or any text; the same seed always draws the same squiggle, and no seed is a real person's hand. */
  signature?: number | string | false;
  /** The colours: by name, or as an array in the order field, ring, ink, accent, signature. A colour is `#rgb`, `#rrggbb` or `rgb()`; anything else is ignored. */
  colors?: FaceColors | readonly (string | undefined)[];
}

interface Look {
  field: string;
  ring: string;
  ink: string;
  accent: string;
  signature: string;
}

const LOOKS: Readonly<Record<PuckDesign, Look>> = {
  canada: { field: "#fbf8f2", ring: "#c4202d", ink: "#ffffff", accent: FLAG.red, signature: "#1b1b1b" },
  "canada-red": { field: FLAG.red, ring: "#1d222b", ink: "#ffffff", accent: "#ffffff", signature: "#e8b923" },
  "canada-white": { field: "#fbf8f2", ring: "#c4202d", ink: "#c4202d", accent: FLAG.red, signature: "#1b1b1b" },
  usa: { field: "#ffffff", ring: "#0f2a5c", ink: "#ffffff", accent: FLAG.usRed, signature: "#1b1b1b" },
  "usa-navy": { field: "#0f2a5c", ring: "#b31942", ink: "#ffffff", accent: "#ffffff", signature: "#e8b923" },
  player: { field: "#1f4e8c", ring: "#0d2347", ink: "#ffffff", accent: "#f2b705", signature: "#e8b923" },
  souvenir: { field: "#f4f1e8", ring: "#13325e", ink: "#ffffff", accent: "#c4202d", signature: "#1b1b1b" },
};

/** The words and the signature a design starts with; the caller's own options replace them. */
const WORDS: Readonly<Record<PuckDesign, PuckFace>> = {
  canada: { flag: "ca", text: "CANADA", ringText: ["CANADA · ICE HOCKEY", "SOUVENIR PUCK"] },
  "canada-red": { text: "CANADA", ringText: ["CANADA · ICE HOCKEY", "SOUVENIR PUCK"] },
  "canada-white": { text: "CANADA", ringText: false },
  usa: { text: "USA", ringText: ["UNITED STATES · ICE HOCKEY", "SOUVENIR PUCK"] },
  "usa-navy": { text: "USA", ringText: ["UNITED STATES · ICE HOCKEY", "SOUVENIR PUCK"] },
  player: { name: "MORRIS", number: 23, ringText: ["", "ICE HOCKEY"] },
  souvenir: { text: "SOUVENIR", ringText: ["ICE HOCKEY · COLLECTOR EDITION", ""] },
};

/** What a puck is drawn with: the design's words and colours with the caller's face laid over them. */
interface Resolved {
  design: PuckDesign;
  look: Look;
  image: string | undefined;
  flag: string | undefined;
  flags: FlagRenderer | undefined;
  text: string | undefined;
  ring: readonly [string, string] | undefined;
  number: string | undefined;
  name: string | undefined;
  signature: number | string | undefined;
}

/** A text from outside made safe: control characters out, 24 characters a line, one line, or `undefined` when nothing is left. */
const cleanText = (value: unknown, max = 24): string | undefined => {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const text = [...String(value).replace(/\p{Cc}/gu, " ").replace(/\s+/g, " ").trim()].slice(0, max).join("");
  return text === "" ? undefined : text;
};

const colourOf = (value: unknown): string | undefined => {
  const rgb = typeof value === "string" ? readColour(value) : undefined;
  return rgb === undefined ? undefined : hexOf(rgb);
};

const DESIGNS = Object.keys(LOOKS) as PuckDesign[];

/** The face, ready to draw: the design's words and colours under the caller's. `base` is the design a puck's own id starts from. */
function resolve(face: PuckFace | undefined, base: PuckDesign, own: PuckFace | undefined): Resolved {
  const f = typeof face === "object" && face !== null ? face : {};
  const design = (typeof f.design === "string" && DESIGNS.includes(f.design) ? f.design : own?.design ?? base) as PuckDesign;
  const words = { ...WORDS[design], ...own, ...definedOnly(f) };
  const look = { ...LOOKS[design] };
  for (const source of [own?.colors, f.colors]) {
    const list = Array.isArray(source) ? { field: source[0], ring: source[1], ink: source[2], accent: source[3], signature: source[4] } : (source as FaceColors | undefined);
    for (const key of ["field", "ring", "ink", "accent", "signature"] as const) {
      const c = colourOf(list?.[key]);
      if (c !== undefined) look[key] = c;
    }
  }
  const ringText = words.ringText;
  const ring: readonly [string, string] | undefined =
    ringText === false ? undefined : typeof ringText === "string" ? [cleanText(ringText, 32) ?? "", ""] : Array.isArray(ringText) ? [cleanText(ringText[0], 32) ?? "", cleanText(ringText[1], 32) ?? ""] : undefined;
  const number = typeof words.number === "number" || typeof words.number === "string" ? String(words.number).replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase() : "";
  const sig = words.signature;
  return {
    design,
    look,
    image: typeof words.image === "string" ? words.image : undefined,
    flag: typeof words.flag === "string" ? words.flag.trim().toLowerCase().slice(0, 12) : undefined,
    flags: typeof words.flags === "function" ? words.flags : undefined,
    text: cleanText(words.text),
    ring,
    number: number === "" ? undefined : number,
    name: cleanText(words.name, 14),
    signature: sig === false || sig === undefined || sig === null ? undefined : typeof sig === "number" ? (Number.isFinite(sig) ? sig : undefined) : cleanText(sig, 40),
  };
}

/** A face's own fields that are set (a field of `undefined` does not replace the design's). */
const definedOnly = (face: PuckFace): PuckFace => Object.fromEntries(Object.entries(face).filter(([, v]) => v !== undefined && !(typeof v === "number" && !Number.isFinite(v)))) as PuckFace;

/** The ink of one line of lettering, with the outline under it when there is one. */
function word(text: string, o: Lettering, x: number, y: number, fill: string, outline?: string, outlineWidth = 0): string {
  const d = linePath(text, o, x, y);
  const join = ` fill="none" stroke-linejoin="miter" stroke-miterlimit="2"`;
  return (outline === undefined ? "" : `<path d="${d}"${join} stroke="${outline}" stroke-width="${num(o.weight * o.size + outlineWidth, 3)}"/>`) + `<path d="${d}"${join} stroke="${fill}" stroke-width="${num(o.weight * o.size, 3)}"/>`;
}

/** The letters of the ring, on the top and on the bottom, set on the circle of radius `r` with letters `size` tall, in the ink. */
function ringLetters(ring: readonly [string, string], r: number, size: number, ink: string): string {
  const spec = { weight: 0.17, wide: 1.12, track: 0.08 };
  let out = "";
  const set = (text: string, centre: number, inside: boolean): void => {
    if (text === "") return;
    const s = Math.min(size, fitSize(text, spec, r * 2.3, size));
    const o = { ...spec, size: s };
    out += `<path d="${arcPath(text, o, r, centre, inside)}" fill="none" stroke="${ink}" stroke-width="${num(o.weight * s, 3)}" stroke-linejoin="miter" stroke-miterlimit="2"/>`;
  };
  set(ring[0], 0, false);
  set(ring[1], 180, true);
  return out;
}

/** The disc's flat ground, and the ring band when there is one (inner radius `ri`). */
const ground = (look: Look, ringed: boolean, ri: number): string => `<circle r=".97" fill="${look.field}"/>` + (ringed ? `<path d="M0-.97A.97.97 0 1 1 0 .97A.97.97 0 1 1 0-.97ZM0-${ri}A${ri} ${ri} 0 1 0 0 ${ri}A${ri} ${ri} 0 1 0 0-${ri}Z" fill="${look.ring}" fill-rule="evenodd"/>` : "");

/** What the picture of a face is: a safe image fitted into a box, or `undefined`. The id prefix keeps two faces in a page apart. */
function picture(f: Resolved, prefix: string, cx: number, cy: number, w: number, h: number): { defs: string; body: string; width: number; height: number } | undefined {
  const fit = (img: SafeImage, tag: string): { defs: string; body: string; width: number; height: number } => {
    const [x, y, bw, bh] = img.box;
    const k = Math.min(w / bw, h / bh);
    const cid = `${prefix}${tag}c`;
    const t = `translate(${num(cx - (x + bw / 2) * k, 3)} ${num(cy - (y + bh / 2) * k, 3)}) scale(${num(k, 5)})`;
    return { defs: `<clipPath id="${cid}"><rect x="${num(x, 3)}" y="${num(y, 3)}" width="${num(bw, 3)}" height="${num(bh, 3)}"/></clipPath>`, body: `<g transform="${t}" clip-path="url(#${cid})" color="${f.look.accent}">${img.markup}</g>`, width: bw * k, height: bh * k };
  };
  if (f.image !== undefined) {
    const img = safeImage(f.image, `${prefix}i`);
    if (img !== undefined) return fit(img, "i");
  }
  if (f.flag !== undefined) {
    const code = f.flag;
    if (f.flags !== undefined) {
      let svg: unknown;
      try {
        svg = f.flags(code, { shape: "4:3", size: 120, theme: "light" });
      } catch {
        svg = undefined;
      }
      const img = safeImage(svg, `${prefix}f`);
      if (img !== undefined) return fit(img, "f");
    }
    if (code === "ca") return { defs: "", body: canadaFlag(cx, cy, Math.min(w, h * 2)) + `<rect x="${num(cx - Math.min(w, h * 2) / 2, 3)}" y="${num(cy - Math.min(w, h * 2) / 4, 3)}" width="${num(Math.min(w, h * 2), 3)}" height="${num(Math.min(w, h * 2) / 2, 3)}" fill="none" stroke="#9a9a9a" stroke-width=".008"/>`, width: Math.min(w, h * 2), height: Math.min(w, h * 2) / 2 };
    if (code === "us") return { defs: "", body: usaFlag(cx, cy, Math.min(w, h * 1.9)), width: Math.min(w, h * 1.9), height: Math.min(w, h * 1.9) / 1.9 };
  }
  return undefined;
}

const LETTERS = { weight: 0.22, wide: 1.32, slant: 0.1, track: 0.02 } as const;

/** The middle of the face in the style of any design: a picture (if there is one) with the words under it, or the words alone, or a number, or a star. `ri` is the radius of the open disc. */
function middle(f: Resolved, prefix: string, ri: number, ink: string, outline: string | undefined): { defs: string; body: string } {
  const pic = picture(f, prefix, 0, 0, ri * 1.3, ri * 0.82);
  const text = f.text;
  const number = f.number;
  let defs = "";
  let body = "";
  if (number !== undefined) {
    const s = fitSize(number, LETTERS, ri * 1.3, ri * 1.0);
    body += word(number, { ...LETTERS, size: s }, 0, -0.02, f.look.accent, outline ?? ink, s * 0.1);
    if (text !== undefined) body += word(text, { ...LETTERS, size: fitSize(text, LETTERS, ri * 1.2, ri * 0.18) }, 0, ri * 0.74, ink);
    return { defs, body };
  }
  if (pic !== undefined) {
    const withText = text !== undefined;
    const dy = withText ? -ri * 0.2 : 0;
    const placed = picture(f, prefix, 0, dy, ri * (withText ? 1.2 : 1.5), ri * (withText ? 0.8 : 1.4)) as NonNullable<typeof pic>;
    defs += placed.defs;
    body += placed.body;
    if (withText) {
      const y = dy + placed.height / 2 + ri * 0.26;
      const s = fitSize(text, LETTERS, Math.sqrt(Math.max(0.01, ri * ri - y * y)) * 1.85, ri * 0.2);
      body += word(text, { ...LETTERS, size: s }, 0, y, ink);
    }
    return { defs, body };
  }
  if (text !== undefined && f.design !== "souvenir") {
    const s = fitSize(text, LETTERS, ri * 1.6, ri * 0.5);
    body += word(text, { ...LETTERS, size: s }, 0, 0, ink, outline, s * 0.12);
    return { defs, body };
  }
  if (text !== undefined) {
    body += star(0, -ri * 0.2, ri * 0.4, f.look.accent);
    body += word(text, { ...LETTERS, size: fitSize(text, LETTERS, ri * 1.3, ri * 0.2) }, 0, ri * 0.5, ink);
    return { defs, body };
  }
  body += star(0, 0, ri * 0.5, f.look.accent);
  return { defs, body };
}

/** A signature across the lower half of the face. */
function signed(f: Resolved): string {
  if (f.signature === undefined) return "";
  const k = 1.12;
  const sw = 0.034 / k;
  return `<path d="${signaturePath(f.signature)}" transform="translate(.02 .2) rotate(-9) scale(${k})" fill="none" stroke="${f.look.signature}" stroke-width="${num(sw, 4)}" stroke-linecap="round" stroke-linejoin="round" opacity=".94"/>`;
}

/** The leaf of the white face, big, with the bands. */
function leaf(cx: number, cy: number, w: number, fill: string): string {
  return `<path d="${LEAF_PATH}" transform="translate(${num(cx, 3)} ${num(cy, 3)}) scale(${num(w / 2, 4)})" fill="${fill}"/>`;
}

/** The face of a design, in the face's units (a disc of radius 1, up is up): its definitions and its drawing. `prefix` makes every id unique to this puck. */
export function faceMarkup(face: PuckFace | undefined, design: PuckDesign, own: PuckFace | undefined, prefix: string): { defs: string; body: string } {
  const f = resolve(face, design, own);
  const look = f.look;
  const clip = `${prefix}clip`;
  let defs = `<clipPath id="${clip}"><circle r=".965"/></clipPath>`;
  let body = "";
  const ringed = f.ring !== undefined && f.design !== "canada-white";
  switch (f.design) {
    case "canada-white": {
      // A white face, the flag's red bands left and right, a big red leaf and the country under it.
      body += ground(look, false, 0);
      body += `<rect x="-1" y="-1" width=".42" height="2" fill="${look.accent}"/><rect x=".58" y="-1" width=".42" height="2" fill="${look.accent}"/>`;
      const pic = picture(f, prefix, 0, -0.1, 1.0, 1.0);
      if (pic !== undefined) {
        defs += pic.defs;
        body += pic.body;
      } else body += leaf(0, -0.22, 1.0, look.accent);
      if (f.text !== undefined) body += word(f.text, { ...LETTERS, size: fitSize(f.text, LETTERS, 0.98, 0.17) }, 0, 0.6, look.accent);
      if (f.ring !== undefined) body += ringLetters(f.ring, 0.88, 0.09, look.accent);
      break;
    }
    case "usa": {
      const ri = 0.73;
      body += ground(look, true, ri);
      if (f.image !== undefined || f.flag !== undefined) {
        // The caller's own picture takes the place of the stars and stripes.
        const mid = middle(f, prefix, ri, look.ring, undefined);
        body += mid.body;
        defs += mid.defs;
      } else {
        body += `<g clip-path="url(#${prefix}u)"><g transform="scale(${num(ri, 3)})">${starsAndStripes(2, 2, 1.04, 0.92, look.accent, "#ffffff", look.ring)}</g></g>`;
        defs += `<clipPath id="${prefix}u"><circle r="${ri}"/></clipPath>`;
        if (f.text !== undefined) {
          const s = fitSize(f.text, LETTERS, 1.05, 0.3);
          body += word(f.text, { ...LETTERS, size: s }, 0, 0.34, "#ffffff", look.ring, s * 0.16);
        }
      }
      if (f.ring !== undefined) body += ringLetters(f.ring, 0.855, 0.115, look.ink);
      break;
    }
    case "usa-navy": {
      // Navy, a red ring with white letters between two white hairlines, five stars over the country, and a rule.
      body += ground(look, false, 0);
      const ro = 0.9, ri = 0.69;
      body += `<path d="M0-${ro}A${ro} ${ro} 0 1 1 0 ${ro}A${ro} ${ro} 0 1 1 0-${ro}ZM0-${ri}A${ri} ${ri} 0 1 0 0 ${ri}A${ri} ${ri} 0 1 0 0-${ri}Z" fill="${look.ring}" fill-rule="evenodd"/>`;
      body += `<circle r=".935" fill="none" stroke="#ffffff" stroke-width=".022"/><circle r=".665" fill="none" stroke="#ffffff" stroke-width=".022"/>`;
      if (f.ring !== undefined) body += ringLetters(f.ring, 0.795, 0.105, look.ink);
      for (let i = 0; i < 5; i++) {
        const a = ((-40 + i * 20) * Math.PI) / 180;
        body += star(0.5 * Math.sin(a) * 1.0, -0.5 * Math.cos(a) * 1.0 + 0.0, 0.052, look.accent, (-40 + i * 20));
      }
      if (f.text !== undefined || f.image !== undefined || f.flag !== undefined) {
        const mid = middle({ ...f, number: undefined }, prefix, 0.62, look.ink, look.ring);
        body += `<g transform="translate(0 .1)">${mid.body}</g>`;
        defs += mid.defs;
        body += `<path d="M-.4 .42H.4" stroke="${look.ring}" stroke-width=".022" stroke-linecap="round"/>`;
      }
      break;
    }
    case "player": {
      // A jersey's face: the surname on the ring, the number big, a thin gold ring inside the band.
      body += ground(look, true, 0.74);
      body += `<circle r=".735" fill="none" stroke="${look.accent}" stroke-width=".02"/>`;
      const ring: readonly [string, string] = [f.name ?? f.ring?.[0] ?? "", f.ring?.[1] ?? ""];
      body += ringLetters(ring, 0.855, 0.12, look.ink);
      const mid = middle({ ...f, text: undefined, flag: undefined }, prefix, 0.72, look.ink, look.ink);
      body += mid.body;
      defs += mid.defs;
      break;
    }
    default: {
      // The flag with the country under it, the red face with the big leaf, and the generic souvenir share one layout: a ring when there is ring text, and the middle.
      const ri = 0.74;
      body += ground(look, ringed, ri);
      if (f.design === "canada") body += `<circle r="${ri}" fill="none" stroke="${look.ring}" stroke-width=".018"/>`;
      if (ringed && f.ring !== undefined) body += ringLetters(f.ring, 0.855, 0.115, look.ink);
      const redLeaf = f.design === "canada-red" && f.image === undefined && f.flag === undefined && f.number === undefined;
      if (redLeaf) {
        body += leaf(0, -0.24, 0.98, look.accent);
        const text = f.text;
        if (text !== undefined) body += word(text, { ...LETTERS, size: fitSize(text, LETTERS, 0.92, 0.14) }, 0, 0.43, look.accent);
      } else {
        const dark = f.design === "souvenir" ? look.ring : f.design === "canada" ? look.accent : look.ink;
        const mid = middle(f, prefix, ringed ? ri : 0.92, dark, undefined);
        body += mid.body;
        defs += mid.defs;
      }
    }
  }
  body += signed(f);
  return { defs, body: `<g clip-path="url(#${clip})">${body}</g>` };
}

