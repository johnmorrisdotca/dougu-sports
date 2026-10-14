// Australian football: a red leather ball, rounder than an American one, with four panels whose seams are sewn with white stitches.
import { defineBall } from "./ball.engine.ts";
import { footballSeams } from "./ball.family.prolate.ts";
import { stitches } from "./ball.stitch.ts";
import { mix } from "./ball.core.ts";

export const BALL_AFL = /* @__PURE__ */ defineBall({
  id: "ball:afl",
  en: "Australian football",
  ja: "オージーボール",
  size: { extentMm: 280, lengthMm: 280, circumferenceMm: 550.0, longCircumferenceMm: 725.0, rule: "Laws of Australian Football 2026, Law 4 The Football, 4.1 Specifications", note: "The Laws give the two circumferences (720-730 mm and 545-555 mm) and no length: 280 mm is the length of an ellipse of those two girths." },
  spec: {
    // An ellipsoid of the Laws' two girths: 550 mm round the middle makes it 175 mm across, 280 mm long.
    axes: [1, 0.6253, 0.6253],
    view: { yaw: -30, pitch: 20, roll: -25 },
    base: "#b4202b",
    mat: { gloss: 0.55, shade: "#2a0408", grain: { f: 1.0, a: 0.34 } },
    draw: (s, base) => {
      const seams = footballSeams(Math.PI / 4);
      let out = s.strokes(seams, mix(base, -0.5), 1.1, { closed: true });
      for (const seam of seams) out += s.strokes(stitches(seam, true, 46, 0.045, { lean: 0.0 }), "#f4efe4", 0.8, { ink: false });
      return out;
    },
  },
});
