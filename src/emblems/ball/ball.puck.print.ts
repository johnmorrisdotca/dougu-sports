// The printed pucks: the same black puck as `ball:puck` (76.2 mm across, 25.4 mm thick, the ridged edge), with a print on its top face. The print is drawn flat (ball.face.ts) and laid on the top by the
// puck's own rotation, so it foreshortens as the puck tips, turns with it, and is gone when the top is turned away (the bottom is plain rubber). The grip on the edge shows as the puck turns. All our own drawing:
// our own leaf and flags, our own lettering, a made-up number and name, a made-up signature; no team's or league's mark. Each puck is an id of its own with a face to start from, and any `face` option replaces it.
import { type Piece } from "./ball.core.ts";
import { type PuckDesign, type PuckFace, faceMarkup } from "./ball.face.ts";
import { PUCK_H, PUCK_SIZE, puckSpec } from "./ball.puck.ts";
import { defineObject } from "./ball.object.ts";
import { drawStack } from "./ball.stack.ts";
import { num } from "./ball.core.ts";

interface PuckDef {
  id: string;
  en: string;
  ja: string;
  design: PuckDesign;
  /** What this puck starts with, over the design's own words and colours. */
  own?: PuckFace;
}

/** A printed puck: a plain puck with the face laid over its top. */
function definePuck(def: PuckDef): Piece<{ slices: number; design: PuckDesign; view: { yaw: number; pitch: number; roll: number } }> {
  return defineObject({
    id: def.id,
    en: def.en,
    ja: def.ja,
    size: PUCK_SIZE,
    view: { yaw: 0, pitch: 50, roll: -6 },
    model: { slices: 1, design: def.design },
    draw: (c) =>
      drawStack(c, puckSpec({
        topRing: undefined,
        overlay: (cx, top) => {
          if (top.nz < 0.02) return { defs: "", body: "" };
          // The top face's plane in the box: its centre, and where a step of 1 along the puck's x and z axes goes (the face's right, and its down).
          const o = cx.at([0, PUCK_H, 0]), ex = cx.at([1, PUCK_H, 0]), ez = cx.at([0, PUCK_H, 1]);
          const m = [ex[0] - o[0], ex[1] - o[1], ez[0] - o[0], ez[1] - o[1], o[0], o[1]].map((v) => num(v, 4)).join(" ");
          const face = faceMarkup(cx.opts.face, def.design, def.own, `${cx.id}p`, cx.opts.flags, cx.opts.theme === "light" || cx.opts.theme === "dark" ? cx.opts.theme : "inherit");
          // A light from the upper left and a falling-off at the far edge, over the print, in the box's own space so the light stays put while the puck turns.
          const gid = `${cx.id}fl`;
          const defs = `${face.defs}<radialGradient id="${gid}" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient>`;
          const body = `<g transform="matrix(${m})">${face.body}</g><path d="${top.ellipse(0.985)}" fill="url(#${gid})" stroke="#000" stroke-opacity=".55" stroke-width="${num(Math.max(0.3, cx.minWidth * 0.35), 2)}"/>`;
          return { defs, body };
        },
      })),
  });
}

/**
 * The Canada flag puck emblem (カナダ国旗のパック in Japanese): id `puck:canada`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_CANADA } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_CANADA.id, PUCK_CANADA.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_CANADA = /* @__PURE__ */ definePuck({ id: "puck:canada", en: "Canada flag puck", ja: "カナダ国旗のパック", design: "canada" });
/**
 * The Canada red puck emblem (カナダ赤地のパック in Japanese): id `puck:canada-red`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_CANADA_RED } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_CANADA_RED.id, PUCK_CANADA_RED.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_CANADA_RED = /* @__PURE__ */ definePuck({ id: "puck:canada-red", en: "Canada red puck", ja: "カナダ赤地のパック", design: "canada-red" });
/**
 * The Canada white puck emblem (カナダ白地のパック in Japanese): id `puck:canada-white`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_CANADA_WHITE } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_CANADA_WHITE.id, PUCK_CANADA_WHITE.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_CANADA_WHITE = /* @__PURE__ */ definePuck({ id: "puck:canada-white", en: "Canada white puck", ja: "カナダ白地のパック", design: "canada-white" });
/**
 * The USA stripes puck emblem (アメリカ星条旗のパック in Japanese): id `puck:usa`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_USA } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_USA.id, PUCK_USA.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_USA = /* @__PURE__ */ definePuck({ id: "puck:usa", en: "USA stripes puck", ja: "アメリカ星条旗のパック", design: "usa" });
/**
 * The USA navy puck emblem (アメリカ紺地のパック in Japanese): id `puck:usa-navy`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_USA_NAVY } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_USA_NAVY.id, PUCK_USA_NAVY.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_USA_NAVY = /* @__PURE__ */ definePuck({ id: "puck:usa-navy", en: "USA navy puck", ja: "アメリカ紺地のパック", design: "usa-navy" });
/**
 * The Player number puck emblem (選手名と背番号のパック in Japanese): id `puck:player`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_PLAYER } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_PLAYER.id, PUCK_PLAYER.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_PLAYER = /* @__PURE__ */ definePuck({ id: "puck:player", en: "Player number puck", ja: "選手名と背番号のパック", design: "player" });
/**
 * The Signed puck emblem (サイン入りパック in Japanese): id `puck:signed`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_SIGNED } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_SIGNED.id, PUCK_SIGNED.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_SIGNED = /* @__PURE__ */ definePuck({ id: "puck:signed", en: "Signed puck", ja: "サイン入りパック", design: "usa-navy", own: { signature: 7, text: "" } });
/**
 * The Souvenir puck emblem (記念パック in Japanese): id `puck:souvenir`, a ball turned in 3D.
 * @example
 * ```ts
 * import { PUCK_SOUVENIR } from "@johnmorrisdotca/dougu-sports";
 * console.log(PUCK_SOUVENIR.id, PUCK_SOUVENIR.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PUCK_SOUVENIR = /* @__PURE__ */ definePuck({ id: "puck:souvenir", en: "Souvenir puck", ja: "記念パック", design: "souvenir" });

/** Every printed puck, in the order a gallery shows them. */
export const PUCKS: readonly Piece[] = [PUCK_CANADA, PUCK_CANADA_RED, PUCK_CANADA_WHITE, PUCK_USA, PUCK_USA_NAVY, PUCK_PLAYER, PUCK_SIGNED, PUCK_SOUVENIR];
