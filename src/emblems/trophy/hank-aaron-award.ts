// A mahogany block cut in the shape of home plate, its face a plate of cast grey metal with a bat laid across it from the upper left, and over the bat two ribbons that cross it one above the other, the upper one rising to the right and
// the lower one falling. Drawn for this package from a photograph of the award held in the hands of the winners (docs/likeness-sources.md); the lettering on the ribbons, the league's mark under them and the engraving are left out.
import { defineFlat } from "../emblem.shapes.ts";

/** The Hank Aaron Award: a home-plate block of mahogany with a grey metal face, a bat and two ribbons. */
export const TROPHY_HANK_AARON_AWARD = /* @__PURE__ */ defineFlat("trophy:hank-aaron-award", "Hank Aaron Award", "ハンク・アーロン賞", "ours", {
  metal: "silver",
  ribbon: "#6b2f22",
  front: [
    ["r", "M5.5 5.5H58.5V36.5L32 60L5.5 36.5Z"],
    ["e", "M11 11H53V33.6L32 52.4L11 33.6Z", "1"],
    ["f", "M11.8 11.8H52.2V33.1L32 51.2L11.8 33.1Z", "#474a46"],
    ["s", "M11.8 29.4L32 47.4L52.2 29.4V33.1L32 51.2L11.8 33.1Z"],
    ["l", "M6.8 6.8H57.2V8.6H8.6ZM6.8 6.8L8.6 8.6V35.6L6.8 34.6Z"],
    ["m", "M15.2 12.6L19.6 11.2L47.6 38.4L45.2 41.4Z"],
    ["l", "M17.2 12.6L19.8 11.8L46.6 38L46 39Z"],
    ["m", "M13.4 18C21 16 31 13.4 46 12.6C49 12.4 50.6 12.6 51.6 13.4L49.8 16.6L51.4 20.2C44 21 33 23.4 14 24.8L15.6 21.4Z"],
    ["t", "M15.8 21.4C26 19.4 38 17.4 50 15.8"],
    ["m", "M14 27.6C27 26.4 40 27.4 50.6 24.4L49 28.6L50.8 32.2C40 33.8 27 32.4 14.6 33.6L16.2 30.4Z"],
    ["t", "M16.4 30.4C28 29.8 40 30.2 49.2 28.6"],
  ],
  rim: 3,
});
