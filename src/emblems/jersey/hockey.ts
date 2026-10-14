// An ice hockey jersey: a loose, long-sleeved shirt with a crew neck, in a team's colours with a number. Drawn for this package: a generic cut, no team's design.
import { defineJersey } from "../emblem.jersey.ts";

/** A hockey jersey. */
export const JERSEY_HOCKEY = /* @__PURE__ */ defineJersey("jersey:hockey", "Hockey jersey", "アイスホッケーのジャージ", {
  name: "hockey",
  start: [24.5, 7.5],
  segs: [["L", 12.5, 10.5], ["L", 3, 40], ["L", 3, 46], ["L", 13.5, 48.5], ["L", 17.2, 34], ["L", 17.5, 57]],
  neck: { front: "M24.5 7.5Q32 19 39.5 7.5Z|M24.5 7.5Q32 19 39.5 7.5", back: "M25.5 7.5Q32 12.5 38.5 7.5Z|M25.5 7.5Q32 12.5 38.5 7.5" },
  seams: ["M12.5 10.5Q16 22 17.2 34"],
  sleeve: "M12.5 10.5L3 40L3 46L13.5 48.5L17.2 34Q16 22 12.5 10.5Z",
  bands: ["M3.7 36L16.6 36.4L16.1 39L3.3 38.6Z", "M3 41L15.6 41.6L15.1 44.2L3 43.8Z"],
  across: ["M16 51.5H48V55H16Z"],
  trim: true,
  front: [32, 34, 13, 15],
  back: [32, 40, 26, 22],
  name_: [32, 25, 7, 26],
});
