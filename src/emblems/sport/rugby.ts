// Rugby: a pictogram of the ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon, tiltedEllipse } from "../emblem.shapes.ts";

/** Rugby. */
export const SPORT_RUGBY = /* @__PURE__ */ defineIcon("sport:rugby", "Rugby", "ラグビー", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", tiltedEllipse(32, 32, 28, 17, -45)],
    ["t", "M13.4 50.6Q23 31 50.6 13.4M13.4 50.6Q33 41 50.6 13.4"],
    ["t", "M24.6 34.6l4.8 4.8M28.1 31.1l4.8 4.8M31.6 27.6l4.8 4.8M35.1 24.1l4.8 4.8"],
  ],
});
