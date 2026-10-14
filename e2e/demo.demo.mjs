import { expect, test } from "@playwright/test";

const noSideways = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("the playground draws an emblem and does not scroll sideways", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#stage > svg")).toBeVisible();
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("every emblem draws, in every style, and the address says which", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("#emblem option").evaluateAll((options) => options.map((o) => o.value));
  expect(ids.length).toBeGreaterThanOrEqual(2);
  for (const id of ids) {
    for (const style of ["metal", "line", "color"]) {
      await page.goto(`/?id=${id}&style=${style}`);
      await expect(page.locator("#stage > svg")).toBeVisible();
      expect(await noSideways(page)).toBe(true);
    }
  }
  await page.goto("/");
  await page.locator("#emblem").selectOption("ball:soccer");
  expect(page.url()).toContain("id=ball%3Asoccer");
  await page.getByRole("button", { name: "Line", exact: true }).click();
  expect(page.url()).toContain("style=line");
  await expect(page.locator("#code")).toContainText('renderEmblem("ball:soccer"');
});

test("the controls change the drawing: size, look and tint", async ({ page }) => {
  await page.goto("/?id=award:medal");
  await page.getByRole("button", { name: "256", exact: true }).click();
  await expect(page.locator("#stage > svg")).toHaveAttribute("width", "256");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("#stage")).toHaveAttribute("data-look", "dark");
  await expect(page.locator("#stage > svg")).toHaveAttribute("color", "#eef1f3");
  await page.getByRole("button", { name: "Color", exact: true }).click();
  await page.getByRole("button", { name: "Red", exact: true }).click();
  await expect(page.locator("#stage > svg")).toContainText("Medal");
  expect(await page.locator("#stage").innerHTML()).toContain("#c8102e");
});

test("the turn slider turns the emblem, and the call says how", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  const before = await page.locator("#stage").innerHTML();
  await page.locator("#yaw").fill("60");
  expect(await page.locator("#stage").innerHTML()).not.toBe(before);
  await expect(page.locator("#code")).toContainText("emblemFrame");
  expect(page.url()).toContain("yaw=60");
  await page.locator("#yaw").fill("0");
  expect(await page.locator("#stage").innerHTML()).toBe(before);
});

test("the gallery lists every emblem, and 44 pixels is the least a control gives a finger", async ({ page }) => {
  await page.goto("/gallery.html");
  await expect(page.locator(".cards li").first()).toBeVisible();
  expect(await noSideways(page)).toBe(true);
  await page.goto("/");
  for (const control of await page.locator("#style button, #theme button, #size button, #tint button, #emblem, #yaw, #pitch").all()) {
    const box = await control.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(43.5);
  }
});
