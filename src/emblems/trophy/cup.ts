// A plain two-handled cup, drawn for this package: a deep bowl with a star, a bevelled handle on each side, a short stem and a flared foot, in polished metal.
import { defineIcon } from "../emblem.shapes.ts";

/** Cup. */
export const TROPHY_CUP = /* @__PURE__ */ defineIcon("trophy:cup", "Cup", "カップ", "ours", {
  metal: "gold",
  front: [
    ["m", "M15.4 8.6H7.6Q5 8.6 5 11.2V17Q5 27 16.4 29.4V24.6Q10 22.6 10 17V13.4H15.4Z"],
    ["m", "M48.6 8.6H56.4Q59 8.6 59 11.2V17Q59 27 47.6 29.4V24.6Q54 22.6 54 17V13.4H48.6Z"],
    ["m", "M15 5h34v15C49 32 42 40 32 41 22 40 15 32 15 20z"],
    ["m", "M27.4 40h9.2l1 7h-11.2z"],
    ["m", "M19 47h26l4 6v5H15v-5z"],
    ["s", "M32 12.4l1.8 4.4 4.8.4-3.6 3.2 1.1 4.7L32 22.4l-4.1 2.7 1.1-4.7-3.6-3.2 4.8-.4z"],
    ["l", "M19.4 8h5v13q-5-3.6-5-13z"],
    ["l", "M20 49.6h24l1.4 2H18.6z"],
  ],
});
