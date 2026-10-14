// Volleyballs in national colours: the 18-panel indoor ball (six groups of three strips) with its panels in the colours of a country's flag, three colours to a ball. They are only colours: no flag is drawn,
// no crest or federation's mark, and the ball is the indoor ball of the FIVB's rule. `colors` takes any three colours for any of them, and `ball:volleyball-colours` is the same ball with colours of your own.
import { type BallSpec, defineBall } from "./ball.engine.ts";
import { ON_A_CORNER, panels18 } from "./ball.family.panelled.ts";
import { BALL_VOLLEYBALL } from "./ball.volleyball.ts";

const WHITE = "#f6f4ee";
type Trio = readonly [string, string, string];

/**
 * How one country's ball is laid out. `panels` is 18 letters, `a`, `b` or `c` for the first, second or third colour, three to each of the cube's six faces in the order of `paintEach18` (+z, -z, +x, -x, +y, -y), the strips of a face
 * from one edge to the other. `corner` stands the ball on a corner of its cube, so three faces make the top and three the bottom and it turns about that corner.
 * The layouts differ in where the colours sit, not only in which they are, so that two balls with alike colours (white and red, or red, white and blue) still look different at 16 pixels.
 */
export interface VolleyballPlan {
  readonly colours: Trio;
  readonly panels: string;
  readonly corner?: boolean;
}

const plan = (colours: Trio, faces: string, corner = false): VolleyballPlan => ({ colours, panels: faces.replace(/ /g, ""), corner });

/** The national balls: colours and layout of each, by the id's last word. */
export const VOLLEYBALL_PLANS = {
  // Three colours in turn, as before: the middle strips of two faces and the outer strips of the others.
  brazil: plan(["#009c3b", "#ffdf00", "#002776"], "aba bcb cac aca bab cbc"),
  // White with one band of crimson: the three strips of the front face run from the top round the side as one broad sash; the dark red is a thin shadow strip on each side of it.
  japan: plan([WHITE, "#bc002d", "#7d0020"], "baa aab aba aba bab aca"),
  // Red with a white pale down the middle, like the flag: the white middle strips of the front and the back, red everywhere else, the dark red on the two ends.
  canada: plan(["#d52b1e", WHITE, "#9b1c14"], "aba aba aaa aaa ccc ccc"),
  // A navy field of two faces (the canton), the other four faces in red and white stripes.
  usa: plan(["#b22234", WHITE, "#3c3b6e"], "aba bab ccc ccc aba bab"),
  // The flag's green, white and red in three bands round the ball: green on one side, white across the front and red on the other.
  italy: plan(["#009246", WHITE, "#ce2b37"], "abc cba ccc aaa bbb bbb"),
  // White above and red below, as the flag is cut: the three faces round the top corner white, the three round the bottom red.
  poland: plan([WHITE, "#dc143c", "#9b1030"], "aaa bcb aaa bcb aaa bcb", true),
  // Blue, white and red as three big fields turning round one corner, each on two opposite faces.
  france: plan(["#0055a4", WHITE, "#ef4135"], "aaa aaa bbb bbb ccc ccc", true),
  // The flag's red, blue and white from the top down: a red cap, a blue belt and a white foot.
  serbia: plan(["#c6363c", "#0c4076", WHITE], "bbb bbb cba cba aaa ccc"),
  // Thin stripes of red, white and blue on every face of a ball standing on its corner.
  netherlands: plan(["#ae1c28", WHITE, "#21468b"], "abc abc abc abc abc abc", true),
  germany: plan(["#1b1b1b", "#dd0000", "#ffce00"], "aaa ccc bbb aaa ccc bbb", true),
} as const satisfies Record<string, VolleyballPlan>;

const SEAM = "#3a4560";

/** The ball with the colours of one flag: `tint` replaces the first colour, `accent` the second and `colors` all three. */
function nation(id: string, en: string, ja: string, laid: VolleyballPlan, view: BallSpec["view"] = laid.corner === true ? { yaw: 20, pitch: 24, roll: 0 } : { yaw: 28, pitch: 22, roll: 0 }): ReturnType<typeof defineBall> {
  const colours = laid.colours;
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
        const by = { a, b, c } as const;
        return panels18(s, [...laid.panels].map((ch) => by[ch as "a" | "b" | "c"]), SEAM, laid.corner === true ? ON_A_CORNER : undefined);
      },
    },
  });
}

export const BALL_VOLLEYBALL_COLOURS = /* @__PURE__ */ nation("ball:volleyball-colours", "Volleyball, three colours", "三色のバレーボール", plan(["#f3c81c", "#1f5fbf", WHITE], "aba bcb cac aca bab cbc"));
export const BALL_VOLLEYBALL_BRAZIL = /* @__PURE__ */ nation("ball:volleyball-brazil", "Volleyball, Brazil", "バレー（ブラジル）", VOLLEYBALL_PLANS.brazil);
export const BALL_VOLLEYBALL_JAPAN = /* @__PURE__ */ nation("ball:volleyball-japan", "Volleyball, Japan", "バレー（日本）", VOLLEYBALL_PLANS.japan);
export const BALL_VOLLEYBALL_CANADA = /* @__PURE__ */ nation("ball:volleyball-canada", "Volleyball, Canada", "バレー（カナダ）", VOLLEYBALL_PLANS.canada);
export const BALL_VOLLEYBALL_USA = /* @__PURE__ */ nation("ball:volleyball-usa", "Volleyball, USA", "バレー（アメリカ）", VOLLEYBALL_PLANS.usa);
export const BALL_VOLLEYBALL_ITALY = /* @__PURE__ */ nation("ball:volleyball-italy", "Volleyball, Italy", "バレー（イタリア）", VOLLEYBALL_PLANS.italy);
export const BALL_VOLLEYBALL_POLAND = /* @__PURE__ */ nation("ball:volleyball-poland", "Volleyball, Poland", "バレー（ポーランド）", VOLLEYBALL_PLANS.poland);
export const BALL_VOLLEYBALL_FRANCE = /* @__PURE__ */ nation("ball:volleyball-france", "Volleyball, France", "バレー（フランス）", VOLLEYBALL_PLANS.france);
export const BALL_VOLLEYBALL_SERBIA = /* @__PURE__ */ nation("ball:volleyball-serbia", "Volleyball, Serbia", "バレー（セルビア）", VOLLEYBALL_PLANS.serbia);
export const BALL_VOLLEYBALL_NETHERLANDS = /* @__PURE__ */ nation("ball:volleyball-netherlands", "Volleyball, Netherlands", "バレー（オランダ）", VOLLEYBALL_PLANS.netherlands);
export const BALL_VOLLEYBALL_GERMANY = /* @__PURE__ */ nation("ball:volleyball-germany", "Volleyball, Germany", "バレー（ドイツ）", VOLLEYBALL_PLANS.germany);
