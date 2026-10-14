// The medal on a ribbon: a gold disc with a star on its face and a plain back, on two crossed straps. Drawn for this package. A sample of the award area (see docs/layout.md).
import { circlePath, defineFlat, starPath } from "../emblem.shapes.ts";

/** A medal on a ribbon. Turned, it flips like a coin and shows its plain back. */
export const AWARD_MEDAL = /* @__PURE__ */ defineFlat("award:medal", "Medal", "メダル", "ours", {
  metal: "gold",
  front: [
    { part: "ribbon", d: "M17 3H29L39 31H28Z" },
    { part: "ribbon", d: "M47 3H35L25 31H36Z" },
    { part: "main", d: circlePath(32, 42, 17) },
    { part: "detail", d: circlePath(32, 42, 12.5) },
    { part: "main", d: starPath(32, 42, 8.6, 3.6) },
  ],
  back: [
    { part: "ribbon", d: "M17 3H29L39 31H28Z" },
    { part: "ribbon", d: "M47 3H35L25 31H36Z" },
    { part: "main", d: circlePath(32, 42, 17) },
    { part: "detail", d: circlePath(32, 42, 12.5) },
  ],
});
