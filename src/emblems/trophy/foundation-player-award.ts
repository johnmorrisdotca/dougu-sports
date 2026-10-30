// A tall clear crystal block, a rectangular prism a little more than twice as tall as it is wide, with two long V facets cut into its front from the top corners down to a point near the bottom centre, which
// catch the light as two bright triangles. Drawn for this package from photographs (docs/likeness.md); the engraved text is left out, so the glass is plain.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_SCULPT } from "../lathe.sculpt.ts";

/** The NHL Foundation Player Award: a tall block of clear crystal with two V-cut facets. */
export const TROPHY_FOUNDATION_PLAYER_AWARD = /* @__PURE__ */ defineLathe("trophy:foundation-player-award", "Foundation Player Award", "NHL財団選手賞", "ours", {
  metal: "silver",
  sculptor: LATHE_SCULPT,
  tones: { glass: "#8fb3c9", copper: "#b98660", cream: "#d9d2bc" },
  turnBox: "-11.7 -11.6 87.4 87.4",
  tilt: 9,
  solids: [],
  parts: [
    {
      kind: "cut",
      t: 8.4,
      layers: [
        ["glass", "M19.2 2.4H44.8V61.8H19.2Z", "gl"],
        ["copper", "M20.2 4.6L31.6 60.6H20.2Z", "rf"],
        ["cream", "M43.8 4.6L32.4 60.6H43.8Z", "rf"],
        ["glass", "M20.2 4.6L31.6 60.6", "ln"],
        ["glass", "M43.8 4.6L32.4 60.6", "ln"],
        ["glass", "M21.6 6.4V59.2H22.8V12Z", "sh"],
        ["glass", "M42.4 6.4V59.2H41.2V12Z", "sh"],
        ["glass", "M19.2 61.8L20.6 60.4H43.4L44.8 61.8Z", "sh"],
      ],
    },
    // The text the `engrave` option cuts into the clear middle of the glass; plain glass without it.
    { kind: "cut", at: [0, 4.3], t: 0.1, decal: true, plate: [25.4, 38.6, 24, 38], layers: [] },
  ],
});
