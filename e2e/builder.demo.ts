// The builder page: each row of choices redraws the emblem and rewrites the code, the tint is a field, and nothing is wider than the screen.
import { expect, test } from "@playwright/test";

test("a choice redraws the emblem and rewrites the code", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto("/builder.html");
  await page.waitForSelector('body[data-ready="true"]');
  await expect(page.locator('[data-testid="stage"] > svg')).toBeVisible();
  const code = page.locator('#embed-panel [part="code"]');
  await expect(code).toContainText("trophy:cup");
  await page.locator('[data-choice="group"] button[data-value="medal"]').click();
  await expect(page.locator('[data-choice="emblem"] button').first()).toContainText(/Medal|Gold|medal/i);
  await page.locator('[data-choice="style"] button[data-value="line"]').click();
  await expect(code).toContainText("line");
  await page.locator('[data-testid="tint"]').fill("#0b6e4f");
  await page.locator('#embed-panel button[data-kind="iframe"]').click();
  await expect(code).toContainText("embed.html?emblem=");
  await page.locator('#embed-panel button[data-kind="svg"]').click();
  await expect(code).toContainText("<svg");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
