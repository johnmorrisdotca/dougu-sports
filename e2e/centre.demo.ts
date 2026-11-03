// Centre and the pan clamp on the playground's stage, with real pointers, and the family's drag rule (kazoku-ui docs/drag-rule.md) checked with its shared helper (e2e/ground.mjs).
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { checkExactGrab, checkFollowsTheHand } from "./ground.mjs";

interface Seen { yaw: number; tilt: number; zoom: number; panX: number; panY: number }
const seen = (page: Page) => page.locator("#view-bar").evaluate((el) => (el as unknown as { state: Seen }).state);
const centre = (page: Page) => page.locator('#view-bar [data-b="centre"]');
const dragFar = async (page: Page, dx: number, dy: number) => {
  await page.locator("#stage").scrollIntoViewIfNeeded();
  const box = (await page.locator("#stage").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 8; i++) await page.mouse.move(x + (dx * i) / 8, y + (dy * i) / 8);
  await page.mouse.up();
};
/** How much of the emblem's picture is inside the stage, as a share of its width and of its height, and where the picture's middle is against the stage's middle. */
const where = (page: Page) =>
  page.evaluate(() => {
    const stage = document.querySelector("#stage")!.getBoundingClientRect();
    const svg = document.querySelector("#stage-view svg")!.getBoundingClientRect();
    const w = Math.max(0, Math.min(svg.right, stage.right) - Math.max(svg.left, stage.left));
    const h = Math.max(0, Math.min(svg.bottom, stage.bottom) - Math.max(svg.top, stage.top));
    return { shareX: w / svg.width, shareY: h / svg.height, dx: svg.left + svg.width / 2 - (stage.left + stage.width / 2), dy: svg.top + svg.height / 2 - (stage.top + stage.height / 2) };
  });

test("Centre is hidden at Fit, comes in once the view is moved, and puts the emblem back in the middle", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  await expect(centre(page)).toBeHidden();
  const zoomIn = page.locator('#view-bar [data-b="in"]');
  await zoomIn.click();
  await zoomIn.click();
  await expect(centre(page)).toBeVisible();
  await dragFar(page, 700, -500);
  await expect.poll(async () => Math.abs((await seen(page)).panX)).toBeGreaterThan(20);
  await centre(page).click();
  await expect.poll(async () => await seen(page)).toMatchObject({ zoom: 1, panX: 0, panY: 0, yaw: 0, tilt: 0 });
  await expect(centre(page)).toBeHidden();
  const back = await where(page);
  expect(Math.abs(back.dx)).toBeLessThan(2);
  expect(Math.abs(back.dy)).toBeLessThan(2);
  await expect(page.locator("#stage-view")).toHaveCSS("transform", "none");
});

test("a drag far off cannot lose the emblem: a quarter of it stays in view, then Centre and the Home key bring it back", async ({ page }) => {
  await page.goto("/?id=ball:soccer&size=32");
  const zoomIn = page.locator('#view-bar [data-b="in"]');
  while (await zoomIn.isEnabled()) await zoomIn.click();
  for (const [dx, dy] of [[3000, 0], [-6000, 0], [0, 3000], [0, -6000], [4000, 4000]] as const) {
    await dragFar(page, dx, dy);
    await page.waitForTimeout(150);
    const at = await where(page);
    expect(Math.min(at.shareX, at.shareY), `after a drag of ${dx},${dy} a quarter of the emblem is still in view each way`).toBeGreaterThanOrEqual(0.24);
  }
  await expect(centre(page)).toBeVisible();
  await centre(page).click();
  await expect(centre(page)).toBeHidden();
  const back = await where(page);
  expect(Math.abs(back.dx)).toBeLessThan(2);
  expect(Math.abs(back.dy)).toBeLessThan(2);
  await zoomIn.click();
  await dragFar(page, 500, 300);
  await page.locator("#stage").focus();
  await page.keyboard.press("Home");
  await expect.poll(async () => await seen(page)).toMatchObject({ zoom: 1, panX: 0, panY: 0 });
});

test("the surface under the pointer follows the pointer: right goes right, up goes up, and the arrow keys turn the same way", async ({ page }) => {
  await page.goto("/?id=ball:soccer&size=256");
  // On a phone the ball is small and one key press moves its ground by fewer pixels than the helper looks for, so the keys are compared with the drag by the numbers they set.
  await checkFollowsTheHand(page, { view: "#stage", picture: "#stage-view svg", controls: "#view-bar", keys: false });
  await page.locator("#stage").focus();
  await page.keyboard.press("ArrowRight");
  expect((await seen(page)).yaw, "Arrow Right turns the same way as a drag right").toBeGreaterThan(0);
  await page.keyboard.press("ArrowUp");
  expect((await seen(page)).tilt, "Arrow Up tips the same way as a drag up").toBeGreaterThan(0);
});

test("on a textured emblem the shared check finds the arrow keys and Auto-turn going the same way as the hand", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desk", "the ball is large enough on a desk for one key press to move its ground by a measurable amount");
  await page.goto("/?id=ball:soccer&size=512");
  await checkFollowsTheHand(page, { view: "#stage", picture: "#stage-view svg", controls: "#view-bar", keys: true, autoTurn: "right" });
});

test("a round ball is turned with exact grab: the touched point stays under the pointer", async ({ page }) => {
  for (const id of ["ball:soccer", "ball:plastic-baseball-practice"]) {
    await page.goto(`/?id=${id}&size=256`);
    await expect(page.locator("#view-bar")).toHaveAttribute("grab-radius", /^\d+$/);
    const radius = Number(await page.locator("#view-bar").getAttribute("grab-radius"));
    // The helper drags 15% of `radius`: twice the radius makes a 30 px drag at 100 px, which is steadier to measure on a ball with few marks.
    await checkExactGrab(page, { view: "#stage", picture: "#stage-view svg", radius: radius * 2, tolerance: 0.25 });
  }
  await page.goto("/?id=trophy:tennis-cup");
  await expect(page.locator("#view-bar")).not.toHaveAttribute("grab-radius", /.*/);
});
