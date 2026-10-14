// Discus: a lens, thin at the rim, with a metal plate let into each face and a metal rim. Drawn as a flattened ellipsoid.
import { defineBall } from "./ball.engine.ts";
import { greatCircle, smallCircle } from "./ball.math.ts";

export const BALL_DISCUS = /* @__PURE__ */ defineBall({
  id: "ball:discus",
  en: "Discus",
  ja: "円盤",
  size: { extentMm: 220, diameterMm: 220, thicknessMm: 45, massG: [2000, 2000], rule: "World Athletics Technical Rules (C2.1), Rule 34 Discus Throw - 'The discus shall conform to the following specifications'", note: "Men's discus, 219 to 221 mm across the rim and 44 to 46 mm thick at the middle; 2 kg is a minimum." },
  spec: {
    axes: [1, 0.2, 1],
    view: { yaw: 25, pitch: 52, roll: -12 },
    base: "#3b3f48",
    mat: { gloss: 0.7, shade: "#050608", grain: { f: 1.4, a: 0.12 } },
    draw: (s) => {
      let out = "";
      for (const sign of [1, -1]) out += s.panel(smallCircle([0, sign, 0], 0.82, 72), "#b4bac3", { n: 1, ink: false });
      for (const sign of [1, -1]) out += s.stroke(smallCircle([0, sign, 0], 0.82, 72), "#555b66", 0.7, { closed: true });
      out += s.stroke(greatCircle([0, 1, 0], 96), "#cfd4dc", 1.6, { closed: true });
      return out;
    },
  },
});
