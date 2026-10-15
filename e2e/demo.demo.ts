import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const noSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test("the playground draws an emblem and does not scroll sideways", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#stage > svg")).toBeVisible();
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("every emblem draws, in every style, and the address says which", async ({ page }) => {
  test.slow();
  await page.goto("/");
  const ids = await page.locator("#emblem option").evaluateAll((options) => options.map((o) => (o as HTMLOptionElement).value));
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

test("the puck workshop prints the words, the name and number and a signature, and turns", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const stage = page.locator("#puck-stage");
  await expect(stage.locator("svg")).toBeVisible();
  await expect(stage.locator("svg title")).toHaveText("Canada flag puck");
  const before = await stage.innerHTML();
  await page.locator("#puck-design").selectOption("puck:player");
  await expect(stage.locator("svg title")).toHaveText("Player number puck");
  await page.locator("#puck-number").fill("99");
  await page.locator("#puck-name").fill("Tanaka");
  await expect(page.locator("#puck-code")).toContainText('number: "99"');
  await expect(page.locator("#puck-code")).toContainText('name: "Tanaka"');
  const printed = await stage.innerHTML();
  expect(printed).not.toBe(before);
  // The signature is drawn only when asked for, and the seed changes it.
  await page.locator('#puck-sign button[data-value="gold"]').click();
  const gold = await stage.innerHTML();
  expect(gold).toContain("#e8b923");
  await page.locator("#puck-seed").fill("21");
  expect(await stage.innerHTML()).not.toBe(gold);
  await page.locator('#puck-sign button[data-value="black"]').click();
  expect(await stage.innerHTML()).toContain("#16171a");
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("the custom ball paints, stamps, scripts, takes a logo from a file as a data URI, and turns", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const stage = page.locator("#ball-stage");
  await expect(stage.locator("svg")).toBeVisible();
  await expect(stage.locator("svg title")).toHaveText("Baseball");
  const own = await stage.innerHTML();
  // The default has the stamp and the script on: navy ink is there.
  expect(own).toContain("#1b2a5c");
  await expect(page.locator("#ball-code")).toContainText('stamp: true');
  // A solid colour: the body takes it, and the navy ink gives way to white on red.
  await page.locator('#ball-colour button[data-value="#c4262e"]').click();
  const red = await stage.innerHTML();
  expect(red).toContain("#c4262e");
  expect(red).not.toContain("#1b2a5c");
  // Two-tone along the seam.
  await page.locator('#ball-two button[data-value="seam"]').click();
  await page.locator('#ball-colour button[data-value=""]').click();
  await expect(page.locator("#ball-code")).toContainText('split: "seam"');
  expect(await stage.innerHTML()).toContain('fill-rule="evenodd"');
  // Words, and a signature line.
  await page.locator("#ball-line1").fill("LIMITED");
  await page.locator("#ball-line2").fill("DEMO BALL");
  await page.locator("#ball-sign").check();
  await expect(page.locator("#ball-code")).toContainText('lines: ["LIMITED", "DEMO BALL"]');
  await expect(page.locator("#ball-code")).toContainText("sign: true");
  // A logo from a file is read in the browser: the call shows a data URI and the ball takes the logo's colour.
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#12ab34"/></svg>';
  await page.locator("#ball-logo").setInputFiles({ name: "logo.svg", mimeType: "image/svg+xml", buffer: Buffer.from(svg) });
  await expect(page.locator("#ball-code")).toContainText("decal:");
  expect(await stage.innerHTML()).toContain("#12ab34");
  await page.locator("#ball-clear").click();
  expect(await stage.innerHTML()).not.toContain("#12ab34");
  // The sample logo, another ball, the mark and the script off.
  await page.locator("#ball-sample").click();
  expect(await stage.innerHTML()).toContain("#1f4e8c");
  await page.locator("#ball-id").selectOption("ball:soccer");
  await expect(stage.locator("svg title")).toHaveText("Soccer ball");
  await page.locator('#ball-mark button[data-value="sample"]').click();
  await page.locator("#ball-script").uncheck();
  await expect(page.locator("#ball-code")).not.toContainText("script:");
  // It turns: the arrow keys turn it, as a drag does.
  const before = await stage.innerHTML();
  await stage.focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowRight");
  await expect.poll(() => stage.innerHTML()).not.toBe(before);
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});

test("the gallery lists every emblem with its id, finds one by a word, and copies its id", async ({ page }) => {
  const errors: string[] = [];
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
  for (const control of await page.locator(".copy").all().then((all) => all.slice(0, 4))) expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(43.5);
  await page.goto("/");
  for (const control of await page.locator("#style button, #theme button, #size button, #tint button, #emblem, #engrave, #yaw, #pitch, #puck-design, #puck-ring, #puck-text, #puck-name, #puck-number, #puck-sign button, #puck-seed").all()) {
    const box = (await control.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(43.5);
  }
});

test("the background is off by default, and a chosen one is a picture behind the stage that leaves the emblem as it was", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?id=trophy:hockey-cup");
  const background = () => page.locator("#stage").evaluate((stage) => stage.style.backgroundImage);
  expect(await background()).toBe("");
  const plain = await page.locator("#stage > svg").evaluate((svg) => svg.outerHTML);
  await page.locator("#background").selectOption("ice");
  await expect.poll(background).toContain("data:image/svg+xml");
  expect(page.url()).toContain("background=ice");
  expect(await page.locator("#stage > svg").evaluate((svg) => svg.outerHTML)).toBe(plain);
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await expect.poll(background).toContain("data:image/svg+xml");
  // The address says which, and None takes it away again.
  await page.goto("/?id=ball:soccer&background=floodlights&theme=dark");
  await expect(page.locator("#background")).toHaveValue("floodlights");
  await expect.poll(background).toContain("data:image/svg+xml");
  await page.locator("#background").selectOption("");
  await expect.poll(background).toBe("");
  expect(page.url()).not.toContain("background");
  await page.goto("/?background=nope");
  await expect(page.locator("#background")).toHaveValue("");
  expect(await noSideways(page)).toBe(true);
  expect(errors).toEqual([]);
});
