// A gold globe, drawn with its lines of latitude and longitude, standing on a column and a stepped base. Drawn for this package.
import { defineLathe } from "../emblem.lathe.ts";

/** A globe in a stand. */
export const TROPHY_GLOBE = /* @__PURE__ */ defineLathe("trophy:globe", "Globe on a stand", "台座の上の地球儀", "ours", {
  metal: "gold",
  solids: [{ p: [[34, 3.4, 1], [48, 3.4, 1], [48, 8, 1], [51, 8, 1], [51, 13, 1], [55, 13, 1], [55, 15.2, 1], [59, 15.2, 1]] }],
  balls: [{ kind: "globe", cy: 21, r: 15 }],
  plate: { y0: 55.2, y1: 58.8 },
});
