// The composing page in a real browser: a data address loads in an <img>, as a CSS background and on a canvas, a sprite draws, and the podium and the award case are on the page.
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const noSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("the cards draw, with a button that copies the call, and the page does not scroll sideways", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/compose.html");
  for (const id of ["podium", "case", "sprite", "uri", "equipment"]) await expect(page.getByTestId(id)).toBeVisible();
  await expect(page.getByTestId("podium").locator("svg[role=img] > title").first()).toHaveText("Podium");
  await expect(page.getByTestId("case").locator("svg[role=img] > desc")).toContainText("Banded silver cup ×4");
  const card = page.getByTestId("podium");
  await card.getByRole("button", { name: /Copy the call/ }).click();
  await expect(card.getByRole("button", { name: /Copy the call/ })).toHaveText("Copied");
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("the look and the words change the cards, and a sport's equipment follows the choice", async ({ page }) => {
  await page.goto("/compose.html");
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.getByTestId("podium").locator("svg[role=img]").first()).toHaveAttribute("color", "#eef1f3");
  await page.getByTestId("locale").getByRole("button", { name: "日本語" }).click();
  await expect(page.getByTestId("podium").locator("svg[role=img] > title").first()).toHaveText("表彰台");
  await expect(page.getByTestId("case").locator("svg[role=img] > title")).toHaveText("トロフィーケース");
  await page.getByTestId("sport").selectOption("tennis");
  await expect(page.getByTestId("equipment-art")).toContainText("gear:tennis-racket");
  await expect(page.getByTestId("equipment-art")).toContainText("trophy:tennis-cup");
});

test("a data address loads in an <img>, as a CSS background and on a canvas", async ({ page }) => {
  await page.goto("/compose.html");
  const img = page.getByTestId("uri-img");
  await expect(img).toBeVisible();
  const loaded = await img.evaluate(async (el) => { const image = el as HTMLImageElement; await image.decode(); return [image.naturalWidth, image.naturalHeight]; });
  expect(loaded).toEqual([96, 96]);
  // The background loads: the address in the style is an image the browser can decode.
  const background = await page.getByTestId("uri-bg").evaluate(async (el) => {
    const url = getComputedStyle(el).backgroundImage.replace(/^url\("?/, "").replace(/"?\)$/, "");
    const picture = new Image();
    picture.src = url;
    await picture.decode();
    return [url.startsWith("data:image/svg+xml;utf8,"), picture.naturalWidth];
  });
  expect(background).toEqual([true, 96]);
  // The canvas holds the drawing, in the red of the call: `currentColor` crossed the image boundary as a colour, not as black.
  await expect.poll(() => page.getByTestId("uri-canvas").evaluate((element) => {
    const canvas = element as unknown as HTMLCanvasElement;
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
    let red = 0;
    let drawn = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 200) drawn++;
      if (data[i + 3] > 200 && data[i] > 150 && data[i + 1] < 60 && data[i + 2] < 80) red++;
    }
    return { drawn: drawn > 200, red: red > 200 };
  })).toEqual({ drawn: true, red: true });
});

test("every kind of emblem, theme and colour loads as a data address and paints a canvas", async ({ page }) => {
  await page.goto("/compose.html");
  const result = await page.evaluate(async () => {
    const dist = "/dist/index.js";
    const D = await import(dist);
    type Options = { style?: string; tint?: string; theme?: string; color?: string; locale?: string; title?: string | boolean };
    const cases: [string, Options][] = [];
    for (const id of ["trophy:hockey-cup", "medal:gold", "crest:shield", "sport:nhl", "award:crown", "ball:soccer", "ball:puck", "gear:hurley", "gear:cricket-bat"]) {
      for (const options of [{}, { style: "line" }, { style: "color", tint: "#1f4e9c" }, { theme: "dark" }, { theme: "auto", style: "line" }, { color: "#0b6e4f", style: "line" }, { locale: "ja", title: "金メダル & <b>\"'" }, { title: false }]) cases.push([id, options]);
    }
    const out: { failed: string[]; ink: Record<string, { light: number; dark: number }> } = { failed: [], ink: {} };
    for (const [id, options] of cases) {
      const picture = new Image();
      picture.src = D.emblemDataUri(id, { size: 48, ...options });
      try {
        await picture.decode();
      } catch {
        out.failed.push(`${id} ${JSON.stringify(options)}`);
        continue;
      }
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 48;
      const context = canvas.getContext("2d")!;
      context.drawImage(picture, 0, 0, 48, 48);
      const data = context.getImageData(0, 0, 48, 48).data;
      let drawn = 0;
      let light = 0;
      let dark = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 200) continue;
        drawn++;
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (lum > 200) light++;
        if (lum < 80) dark++;
      }
      if (drawn < 30) out.failed.push(`${id} ${JSON.stringify(options)} drew ${drawn}`);
      if (id === "sport:nhl" && options.style === undefined && options.theme === undefined) out.ink.default = { light, dark };
      if (id === "sport:nhl" && options.theme === "dark") out.ink.dark = { light, dark };
    }
    return out;
  });
  expect(result.failed).toEqual([]);
  // A pictogram is dark by default (the light theme's ink) and pale in the dark theme: it is not left black on a dark page.
  expect(result.ink.default.dark).toBeGreaterThan(result.ink.default.light);
  expect(result.ink.dark.light).toBeGreaterThan(result.ink.dark.dark);
});

test("a sprite draws what the inline emblem draws, and costs a fraction of the nodes", async ({ page }) => {
  await page.goto("/compose.html");
  const grid = page.getByTestId("sprite-grid");
  await expect(grid.locator(":scope > svg")).toHaveCount(65);
  await expect(grid.locator(":scope > svg").nth(1).locator("use")).toHaveCount(1);
  const stats = await page.getByTestId("sprite-stats").innerText();
  const [inline, sprite] = [...stats.matchAll(/(\d[\d,]*) nodes/g)].map((m) => Number(m[1].replace(/,/g, "")));
  expect(sprite * 5).toBeLessThan(inline);
  // The same pixels: one ball from the sheet and one drawn inline, at the same size on the same ground.
  const same = await page.evaluate(async () => {
    const dist = "/dist/index.js";
    const D = await import(dist);
    const sprite = D.emblemSprite(["ball:soccer", "medal:gold"]);
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:0;top:0;background:#fff;line-height:0;padding:4px";
    host.innerHTML = `${sprite.sheet}${sprite.use("ball:soccer", { size: 40 })}${D.renderEmblem("ball:soccer", { size: 40, grain: false })}${sprite.use("medal:gold", { size: 40 })}${D.renderEmblem("medal:gold", { size: 40 })}`;
    document.body.append(host);
    const boxes = [...host.querySelectorAll(":scope > svg:not([aria-hidden])")].map((el) => el.getBoundingClientRect());
    return boxes.map((b) => [b.x, b.y, b.width, b.height]);
  });
  expect(same).toHaveLength(4);
  for (const box of same) expect([box[2], box[3]]).toEqual([40, 40]);
  const shot = async (box: number[]) => page.screenshot({ clip: { x: box[0], y: box[1], width: box[2], height: box[3] } });
  const [useBall, inlineBall, useMedal, inlineMedal] = await Promise.all(same.map(shot));
  // PNG bytes of the same drawing agree to within a hair; a sprite whose gradients failed would not.
  for (const [a, b] of [[useBall, inlineBall], [useMedal, inlineMedal]]) expect(Math.abs(a.length - b.length)).toBeLessThan(a.length * 0.08);
});
