# Soccer balls

[Back to the README](../README.md) · [日本語](soccer-balls.ja.md) · English

The package draws 21 soccer balls, all in true 3D, all turning with `ballFrame`, all with their seams on the sphere. Every construction is generic: it is worked out here from a polyhedron or a curve, and no brand's or tournament's ball, pattern or graphics is used. The sources and derivations are in [references.md](references.md#soccer-balls). Thirty-four more soccer balls (vintage leather, era-style match balls and shop-wall patterns) are in [vintage-balls.md](vintage-balls.md).

## The ids

| Construction | Black and white | Winter orange | High-visibility yellow |
| --- | --- | --- | --- |
| 32 panels (12 pentagons, 20 hexagons) | `ball:soccer` | `ball:soccer-orange` | `ball:soccer-yellow` |
| 26 panels | `ball:soccer-26` | `ball:soccer-26-orange` | `ball:soccer-26-yellow` |
| 18 panels | `ball:soccer-18` | `ball:soccer-18-orange` | `ball:soccer-18-yellow` |
| 14 panels | `ball:soccer-14` | `ball:soccer-14-orange` | `ball:soccer-14-yellow` |
| 12 panels | `ball:soccer-12` | `ball:soccer-12-orange` | `ball:soccer-12-yellow` |
| 6 panels, thermobonded | `ball:soccer-6` | `ball:soccer-6-orange` | `ball:soccer-6-yellow` |

`ball:soccer-colour` (a red ball with a triangle on each hexagon), `ball:futsal` and `ball:beach-soccer` complete the 21. The colourways are ids of their own, like the squash balls' dots and the cricket balls' colours, so that each shows in the gallery and the registry; `tint` replaces the orange or the yellow and `accent` replaces the dark panels. The black-and-white balls are laid on a white ground, and `tint` replaces their dark panels.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

console.log(renderEmblem("ball:soccer-26", { size: 64 }).includes("<title>Soccer ball, 26 panels</title>")); // true
console.log(renderEmblem("ball:soccer-14-orange", { tint: "#e8f21c" }).includes("#e8f21c")); // true
console.log(ballFrame("ball:soccer-12", { yaw: 360 }) === ballFrame("ball:soccer-12", { yaw: 0 })); // true
```

## The panel constructions

Every panel is a ring of unit vectors on the sphere and every edge between two vertices follows the sphere (spherical interpolation), so the panels bulge as an inflated ball's do. The code is `src/emblems/ball/ball.tilings.ts` (the tilings) and `ball.soccer.panels.ts` (the balls); `test/ball.test.ts` counts the vertices, edges and faces of each.

- **32 panels** (`ball:soccer`): the truncated icosahedron, 12 pentagons and 20 hexagons, with 60 vertices and 90 edges.
- **26 panels** (`ball:soccer-26`): the rhombicuboctahedron. Its 24 vertices are the permutations of (±1, ±1, ±(1 + √2)); its 26 faces are 8 triangles (about the corners of a cube, drawn dark), 6 squares about the directions of the cube's faces (mid tone) and 12 squares about the directions of its edges (light), with 48 edges.
- **18 panels** (`ball:soccer-18`): the six faces of a cube, each cut into three strips by two lines a third of the way in from its sides; each face is projected onto the sphere from the middle, so every seam is an arc of a great circle, and the strips of neighbouring faces run square to each other. This is the layout the volleyballs use; the soccer ball has its own colours.
- **14 panels** (`ball:soccer-14`): the topology of a truncated cube, 8 triangles and 6 octagons, with vertices the permutations of (±ξ, ±1, ±1) and ξ = 0.42 (almost the regular truncated cube, which has ξ = √2 − 1 ≈ 0.414). The octagons meet along 12 edges, and each is bent into an S: the point a fraction t of the way along the great-circle arc is moved sideways, along the sphere, by 0.2 × (the chord) × sin(2πt) × (0.5 + 0.5 sin(πt)). That curve is the same turned half a turn about the middle of its edge, so the 12 S-curves, the 6 octagons and the 8 triangles keep all 24 rotations of the cube, and lose its mirrors, so the tiling has a hand. Each octagon then has four straight sides against the triangles and four S-shaped ones: a propeller. The three pairs of opposite propellers have a tone each.
- **12 panels** (`ball:soccer-12`): the dodecahedron. Its 20 vertices are (±1, ±1, ±1) and the cyclic permutations of (0, ±1/φ, ±φ); its 12 pentagons are about the directions (±1, 0, ±φ) and their cyclic permutations. The pentagons are coloured in four classes so that no two that touch share one (a four-colouring of the icosahedron's vertices, found by search), and drawn in three tones: one class dark, one mid, two light.
- **6 panels, thermobonded** (`ball:soccer-6`): our own design, with no stitching: six gores, each between two seams that run from one pole to the other and turn through 180° of longitude on the way, longitude = 360° × i / 6 + 90° × latitude / 90°. The seams are long, shallow grooves, the cover is smooth and the grain is finer than the others'. The poles are tilted 28° from the ball's spin axis, so that the seams do not all meet at the top of a turning ball. Panels alternate light, mid and dark, so opposite gores match.

## Futsal and beach soccer

| | Futsal (`ball:futsal`) | Beach soccer (`ball:beach-soccer`) |
| --- | --- | --- |
| Rule | Futsal Laws of the Game 2025/26, Law 2 The Ball, section 1 | Beach Soccer Laws of the Game 2024-25, Law 2 The Ball, section 1 |
| Size | 4 | 5 |
| Circumference | 62 to 64 cm (63 cm drawn: diameter 200.5 mm) | 68 to 70 cm (69 cm drawn: diameter 219.6 mm) |
| Mass at the start of the match | 400 to 440 g | 400 to 440 g |
| Pressure at sea level | 0.6 to 0.9 atm (600 to 900 g/cm²) | 0.4 to 0.6 atm (400 to 600 g/cm²) |
| Bounce | first rebound from 2 m: 50 to 65 cm, which is low | not set |
| The drawing | 32 panels, bright blue and white, a small yellow pentagon inside each of the twelve, a matt grained cover | the 14-panel propeller layout in yellow, orange and blue, with dark navy triangles |

The sizes are in `emblemInfo(id).size`, with the rule in `size.rule` and the rest in `size.note`; `lineup` draws futsal smaller than the 11-a-side ball, and `test/proportions.test.ts` holds every one of these balls to its rule's size within 2%. The Laws let associations change the size, weight and material for youth and other categories; the figures here are the ones the Laws set for the full game. An 11-a-side ball is 68 to 70 cm, 410 to 450 g (IFAB Law 2).

## Colourways

Winter orange is `#ff6a13`, a bright orange that shows against snow and in low light; high-visibility yellow is `#e8f21c`, a fluorescent yellow. Both have dark panels (`#1e2025`) where the black-and-white ball has its dark ones, and lighter tones of the colour where it has its mid ones. They are the same ball as the black-and-white one in every other way, so each has the same size and rule.
