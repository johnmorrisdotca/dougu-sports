// Rugby: a pictogram of the ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon, tiltedEllipse } from "../emblem.shapes.ts";

/** Rugby. */
export const SPORT_RUGBY = /* @__PURE__ */ defineIcon("sport:rugby", "Rugby", "ラグビー", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", tiltedEllipse(32, 32, 28, 17, -45)],
    ["t", "M13.4 50.6L50.6 13.4M13.4 50.6Q26 26 50.6 13.4M13.4 50.6Q38 38 50.6 13.4"],
    ["t", "M24.6 34.6l-3.4 3.4M28.4 30.8l-3.4 3.4M32.2 27l-3.4 3.4M36 23.2l-3.4 3.4M39.8 19.4l-3.4 3.4"],
  ],
});
