// A pickleball's holes are cut through its shell (ball.holes.ts). Every other ball that is covered in round marks (a golf ball's dimples, a field hockey ball's, a squash ball's dots) is drawn exactly as it
// was before the holes were made: the hashes below are of the drawings of version 0.14.0, and the pickleball's line style, which still draws marks, is among them.
import { createHash } from "node:crypto";

import { describe, expect, it } from "./vitest-shim.ts";
import { BALLS, ballOf } from "../src/emblems/ball/ball.index.ts";
import { rotation, spread } from "../src/emblems/ball/ball.math.ts";
import { BALL_PICKLEBALL_INDOOR, BALL_PICKLEBALL_OUTDOOR } from "../src/emblems/ball/ball.pickleball.ts";

const GOLDEN: Record<string, string> = {
  "ball:tennis": "9cdf31544602,bec9e04e1624,9796c0564442,0d618daf248d,c06aa3a25294",
  "ball:padel": "a7fd4318a83f,eb1d7d5aba74,f540e6678346,30d10514f176,0de7ec42bd25",
  "ball:pickleball-outdoor": "e0cf5e622916,33f9c17be6ad",
  "ball:pickleball-indoor": "ee23f7b769eb,fbc5d2a206e9",
  "ball:squash": "766b7a9cd14c,01bdc53d45b6,5d699550df38,d2693bad9122,566532fa52cc",
  "ball:squash-yellow": "aa8a33a3d927,2055b71c8eab,bc0788bb0742,85dde70397e9,97753b98250e",
  "ball:squash-green": "2c4ee5067748,9285bf020a7c,eb569faff055,600047d464d5,cfb9ee183efb",
  "ball:squash-red": "2a7b925d887e,6b9e9e28905c,f0a222296c4f,b0abf20fffb9,b58b0b7306b1",
  "ball:squash-blue": "8708e1170a7e,b4495ddfbdac,4cdc760e6d43,005b0f2e655e,3467bea2feb7",
  "ball:racquetball": "00972fe18d27,b12988fb5f33,6e3a3f253872,176858e42b9c,27edc64fbb48",
  "ball:field-hockey": "b7cec9037dc4,1958fc960c4d,9f02a27c1ed0,7565f6e783ad,1d2944f3b5c0",
  "ball:table-tennis": "485b2367709b,25b32a0dd719,f8ba2d8b46e9,9e5f035cba0d,892b3c6b8e3b",
  "ball:golf": "ec41fe6cce34,b6194495644a,3a35d5419c6c,32442212867f,96b1c2521a3c",
};

const hash = (s: string): string => createHash("sha1").update(s).digest("hex").slice(0, 12);

/** The drawings the golden hashes stand for: still, line, tinted, two turns (one in line). */
const drawings = (id: string, line: boolean): string[] => {
  const b = ballOf(id as never);
  return line ? [b.svg({ size: 128, style: "line" }), b.frame({ yaw: 200, pitch: -30, size: 64, style: "line" })] : [b.svg({ size: 64 }), b.svg({ size: 128, style: "line" }), b.svg({ size: 200, tint: "#336699" }), b.frame({ yaw: 70, pitch: 20, size: 64 }), b.frame({ yaw: 200, pitch: -30, size: 64, style: "line" })];
};

describe("the balls with marks that are not holes", () => {
  it("are drawn as they were before the pickleball's holes were made", () => {
    for (const [id, want] of Object.entries(GOLDEN)) {
      const got = drawings(id, id.startsWith("ball:pickleball")).map(hash).join(",");
      expect(got, id).toBe(want);
    }
  });

  it("carry no mask and no inside, which only a ball with holes has", () => {
    for (const b of BALLS) {
      if (b.id.startsWith("ball:pickleball")) continue;
      expect(b.svg({ size: 64 }), b.id).not.toContain("<mask");
    }
  });
});

describe("the pickleball", () => {
  const view = { yaw: 20, pitch: 25 };
  /** How many holes face the eye in a view, worked out from the sphere alone: the ones the drawing cuts out. */
  const near = (count: number, yaw: number, pitch: number, flip = 1): number => {
    const r = rotation((yaw * Math.PI) / 180, (pitch * Math.PI) / 180, 0);
    const eye = [r[2][0], r[2][1], r[2][2]] as const;
    return spread(count).filter((m) => flip * (m[0] * eye[0] + m[1] * eye[1] + m[2] * eye[2]) >= 0.08).length;
  };
  /** The ellipses in the first path of the first mask whose black is the near holes: one move to each. */
  const cut = (svg: string): number => {
    const mask = /<path id="([^"]*f[^"]*)" d="([^"]*)"\/><mask id="[^"]*k[^"]*"[^>]*><rect[^>]*\/><use href="#\1" fill="#000"\/>/.exec(svg);
    return mask === null ? 0 : (mask[2].match(/M/g) ?? []).length;
  };

  it("has real holes: the near ones are cut out of the shell, as many as face you, outdoor 40 small and indoor 26 large", () => {
    for (const [ball, count] of [[BALL_PICKLEBALL_OUTDOOR, 40], [BALL_PICKLEBALL_INDOOR, 26]] as const) {
      expect(spread(count).length).toBe(count);
      expect(cut(ball.svg({ size: 100 })), ball.id).toBe(near(count, view.yaw, view.pitch));
      for (const [yaw, pitch] of [[0, 0], [90, 10], [200, -20], [310, 40]] as const) expect(cut(ball.frame({ size: 100, yaw, pitch })), `${ball.id} ${yaw} ${pitch}`).toBe(near(count, yaw + view.yaw, pitch + view.pitch));
    }
  });

  it("cuts the far holes out of the inside of the ball, as many as face away", () => {
    const svg = BALL_PICKLEBALL_OUTDOOR.svg({ size: 100 });
    const back = /<mask id="[^"]*b[^"]*"[^>]*><rect[^>]*\/><path d="([^"]*)" fill="#000" clip-path/.exec(svg);
    expect(back).toBeDefined();
    expect(((back as RegExpExecArray)[1].match(/M/g) ?? []).length).toBe(near(40, view.yaw, view.pitch, -1));
  });

  it("is drawn behind-first: the inside, the walls of the holes, then the shell under its mask", () => {
    const svg = BALL_PICKLEBALL_OUTDOOR.svg({ size: 100 });
    const inside = svg.indexOf('fill="url(#');
    const walls = svg.indexOf('fill-rule="evenodd"');
    const shell = svg.indexOf('<g mask="url(#');
    expect(inside).toBeGreaterThan(0);
    expect(walls).toBeGreaterThan(inside);
    expect(shell).toBeGreaterThan(walls);
  });

  it("has ids that tell one turn from another, so a row of turns on one page does not borrow one another's holes", () => {
    const ids = [0, 60, 120, 180, 240, 300].map((yaw) => /<mask id="([^"]*)"/.exec(BALL_PICKLEBALL_OUTDOOR.frame({ size: 64, yaw }))![1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(BALL_PICKLEBALL_OUTDOOR.frame({ size: 64, yaw: 60 })).toBe(BALL_PICKLEBALL_OUTDOOR.frame({ size: 64, yaw: 60 }));
  });

  it("keeps the line style, which cannot cut anything out, as marks", () => {
    const line = BALL_PICKLEBALL_OUTDOOR.svg({ size: 64, style: "line" });
    expect(line).not.toContain("<mask");
    expect(line).toContain("currentColor");
  });

  it("follows the tint: a tinted ball's inside and walls are made from the tint", () => {
    const plain = BALL_PICKLEBALL_INDOOR.svg({ size: 64 });
    const red = BALL_PICKLEBALL_INDOOR.svg({ size: 64, tint: "#cc2020" });
    expect(red).not.toBe(plain);
    expect(red).toContain("<mask");
  });
});
