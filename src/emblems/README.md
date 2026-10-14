# Balls and gear

`ball/` draws every ball and implement of the sports we support, in true 3D, in a colour style and a line style (`currentColor`); `gear/` holds a piece of equipment for each sport in the same styles (`metal`, `color` and `line`, the last in `currentColor`); a piece of gear flips like a coin when it is turned. Both are self-contained (they import nothing from the rest of the package), so they can be taken as they are.

```ts
import { ballFrame, lineup, renderBall } from "./ball/ball.index.ts";
import { renderGear } from "./gear/gear.index.ts";

renderBall("soccer", { size: 64 });                       // a document of SVG
renderBall("ball:puck", { style: "line" });               // the line style, in the page's ink
ballFrame("basketball", { yaw: 120, pitch: 10, size: 48 }); // turned: any ball turns in 3D
lineup(["golf", "tennis", "puck", "basketball"], { scale: "true" }); // at the rulebooks' relative sizes
renderGear("hockey-stick", { size: 48 });
```

- **Ids** are `ball:<name>` (47) and `gear:<name>` (42). A module per family exports named constants (`BALL_SOCCER`, `GEAR_HURLEY`) that are pieces of the shape `{ id, en, ja, source, kind, model, size?, svg(options), frame(options) }`, which is the emblem registry's shape; `source` is `generated` or `drawn` and `kind` is `ball` or `gear`, so a registry that checks those unions needs widening. A bundler keeps only the pieces that are imported.
- **Options** are `style` (`colour`, also written `metal`, or `line`), `size`, `tint`, `accent`, `theme` (`inherit`, `auto`, `light`, `dark`) and, for a ball, `grain`; a turn is `yaw`, `pitch` and `roll` in degrees, added to the ball's own 3/4 view. The grain is left out under 48 px and while a ball is turning.
- **Sizes** (`size`): each ball carries its official diameter or length, circumference, mass and the rule they are from (`rule`), and `extentMm`, the scale `lineup` draws at.
- **The engine** (`ball/ball.engine.ts`): a rotation matrix, an orthographic projection, panels cut exactly at the limb and joined along it, strokes that thin toward the limb, radial-gradient shading and a screen-space grain (`feTurbulence` lit from the upper left). Ellipsoids cover the prolate balls and the discus; a puck, a stone and a shuttlecock are drawn from their own geometry (`ball.stack.ts`, `ball.shuttlecock.ts`).
- **Sources:** [NOTICE.md](../../NOTICE.md) and [docs/references.md](../../docs/references.md); the licence texts are in [LICENSES/](../../LICENSES).

## Scripts (`scripts/dougu/`)

| Script | What it does |
| --- | --- |
| `contact-sheet.mjs` | the contact sheet at 256, 64 and 16 px, in colour and as line drawings, light and dark |
| `gallery.mjs`, `gallery-page.mjs` | the gallery page: every id, both styles, a turning demo for each ball, the balls at their true sizes |
