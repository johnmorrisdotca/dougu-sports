// A football jersey: a wide-shouldered, short-sleeved shirt with a V neck, cut to go over pads, in a team's colours with a big number. Drawn for this package: a generic cut, no team's design.
import { defineJersey } from "../emblem.jersey.ts";

/** A football jersey. */
export const JERSEY_FOOTBALL = /* @__PURE__ */ defineJersey("jersey:football", "Football jersey", "アメリカンフットボールのジャージ", {
  name: "football",
  start: [25, 8],
  segs: [["L", 13, 8.5], ["L", 4, 13.5], ["L", 2, 28], ["L", 9.5, 32], ["L", 15.5, 27], ["L", 17.5, 42], ["L", 17.5, 58]],
  neck: { front: "M25 8L32 19L39 8Z|M25 8L32 19L39 8", back: "M26 8Q32 12.5 38 8Z|M26 8Q32 12.5 38 8" },
  seams: ["M13 8.5Q16 18 15.5 27"],
  sleeve: "M13 8.5L4 13.5L2 28L9.5 32L15.5 27Q16 18 13 8.5Z",
  bands: ["M3.4 17.5L15.6 20L15.6 22.8L3 20.6Z", "M2.8 23L15.5 25.6L15.4 28.4L2.6 26Z"],
  across: [],
  chest: "M10 28H54V34H10Z",
  stripes: "sleeves",
  front: [32, 38, 22, 20],
  back: [32, 41, 28, 24],
  name_: [32, 24, 7, 26],
});
