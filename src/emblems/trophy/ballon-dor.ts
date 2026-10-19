// A large gilt soccer ball of the classic pentagon-and-hexagon pattern, nearly as wide as its base, resting on a black domed base that flares to its foot, with a small gilt plate on the front. Drawn for this package from a
// photograph of the 1998 trophy (docs/likeness.md), at a small size; the ball's panels are the engine's own and the plate takes the engraving option. The trophy has changed in detail over the years, and this is its overall form.
import { defineLathe } from "../emblem.lathe.ts";

/** The Ballon d'Or: a gilt soccer ball on a black domed base. */
export const TROPHY_BALLON_DOR = /* @__PURE__ */ defineLathe("trophy:ballon-dor", "Ballon d'Or", "バロンドール", "ours", {
  metal: "gold",
  box: "-0.6 0 65.1 65.1",
  turnBox: "-6.6 0 77.1 77.1",
  tones: { dark: "#17181c" },
  tilt: 10,
  solids: [{ p: [[43, 10.5, 1, "dark"], [46, 12.5], [51, 14.2], [58, 15.4], [61, 15.6, 1, "dark"]] }],
  balls: [{ kind: "soccer", cy: 25, r: 19 }],
  plate: { y0: 52.5, y1: 57 },
});
