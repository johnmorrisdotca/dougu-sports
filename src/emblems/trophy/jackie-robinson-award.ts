// A tall plaque of walnut, three quarters as wide as it is tall, with a slight bevel: at the top a black nameplate edged in gold, under it a gold emblem (a ribbon banner over a baseball diamond badge, with two bats crossed behind it),
// in the middle a raised gold frame round a panel in low relief of a play at the plate (an umpire with his arms spread, a catcher in his gear, a runner sliding in with his cap flying), under that a small black plate edged in gold and a
// tiny green diamond pin. Drawn for this package from photographs of the plaques of 1989 and 1992 (docs/likeness.md): the relief is simplified to its three figures, and every plate, the banner and the lettering are left blank.
import { bar, defineFlat, ellipsePath } from "../emblem.shapes.ts";

// The relief is drawn in a 475 by 392 frame (the proportions of the real panel) and put into the panel's box: a closed shape is a few dozen points joined by straight edges.
const px = (x: number): number => Math.round((20 + x * 0.0505) * 100) / 100;
const py = (y: number): number => Math.round((22.5 + y * 0.0469) * 100) / 100;
const poly = (points: readonly (readonly [number, number])[]): string => `M${points.map(([x, y]) => `${px(x)} ${py(y)}`).join("L")}Z`;
const disc = (x: number, y: number, rx: number, ry = rx): string => ellipsePath(px(x), py(y), rx * 0.0505, ry * 0.0469);

const GOLD = "#c9a24a";
const GOLD_DARK = "#8d6e2b";
const BLACK = "#16171a";
const PANEL = "#3b2b1e";

/** The Jackie Robinson Rookie of the Year Award: a walnut plaque with a black nameplate, a gold emblem, a bronze relief of a slide at the plate, a plate and a green pin. */
export const TROPHY_JACKIE_ROBINSON_AWARD = /* @__PURE__ */ defineFlat("trophy:jackie-robinson-award", "Jackie Robinson Award", "ジャッキー・ロビンソン賞", "ours", {
  metal: "gold",
  ribbon: "#8a4a22",
  front: [
    // the board and its bevel
    ["r", "M10.4 2.5H54.1L54.6 3.2V60.8L53.9 61.5H10.1L9.4 60.8V3.2Z"],
    ["f", "M9.4 3.2L10.4 2.5H54.1L54.6 3.2L53.4 4.2H10.6Z", "#9a6a3e"],
    ["f", "M9.4 3.2L10.6 4.2V60.4L9.4 60.8Z", "#85582f"],
    ["f", "M54.6 3.2V60.8L53.9 61.5H10.1L9.4 60.8L10.6 60.4H53.4V4.2Z", "#3f2412"],
    // the nameplate
    ["f", "M16.8 5.4H48.2V10.6H16.8Z", GOLD],
    ["f", "M17.6 6.2H47.4V9.8H17.6Z", BLACK],
    // the emblem: two bats crossed, a ribbon banner, a diamond badge
    ["f", `${bar(24.6, 19.4, 39.4, 15.2, 1.1)}${bar(24.6, 15.2, 39.4, 19.4, 1.1)}`, GOLD_DARK],
    ["f", "M24 14.2Q32 12 40 14.2L39.2 16.6Q32 14.8 24.8 16.6Z", GOLD],
    ["f", "M27.4 13Q32 11.8 36.6 13L36 14.4Q32 13.2 28 14.4Z", GOLD],
    ["f", "M32 14.6L34.6 17.4L32 20.2L29.4 17.4Z", GOLD],
    ["f", "M32 15.9L33.4 17.4L32 18.9L30.6 17.4Z", GOLD_DARK],
    // the frame and the relief panel
    ["f", "M18.9 21.6H45.1V41.8H18.9Z", GOLD],
    ["f", "M19.8 22.5H44.2V40.9H19.8Z", PANEL],
    // the umpire, behind: arms spread, a mask on his face
    ["s", poly([[36, 38], [52, 22], [86, 38], [125, 56], [150, 70], [178, 92], [235, 96], [290, 76], [340, 52], [362, 52], [366, 66], [330, 84], [290, 108], [262, 126], [250, 160], [232, 210], [205, 238], [160, 290], [125, 320], [100, 338], [62, 350], [42, 338], [60, 300], [88, 262], [104, 222], [116, 180], [120, 140], [112, 112], [84, 96], [60, 76]])],
    ["m", disc(183, 55, 38, 42)],
    ["s", `${disc(183, 55, 24, 28)}`],
    // the catcher in front: legs, chest, arms, helmet and glove
    ["m", `${poly([[148, 258], [204, 250], [210, 300], [204, 342], [222, 358], [148, 364], [156, 330], [146, 290]])}${poly([[246, 268], [312, 262], [330, 292], [306, 322], [336, 338], [292, 358], [252, 332]])}${poly([[176, 156], [222, 144], [278, 148], [304, 182], [302, 236], [280, 272], [236, 284], [192, 270], [176, 224]])}`],
    ["m", `${poly([[190, 140], [150, 148], [110, 166], [92, 200], [84, 232], [106, 228], [124, 196], [160, 182], [196, 170]])}${disc(236, 108, 34, 36)}${disc(282, 190, 38, 36)}`],
    ["s", `${disc(284, 192, 22, 22)}`],
    ["l", `${poly([[186, 178], [262, 176], [262, 190], [188, 192]])}${poly([[188, 206], [266, 204], [266, 218], [190, 220]])}${poly([[192, 234], [264, 232], [260, 246], [196, 248]])}`],
    // the runner sliding in: body and legs, reaching arm, head, cap, and a mask on the ground
    ["m", `${poly([[380, 196], [424, 186], [456, 216], [446, 268], [402, 286], [362, 290], [330, 306], [296, 336], [244, 330], [208, 326], [214, 302], [262, 288], [304, 252], [338, 226]])}${poly([[440, 256], [456, 284], [430, 320], [384, 340], [358, 334], [364, 316], [400, 302], [414, 276]])}${disc(390, 160, 30, 32)}${disc(432, 148, 28, 19)}${disc(325, 350, 42, 24)}`],
    ["s", `${disc(325, 350, 24, 12)}`],
    ["l", `${poly([[388, 214], [428, 204], [436, 228], [394, 244]])}${poly([[332, 262], [372, 250], [378, 268], [338, 282]])}`],
    // the lower plate, and the green pin
    ["f", "M23.8 45.4H41V51.8H23.8Z", GOLD],
    ["f", "M24.6 46.2H40.2V51H24.6Z", BLACK],
    ["f", "M32.4 55.2L33.8 56.8L32.4 58.4L31 56.8Z", "#3f9a58"],
  ],
  back: [
    ["r", "M10.4 2.5H54.1L54.6 3.2V60.8L53.9 61.5H10.1L9.4 60.8V3.2Z"],
    ["f", "M13 5.5H51V58.5H13Z", "#7e4d28"],
    ["f", "M29.4 7H34.6V10H29.4Z", "#2a2a2c"],
  ],
  rim: 3.2,
});
