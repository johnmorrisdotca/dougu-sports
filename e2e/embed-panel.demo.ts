// "Put it in your page" is the family's <kazoku-embed-panel>, on the index page and on the builder. Nothing the old panels had is gone, and a test counts it: the five ways (HTML, iframe, ES module, image, SVG),
// the Turning choice, the size, Copy, Download the SVG, the running picture, and the builder's six tabs; and the panel adds React, Vue, Angular, Svelte, the embed page, the docs and the credit.
import { expect, test } from "@playwright/test";

const PANEL = "#embed-panel";

test("the index panel keeps the five ways, Turning, the sizes, Copy, Download and the running picture, and adds the framework tabs, the links and the credit", async ({ page }) => {
  await page.goto("/?id=medal:gold&size=128");
  const panel = page.locator(PANEL);
  await expect(panel.locator('[role="tab"]')).toHaveText(["HTML", "ES module", "React", "Vue", "Angular", "Svelte", "iframe", "Image", "SVG"]);
  await expect(panel.locator('[part="size-button"]')).toHaveText(["32", "64", "128", "256"]);
  await expect(panel.locator('[part="size-button"][aria-pressed="true"]')).toHaveText("128");
  await expect(page.locator("#embed-turn button")).toHaveText(["Still", "By hand", "By itself"]);
  await expect(page.locator("#embed-turn button[aria-pressed=\"true\"]")).toHaveText("Still");
  await expect(panel.locator('[part="preview"] dougu-emblem')).toHaveCount(1);
  await expect(panel.locator('[part="preview"] dougu-emblem')).toHaveAttribute("emblem", "medal:gold");
  await expect(panel.locator('[part="copy"]')).toHaveText("Copy code");
  await expect(page.locator("#embed-download")).toHaveText("Download the SVG");
  await expect(panel.locator('[part="open"]')).toHaveText("Open the embed page");
  await expect(panel.locator('[part="open"]')).toHaveAttribute("href", /embed\.html\?emblem=medal%3Agold/);
  await expect(panel.locator('[part="docs"]')).toHaveText("Read the docs");
  await expect(panel.locator('[part="credits"]')).toContainText("Dougu Sports");
  const code = panel.locator('[part="code"]');
  for (const [kind, needle] of [["html", "<dougu-emblem"], ["module", 'emblem.setAttribute("emblem", "medal:gold")'], ["react", "useEffect"], ["vue", "onMounted"], ["angular", "CUSTOM_ELEMENTS_SCHEMA"], ["svelte", "onMount"], ["iframe", "<iframe"], ["image", "<img"], ["svg", "<svg"]] as const) {
    await panel.locator(`button[data-kind="${kind}"]`).click();
    await expect(code, kind).toContainText(needle);
  }
  await expect(page).toHaveURL(/embed=svg/);
});

test("Turning changes the code, the size follows the page's own size, and the picture never turns by itself", async ({ page }) => {
  await page.goto("/?id=medal:gold");
  const panel = page.locator(PANEL);
  const code = panel.locator('[part="code"]');
  await expect(code).not.toContainText("turnable");
  await page.locator('#embed-turn button[data-value="turnable"]').click();
  await expect(code).toContainText("turnable");
  await expect(code).not.toContainText("autoplay");
  await page.locator('#embed-turn button[data-value="autoplay"]').click();
  await expect(code).toContainText("autoplay");
  await expect(panel.locator('[part="note"]')).toContainText("stays still");
  await expect(panel.locator('[part="preview"] dougu-emblem')).not.toHaveAttribute("autoplay", /.*/);
  await panel.locator('[part="size-button"]', { hasText: "64" }).click();
  await expect(page.locator('#size button[aria-pressed="true"]')).toHaveText("64");
  await expect(code).toContainText('size="64"');
  await expect(page).toHaveURL(/eturn=autoplay/);
});

test("copy puts the code on the clipboard", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("webkit"), "the clipboard is Chromium's to grant here");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?id=medal:gold");
  await page.locator(`${PANEL} [part="copy"]`).click();
  await expect(page.locator(`${PANEL} .status`)).toContainText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('<dougu-emblem emblem="medal:gold"');
});

test("the builder keeps its six tabs (script and tag, tag, frame, module, image, SVG) and adds the framework tabs, the docs and the credit", async ({ page }) => {
  await page.goto("/builder.html");
  await page.waitForSelector('body[data-ready="true"]');
  const panel = page.locator(PANEL);
  await expect(panel.locator('[role="tab"]')).toHaveText(["Script and tag", "Tag", "ES module", "React", "Vue", "Angular", "Svelte", "iframe", "Image", "SVG"]);
  await expect(panel.locator('[part="copy"]')).toHaveText("Copy code");
  await expect(panel.locator('[part="docs"]')).toHaveText("Read the docs");
  await expect(panel.locator('[part="open"]')).toHaveText("Open the embed page");
  await expect(panel.locator('[part="credits"]')).toContainText("Dougu Sports");
  await panel.locator('button[data-kind="element"]').click();
  await expect(panel.locator('[part="code"]')).toContainText("<dougu-emblem");
  await expect(panel.locator('[part="code"]')).not.toContainText("<script");
});

test("every control of the panel is a finger wide", async ({ page }) => {
  await page.goto("/");
  const bad = await page.evaluate(() => {
    const out: string[] = [];
    const inside = document.querySelector("#embed-panel")!.shadowRoot!;
    for (const el of [...document.querySelectorAll<HTMLElement>("#embed-panel button"), ...inside.querySelectorAll<HTMLElement>("button, a.btn")]) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 47.5) out.push(`${el.textContent?.trim()} is ${Math.round(r.height)} px high`);
    }
    return out;
  });
  expect(bad).toEqual([]);
});
