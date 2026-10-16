// The contact sheet of the made-up logos in a real browser: every maker and team is drawn, the look and the name switch, a mark is printed on a ball, a call is copied, and the page does not scroll sideways.
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const noSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("twelve makers and ten teams are drawn, and the page does not scroll sideways", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/brands.html");
  await expect(page.getByTestId("makers").locator("article")).toHaveCount(12);
  await expect(page.getByTestId("teams").locator("article")).toHaveCount(10);
  await expect(page.getByTestId("maker-arvane").locator("svg[role=img] > title")).toHaveText("Arvane");
  await expect(page.getByTestId("team-larkmoor").locator("svg[role=img] > title")).toHaveText("Larkmoor Foxes");
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("the mark is alone by default and the name is a choice; the look switches the page", async ({ page }) => {
  await page.goto("/brands.html");
  const art = page.getByTestId("maker-kovreth").locator(".big svg");
  await expect(art).toHaveAttribute("viewBox", "0 0 100 100");
  await page.getByTestId("layout").getByRole("button", { name: "Mark and name" }).click();
  expect(await art.getAttribute("viewBox")).not.toBe("0 0 100 100");
  await page.getByTestId("look").getByRole("button", { name: "Dark" }).click();
  await expect(page.getByTestId("maker-kovreth").locator(".brand-art")).toHaveAttribute("data-look", "dark");
  expect(await noSideways(page)).toBe(true);
});

test("a maker's mark is printed on a ball and follows the choices", async ({ page }) => {
  await page.goto("/brands.html");
  await expect(page.getByTestId("balls").locator("svg[role=img]").first()).toBeVisible();
  const before = await page.getByTestId("balls").innerHTML();
  await page.getByTestId("ball-maker").selectOption("solvik");
  await page.getByTestId("ball-kind").selectOption("ball:soccer");
  expect(await page.getByTestId("balls").innerHTML()).not.toBe(before);
  await expect(page.getByTestId("shirts").locator("svg")).toHaveCount(3);
});

test("a card's call is copied", async ({ page }) => {
  await page.goto("/brands.html");
  const card = page.getByTestId("maker-ostrel");
  await card.getByRole("button", { name: /Copy the call/ }).click();
  await expect(card.getByRole("button", { name: /Copy the call/ })).toHaveText("Copied");
});
