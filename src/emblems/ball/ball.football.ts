// American and Canadian football: a pebbled leather ball drawn as a prolate shape whose ends come to a point (`point` in the spec), a ball ("natural tan" in the NFL and IFAF rules), with four panels and a row of laces on one seam. The Canadian ball has a
// 1-inch white stripe all the way round near each end (CFL Rule 1, Section 2); the IFAF ball has a stripe near each end on the two panels next to the laces only (IFAF Rule 1, Section 3).
import { defineBall } from "./ball.engine.ts";
import { footballSeams, laces, tipRing } from "./ball.family.prolate.ts";
import { mix } from "./ball.core.ts";
import type { V3 } from "./ball.math.ts";
import type { BallDef } from "./ball.engine.ts";

/** The part of a ring that lies on the laces' side (y at or above 0), as one run: the ring is turned to start below it. */
const upperArc = (ring: V3[]): V3[] => {
  const k = ring.findIndex((p) => p[1] < 0);
  const turned = [...ring.slice(k), ...ring.slice(0, k)];
  const run: V3[] = [];
  for (const p of turned) if (p[1] >= 0) run.push(p);
  return run;
};

const BROWN = "#8b4a21";
const AXES = [1, 0.55, 0.55] as const;
const VIEW = { yaw: -20, pitch: 35, roll: -35 };
const MAT = { gloss: 0.5, shade: "#2a1006", grain: { f: 0.95, a: 0.42 } };

function football(id: string, en: string, ja: string, size: BallDef["size"], stripes: "none" | "ring" | "top", colour: string) {
  return defineBall({
    id,
    en,
    ja,
    size,
    spec: {
      axes: AXES,
      point: 0.85,
      view: VIEW,
      base: colour,
      mat: MAT,
      draw: (s, base) => {
        let out = "";
        if (stripes === "ring") for (const sign of [1, -1] as const) out += s.stroke(tipRing(sign, 0.99), "#f4f0e6", 7, { closed: true, ink: false });
        if (stripes === "top") for (const sign of [1, -1] as const) out += s.stroke(upperArc(tipRing(sign, 1.1, 96)), "#f4f0e6", 7, { ink: false });
        out += s.strokes(footballSeams(), mix(base, -0.55), 1.1);
        out += s.strokes(footballSeams(), mix(base, 0.4), 0.45, { deco: true, opacity: 0.45, dx: 0.25, dy: 0.3 });
        out += laces(s, "#f4f0e6", mix(base, -0.7));
        return out;
      },
    },
  });
}

const SIZE: BallDef["size"] = { extentMm: 282.6, lengthMm: 282.6, circumferenceMm: 536.58, longCircumferenceMm: 717.55, massG: [396.89, 425.24], rule: "NFL Rulebook, Rule 2 The Ball, Section 1 (Dimensions)" };
export const BALL_FOOTBALL = /* @__PURE__ */ football("ball:football", "Football (NFL)", "アメリカンフットボールのボール（NFL）", SIZE, "none", BROWN);
export const BALL_FOOTBALL_CFL = /* @__PURE__ */ football("ball:football-cfl", "Football (CFL)", "カナディアンフットボールのボール（CFL）", { extentMm: 282.6, lengthMm: 282.6, circumferenceMm: 536.58, longCircumferenceMm: 717.55, massG: [396.89, 425.24], rule: "CFL Official Playing Rules, Rule 1 Conduct of the Game, Section 2 The Ball" }, "ring", BROWN);
export const BALL_FOOTBALL_IFAF = /* @__PURE__ */ football("ball:football-ifaf", "Football (IFAF)", "アメリカンフットボールのボール（IFAF）", { extentMm: 283.4, lengthMm: 283.4, circumferenceMm: 533.4, longCircumferenceMm: 714.38, massG: [396.89, 425.24], rule: "IFAF Football Rules and Interpretations 2026, Rule 1 (The Game, Field, Players and Equipment), Section 3 The Ball, Article 1 a-i", note: "The IFAF figures are in a diagram of the rules, read from the rendered page." }, "top", "#a8693a");
