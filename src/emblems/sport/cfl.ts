// Canadian football: the pictogram of the ball with a white stripe all the way round near each end (CFL Rule 1, Section 2), drawn for this package from `ball:football-cfl`, in a 64 by 64 box.
import { defineIcon } from "../emblem.shapes.ts";
import { footballModel } from "./nfl.ts";

/** Canadian football. */
export const SPORT_CFL = /* @__PURE__ */ defineIcon("sport:cfl", "Canadian football", "カナディアンフットボール", "ours", footballModel("ring"));
