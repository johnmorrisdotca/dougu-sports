// A wooden board with a metal plate and lines for the words. Drawn for this package.
import { defineFlat } from "../emblem.shapes.ts";

/** A wooden board with a plate and lines for the words. */
export const TROPHY_PLAQUE = /* @__PURE__ */ defineFlat("trophy:plaque", "Plaque", "記念盾", "ours", {
  metal: "gold",
  ribbon: "#7a5230",
  front: [
    ["r", "M10 4h44l5 6v44l-5 6H10l-5-6V10z"],
    ["e", "M12 8h40l3 4v40l-3 4H12l-3-4V12z", "1.4"],
    ["m", "M15 12h34v30H15z"],
    ["T", "M21 20h22M21 27h22M21 34h13"],
    ["m", "M23 47h18v7H23z"],
    ["l", "M17 14h8l-8 8z"],
  ],
  rim: 4,
  engrave: { front: { x: 32, y: 27, w: 30, h: 26 }, year: { x: 32, y: 50.5, w: 16, h: 5 } },
});
