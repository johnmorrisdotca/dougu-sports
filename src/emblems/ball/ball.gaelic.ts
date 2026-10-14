// Gaelic football and netball: panelled spheres. The panelling is not set by the rules; ours is the 18-panel layout (six faces of three strips), the Gaelic ball white with a green strip on
// each face and the netball in orange and cream.
import { defineBall } from "./ball.engine.ts";
import { strips18 } from "./ball.family.panelled.ts";

export const BALL_GAELIC_FOOTBALL = /* @__PURE__ */ defineBall({
  id: "ball:gaelic-football",
  en: "Gaelic football",
  ja: "ゲーリックフットボール",
  size: { extentMm: 219.6, diameterMm: 219.6, circumferenceMm: 690.0, massG: [480, 500], rule: "GAA Official Guide Part 2, Rules of Specification, Rule 4.4(ii)", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 28, pitch: 22, roll: 0 },
    base: "#13935a",
    ground: "#f7f6f0",
    mat: { gloss: 0.6, shade: "#18304a", grain: { f: 1.2, a: 0.2 } },
    draw: (s, base) => strips18(s, [[ "#f7f6f0", base]], "#5a6a60", 1.25),
  },
});

export const BALL_NETBALL = /* @__PURE__ */ defineBall({
  id: "ball:netball",
  en: "Netball",
  ja: "ネットボール",
  size: { extentMm: 222.8, diameterMm: 222.8, circumferenceMm: 700.0, massG: [400, 450], rule: "World Netball Rules of Netball, Rule 1 (Equipment: Ball), item 15 a-d", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 28, pitch: 22, roll: 0 },
    base: "#ea8a2a",
    ground: "#fbeed8",
    mat: { gloss: 0.5, shade: "#4a2208", grain: { f: 1.2, a: 0.22 } },
    draw: (s, base) => strips18(s, [[base, "#fbeed8"], ["#fbeed8", base]], "#7a4a28", 1.25),
  },
});
