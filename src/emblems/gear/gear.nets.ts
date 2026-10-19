// The nets and posts of three sports, drawn for this package from their rulebooks' sizes: a sepak takraw net between its two posts, a netball goalpost with its ring and net, and a teqball table with its net.
// Each is drawn to the scale of its rule where the rule gives a size and the box allows; what is not to scale is said beside each drawing below and the sources are in NOTICE.md (a piece of gear claims no size of its own).
import { capsule, drawn, ellipse, rect, seg } from "./gear.core.ts";

/** A number rounded for a path. */
const f = (n: number): number => Math.round(n * 100) / 100;

// Not to scale: the net is drawn about 1.4 m long between its posts (the rule's minimum is 6.1 m) with a coarser mesh than 0.06-0.08 m, and the posts 0.08 m across (the rule's greatest radius is 0.04 m).
// Sepak takraw (ISTAF Law of the Game, Regu): the posts are 1.55 m for men, the net 0.70 m deep and at least 6.10 m long, its top 1.52 m at the centre and 1.55 m at the posts. 1.55 m is 52 units, so 1 m is 33.5.
const TAKRAW_M = 52 / 1.55;
const TAKRAW_FLOOR = 58.5;
const TAKRAW_TOP = TAKRAW_FLOOR - 52;
const TAKRAW_DEEP = 0.7 * TAKRAW_M;
const TAKRAW_SAG = 0.03 * TAKRAW_M;
const TAKRAW_LEFT = 9;
const TAKRAW_RIGHT = 55;

/** The y of the net's top edge across it: 1.55 m at the posts and 1.52 m at the centre (a parabola). */
const takrawTop = (x: number): number => {
  const u = (x - 32) / ((TAKRAW_RIGHT - TAKRAW_LEFT) / 2);
  return TAKRAW_TOP + TAKRAW_SAG * (1 - u * u);
};

const takrawEdge = (dy: number): string => `M${TAKRAW_LEFT} ${f(TAKRAW_TOP + dy)}Q32 ${f(TAKRAW_TOP + dy + 2 * TAKRAW_SAG)} ${TAKRAW_RIGHT} ${f(TAKRAW_TOP + dy)}`;

const TAKRAW_MESH = ((): string => {
  let d = "";
  for (let x = TAKRAW_LEFT + 3; x < TAKRAW_RIGHT - 1; x += 3) d += seg(x, f(takrawTop(x) + 1), x, f(takrawTop(x) + TAKRAW_DEEP - 1));
  for (let k = 1; k < 7; k++) d += takrawEdge(1 + ((TAKRAW_DEEP - 2) * k) / 7);
  return d;
})();


export const GEAR_TAKRAW_NET = /* @__PURE__ */ drawn("gear:takraw-net", "Sepak takraw net", "セパタクローのネット", {
  main: "#f4f1ea",
  accent: "#c8202c",
  parts: [
    { d: seg(3, TAKRAW_FLOOR + 0.5, 61, TAKRAW_FLOOR + 0.5), stroke: "#8a949f", w: 1.2, line: "none" },
    { d: TAKRAW_MESH, stroke: "#4a5260", w: 0.6, line: "stroke" },
    { d: takrawEdge(0.9), stroke: "$main", w: 1.8 },
    { d: takrawEdge(TAKRAW_DEEP - 0.9), stroke: "$main", w: 1.8 },
    { d: rect(TAKRAW_LEFT, TAKRAW_TOP, 1.7, f(TAKRAW_DEEP), 0), fill: "$accent", shade: 0.3, line: "none" },
    { d: rect(TAKRAW_RIGHT - 1.7, TAKRAW_TOP, 1.7, f(TAKRAW_DEEP), 0), fill: "$accent", shade: 0.3, line: "none" },
    { d: capsule(TAKRAW_LEFT - 1.3, TAKRAW_FLOOR, TAKRAW_LEFT - 1.3, TAKRAW_TOP, 2.7), fill: "#9aa3ae", shade: 0.6, cyl: 0.8 },
    { d: capsule(TAKRAW_RIGHT + 1.3, TAKRAW_FLOOR, TAKRAW_RIGHT + 1.3, TAKRAW_TOP, 2.7), fill: "#9aa3ae", shade: 0.6, cyl: 0.8 },
  ],
});

// Not to scale: the pole is drawn 190 mm across (a padded middle pole), the ring's rod wider than 15 mm, the bar a little over 150 mm so that it reaches the ring, and the net 420 mm long (the rule: 380 to 457 mm).
// Netball (World Netball, Rules of Netball, 2024 edition, Rule 1 Technical specifications, 1.13 and 1.14 goalposts): a pole 3.05 m high and 65 to 100 mm across under padding up to 50 mm thick, a bar of 150 mm from the front edge at the top, a ring of 15 mm rod 380 mm inside, and a net 380 to 457 mm long.
// 3.05 m is 54 units, so 1 m is 17.7 units.
const NETBALL_M = 54 / 3.05;
const NETBALL_FLOOR = 59;
const NETBALL_TOP = NETBALL_FLOOR - 54;
const NETBALL_POLE = 25;
const NETBALL_BAR = 0.15 * NETBALL_M;
const NETBALL_RING_R = (0.38 / 2) * NETBALL_M;
const NETBALL_NET = 0.42 * NETBALL_M;
const ringX = NETBALL_POLE + 1.7 + NETBALL_BAR + NETBALL_RING_R;
const ringTilt = NETBALL_RING_R * 0.34;

const NETBALL_MESH = ((): string => {
  let d = "";
  for (let k = -3; k <= 3; k++) {
    const x1 = ringX + (NETBALL_RING_R * k) / 3.4;
    d += `M${f(x1)} ${f(NETBALL_TOP + 1.5 + ringTilt * Math.sqrt(Math.max(0, 1 - (k / 3.4) ** 2)))}L${f(x1 * 0.97 + ringX * 0.03)} ${f(NETBALL_TOP + 1.5 + NETBALL_NET)}`;
  }
  for (let r = 1; r < 4; r++) d += `M${f(ringX - NETBALL_RING_R)} ${f(NETBALL_TOP + 1.5 + (NETBALL_NET * r) / 4)}H${f(ringX + NETBALL_RING_R)}`;
  return d;
})();

export const GEAR_NETBALL_POST = /* @__PURE__ */ drawn("gear:netball-post", "Netball goalpost", "ネットボールのポスト", {
  main: "#2b6cb5",
  accent: "#d9dde2",
  parts: [
    { d: seg(8, NETBALL_FLOOR + 0.5, 56, NETBALL_FLOOR + 0.5), stroke: "#8a949f", w: 1.2, line: "none" },
    { d: rect(NETBALL_POLE - 1.7, NETBALL_TOP, 3.4, NETBALL_FLOOR - NETBALL_TOP, 1.2), fill: "$main", shade: 0.5, cyl: 0.7 },
    { d: NETBALL_MESH, stroke: "#8f98a3", w: 0.5, line: "stroke" },
    { d: seg(NETBALL_POLE + 1.7, NETBALL_TOP + 1, NETBALL_POLE + 1.7 + NETBALL_BAR + 0.5, NETBALL_TOP + 1.5), stroke: "#8f98a3", w: 1.1 },
    { d: ellipse(f(ringX), NETBALL_TOP + 1.5, f(NETBALL_RING_R), f(ringTilt)), stroke: "$accent", w: 1.1, op: 0.95 },
  ],
});

// Not to scale: the table is seen from the side, so its width is not shown and the net's 20 mm thickness is a line; the legs' places and the surface's thickness are drawn by eye (the rules give none). The length, the heights and the net's 140 mm are to scale.
// Teqball (FITEQ, The Official Rules and Regulations of Teqball, 2025 edition effective 5 February 2025, 1.1.1-1.1.5 the table and 1.2.1-1.2.3 the net): 3,000 mm long, 900 mm to the top of the net; the playing surface 760 mm from the ground at its highest and 565 mm at its lowest; the net 140 mm above the surface.
// 3,000 mm is 54 units, so 1 m is 18.
const TEQ_S = 54 / 3000;
const TEQ_FLOOR = 42;
const TEQ_X0 = 5;
const TEQ_X1 = TEQ_X0 + 3000 * TEQ_S;
const TEQ_MID = (TEQ_X0 + TEQ_X1) / 2;
const TEQ_LOW = TEQ_FLOOR - 565 * TEQ_S;
const TEQ_HIGH = TEQ_FLOOR - 760 * TEQ_S;
const TEQ_NET_TOP = TEQ_FLOOR - 900 * TEQ_S;
/** The control point that puts the middle of a quadratic from the low end to the low end at the highest point. */
const TEQ_CTRL = 2 * TEQ_HIGH - TEQ_LOW;
/** The surface's thickness, drawn by eye. */
const TEQ_THICK = 2.4;
/** The surface's height at a distance t (0 to 1) along its length. */
const teqAt = (t: number): number => (1 - t) * (1 - t) * TEQ_LOW + 2 * t * (1 - t) * TEQ_CTRL + t * t * TEQ_LOW;
const teqLeg = (t: number): string => `M${f(TEQ_X0 + 3000 * TEQ_S * t)} ${f(TEQ_FLOOR)}V${f(teqAt(t) + TEQ_THICK - 0.4)}`;

export const GEAR_TEQBALL_TABLE = /* @__PURE__ */ drawn("gear:teqball-table", "Teqball table", "テックボールのテーブル", {
  main: "#3f7fb5",
  accent: "#e9eef2",
  parts: [
    { d: seg(3, TEQ_FLOOR + 0.5, 61, TEQ_FLOOR + 0.5), stroke: "#8a949f", w: 1.2, line: "none" },
    { d: `${teqLeg(0.16)}${teqLeg(0.84)}`, stroke: "#6b7580", w: 2.4, line: "stroke" },
    { d: `M${f(TEQ_X0)} ${f(TEQ_LOW)}Q${f(TEQ_MID)} ${f(TEQ_CTRL)} ${f(TEQ_X1)} ${f(TEQ_LOW)}V${f(TEQ_LOW + TEQ_THICK)}Q${f(TEQ_MID)} ${f(TEQ_CTRL + TEQ_THICK)} ${f(TEQ_X0)} ${f(TEQ_LOW + TEQ_THICK)}z`, fill: "$main", shade: 0.7 },
    { d: rect(TEQ_MID - 0.6, TEQ_NET_TOP, 1.2, TEQ_HIGH - TEQ_NET_TOP + 0.4, 0.2), fill: "$accent", shade: 0.2 },
  ],
});
