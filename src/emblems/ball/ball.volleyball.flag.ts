// Volleyballs in national colours: the 18-panel indoor ball (six groups of three strips) with its panels in the colours of a country's flag, three colours to a ball. They are only colours: no flag is drawn,
// no crest or federation's mark, and the ball is the indoor ball of the FIVB's rule. `colors` takes any three colours for any of them, and `ball:volleyball-colours` is the same ball with colours of your own.
import { type BallSpec, defineBall } from "./ball.engine.ts";
import { strips18 } from "./ball.family.panelled.ts";
import { BALL_VOLLEYBALL } from "./ball.volleyball.ts";

const WHITE = "#f6f4ee";
type Trio = readonly [string, string, string];

/** The ball with the colours of one flag: `tint` replaces the first colour, `accent` the second and `colors` all three. The six faces take the three colours in pairs, so each colour is the outer strips of two faces and the middle strip of two others. */
function nation(id: string, en: string, ja: string, colours: Trio, view: BallSpec["view"] = { yaw: 28, pitch: 22, roll: 0 }): ReturnType<typeof defineBall> {
  return defineBall({
    id,
    en,
    ja,
    size: BALL_VOLLEYBALL.size!,
    spec: {
      view,
      base: colours[0],
      ground: "#e9e7e0",
      mat: { gloss: 0.75, shade: "#1a2a50", grain: { f: 1.2, a: 0.12 } },
      draw: (s, base, accent, picked) => {
        const [a, b, c] = picked ?? ([base, accent ?? colours[1], colours[2]] as const);
        return strips18(s, [[a, b], [b, c], [c, a], [a, c], [b, a], [c, b]], "#3a4560");
      },
    },
  });
}

export const BALL_VOLLEYBALL_COLOURS = /* @__PURE__ */ nation("ball:volleyball-colours", "Volleyball, three colours", "三色のバレーボール", ["#f3c81c", "#1f5fbf", WHITE]);
export const BALL_VOLLEYBALL_BRAZIL = /* @__PURE__ */ nation("ball:volleyball-brazil", "Volleyball, Brazil", "バレー（ブラジル）", ["#009c3b", "#ffdf00", "#002776"]);
export const BALL_VOLLEYBALL_JAPAN = /* @__PURE__ */ nation("ball:volleyball-japan", "Volleyball, Japan", "バレー（日本）", [WHITE, "#bc002d", "#7d0020"]);
export const BALL_VOLLEYBALL_CANADA = /* @__PURE__ */ nation("ball:volleyball-canada", "Volleyball, Canada", "バレー（カナダ）", ["#d52b1e", WHITE, "#9b1c14"]);
export const BALL_VOLLEYBALL_USA = /* @__PURE__ */ nation("ball:volleyball-usa", "Volleyball, USA", "バレー（アメリカ）", ["#b22234", WHITE, "#3c3b6e"]);
export const BALL_VOLLEYBALL_ITALY = /* @__PURE__ */ nation("ball:volleyball-italy", "Volleyball, Italy", "バレー（イタリア）", ["#009246", WHITE, "#ce2b37"]);
export const BALL_VOLLEYBALL_POLAND = /* @__PURE__ */ nation("ball:volleyball-poland", "Volleyball, Poland", "バレー（ポーランド）", [WHITE, "#dc143c", "#9b1030"]);
export const BALL_VOLLEYBALL_FRANCE = /* @__PURE__ */ nation("ball:volleyball-france", "Volleyball, France", "バレー（フランス）", ["#0055a4", WHITE, "#ef4135"]);
export const BALL_VOLLEYBALL_SERBIA = /* @__PURE__ */ nation("ball:volleyball-serbia", "Volleyball, Serbia", "バレー（セルビア）", ["#c6363c", "#0c4076", WHITE]);
export const BALL_VOLLEYBALL_NETHERLANDS = /* @__PURE__ */ nation("ball:volleyball-netherlands", "Volleyball, Netherlands", "バレー（オランダ）", ["#ae1c28", WHITE, "#21468b"]);
export const BALL_VOLLEYBALL_GERMANY = /* @__PURE__ */ nation("ball:volleyball-germany", "Volleyball, Germany", "バレー（ドイツ）", ["#1b1b1b", "#dd0000", "#ffce00"]);
