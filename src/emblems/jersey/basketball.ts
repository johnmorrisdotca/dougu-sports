// A basketball jersey: a sleeveless tank with a wide scoop neck and round armholes, in a team's colours with a number. Drawn for this package: a generic cut, no team's design.
import { defineJersey } from "../emblem.jersey.ts";

/** A basketball jersey. */
export const JERSEY_BASKETBALL = /* @__PURE__ */ defineJersey("jersey:basketball", "Basketball jersey", "バスケットボールのユニフォーム", {
  name: "basketball",
  start: [24, 6.5],
  segs: [["L", 17.5, 6.5], ["Q", 20.5, 17, 13.5, 27], ["L", 14, 42], ["L", 12.5, 58]],
  neck: { front: "M24 6.5Q32 25 40 6.5Z|M24 6.5Q32 25 40 6.5", back: "M24 6.5Q32 14 40 6.5Z|M24 6.5Q32 14 40 6.5" },
  seams: [],
  bands: ["M13.4 27L17 26.5L16.4 58L12.4 58Z"],
  across: ["M10 54H54V58H10Z"],
  chest: "M10 28H54V34H10Z",
  stripes: "sleeves",
  front: [32, 36, 16, 17],
  back: [32, 38, 28, 22],
  name_: [32, 22, 7, 24],
});
