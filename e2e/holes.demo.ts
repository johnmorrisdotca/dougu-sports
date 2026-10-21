// The pickleball's holes are real: a pixel seen through a near hole and a far hole that line up is the page's own, whatever the page is. Drawn in a real browser, onto a canvas with nothing behind it.
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { defineBall } from "../src/emblems/ball/ball.engine.ts";
import { holeLayers } from "../src/emblems/ball/ball.holes.ts";
import { BALL_GOLF } from "../src/emblems/ball/ball.golf.ts";
import { BALL_PICKLEBALL_INDOOR, BALL_PICKLEBALL_OUTDOOR } from "../src/emblems/ball/ball.pickleball.ts";
import { BALL_PLASTIC_BASEBALL_SLOTTED } from "../src/emblems/ball/ball.plastic.ts";

/** A ball with two holes, straight through it from the eye: the near one at the middle and the far one right behind it. */
const THROUGH = defineBall({
  id: "ball:test-through",
  en: "Through",
  ja: "貫通",
  size: { extentMm: 74, rule: "test" },
  spec: {
    view: { yaw: 0, pitch: 0, roll: 0 },
    base: "#e6e83c",
    mat: { gloss: 0.5 },
    draw: () => "",
    holes: (s, id, base, shape, minWidth) => holeLayers(s, id, { centres: [[0, 0, 1], [0, 0, -1]], radius: 0.2 }, base, shape, minWidth),
  },
});

const SIZE = 400;

/** The pixels of a drawing on a canvas the size of the drawing, over a page colour (or none): `at` is the points to read in box units (0 to 100), and each comes back as [r, g, b, a]. */
async function read(page: Page, svg: string, at: ReadonlyArray<readonly [number, number]>, page_colour?: string): Promise<number[][]> {
  return page.evaluate(
    async ([markup, points, colour, size]) => {
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      if (colour !== undefined) {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, size, size);
      }
      ctx.drawImage(img, 0, 0, size, size);
      return points.map(([x, y]) => [...ctx.getImageData(Math.round((x / 100) * size), Math.round((y / 100) * size), 1, 1).data]);
    },
    [svg, at, page_colour, SIZE] as const,
  );
}

/** How many pixels of the ball's disc (not its corners) have nothing in them. */
async function holesOpen(page: Page, svg: string): Promise<number> {
  return page.evaluate(
    async ([markup, size]) => {
      const img = new Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let open = 0;
      const c = size / 2, r = size * 0.44;
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (Math.hypot(x - c, y - c) < r && data[(y * size + x) * 4 + 3] < 8) open++;
      return open;
    },
    [svg, SIZE] as const,
  );
}

test("through a near hole and the far hole behind it, the pixel is the page's own, on any page", async ({ page }) => {
  const svg = THROUGH.svg({ size: SIZE });
  const [bare] = await read(page, svg, [[50, 50]]);
  expect(bare[3]).toBe(0);
  for (const colour of ["#ff00ff", "#00ffff", "#101010", "#fafafa"]) {
    const [pixel] = await read(page, svg, [[50, 50]], colour);
    const want = await page.evaluate((c) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data];
    }, colour);
    expect(pixel).toEqual(want);
  }
});

test("the shell round a hole is solid, and past the rim the ball is whole", async ({ page }) => {
  // The holes are 0.2 radians across from their middle: 9 box units. A point 14 units out is shell, and the corner of the box is empty.
  const [shell, corner] = await read(page, THROUGH.svg({ size: SIZE }), [[64, 50], [2, 2]]);
  expect(shell[3]).toBe(255);
  expect(corner[3]).toBe(0);
});

test("turned a little, the near hole shows the dark inside of the ball and no longer the page", async ({ page }) => {
  // At 40 degrees the near hole's middle is 46 sin 40 = 29.6 units to the right of the middle, and the far hole is as far to the left.
  const [middle] = await read(page, THROUGH.frame({ size: SIZE, yaw: 40 }), [[79.6, 50]], "#ff00ff");
  expect(middle[3]).toBe(255);
  expect(middle).not.toEqual([255, 0, 255, 255]);
  // Darker than the plastic, which is a bright yellow.
  expect(middle[0] + middle[1] + middle[2]).toBeLessThan(300);
});

test("a turning pickleball lets the page through some of its holes at some angles, and a golf ball never does", async ({ page }) => {
  for (const ball of [BALL_PICKLEBALL_OUTDOOR, BALL_PICKLEBALL_INDOOR]) {
    let most = 0;
    for (let yaw = 0; yaw < 360; yaw += 45) most = Math.max(most, await holesOpen(page, ball.frame({ size: SIZE, yaw, pitch: 15 })));
    expect(most, ball.id).toBeGreaterThan(20);
  }
  expect(await holesOpen(page, BALL_GOLF.frame({ size: SIZE, yaw: 45 }))).toBe(0);
  expect(await holesOpen(page, BALL_GOLF.svg({ size: SIZE }))).toBe(0);
});

test("the slotted practice ball lets the page through where a near slot and a far one line up, and not through its solid half", async ({ page }) => {
  // Seen from the side (the pole across the line of sight, 90 degrees from the resting view's 22 and 22), a near slot and the far slot behind it are on the same line.
  const side = await holesOpen(page, BALL_PLASTIC_BASEBALL_SLOTTED.frame({ size: SIZE, yaw: 112, pitch: -22 }));
  expect(side).toBeGreaterThan(200);
  // Seen from the pole, or from the solid half, there is nothing behind the slots but the solid half.
  expect(await holesOpen(page, BALL_PLASTIC_BASEBALL_SLOTTED.frame({ size: SIZE, yaw: 22, pitch: -22 }))).toBe(0);
  expect(await holesOpen(page, BALL_PLASTIC_BASEBALL_SLOTTED.frame({ size: SIZE, yaw: 202, pitch: -22 }))).toBe(0);
  // The slots' shell is solid: a point on the solid half's middle is plastic.
  const [middle] = await read(page, BALL_PLASTIC_BASEBALL_SLOTTED.frame({ size: SIZE, yaw: 202, pitch: -22 }), [[50, 50]], "#ff00ff");
  expect(middle[3]).toBe(255);
  expect(middle[0]).toBeGreaterThan(200);
});
