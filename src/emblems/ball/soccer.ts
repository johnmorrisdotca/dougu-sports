// A soccer ball: a white sphere with twelve dark pentagons at the corners of an icosahedron. Drawn for this package. A sample of the ball area (see docs/layout.md).
import { defineBall, ICOSAHEDRON } from "../emblem.ball.ts";

/** A soccer ball. Turned, it rolls: the pentagons move across the face and the ones that come round the edge are drawn flattened against it. */
export const BALL_SOCCER = /* @__PURE__ */ defineBall("ball:soccer", "Soccer ball", "サッカーボール", "ours", {
  base: "#f6f6f2",
  ink: "#20262d",
  rest: { yaw: 18, pitch: 22 },
  marks: ICOSAHEDRON.map((at) => ({ at, sides: 5, radius: 0.36 })),
});
