// A soccer jersey: a short-sleeved shirt with a round collar, in a team's colours with a number. Drawn for this package: a generic cut, no team's design.
import { defineJersey } from "../emblem.jersey.ts";

/** A soccer jersey. */
export const JERSEY_SOCCER = /* @__PURE__ */ defineJersey("jersey:soccer", "Soccer jersey", "サッカーのユニフォーム", {
  name: "soccer",
  start: [25.5, 7.5],
  segs: [["L", 14.5, 10], ["L", 4, 25], ["L", 10.5, 30], ["L", 16, 22.5], ["L", 17, 38], ["L", 17.2, 57]],
  neck: { front: "M25.5 7.5Q32 16 38.5 7.5Z|M25.5 7.5Q32 16 38.5 7.5", back: "M26 7.5Q32 11 38 7.5Z|M26 7.5Q32 11 38 7.5" },
  seams: ["M14.5 10Q16 17 16 22.5"],
  sleeve: "M14.5 10L4 25L10.5 30L16 22.5Q16 17 14.5 10Z",
  bands: ["M4.6 23.6L11.4 29.4L9.6 31.6L2.8 25.8Z"],
  across: ["M16 53H48V57.5H16Z"],
  chest: "M12 27H52V33H12Z",
  stripes: "none",
  front: [32, 33, 13, 14],
  back: [32, 39, 26, 22],
  name_: [32, 24, 7, 24],
});
