// American football: a pictogram of the ball, drawn for this package, in a 64 by 64 box. The Canadian and the international-rules pictograms are the same drawing.
import { type FlatModel, defineIcon } from "../emblem.shapes.ts";

/** A pointed ball on the diagonal, with laces and a band near each end. */
const FOOTBALL: FlatModel = {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M8 56Q15.4 15.4 56 8Q48.6 48.6 8 56Z"],
    ["n", "M26 38L38 26"],
    ["t", "M29.4 31.2l3.4 3.4M32.2 28.4l3.4 3.4M26.6 34l3.4 3.4M23.8 36.8l3.4 3.4M35 25.6l3.4 3.4"],
    ["t", "M14.6 40.6l5.6 5.6M43.8 17.8l5.6 5.6"],
  ],
};

/** American football. */
export const SPORT_NFL = /* @__PURE__ */ defineIcon("sport:nfl", "American football", "アメリカンフットボール", "ours", FOOTBALL);
