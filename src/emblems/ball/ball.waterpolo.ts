// Water polo ball: yellow, with deep dark grip channels that follow the seams of its panels. Three seams at right angles cut it into eight panels; beside each seam run a fine groove on each side, which is
// what the grip of a water polo ball looks like. The rest of the surface is the pebbled grain.
import { defineBall } from "./ball.engine.ts";
import { greatCircle, smallCircle } from "./ball.math.ts";
import type { V3 } from "./ball.math.ts";
import { mix } from "./ball.core.ts";

const AXES: V3[] = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
/** How far the grooves run from a seam, in radians. */
const OFFSETS = [0.17];

export const BALL_WATER_POLO = /* @__PURE__ */ defineBall({
  id: "ball:water-polo",
  en: "Water polo ball",
  ja: "水球ボール",
  size: { extentMm: 221.2, diameterMm: 221.2, circumferenceMm: 695.0, massG: [400, 450], rule: "World Aquatics Competition Regulations, Part Six Water Polo Rules, Appendix 4 Field of Play & Equipment, 20.4.3 Ball (20.4.3.1-20.4.3.4); Part Six rule 1.1 points to Appendix 4", note: "Men's ball. Diameter worked out from the middle of the circumference range. Colour is not regulated." },
  spec: {
    view: { yaw: 30, pitch: 24, roll: 0 },
    base: "#f2c012",
    mat: { gloss: 0.5, shade: "#4a2c04", grain: { f: 1.6, a: 0.3 } },
    draw: (s, base) => {
      const channel = mix(base, -0.62);
      let out = "";
      // The grooves beside each seam: a pair on each side of it.
      const grooves = AXES.flatMap((a) => OFFSETS.flatMap((o) => [smallCircle(a, Math.PI / 2 - o, 96), smallCircle(a, Math.PI / 2 + o, 96)]));
      out += s.strokes(grooves, mix(base, -0.5), 1.1, { closed: true, ink: false, opacity: 0.9 });
      // The seams themselves are the wide channels: dark, with the raised lips either side of them.
      const seams = AXES.map((a) => greatCircle(a, 96));
      out += s.strokes(seams, channel, 3.8, { closed: true });
      out += s.strokes(seams, mix(base, 0.35), 0.5, { closed: true, deco: true, opacity: 0.55, dx: 0.6, dy: 0.7 });
      return out;
    },
  },
});
