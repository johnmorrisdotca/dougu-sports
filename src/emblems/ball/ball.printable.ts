// The balls that take a logo, lettering and a mark, with the printer in hand: the same balls as `ball.baseball.ts`, `ball.softball.ts` and `ball.soccer.ts` and the classic soccer balls of `ball.soccer.panels.ts`, made
// with `printed()`. The balls' own modules carry no printing code (so one bundled alone stays small); the registry and the main entry take these.
import { BALL_BASEBALL as PLAIN_BASEBALL } from "./ball.baseball.ts";
import { printed } from "./ball.print.ts";
import { BALL_SOCCER_ORANGE as PLAIN_SOCCER_ORANGE, BALL_SOCCER_YELLOW as PLAIN_SOCCER_YELLOW } from "./ball.soccer.panels.ts";
import { BALL_SOCCER as PLAIN_SOCCER, BALL_SOCCER_COLOUR as PLAIN_SOCCER_COLOUR } from "./ball.soccer.ts";
import { BALL_SOFTBALL as PLAIN_SOFTBALL } from "./ball.softball.ts";

export const BALL_BASEBALL = /* @__PURE__ */ printed(PLAIN_BASEBALL);
export const BALL_SOFTBALL = /* @__PURE__ */ printed(PLAIN_SOFTBALL);
export const BALL_SOCCER = /* @__PURE__ */ printed(PLAIN_SOCCER);
export const BALL_SOCCER_COLOUR = /* @__PURE__ */ printed(PLAIN_SOCCER_COLOUR);
export const BALL_SOCCER_ORANGE = /* @__PURE__ */ printed(PLAIN_SOCCER_ORANGE);
export const BALL_SOCCER_YELLOW = /* @__PURE__ */ printed(PLAIN_SOCCER_YELLOW);
