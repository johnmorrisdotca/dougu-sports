// The set: twelve fictional maker marks and ten fictional team logos, as data. Every mark is drawn for this package on a 100 by 100 box in a few flat parts, each part one path and one role (`a` the main colour, `b` the second, `c` a third
// for a team); the parts never overlap, so the mark is the same drawn in one colour. Nothing here is a real company's or club's mark, name or lettering: each note says what the nearest real one is and how this differs.

import type { LetterStyle } from "./brand.letters.ts";

export type PartRole = "a" | "b" | "c";

/** One flat shape of a mark: an SVG path (drawn with the even-odd rule, so a hole is a hole) and the colour it takes. */
export interface LogoPart {
  d: string;
  role: PartRole;
}

/** The colours of a maker on a light page or a dark one: the two of its mark and the ink of its wordmark. */
export interface MakerPalette {
  a: string;
  b: string;
  ink: string;
}

/** The three colours of a team logo on a light page or a dark one. */
export interface TeamPalette {
  a: string;
  b: string;
  c: string;
}

/** A fictional maker of balls and sports gear: a mark, a name to set as a wordmark, two palettes and the note of how it differs from the nearest real brand. */
export interface MakerData {
  id: MakerId;
  name: string;
  genre: string;
  note: string;
  parts: readonly LogoPart[];
  light: MakerPalette;
  dark: MakerPalette;
  lettering: LetterStyle;
}

/** A fictional team: a city and a nickname, a logo, two palettes and a note. */
export interface TeamData {
  id: TeamId;
  city: string;
  nickname: string;
  genre: string;
  note: string;
  parts: readonly LogoPart[];
  light: TeamPalette;
  dark: TeamPalette;
}

export const MAKER_IDS = ["arvane", "tarsin", "ravelle", "kovreth", "dunmar", "ostrel", "vexlin", "quillan", "tenzar", "marenko", "halvane", "solvik"] as const;
export type MakerId = (typeof MAKER_IDS)[number];
export const TEAM_IDS = ["saltmere", "greywick", "brightwater", "cinderfell", "valmere", "larkmoor", "ironport", "pinecrest", "redfern", "tarn"] as const;
export type TeamId = (typeof TEAM_IDS)[number];

const part = (role: PartRole, d: string): LogoPart => ({ role, d });

export const MAKERS: Readonly<Record<MakerId, MakerData>> = Object.freeze({
  arvane: {
    id: "arvane",
    name: "Arvane",
    genre: "stripes",
    note: "Nearest: the Adidas performance mark, three slanted stripes that make a triangle. Arvane is one upright triangle cut into three level bands with a notch in the base, in green and amber; there is no slanted stripe at all.",
    parts: [
      part("a", "M49.3 11.3Q50 10 50.7 11.3L62.8 32.7Q63.5 34 62 34L38 34Q36.5 34 37.2 32.7Z"),
      part("b", "M32.3 41.3Q33.1 40 34.6 40L65.4 40Q66.9 40 67.7 41.3L78.6 60.7Q79.3 62 77.8 62L22.2 62Q20.7 62 21.4 60.7Z"),
      part("a", "M16.6 69.3Q17.3 68 18.8 68L81.2 68Q82.7 68 83.4 69.3L93.3 86.7Q94 88 92.5 88L61.5 88Q60 88 58.9 86.9L51.1 79.1Q50 78 48.9 79.1L41.1 86.9Q40 88 38.5 88L7.5 88Q6 88 6.7 86.7Z"),
    ],
    light: { a: "#0f5a46", b: "#f2a33a", ink: "#0f2f27" },
    dark: { a: "#3fc59a", b: "#f7b955", ink: "#eaf6f1" },
    lettering: { weight: 11, corner: "sharp", radius: 0, width: 0.8, gap: 14, slant: 0, cap: "butt" },
  },
  tarsin: {
    id: "tarsin",
    name: "Tarsin",
    genre: "animal",
    note: "Nearest: Orca, the triathlon and swim maker whose mark is a whole orca. Tarsin shows only the symmetrical tail fluke over two waterline bars, in indigo and cyan, and no body.",
    parts: [
      part("a", "M50 40C42 33 26 34 6 22C10 46 28 62 46 62L45 80L55 80L54 62C72 62 90 46 94 22C74 34 58 33 50 40Z"),
      part("b", "M6 89Q6 86 9 86L39 86Q42 86 42 89L42 89Q42 92 39 92L9 92Q6 92 6 89Z"),
      part("b", "M58 89Q58 86 61 86L91 86Q94 86 94 89L94 89Q94 92 91 92L61 92Q58 92 58 89Z"),
    ],
    light: { a: "#1d2d78", b: "#3fb8cf", ink: "#141d4f" },
    dark: { a: "#8fa2ff", b: "#5fd0e3", ink: "#e8ecff" },
    lettering: { weight: 9, corner: "round", radius: 40, width: 1, gap: 18, slant: 0, cap: "round" },
  },
  ravelle: {
    id: "ravelle",
    name: "Ravelle",
    genre: "motion",
    note: "Nearest: the Nike swoosh, one tapered curve. Ravelle is a ball with two concentric arcs that taper at both ends and wrap the ball like a wake; it has no single wedge and no check shape.",
    parts: [
      part("b", "M49 46A17 17 0 1 0 83 46A17 17 0 1 0 49 46Z"),
      part("a", "M61.1 73.6L59.1 73.7L57 73.5L54.9 73.2L52.9 72.6L50.9 71.9L48.9 71L47.1 69.9L45.2 68.7L43.5 67.4L41.9 65.9L40.4 64.2L39 62.5L37.8 60.6L36.7 58.6L35.8 56.5L35 54.4L34.5 52.2L34 50L33.8 47.7L33.8 45.4L33.9 43.2L34.2 40.9L34.7 38.7L35.4 36.5L36.2 34.4L37.2 32.4L38.3 30.4L39.6 28.6L41.1 26.9L42.6 25.3L44.3 23.9L46.1 22.6L47.9 21.4L49.8 20.4L51.8 19.6L53.8 18.9L55.9 18.5L58 18.2L60 18.1L62.1 18.3L62.1 18.3L60.3 19.2L58.5 20L56.8 21L55.2 22L53.7 23.1L52.2 24.2L50.9 25.5L49.7 26.8L48.5 28.2L47.4 29.6L46.5 31L45.6 32.6L44.9 34.1L44.2 35.7L43.6 37.3L43.2 38.9L42.8 40.6L42.5 42.2L42.3 43.9L42.3 45.6L42.3 47.3L42.4 48.9L42.6 50.6L42.9 52.3L43.3 53.9L43.8 55.5L44.5 57.1L45.2 58.7L46 60.3L46.9 61.8L47.9 63.2L49 64.6L50.2 66L51.5 67.3L52.9 68.5L54.4 69.6L55.9 70.7L57.6 71.7L59.3 72.6L61.1 73.6Z"),
      part("a", "M50.6 84L48.3 83.7L46.1 83.1L43.9 82.4L41.7 81.4L39.6 80.4L37.6 79.1L35.6 77.8L33.7 76.3L31.9 74.7L30.2 73L28.6 71.1L27.2 69.2L25.8 67.1L24.6 65L23.5 62.7L22.5 60.5L21.7 58.1L21.1 55.7L20.6 53.3L20.3 50.8L20.1 48.3L20 45.8L20.2 43.4L20.5 40.9L20.9 38.5L21.5 36.1L22.3 33.7L23.2 31.4L24.2 29.2L25.4 27.1L26.7 25L28.1 23.1L29.7 21.2L31.3 19.5L33.1 17.9L34.9 16.4L36.8 15L38.8 13.8L40.9 12.8L43.1 12L43.1 12L41.7 13.8L40.3 15.6L39 17.3L37.7 19.1L36.6 20.9L35.5 22.7L34.6 24.6L33.7 26.5L33 28.4L32.3 30.3L31.7 32.2L31.2 34.1L30.8 36.1L30.4 38.1L30.2 40L30 42L29.9 43.9L30 45.9L30 47.8L30.2 49.8L30.4 51.7L30.8 53.6L31.2 55.5L31.7 57.4L32.2 59.3L32.9 61.2L33.6 63L34.4 64.8L35.3 66.6L36.3 68.4L37.3 70.1L38.5 71.8L39.7 73.5L41 75.1L42.5 76.7L43.9 78.2L45.5 79.7L47.2 81.1L48.9 82.5L50.6 84Z"),
    ],
    light: { a: "#c41e6b", b: "#26262c", ink: "#26262c" },
    dark: { a: "#ff5fa2", b: "#f1f1f4", ink: "#f6f6f8" },
    lettering: { weight: 10, corner: "round", radius: 30, width: 1, gap: 12, slant: 10, cap: "round" },
  },
  kovreth: {
    id: "kovreth",
    name: "Kovreth",
    genre: "monogram",
    note: "Nearest: Fila, a letter in a box. Kovreth is a hexagon with the K cut out of it as negative space (a slit between the stem and the arms), in sunflower; the letter, the shape and the cut are all different.",
    parts: [
      part("a", "M45.7 6.5Q50 4 54.3 6.5L85.5 24.5Q89.8 27 89.8 32L89.8 68Q89.8 73 85.5 75.5L54.3 93.5Q50 96 45.7 93.5L14.5 75.5Q10.2 73 10.2 68L10.2 32Q10.2 27 14.5 24.5ZM30 29Q30 28 31 28L42 28Q43 28 43 29L43 71Q43 72 42 72L31 72Q30 72 30 71ZM47.7 50.8Q47 50 47.7 49.2L65.3 28.8Q66 28 67 28L80 28Q81 28 80.3 28.7L60.7 49.3Q60 50 60.7 50.7L80.3 71.3Q81 72 80 72L67 72Q66 72 65.3 71.2Z"),
    ],
    light: { a: "#f2b21b", b: "#f2b21b", ink: "#221c0a" },
    dark: { a: "#f2b21b", b: "#f2b21b", ink: "#fff5d6" },
    lettering: { weight: 18, corner: "sharp", radius: 0, width: 0.7, gap: 5, slant: 0, cap: "butt" },
  },
  dunmar: {
    id: "dunmar",
    name: "Dunmar",
    genre: "shield",
    note: "Nearest: the shield badges that many kit makers and clubs use, with no single owner. Dunmar is a shield split down the middle, the right half set lower, with no letter, stripe or star, in claret and old gold.",
    parts: [
      part("a", "M11 10H48V94C28 84 11 72 11 50Z"),
      part("b", "M52 18H89V50C89 72 72 84 52 94Z"),
    ],
    light: { a: "#7a1f33", b: "#c9a24a", ink: "#4a1220" },
    dark: { a: "#d6657d", b: "#e3c26e", ink: "#fbe9ee" },
    lettering: { weight: 12, corner: "cut", radius: 14, width: 0.9, gap: 12, slant: 0, cap: "butt" },
  },
  ostrel: {
    id: "ostrel",
    name: "Ostrel",
    genre: "disc",
    note: "Nearest: The North Face, a half dome cut by curved lines. Ostrel is a whole disc cut by one straight diagonal gap into two offset pieces, in orange and navy.",
    parts: [
      part("a", "M20.1 73.5A42 42 0 1 1 92.2 31.9Z"),
      part("b", "M16.6 81.5A42 42 0 0 0 87 40.9Z"),
    ],
    light: { a: "#ee6a2c", b: "#141e3a", ink: "#141e3a" },
    dark: { a: "#ff8a4d", b: "#8fa3d6", ink: "#f6efe9" },
    lettering: { weight: 8, corner: "round", radius: 50, width: 1.1, gap: 22, slant: 0, cap: "round" },
  },
  vexlin: {
    id: "vexlin",
    name: "Vexlin",
    genre: "geometry",
    note: "Nearest: Umbro's double diamond and Hummel's chevrons, marks made of one repeated simple shape. Vexlin is three hexagons in a triangle, one a ring and one in the second colour, in violet and teal.",
    parts: [
      part("a", "M47.4 9.5Q50 8 52.6 9.5L65.6 17Q68.2 18.5 68.2 21.5L68.2 36.5Q68.2 39.5 65.6 41L52.6 48.5Q50 50 47.4 48.5L34.4 41Q31.8 39.5 31.8 36.5L31.8 21.5Q31.8 18.5 34.4 17ZM48.7 20.3Q50 19.5 51.3 20.3L56.9 23.5Q58.2 24.3 58.2 25.8L58.2 32.3Q58.2 33.8 56.9 34.5L51.3 37.8Q50 38.5 48.7 37.8L43.1 34.5Q41.8 33.8 41.8 32.3L41.8 25.8Q41.8 24.3 43.1 23.5Z"),
      part("a", "M26.7 45.3Q29.3 43.8 31.9 45.3L44.9 52.8Q47.5 54.3 47.5 57.3L47.5 72.3Q47.5 75.3 44.9 76.8L31.9 84.3Q29.3 85.8 26.7 84.3L13.7 76.8Q11.1 75.3 11.1 72.3L11.1 57.3Q11.1 54.3 13.7 52.8Z"),
      part("b", "M68.1 45.3Q70.7 43.8 73.3 45.3L86.3 52.8Q88.9 54.3 88.9 57.3L88.9 72.3Q88.9 75.3 86.3 76.8L73.3 84.3Q70.7 85.8 68.1 84.3L55.1 76.8Q52.5 75.3 52.5 72.3L52.5 57.3Q52.5 54.3 55.1 52.8Z"),
    ],
    light: { a: "#5b2a86", b: "#19b6a2", ink: "#34195a" },
    dark: { a: "#a77be0", b: "#36d6c0", ink: "#f1e9fb" },
    lettering: { weight: 14, corner: "cut", radius: 18, width: 0.95, gap: 12, slant: 0, cap: "butt" },
  },
  quillan: {
    id: "quillan",
    name: "Quillan",
    genre: "disc",
    note: "Nearest: the BMW roundel, a circle in four quarters (not a sports mark). Quillan has convex quarter-discs set apart by a cross-shaped gap, one quarter smaller, with no ring, in teal and amber.",
    parts: [
      part("a", "M48 48L8 48A40 40 0 0 1 48 8Z"),
      part("b", "M52 48L92 48A40 40 0 0 0 52 8Z"),
      part("b", "M48 52L8 52A40 40 0 0 0 48 92Z"),
      part("a", "M52 52L78 52A26 26 0 0 1 52 78Z"),
    ],
    light: { a: "#12857f", b: "#f0b429", ink: "#0d4d49" },
    dark: { a: "#3fc4bd", b: "#ffc94d", ink: "#e6f7f6" },
    lettering: { weight: 10, corner: "round", radius: 20, width: 0.95, gap: 14, slant: 0, cap: "square" },
  },
  tenzar: {
    id: "tenzar",
    name: "Tenzar",
    genre: "monogram",
    note: "Nearest: the three-bar marks such as the Adidas performance logo. Tenzar is a Z of two level bars with bevelled ends joined by one diagonal slab in a second colour; the bars are not parallel and not three of a kind.",
    parts: [
      part("a", "M12 14Q12 12 14 12L86 12Q88 12 87.1 13.8L79.9 28.2Q79 30 77 30L14 30Q12 30 12 28Z"),
      part("b", "M58.3 35.1Q60 34 62 34L86 34Q88 34 86.3 35.1L41.7 64.9Q40 66 38 66L14 66Q12 66 13.7 64.9Z"),
      part("a", "M20.1 71.8Q21 70 23 70L86 70Q88 70 88 72L88 86Q88 88 86 88L14 88Q12 88 12.9 86.2Z"),
    ],
    light: { a: "#10151d", b: "#14b7c9", ink: "#10151d" },
    dark: { a: "#e9edf2", b: "#3fd4e4", ink: "#f2f5f8" },
    lettering: { weight: 16, corner: "sharp", radius: 0, width: 1.1, gap: 10, slant: 14, cap: "butt" },
  },
  marenko: {
    id: "marenko",
    name: "Marenko",
    genre: "geometry",
    note: "Nearest: no sports maker that we know; the golden-ratio spiral is a common device in design. Marenko is four tiles, three of them quarter-discs, in gold and green.",
    parts: [
      part("a", "M60.1 77.5L5.1 77.5A55 55 0 0 1 60.1 22.5Z"),
      part("b", "M63.1 54.3L63.1 22.5A31.8 31.8 0 0 1 94.9 54.3Z"),
      part("a", "M74.7 57.3L94.9 57.3A20.2 20.2 0 0 1 74.7 77.5Z"),
      part("b", "M63.1 57.3L71.7 57.3L71.7 77.5L63.1 77.5Z"),
    ],
    light: { a: "#e0a100", b: "#1b8a5a", ink: "#3b2c00" },
    dark: { a: "#f5c230", b: "#3fc78a", ink: "#fff4cc" },
    lettering: { weight: 12, corner: "round", radius: 60, width: 0.9, gap: 14, slant: 0, cap: "round" },
  },
  halvane: {
    id: "halvane",
    name: "Halvane",
    genre: "animal",
    note: "Nearest: the Ram Trucks ram head (a vehicle maker, not sport) and clubs that are called Rams. Halvane is two spiral horns and a plain shield face, flat, in violet and yellow.",
    parts: [
      part("a", "M40.1 17.5L36.2 16.2L32.3 15.6L28.4 15.6L24.6 16.1L21 17.2L17.6 18.8L14.6 20.8L12 23.2L9.8 25.9L8 28.9L6.8 32L6 35.2L5.8 38.4L6 41.5L6.6 44.5L7.7 47.3L9.1 49.8L10.9 52.1L12.9 53.9L15.2 55.5L17.5 56.6L20 57.3L22.4 57.7L24.8 57.7L27.1 57.3L29.2 56.6L31.2 55.6L32.8 54.3L34.3 52.9L35.4 51.3L36.3 49.7L36.8 48L37.1 46.3L37.1 44.6L36.8 43.1L36.3 41.7L35.7 41.7L35.8 43L35.6 44.3L35.3 45.5L34.8 46.8L34.2 47.9L33.3 49L32.3 49.9L31.1 50.7L29.9 51.4L28.5 51.8L27.1 52.1L25.6 52.1L24.1 51.9L22.6 51.5L21.2 50.9L19.9 50.1L18.7 49L17.6 47.8L16.8 46.5L16.1 45L15.6 43.4L15.4 41.7L15.4 40L15.6 38.3L16.2 36.6L16.9 35L17.9 33.5L19.1 32.2L20.5 31L22.1 30L23.9 29.2L25.8 28.7L27.7 28.5L29.7 28.5L31.7 28.9L33.7 29.5L36.4 29.9L39.1 29.4L41.5 27.9L43.2 25.8L44 23.3L43.6 20.9L42.2 18.8ZM59.9 17.5L63.8 16.2L67.7 15.6L71.6 15.6L75.4 16.1L79 17.2L82.4 18.8L85.4 20.8L88 23.2L90.2 25.9L92 28.9L93.2 32L94 35.2L94.2 38.4L94 41.5L93.4 44.5L92.3 47.3L90.9 49.8L89.1 52.1L87.1 53.9L84.8 55.5L82.5 56.6L80 57.3L77.6 57.7L75.2 57.7L72.9 57.3L70.8 56.6L68.8 55.6L67.2 54.3L65.7 52.9L64.6 51.3L63.7 49.7L63.2 48L62.9 46.3L62.9 44.6L63.2 43.1L63.7 41.7L64.3 41.7L64.2 43L64.4 44.3L64.7 45.5L65.2 46.8L65.8 47.9L66.7 49L67.7 49.9L68.9 50.7L70.1 51.4L71.5 51.8L72.9 52.1L74.4 52.1L75.9 51.9L77.4 51.5L78.8 50.9L80.1 50.1L81.3 49L82.4 47.8L83.2 46.5L83.9 45L84.4 43.4L84.6 41.7L84.6 40L84.4 38.3L83.8 36.6L83.1 35L82.1 33.5L80.9 32.2L79.5 31L77.9 30L76.1 29.2L74.2 28.7L72.3 28.5L70.3 28.5L68.3 28.9L66.3 29.5L63.6 29.9L60.9 29.4L58.5 27.9L56.8 25.8L56 23.3L56.4 20.9L57.8 18.8Z"),
      part("b", "M42 29Q50 23 58 29L58 54Q57 72 50 86Q43 72 42 54Z"),
    ],
    light: { a: "#3a2a8c", b: "#f4b400", ink: "#231a5c" },
    dark: { a: "#8f7df0", b: "#ffcb33", ink: "#efeaff" },
    lettering: { weight: 7, corner: "sharp", radius: 0, width: 1, gap: 20, slant: 0, cap: "butt" },
  },
  solvik: {
    id: "solvik",
    name: "Solvik",
    genre: "ball",
    note: "Nearest: the everyday tennis-ball icon, a disc with two seam curves, which is a generic symbol and not any maker's mark. Solvik is a lime disc with two crescent seams cut out, and nothing else.",
    parts: [
      part("a", "M7 50A43 43 0 1 0 93 50A43 43 0 1 0 7 50ZM26 22C52 38 52 62 26 78C44 62 44 38 26 22ZM74 22C48 38 48 62 74 78C56 62 56 38 74 22Z"),
    ],
    light: { a: "#9bc41c", b: "#9bc41c", ink: "#2a3306" },
    dark: { a: "#b6e03a", b: "#b6e03a", ink: "#f3fbd6" },
    lettering: { weight: 13, corner: "round", radius: 16, width: 0.85, gap: 12, slant: 0, cap: "round" },
  },
});

export const TEAMS: Readonly<Record<TeamId, TeamData>> = Object.freeze({
  saltmere: {
    id: "saltmere",
    city: "Saltmere",
    nickname: "Gulls",
    genre: "roundel",
    note: "Nearest: a club that wears a whole seagull. This one is a roundel: a gull's wings cut out of the sky over a wave line.",
    parts: [
      part("a", "M4 50A46 46 0 1 0 96 50A46 46 0 1 0 4 50ZM9.5 50A40.5 40.5 0 1 0 90.5 50A40.5 40.5 0 1 0 9.5 50Z"),
      part("b", "M17.1 62A35 35 0 1 1 82.9 62C72 55 62 69 50 62C38 55 28 69 17.1 62ZM26 40Q38 22 50 38Q62 22 74 40Q62 33 50 48Q38 33 26 40Z"),
      part("a", "M19.4 67C28 60 38 74 50 67C62 74 72 60 80.6 67A35 35 0 0 1 19.4 67Z"),
    ],
    light: { a: "#0e4a6b", b: "#8fd0e8", c: "#ffffff" },
    dark: { a: "#3b9bc4", b: "#a9dff0", c: "#ffffff" },
  },
  greywick: {
    id: "greywick",
    city: "Greywick",
    nickname: "Wardens",
    genre: "crest",
    note: "Nearest: the many castle-on-a-shield crests. This is a plain shield under a red chief with a tower cut out.",
    parts: [
      part("b", "M12 10L88 10L88 25L12 25Z"),
      part("a", "M12 30H88V50C88 72 70 86 50 95C30 86 12 72 12 50ZM34 80L34 46L34 40L40 40L40 46L45 46L45 40L55 40L55 46L60 46L60 40L66 40L66 46L66 80ZM45 80V66Q50 58 55 66V80Z"),
    ],
    light: { a: "#4a4f57", b: "#c8372d", c: "#ffffff" },
    dark: { a: "#aeb6c2", b: "#e5594d", c: "#ffffff" },
  },
  brightwater: {
    id: "brightwater",
    city: "Brightwater",
    nickname: "Comets",
    genre: "monogram",
    note: "Nearest: letter-in-a-disc club badges. A B knocked out of a violet disc, with a gold arc for the comet.",
    parts: [
      part("a", "M14 50A36 36 0 1 0 86 50A36 36 0 1 0 14 50ZM34 29Q34 26 37 26L53 26Q56 26 58.7 27.3L65.3 30.7Q68 32 68 35L68 42Q68 45 65.9 47.1L65.1 47.9Q63 50 65.3 52L67.7 54Q70 56 70 59L70 65Q70 68 67.5 69.7L60.5 74.3Q58 76 55 76L37 76Q34 76 34 73ZM44 36.5Q44 35 45.5 35L52.5 35Q54 35 55.2 35.9L56.8 37.1Q58 38 58 39.5L58 41.5Q58 43 56.8 43.9L55.2 45.1Q54 46 52.5 46L45.5 46Q44 46 44 44.5ZM44 56.5Q44 55 45.5 55L53.5 55Q55 55 56.2 55.9L58.8 58.1Q60 59 60 60.5L60 62.5Q60 64 58.8 64.9L56.2 67.1Q55 68 53.5 68L45.5 68Q44 68 44 66.5Z"),
      part("b", "M9.6 35.3L10.3 31.9L11.5 28.7L13 25.5L14.7 22.4L16.8 19.5L19 16.8L21.6 14.3L24.3 11.9L27.3 9.8L30.4 7.9L33.7 6.3L37.1 5L40.6 4L44.3 3.2L47.9 2.8L51.7 2.7L55.4 2.9L59.1 3.4L62.7 4.2L66.2 5.4L69.7 6.8L73 8.5L76.2 10.5L79.1 12.7L81.9 15.2L84.4 17.9L86.8 20.8L88.8 23.8L90.6 27L92.1 30.4L93.3 33.8L94.2 37.3L94.8 40.9L95.1 44.5L95 48L94.7 51.6L94.1 55L93.2 58.4L92 61.6L90.4 64.7L90.4 64.7L90.9 61.3L91.2 58L91.3 54.7L91.2 51.4L90.9 48.2L90.3 45.1L89.5 42L88.5 39L87.3 36.1L85.9 33.3L84.3 30.6L82.5 28.1L80.6 25.7L78.4 23.5L76.2 21.4L73.8 19.5L71.3 17.8L68.7 16.3L66 15L63.2 13.8L60.3 12.9L57.4 12.2L54.4 11.6L51.3 11.3L48.3 11.3L45.3 11.4L42.2 11.7L39.2 12.3L36.2 13.1L33.3 14.1L30.4 15.3L27.6 16.8L24.9 18.4L22.3 20.3L19.8 22.4L17.5 24.6L15.3 27L13.3 29.6L11.4 32.4L9.6 35.3Z"),
    ],
    light: { a: "#7a2a8e", b: "#f2b705", c: "#ffffff" },
    dark: { a: "#b46ad0", b: "#ffc933", c: "#ffffff" },
  },
  cinderfell: {
    id: "cinderfell",
    city: "Cinderfell",
    nickname: "Bears",
    genre: "mascot",
    note: "Nearest: the Memphis Grizzlies' bear head. This one is a flat front view built from circles, with an angry brow.",
    parts: [
      part("a", "M11 28A13 13 0 1 0 37 28A13 13 0 1 0 11 28Z"),
      part("a", "M63 28A13 13 0 1 0 89 28A13 13 0 1 0 63 28Z"),
      part("a", "M16 56A34 34 0 1 0 84 56A34 34 0 1 0 16 56ZM30 47Q30 46 30.9 46.4L43.1 51.6Q44 52 43.7 52.9L42.3 57.1Q42 58 41.1 57.7L30.9 54.3Q30 54 30 53ZM70 47Q70 46 69.1 46.4L56.9 51.6Q56 52 56.3 52.9L57.7 57.1Q58 58 58.9 57.7L69.1 54.3Q70 54 70 53ZM31 70Q50 52 69 70Q66 88 50 90Q34 88 31 70Z"),
      part("c", "M35 71Q50 58 65 71Q63 85 50 87Q37 85 35 71ZM43 69Q50 64 57 69Q56 76 50 77Q44 76 43 69Z"),
    ],
    light: { a: "#5a3a24", b: "#d9b27c", c: "#d9b27c" },
    dark: { a: "#c08a5c", b: "#f0d4aa", c: "#f0d4aa" },
  },
  valmere: {
    id: "valmere",
    city: "Valmere",
    nickname: "Hawks",
    genre: "mascot",
    note: "Nearest: the Atlanta Hawks' hawk head. This one is a faceted head in profile, in navy and amber.",
    parts: [
      part("a", "M15.2 94Q14 94 13.9 92.8L10.1 59.2Q10 58 10.3 56.8L17.7 31.2Q18 30 18.9 29.2L35.1 14.8Q36 14 37.2 13.7L58.8 8.3Q60 8 61.1 8.5L76.9 15.5Q78 16 78.7 16.9L85.3 25.1Q86 26 85 26.6L73 33.4Q72 34 72.1 35.2L72.9 48.8Q73 50 72.1 50.8L64.9 57.2Q64 58 64 59.2L64 68.8Q64 70 64.7 71L71.3 81Q72 82 71 82.7L59 91.3Q58 92 57.2 91.1L48.8 80.9Q48 80 47.2 80.9L36.8 93.1Q36 94 34.8 94ZM44 24L64 26L55 36Z"),
      part("b", "M87 26.7Q88 26 88.6 27L96.4 41Q97 42 96.9 43.2L95.1 58.8Q95 60 94.2 59.1L86.8 50.9Q86 50 84.8 50L77.2 50Q76 50 75.9 48.8L75.1 37.2Q75 36 76 35.3Z"),
    ],
    light: { a: "#1f3b6f", b: "#f2a900", c: "#ffffff" },
    dark: { a: "#6f95e0", b: "#ffc233", c: "#ffffff" },
  },
  larkmoor: {
    id: "larkmoor",
    city: "Larkmoor",
    nickname: "Foxes",
    genre: "mascot",
    note: "Nearest: the Fox Racing head and the Leicester City fox. This is a front-facing fox made of seven flat facets.",
    parts: [
      part("a", "M9.9 7.5Q10 6 11.2 6.9L36.8 27.1Q38 28 39.5 28L60.5 28Q62 28 63.2 27.1L88.8 6.9Q90 6 90.1 7.5L93.9 48.5Q94 50 92.6 50.4L67.4 57.6Q66 58 64.8 57.1L51.2 46.9Q50 46 48.8 46.9L35.2 57.1Q34 58 32.6 57.6L7.4 50.4Q6 50 6.1 48.5ZM22 38L38 40L30 47ZM78 38L62 40L70 47Z"),
      part("b", "M9.6 57Q8.5 56 9.9 56.4L32.6 63.6Q34 64 35.2 63.1L48.8 52.9Q50 52 51.2 52.9L64.8 63.1Q66 64 67.4 63.6L90.1 56.4Q91.5 56 90.4 57L51.1 94Q50 95 48.9 94Z"),
      part("c", "M42.6 82.8Q42 82 43 82L57 82Q58 82 57.4 82.8L50.6 91.2Q50 92 49.4 91.2Z"),
    ],
    light: { a: "#d4561e", b: "#f4ead8", c: "#1c1c1c" },
    dark: { a: "#f07a3d", b: "#f4ead8", c: "#ffd9c2" },
  },
  ironport: {
    id: "ironport",
    city: "Ironport",
    nickname: "Sharks",
    genre: "emblem",
    note: "Nearest: the San Jose Sharks' leaping shark. This one is only a fin, in a ring, over two wave bars.",
    parts: [
      part("c", "M4 50A46 46 0 1 0 96 50A46 46 0 1 0 4 50ZM9 50A41 41 0 1 0 91 50A41 41 0 1 0 9 50Z"),
      part("a", "M86 72C76 54 62 30 40 8C46 30 40 54 24 72Z"),
      part("b", "M18.3 76C34 70 42 82 50 76C58 70 66 82 81.7 76L74.3 83C66 89 58 77 50 83C42 89 34 77 25.7 83Z"),
      part("b", "M32.3 87C34 81 42 93 50 87C58 81 66 93 67.7 87L50 91C66 97 58 85 50 91C42 97 34 85 50 91Z"),
    ],
    light: { a: "#233447", b: "#2fa4b8", c: "#9aa7b4" },
    dark: { a: "#7f9bb8", b: "#3fc2d6", c: "#b8c4d0" },
  },
  pinecrest: {
    id: "pinecrest",
    city: "Pinecrest",
    nickname: "Firs",
    genre: "badge",
    note: "Nearest: forestry and outdoor badges; no well-known club uses a fir. Three stacked triangles cut out of a rounded square.",
    parts: [
      part("a", "M10 24Q10 10 24 10L76 10Q90 10 90 24L90 76Q90 90 76 90L24 90Q10 90 10 76ZM49.6 18.7Q50 18 50.4 18.7L61.6 37.3Q62 38 61.2 38L38.8 38Q38 38 38.4 37.3ZM49.5 32.6Q50 32 50.5 32.6L67.5 53.4Q68 54 67.2 54L32.8 54Q32 54 32.5 53.4ZM49.4 48.6Q50 48 50.6 48.6L73.4 71.4Q74 72 73.2 72L26.8 72Q26 72 26.6 71.4Z"),
      part("b", "M45 74L55 74L55 84L45 84Z"),
    ],
    light: { a: "#14573a", b: "#8a5a2b", c: "#ffffff" },
    dark: { a: "#3fae7c", b: "#c58b4a", c: "#ffffff" },
  },
  redfern: {
    id: "redfern",
    city: "Redfern",
    nickname: "Rovers",
    genre: "crest",
    note: "Nearest: the Dallas Cowboys' star. This is a gold star set inside a red diamond ring.",
    parts: [
      part("a", "M46.5 7.5Q50 4 53.5 7.5L92.5 46.5Q96 50 92.5 53.5L53.5 92.5Q50 96 46.5 92.5L7.5 53.5Q4 50 7.5 46.5ZM48.6 15.4Q50 14 51.4 15.4L84.6 48.6Q86 50 84.6 51.4L51.4 84.6Q50 86 48.6 84.6L15.4 51.4Q14 50 15.4 48.6Z"),
      part("b", "M49.5 29.4Q50 28 50.5 29.4L55.4 42.5Q55.9 43.9 57.4 44L71.3 44.5Q72.8 44.6 71.6 45.5L60.7 54.2Q59.5 55.1 59.9 56.5L63.7 70Q64.1 71.4 62.9 70.6L51.2 62.8Q50 62 48.8 62.8L37.1 70.6Q35.9 71.4 36.3 70L40.1 56.5Q40.5 55.1 39.3 54.2L28.4 45.5Q27.2 44.6 28.7 44.5L42.6 44Q44.1 43.9 44.6 42.5Z"),
    ],
    light: { a: "#b01e2e", b: "#f0c24b", c: "#ffffff" },
    dark: { a: "#e4505f", b: "#f6cf63", c: "#ffffff" },
  },
  tarn: {
    id: "tarn",
    city: "Tarn Valley",
    nickname: "Peaks",
    genre: "badge",
    note: "Nearest: Patagonia's skyline and The North Face's half dome. Two cut-out peaks and a sun in a hexagon.",
    parts: [
      part("a", "M45.7 6.5Q50 4 54.3 6.5L85.5 24.5Q89.8 27 89.8 32L89.8 68Q89.8 73 85.5 75.5L54.3 93.5Q50 96 45.7 93.5L14.5 75.5Q10.2 73 10.2 68L10.2 32Q10.2 27 14.5 24.5ZM17 70Q16 70 16.6 69.2L39.4 34.8Q40 34 40.6 34.8L63.4 69.2Q64 70 63 70ZM45 70Q44 70 44.6 69.2L65.4 42.8Q66 42 66.6 42.8L87.4 69.2Q88 70 87 70Z"),
      part("b", "M60 28A8 8 0 1 0 76 28A8 8 0 1 0 60 28Z"),
    ],
    light: { a: "#26527a", b: "#f2c14e", c: "#ffffff" },
    dark: { a: "#5f9bd0", b: "#f6cf63", c: "#ffffff" },
  },
});
