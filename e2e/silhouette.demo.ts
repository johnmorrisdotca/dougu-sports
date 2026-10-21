// Every piece that turns has a body at every angle, counted in pixels in a real browser: edge on (a quarter turn, either way) a flat piece is a band and never a hairline, from behind it is still there with
// what hangs from it, and a puck seen from the side is a thick dark wall with its flat faces as ellipses at an angle. Each drawing is made at 96 pixels, painted on a canvas, and the pixels that are not clear are counted.
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import * as D from "../src/index.ts";

const SIZE = 96;
const FLAT = D.EMBLEM_IDS.filter((id) => ["flat", "icon", "gear"].includes(D.emblemOf(id).emblem.kind));

/** How many pixels of each drawing are not clear, and the width of the widest row of them, counted on a canvas. */
async function inked(page: Page, svgs: readonly string[]): Promise<{ pixels: number; widest: number; tall: number }[]> {
  return page.evaluate(
    async ({ svgs, size }) => {
      const out: { pixels: number; widest: number; tall: number }[] = [];
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      for (const svg of svgs) {
        const img = new Image();
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        await img.decode();
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let pixels = 0;
        let widest = 0;
        let tall = 0;
        for (let y = 0; y < size; y++) {
          let row = 0;
          for (let x = 0; x < size; x++) if (data[(y * size + x) * 4 + 3]! > 40) row++;
          pixels += row;
          widest = Math.max(widest, row);
          if (row > 0) tall++;
        }
        out.push({ pixels, widest, tall });
      }
      return out;
    },
    { svgs, size: SIZE },
  );
}

test.skip(({ browserName }) => browserName !== "chromium", "the pixels are counted once, in Chromium");

test("every flat piece is edge on a solid band, at least two pixels wide and as tall as its picture, never a hairline", async ({ page }) => {
  await page.goto("/");
  const front = await inked(page, FLAT.map((id) => D.renderEmblem(id, { size: SIZE, theme: "light" })));
  for (const yaw of [90, -90]) {
    const edge = await inked(page, FLAT.map((id) => D.emblemFrame(id, { size: SIZE, theme: "light", yaw })));
    FLAT.forEach((id, i) => {
      const e = edge[i]!;
      const f = front[i]!;
      expect(e.widest, `${id} edge on (${yaw}): the band is ${e.widest} px wide`).toBeGreaterThanOrEqual(2);
      expect(e.pixels, `${id} edge on (${yaw}): ${e.pixels} px of ${f.pixels}`).toBeGreaterThanOrEqual(Math.max(60, f.pixels * 0.012));
      expect(e.tall, `${id} edge on (${yaw}): ${e.tall} rows of ${f.tall}`).toBeGreaterThanOrEqual(f.tall * 0.5);
    });
  }
});

test("from behind every flat piece is still a body, as solid as its front", async ({ page }) => {
  await page.goto("/");
  const front = await inked(page, FLAT.map((id) => D.renderEmblem(id, { size: SIZE, theme: "light" })));
  const back = await inked(page, FLAT.map((id) => D.emblemFrame(id, { size: SIZE, theme: "light", yaw: 180 })));
  FLAT.forEach((id, i) => expect(back[i]!.pixels, `${id}: ${back[i]!.pixels} px behind, ${front[i]!.pixels} in front`).toBeGreaterThanOrEqual(front[i]!.pixels * 0.85));
});

test("a puck is a thick wall seen from the side and three to one at an angle, in every look", async ({ page }) => {
  await page.goto("/");
  for (const id of ["ball:puck", "puck:usa"] as const) {
    for (const style of ["metal", "color"] as const) {
      // The tilt from the side: 0 (edge on), 30, 60 and 90 (the top face straight on); the puck's own resting view is 36 degrees up.
      const view = (D.emblemOf(id).emblem.model as { view: { yaw: number; pitch: number; roll: number } }).view;
      const shots = await inked(page, [0, 30, 60, 90].map((tilt) => D.emblemFrame(id, { size: SIZE, style, theme: "light", yaw: -view.yaw, pitch: tilt - view.pitch, roll: -view.roll })));
      const [side, thirty, sixty, top] = shots as [typeof shots[0], typeof shots[0], typeof shots[0], typeof shots[0]];
      // Edge on, a wall one third as high as it is wide.
      expect(side.tall / side.widest, `${id} ${style} edge on`).toBeGreaterThan(0.29);
      expect(side.tall / side.widest, `${id} ${style} edge on`).toBeLessThan(0.4);
      expect(thirty.tall, `${id} ${style} 30`).toBeGreaterThan(side.tall);
      expect(sixty.tall, `${id} ${style} 60`).toBeGreaterThan(thirty.tall * 0.95);
      expect(top.pixels, `${id} ${style} 90`).toBeGreaterThan(side.pixels * 2);
      for (const shot of shots) expect(shot.pixels, `${id} ${style}`).toBeGreaterThan(300);
    }
  }
});
