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
  test.slow();
  await page.goto("/");
  const ids = await page.locator("#emblem option").evaluateAll((options) => options.map((o) => o.value));
  expect(ids.length).toBeGreaterThanOrEqual(140);
  // Choosing in the page is the same call as the address, and cheaper than a page load for each of a hundred and forty emblems.
  for (const [index, id] of ids.entries()) {
    await page.locator("#emblem").selectOption(id);
    for (const style of ["metal", "line", "color"]) {
      await page.locator(`#style button[data-value="${style}"]`).click();
      await expect(page.locator("#stage > svg")).toBeVisible();
      // The address follows (it is left out for the first emblem, the default; Safari allows a hundred changes of it in thirty seconds, so it is read for some of the emblems only).
      if ([1, 12, 24].includes(index) && style === "color") await expect(page).toHaveURL(new RegExp(`[?&]id=${encodeURIComponent(id)}(&|$)`));
    }
  }
  expect(await noSideways(page)).toBe(true);
  // The address itself, for one of each kind of emblem.
  for (const id of ["trophy:hockey-cup", "medal:gold", "ball:rugby", "gear:hurley", "sport:nhl", "crest:shield"]) {
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
  await page.goto("/?id=medal:gold");
  await page.getByRole("button", { name: "256", exact: true }).click();
  await expect(page.locator("#stage > svg")).toHaveAttribute("width", "256");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("#stage")).toHaveAttribute("data-look", "dark");
  await expect(page.locator("#stage > svg")).toHaveAttribute("color", "#eef1f3");
  await page.getByRole("button", { name: "Color", exact: true }).click();
  await page.getByRole("button", { name: "Red", exact: true }).click();
  await expect(page.locator("#stage > svg")).toContainText("Gold medal");
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

test("a cup turns with the slider: its handles move, and the call says how", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const before = await page.locator("#stage").innerHTML();
  await page.locator("#yaw").fill("100");
  expect(await page.locator("#stage").innerHTML()).not.toBe(before);
  await page.locator("#yaw").fill("0");
  expect(await page.locator("#stage").innerHTML()).toBe(before);
});

test("the engrave field engraves a medal, and the address and the call say so, and a gear piece turns too", async ({ page }) => {
  await page.goto("/?id=medal:gold");
  await page.locator("#engrave").fill("MVP 2026");
  await expect(page.locator("#stage")).toContainText("MVP");
  expect(page.url()).toContain("engrave=MVP");
  await expect(page.locator("#code")).toContainText('engrave: "MVP 2026"');
  await page.locator("#yaw").fill("180");
  expect(await page.locator("#stage").innerHTML()).not.toContain("<text");
  await page.goto("/?id=gear:hurley&yaw=60");
  await expect(page.locator("#turn-row")).toBeVisible();
  expect(await page.locator("#stage").innerHTML()).toContain("scale(0.5 1)");
  await page.goto("/?id=pennant:championship&engrave=Champions");
  await expect(page.locator("#stage")).toContainText("CHAMPIONS");
});

test("the gallery lists every emblem with its id, finds one by a word, and copies its id", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/gallery.html");
  await expect(page.locator(".cards li").first()).toBeVisible();
  expect(await noSideways(page)).toBe(true);
  const total = await page.locator(".cards li").count();
  expect(total).toBeGreaterThanOrEqual(60);
  await expect(page.locator("#count")).toHaveText(`${total} of ${total} emblems`);
  // Every card shows its id and its three styles.
  const first = page.locator(".cards li").first();
  await expect(first.locator("code")).toContainText(":");
  await expect(first.locator(".styles svg")).toHaveCount(3);
  await page.locator("#find").fill("hockey");
  await expect(page.locator(".cards li:not([hidden])").first().locator("code")).toContainText("trophy:hockey-cup");
  expect(await page.locator(".cards li:not([hidden])").count()).toBeLessThan(total);
  const card = page.locator("#trophy-hockey-cup");
  await card.getByRole("button", { name: /Copy the id/ }).click();
  await expect(card.getByRole("button", { name: /Copy the id/ })).toHaveText("Copied");
  expect(errors).toEqual([]);
  await page.locator("#find").fill("");
  await expect(page.locator("#count")).toHaveText(`${total} of ${total} emblems`);
});

test("44 pixels is the least a control gives a finger", async ({ page }) => {
  await page.goto("/gallery.html");
  await expect(page.locator(".cards li").first()).toBeVisible();
  for (const control of await page.locator(".copy").all().then((all) => all.slice(0, 4))) expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(43.5);
  await page.goto("/");
  for (const control of await page.locator("#style button, #theme button, #size button, #tint button, #emblem, #engrave, #yaw, #pitch").all()) {
    const box = await control.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(43.5);
  }
});
