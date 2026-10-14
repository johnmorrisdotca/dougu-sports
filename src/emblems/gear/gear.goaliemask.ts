// A goalie mask, drawn for this package: a pale moulded shell with a caged face opening, painted brow, side pieces over the ears and a chin guard.
import { drawn, ellipse, seg } from "./gear.core.ts";

/** The cage: bars across the face opening. */
const CAGE = ((): string => {
  let d = "";
  for (const x of [26.5, 32, 37.5]) d += seg(x, 15, x, 53);
  for (const y of [24, 35, 46]) d += `M${32 - 12.4 * Math.sqrt(1 - ((y - 34) / 20) ** 2)} ${y}H${32 + 12.4 * Math.sqrt(1 - ((y - 34) / 20) ** 2)}`;
  return d;
})();

export const GEAR_GOALIE_MASK = /* @__PURE__ */ drawn("gear:goalie-mask", "Goalie mask", "ゴールキーパーマスク", {
  main: "#eef0f2",
  accent: "#c8202c",
  parts: [
    { d: "M32 3C46 3 53 14 53 29C53 41 48 51 41 58Q32 63 23 58C16 51 11 41 11 29C11 14 18 3 32 3Z", fill: "$main", cyl: 0.7 },
    { d: "M14 20Q32 6 50 20L48 25Q32 13 16 25Z", fill: "$accent", stroke: "none", shade: 0.6, line: "none" },
    { d: ellipse(32, 34, 13.6, 20.4), fill: "#2b3038", stroke: "#1b1f27", shade: 0, line: "stroke" },
    { d: CAGE, fill: "none", stroke: "#cfd6de", w: 1.5 },
    { d: "M11.6 30Q10.6 40 13.6 47L18 44Q15.4 38 16.4 30ZM52.4 30Q53.4 40 50.4 47L46 44Q48.6 38 47.6 30Z", fill: "$main", cyl: 0.6, line: "none" },
    { d: "M18 8Q24 4.8 29 4.4", fill: "none", stroke: "#fff", w: 1.8, op: 0.8, line: "none", fx: true },
  ],
});
