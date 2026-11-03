// The balls that take a logo, lettering and a mark, with the printer in hand: the same balls as `ball.baseball.ts`, `ball.softball.ts` and `ball.soccer.ts` and the classic soccer balls of `ball.soccer.panels.ts`, made
// with `printed()`. The balls' own modules carry no printing code (so one bundled alone stays small); the registry and the main entry take these.
import { BALL_BASEBALL as PLAIN_BASEBALL } from "./ball.baseball.ts";
import { printed } from "./ball.print.ts";
import { BALL_SOCCER_ORANGE as PLAIN_SOCCER_ORANGE, BALL_SOCCER_YELLOW as PLAIN_SOCCER_YELLOW } from "./ball.soccer.panels.ts";
import { BALL_SOCCER as PLAIN_SOCCER, BALL_SOCCER_COLOUR as PLAIN_SOCCER_COLOUR } from "./ball.soccer.ts";
import { BALL_SOFTBALL as PLAIN_SOFTBALL } from "./ball.softball.ts";

/**
 * The Baseball emblem (野球のボール in Japanese): id `ball:baseball`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_BASEBALL } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_BASEBALL.id, BALL_BASEBALL.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_BASEBALL = /* @__PURE__ */ printed(PLAIN_BASEBALL);
/**
 * The Softball emblem (ソフトボール in Japanese): id `ball:softball`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_SOFTBALL } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_SOFTBALL.id, BALL_SOFTBALL.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_SOFTBALL = /* @__PURE__ */ printed(PLAIN_SOFTBALL);
/**
 * The Soccer ball emblem (サッカーボール in Japanese): id `ball:soccer`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_SOCCER } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_SOCCER.id, BALL_SOCCER.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_SOCCER = /* @__PURE__ */ printed(PLAIN_SOCCER);
/**
 * The Soccer ball, coloured emblem (サッカーボール（カラー） in Japanese): id `ball:soccer-colour`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_SOCCER_COLOUR } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_SOCCER_COLOUR.id, BALL_SOCCER_COLOUR.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_SOCCER_COLOUR = /* @__PURE__ */ printed(PLAIN_SOCCER_COLOUR);
/**
 * The Soccer ball, orange emblem (32枚貼り・オレンジ in Japanese): id `ball:soccer-orange`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_SOCCER_ORANGE } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_SOCCER_ORANGE.id, BALL_SOCCER_ORANGE.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_SOCCER_ORANGE = /* @__PURE__ */ printed(PLAIN_SOCCER_ORANGE);
/**
 * The Soccer ball, yellow emblem (32枚貼り・蛍光イエロー in Japanese): id `ball:soccer-yellow`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_SOCCER_YELLOW } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_SOCCER_YELLOW.id, BALL_SOCCER_YELLOW.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_SOCCER_YELLOW = /* @__PURE__ */ printed(PLAIN_SOCCER_YELLOW);
