// Squash balls: small hollow black rubber balls with a coloured dot (or two) that says how lively the ball is: double yellow (the competition ball), yellow (club), green (high altitude), red
// (medium) and blue (fast). World Squash's specification recommends the dots; it does not require them.
import { type BallDef, defineBall } from "./ball.engine.ts";
import { norm } from "./ball.math.ts";
import type { Piece } from "./ball.core.ts";
import type { BallSpec } from "./ball.engine.ts";

function squash(id: string, en: string, ja: string, colour: string, count: 1 | 2, size: BallDef["size"]): Piece<BallSpec> {
  return defineBall({
    id,
    en,
    ja,
    size,
    spec: {
      view: { yaw: -18, pitch: 18, roll: 0 },
      base: "#1f2023",
      mat: { gloss: 0.5, shade: "#000000", grain: { f: 1.6, a: 0.12 } },
      draw: (s) => {
        const centres = count === 2 ? [norm([-0.28, 0.12, 1]), norm([0.34, 0.1, 1])] : [norm([0.04, 0.1, 1])];
        return s.dots(centres, count === 2 ? 0.2 : 0.28, colour, { ink: true });
      },
    },
  });
}

const SIZE: BallDef["size"] = { extentMm: 40.0, diameterMm: 40.0, massG: [23.0, 25.0], rule: "World Squash 'Specifications for Squash Balls' (Recommended standards approved by the WSF; updated WSF AGM 2021, rebranded 2025), sections 1-3 and Notes 2-4", note: "Size and weight are set for the double yellow, yellow and green dot balls; the red and blue dot balls carry no limits in the specification." };
export const BALL_SQUASH_DOUBLE_YELLOW = /* @__PURE__ */ squash("ball:squash", "Squash ball, double yellow dot", "スカッシュボール（ダブルイエロードット）", "#f4d41c", 2, SIZE);
export const BALL_SQUASH_YELLOW = /* @__PURE__ */ squash("ball:squash-yellow", "Squash ball, yellow dot", "スカッシュボール（イエロードット）", "#f4d41c", 1, SIZE);
export const BALL_SQUASH_RED = /* @__PURE__ */ squash("ball:squash-red", "Squash ball, red dot", "スカッシュボール（レッドドット）", "#d9262c", 1, SIZE);
export const BALL_SQUASH_BLUE = /* @__PURE__ */ squash("ball:squash-blue", "Squash ball, blue dot", "スカッシュボール（ブルードット）", "#2b6fd6", 1, SIZE);
export const BALL_SQUASH_GREEN = /* @__PURE__ */ squash("ball:squash-green", "Squash ball, green dot", "スカッシュボール（グリーンドット）", "#2aa84a", 1, SIZE);
