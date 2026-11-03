// <dougu-emblem> and the embed page, in a real browser: the address says what is drawn, a change of attribute draws again, a drag turns it with a real pointer
// the way the pointer goes, and the page that is put in an iframe fetches nothing but its own files.
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const html = (page: Page) => page.locator("dougu-emblem").evaluate((el) => el.shadowRoot?.innerHTML ?? "");
const angles = (page: Page) => page.locator("dougu-emblem").evaluate((el) => (el as unknown as { turner: { angles: { yaw: number; pitch: number } } }).turner.angles);

test("the embed page draws the emblem the address asks for, and fetches nothing else", async ({ page }) => {
  const asked: string[] = [];
  page.on("request", (request) => asked.push(new URL(request.url()).pathname));
  await page.goto("/embed.html?emblem=trophy:cup&variant=line&size=120");
  await expect(page.locator("dougu-emblem svg")).toBeVisible();
  await expect(page.locator("dougu-emblem")).toHaveAttribute("variant", "line");
  expect(await page.locator("dougu-emblem svg").getAttribute("width")).toBe("120");
  expect(asked.every((path) => /^\/(embed\.(html|js)|dist\/.*\.js)$/.test(path) || path === "/favicon.ico")).toBe(true);
});

test("by default it is still, with no controls", async ({ page }) => {
  await page.goto("/embed.html?id=ball:soccer");
  await expect(page.locator("dougu-emblem svg")).toBeVisible();
  expect(await page.locator("button:visible, input, select").count()).toBe(0);
  const before = await html(page);
  await page.waitForTimeout(1200);
  expect(await html(page)).toBe(before);
});

test("a changed attribute draws again, and a name that is no emblem draws nothing", async ({ page }) => {
  await page.goto("/embed.html?emblem=medal:gold&size=80");
  await expect(page.locator("dougu-emblem svg")).toBeVisible();
  const before = await html(page);
  await page.locator("dougu-emblem").evaluate((el) => el.setAttribute("variant", "line"));
  await expect.poll(() => html(page)).not.toBe(before);
  await page.locator("dougu-emblem").evaluate((el) => el.setAttribute("emblem", "no:such-thing"));
  await expect(page.locator("dougu-emblem")).toHaveAttribute("data-state", "error");
  expect(await html(page)).not.toContain("<svg");
});

test("the angle in the address is the angle it is drawn at", async ({ page }) => {
  await page.goto("/embed.html?emblem=ball:soccer&size=100");
  await expect(page.locator("dougu-emblem svg")).toBeVisible();
  const flat = await html(page);
  await page.goto("/embed.html?emblem=ball:soccer&size=100&yaw=70&pitch=20");
  await expect(page.locator("dougu-emblem svg")).toBeVisible();
  expect(await html(page)).not.toBe(flat);
});

test("a drag turns it the way the pointer goes: right turns right, up lifts the front", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "a pointer drag on WebKit is played by the playground's own tests");
  await page.goto("/embed.html?emblem=ball:soccer&turnable=1&size=200");
  await expect(page.locator("dougu-emblem[data-state=live] svg")).toBeVisible();
  const box = (await page.locator("dougu-emblem svg").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 20, y, { steps: 4 });
  await page.mouse.move(x + 40, y, { steps: 4 });
  await page.mouse.up();
  expect((await angles(page)).yaw).toBeGreaterThan(20);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y - 20, { steps: 4 });
  await page.mouse.up();
  // Up lifts the front toward the eye: the package's pitch goes down.
  expect((await angles(page)).pitch).toBeLessThan(-10);
});

test.describe("turning by itself", () => {
  test.use({ reducedMotion: "no-preference" });

  test("autoplay turns it, and the small Pause button holds it and sets it going again", async ({ page }) => {
    await page.goto("/embed.html?emblem=ball:soccer&autoplay=1&speed=120&size=160");
    await expect(page.locator("dougu-emblem[data-state=live] svg")).toBeVisible();
    const pause = page.getByTestId("pause");
    await expect(pause).toBeVisible();
    const box = (await pause.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(48);
    const before = await html(page);
    await expect.poll(() => html(page), { timeout: 5000 }).not.toBe(before);
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    const held = await html(page);
    await page.waitForTimeout(700);
    expect(await html(page)).toBe(held);
    await pause.click();
    await expect.poll(() => html(page), { timeout: 5000 }).not.toBe(held);
  });

  test("it waits while it is scrolled out of sight", async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 300 });
    await page.goto("/embed.html?emblem=ball:soccer&autoplay=1&speed=120&size=160");
    await expect(page.locator("dougu-emblem[data-state=live] svg")).toBeVisible();
    await page.locator("dougu-emblem").evaluate((el) => {
      (el as HTMLElement).style.position = "fixed";
      (el as HTMLElement).style.top = "3000px";
    });
    await page.waitForTimeout(300);
    const away = await html(page);
    await page.waitForTimeout(800);
    expect(await html(page)).toBe(away);
  });
});

test.describe("Put it in your page", () => {
  test("the panel gives the code for the emblem on the stage, in every way, and runs it beside the code", async ({ page }) => {
    await page.goto("/?id=trophy:cup&style=line&size=64");
    const code = page.getByTestId("embed-code");
    await expect(code).toContainText('<dougu-emblem emblem="trophy:cup" variant="line" size="64"');
    await expect(code).toContainText("cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports/element/+esm");
    await expect(page.locator("#embed-stage dougu-emblem svg")).toBeVisible();
    await page.getByTestId("embed-way").getByRole("button", { name: "iframe" }).click();
    await expect(code).toContainText("https://johnmorrisdotca.github.io/dougu-sports/embed.html?emblem=trophy%3Acup");
    await expect(page.locator("#embed-stage iframe")).toBeVisible();
    await expect(page.frameLocator("#embed-stage iframe").locator("dougu-emblem svg")).toBeVisible();
    await page.getByTestId("embed-way").getByRole("button", { name: "ES module" }).click();
    await expect(code).toContainText('import "@johnmorrisdotca/dougu-sports/element";');
    await page.getByTestId("embed-way").getByRole("button", { name: "Image" }).click();
    await expect(code).toContainText('<img src="data:image/svg+xml;utf8,');
    await expect(page.locator("#embed-stage img")).toBeVisible();
    await page.getByTestId("embed-way").getByRole("button", { name: "SVG" }).click();
    await expect(code).toContainText("<svg");
    await expect.poll(() => page.url()).toContain("embed=svg");
  });

  test("a choice of turning goes into the code, and a style chosen above changes it", async ({ page }) => {
    await page.goto("/?id=ball:soccer&size=64");
    await page.getByTestId("embed-turn").getByRole("button", { name: "By hand" }).click();
    await expect(page.getByTestId("embed-code")).toContainText(" turnable></dougu-emblem>");
    await page.getByTestId("embed-turn").getByRole("button", { name: "By itself" }).click();
    await expect(page.getByTestId("embed-code")).toContainText(" turnable autoplay></dougu-emblem>");
    await page.getByRole("group", { name: "Style" }).getByRole("button", { name: "Color" }).click();
    await expect(page.getByTestId("embed-code")).toContainText('variant="color"');
  });

  test("it is kept in the address and comes back, in Japanese too", async ({ page }) => {
    await page.goto("/?id=medal:gold&embed=iframe&eturn=turnable");
    await expect(page.getByTestId("embed-code")).toContainText("turnable=1");
    await expect(page.getByTestId("embed-way").getByRole("button", { name: "iframe" })).toHaveAttribute("aria-pressed", "true");
    await page.locator('kazoku-language-picker [data-v="ja"]').click();
    await expect(page.locator("#embed-h")).toHaveText("ページに入れる");
  });

  test("every control of the panel is in the demo's own style", async ({ page }) => {
    await page.goto("/");
    const bad = await page.locator("#embed-way button, #embed-turn button, #embed-copy, #embed-download").evaluateAll((els) => els.filter((el) => el.getBoundingClientRect().height < 44 || getComputedStyle(el).borderRadius === "0px").map((el) => el.textContent));
    expect(bad).toEqual([]);
  });
});
