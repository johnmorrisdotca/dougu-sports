// A flat polished-silver cut-out of a hockey player in a skating stance, stick low to the right, with more of the same stacked behind it in depth and stepping back to the right, on a black stepped base of
// two tiers and a foot: the upper tier carries a silver nameplate and the lower one rows of small silver jerseys on its front and sides. Drawn for this package from photographs (docs/likeness.md); the player is an
// original silhouette of the pose, the plate is blank and no name or number is on a jersey.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_SCULPT } from "../lathe.sculpt.ts";

/** The Mark Messier NHL Leadership Award: a silver player cut-out, stacked in depth, on a black stepped base with a nameplate and rows of jerseys. */
export const TROPHY_MESSIER_LEADERSHIP_AWARD = /* @__PURE__ */ defineLathe("trophy:messier-leadership-award", "Messier Leadership Award", "メシエ・リーダーシップ賞", "ours", {
  metal: "silver",
  sculptor: LATHE_SCULPT,
  tones: { steel: "#b9c0c8", black: "#15161a", plate: "#aab1b9", jersey: "#dfe3e6", rim: "#c9d0d8" },
  turnBox: "-14.6 -4.5 93.3 93.3",
  tilt: 8,
  solids: [],
  parts: [
    { kind: "box", tone: "black", x: [-26.5, 26.5], y: [56.6, 59.1], z: [-15.2, 15.2] },
    { kind: "box", tone: "black", x: [-22.6, 22.7], y: [44.2, 56.6], z: [-13, 13] },
    { kind: "box", tone: "black", x: [-21.1, 21.1], y: [41.4, 44.2], z: [-12, 12], rim: "rim" },
    { kind: "box", tone: "black", x: [-17.2, 17.3], y: [33, 41.4], z: [-10, 10], rim: "rim" },
    { kind: "box", tone: "black", x: [-15.5, 15.6], y: [30.3, 33], z: [-9, 9], rim: "rim" },
    {
      kind: "cut",
      at: [0, 10.05],
      t: 0.3,
      decal: true,
      plate: [18.2, 46.2, 35.6, 38.9],
      layers: [
        ["plate", "M15.6 33.6H48.5V40.7H15.6Z"],
        ["plate", "M16.5 34.2H47.6V40.1H16.5Z", "ln"],
      ],
    },
    {
      kind: "cut",
      at: [0.2, 2.8],
      t: 1,
      fine: true,
      layers: [["steel", "M32.4 2.3L34.4 3.3L34.7 5.1L33.8 7.1L35.8 6.9L37.8 10.5L37.3 15.4L38.4 19.4L38.9 24.9L39.1 28.6L39.9 30.6L35.5 30.6L35.1 26.6L33.5 20.8L31.7 19.9L31 24.9L31.2 28.9L31.5 30.6L26.2 30.6L26.3 25.5L27 20.6L25.4 16.8L24.6 11.5L25.9 8.9L29.9 7.6L31 6.7L30.2 4.8ZM28.6 14L41.5 20.7L48.1 22.5L48.4 23.4L47.7 24.2L41.6 22.7L28.4 14.6Z"]],
      copies: [[0.2, -2.2], [0.4, -4.4], [0.6, -6.6], [0.8, -8.8]],
    },
    {
      kind: "cut",
      at: [0, 5],
      t: 1,
      layers: [
        ["steel", "M32.4 2.3L33.3 2.4L34.1 2.8L34.5 3.4L34.7 4.2L34.7 5.1L34.5 5.9L34.1 6.5L33.8 7.1L35.8 6.9L37.1 8.5L37.8 10.5L37.8 12.7L37.3 15.4L36.9 18.1L38.4 19.4L38.7 22.1L38.9 24.9L38.7 27.2L39.1 28.6L39.8 29.8L39.9 30.6L35.5 30.6L35.2 29.1L35.1 26.6L34.9 23.3L33.5 20.8L32.6 19.9L31.7 19.9L31.6 22.4L31 24.9L30.9 27.2L31.2 28.9L31.5 30.6L26.2 30.6L26.5 29.1L26.3 27.3L26.3 25.5L26.6 23L27 20.6L26.8 19.4L25.4 16.8L24.8 14.3L24.6 11.5L24.8 9.6L25.9 8.9L28.1 8L29.9 7.6L31 7.1L31 6.7L30.4 6L30.2 4.8L30.5 3.3ZM28.6 14L41.5 20.7L48.1 22.5L48.4 23.4L47.7 24.2L41.6 22.7L41.4 21.5L28.4 14.6Z"],
        ["steel", "M25 10.9L27.7 8.7L29.9 8L29.5 10.9L28.1 15.2L26.8 19L25.4 16.8L24.8 14.3Z", "lt"],
        ["steel", "M35.8 7.4L37.1 8.7L37.7 10.9L37.7 12.7L37.1 15.4L36.4 15L36.2 10.9Z", "dk"],
        ["steel", "M27 19.4L36.9 18.3L38.4 19.4L32.6 19.9L31.7 19.9Z", "dk"],
        ["steel", "M26.3 26.6L26.6 23L27 20.6L28.4 21.2L29 25.5L28.7 29.1L31.3 29.3L31.5 30.6L26.2 30.6L26.5 29.1Z", "dk"],
        ["steel", "M35.1 26.6L34.9 23.3L33.5 20.8L35.1 21.2L36.9 22.4L38 25.5L38 28.4L39.1 28.6L39.9 30.6L35.5 30.6L35.2 29.1Z", "dk"],
        ["steel", "M26.3 13.8L27.9 13.6L28.4 15L26.8 15.4Z", "dk"],
        ["steel", "M35.3 15.9L37.1 16.1L37.1 17.7L35.5 17.9Z", "dk"],
        ["steel", "M31.3 4.3L32.8 4L34.3 4.6", "ln"],
        ["steel", "M30.4 4.9L30.8 3.3L32.4 2.4", "ln"],
        ["steel", "M26.8 9.8L27.5 13.6", "ln"],
        ["steel", "M36.6 10L36.4 12.7L36.6 16.1", "ln"],
        ["steel", "M27 19.9L32.4 20.6L38 19.9", "ln"],
      ],
    },
    {
      kind: "cut",
      at: [0, 13.05],
      t: 0.3,
      decal: true,
      fine: true,
      layers: [["jersey", "M13 45L13.6 45.3L14.5 45.3L15 45L16.3 45.4L17.6 46.6L16.9 47.2L16.3 46.8L16.2 49.5L11.9 49.5L11.8 46.8L11.1 47.2L10.4 46.6L11.8 45.4Z", "fl"]],
      copies: [[9.2, 0, 0.0], [17.9, 0, 0.0], [27.1, 0, 0.0], [36.1, 0, 0.0], [0.0, 0, 5.7], [9.2, 0, 5.7], [17.9, 0, 5.7], [27.1, 0, 5.7], [36.1, 0, 5.7]],
    },
    { kind: "cut", at: [22.7, 0], rot: 90, t: 0.3, decal: true, fine: true, layers: [["jersey", "M31 45L31.6 45.3L32.4 45.3L33 45L34.2 45.4L35.6 46.6L34.9 47.2L34.2 46.8L34.1 49.5L29.9 49.5L29.8 46.8L29.1 47.2L28.4 46.6L29.8 45.4Z", "fl"]], copies: [[0, 8, 0], [0, -8, 0], [0, 0, 5.7], [0, 8, 5.7], [0, -8, 5.7]] },
    { kind: "cut", at: [-22.6, 0], rot: -90, t: 0.3, decal: true, fine: true, layers: [["jersey", "M31 45L31.6 45.3L32.4 45.3L33 45L34.2 45.4L35.6 46.6L34.9 47.2L34.2 46.8L34.1 49.5L29.9 49.5L29.8 46.8L29.1 47.2L28.4 46.6L29.8 45.4Z", "fl"]], copies: [[0, 8, 0], [0, -8, 0], [0, 0, 5.7], [0, 8, 5.7], [0, -8, 5.7]] },
  ],
});
