// The playground's turning, in a real browser. The hands (drag, wheel, pinch, keys, the bar) are the family's <kazoku-view-controls>, which turns the emblem through `setAngles`;
// every drag here is a real pointer. A drag follows the hand: right turns it right, up lifts the front.
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

interface Seen { yaw: number; tilt: number; zoom: number; turning: boolean }
const seen = (page: Page) => page.locator("#view-bar").evaluate((el) => (el as unknown as { state: Seen }).state);
const yaw = (page: Page) => seen(page).then((s) => s.yaw);
const tilt = (page: Page) => seen(page).then((s) => s.tilt);
const play = (page: Page) => page.locator('#view-bar [data-b="play"]');
const stageHtml = (page: Page) => page.locator("#stage-view").innerHTML();
const dragStage = async (page: Page, dx: number, dy = 0) => {
  await page.locator("#stage").scrollIntoViewIfNeeded();
  const box = (await page.locator("#stage").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx / 2, y + dy / 2, { steps: 3 });
  await page.mouse.move(x + dx, y + dy, { steps: 3 });
  await page.mouse.up();
};

test("nothing turns until a button is pressed", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const before = await stageHtml(page);
  await page.waitForTimeout(600);
  expect(await stageHtml(page)).toBe(before);
  expect(await yaw(page)).toBe(0);
  await expect(play(page)).toHaveAttribute("aria-pressed", "false");
});

test("dragging the emblem with a real pointer turns it, right turns it right and up tips it up, and the address keeps the view", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const before = await stageHtml(page);
  await dragStage(page, 60, -30);
  await expect.poll(() => stageHtml(page)).not.toBe(before);
  expect(await yaw(page)).toBeGreaterThan(5);
  expect(await tilt(page)).toBeGreaterThan(2);
  await expect(page.locator("#code")).toContainText("emblemFrame");
  await expect(page).toHaveURL(/yaw=-?\d+/);
  await expect(play(page)).toHaveAttribute("aria-pressed", "false");
  // The bar's angle slider says the same as the view.
  const slider = Number(await page.locator("#view-bar #yaw").inputValue());
  expect(slider).toBe(Math.round((await yaw(page)) as number));
});

// What a drag to the right does to what is drawn, measured on the page: the front of every kind carries to the right, and a flat thing shows its rim on the left.
const darkPanels = (page: Page) =>
  page.locator("#stage-view svg").first().evaluate((svg) => {
    const box = svg.getBoundingClientRect();
    return [...svg.querySelectorAll('path[fill="#1e2025"]')].map((el) => {
      const b = el.getBoundingClientRect();
      return { x: b.x + b.width / 2 - box.x - box.width / 2, y: b.y + b.height / 2 - box.y - box.height / 2 };
    });
  });
const nearestTo = (list: { x: number; y: number }[], at: { x: number; y: number }) => list.reduce((best, p) => (Math.hypot(p.x - at.x, p.y - at.y) < Math.hypot(best.x - at.x, best.y - at.y) ? p : best));

test("a drag to the right carries the front of a ball to the right, and to the left carries it left", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  const panel = nearestTo(await darkPanels(page), { x: 0, y: 0 });
  await dragStage(page, 20);
  await expect.poll(async () => nearestTo(await darkPanels(page), panel).x).toBeGreaterThan(panel.x + 2);
  const right = nearestTo(await darkPanels(page), panel);
  await dragStage(page, -40);
  await expect.poll(async () => nearestTo(await darkPanels(page), right).x).toBeLessThan(right.x - 2);
});

test("a drag up lifts the front of a ball, and a drag down lowers it", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  const panel = nearestTo(await darkPanels(page), { x: 0, y: 0 });
  await dragStage(page, 0, -20);
  // The near face goes up with the hand, as if the near edge of a turntable were lifted: the panel in the middle of the view moves up.
  await expect.poll(async () => nearestTo(await darkPanels(page), panel).y).toBeLessThan(panel.y - 2);
  expect(await tilt(page)).toBeGreaterThan(0);
  await expect(page).toHaveURL(/tilt=\d+/);
  const up = nearestTo(await darkPanels(page), panel);
  await dragStage(page, 0, 40);
  await expect.poll(async () => nearestTo(await darkPanels(page), up).y).toBeGreaterThan(up.y + 2);
  expect(await tilt(page)).toBeLessThan(0);
});

test("the arrow key up tips it the way a drag up does, and Home puts it back", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  const panel = nearestTo(await darkPanels(page), { x: 0, y: 0 });
  await page.locator("#stage").focus();
  for (let i = 0; i < 4; i += 1) await page.keyboard.press("ArrowUp");
  await expect.poll(async () => nearestTo(await darkPanels(page), panel).y).toBeLessThan(panel.y - 2);
  expect(await tilt(page)).toBeGreaterThan(0);
  await page.keyboard.press("Home");
  await expect.poll(() => tilt(page)).toBe(0);
});

test("a drag to the right carries the face of a cup to the right: its light slides that way", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const light = () =>
    page.locator('#stage-view svg path[fill="#fff"]').first().evaluate((el) => {
      const b = el.getBoundingClientRect();
      return b.x + b.width / 2;
    });
  const start = await light();
  await dragStage(page, 40);
  await expect.poll(light).toBeGreaterThan(start + 1);
  await dragStage(page, -80);
  await expect.poll(light).toBeLessThan(start - 1);
});

test("a drag to the right shows the rim of a medal on its left, the edge that comes toward the eye", async ({ page }) => {
  await page.goto("/?id=medal:gold");
  const rimSide = () =>
    page.locator("#stage-view svg").first().evaluate((svg) => {
      // The edge is the slices of the face moved along the thickness: the farthest one says which side it lies on (left is negative).
      const far = svg.querySelector('feOffset[result="o8"]');
      return far === null ? undefined : Number(far.getAttribute("dx"));
    });
  await dragStage(page, 40);
  await expect.poll(rimSide).toBeLessThan(0);
  await dragStage(page, -80);
  await expect.poll(rimSide).toBeGreaterThan(0);
});

test("the arrow keys turn it, Home puts it back, and the stage can be reached by keyboard", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  await expect(page.locator("#stage")).toHaveAttribute("tabindex", "0");
  await page.locator("#stage").focus();
  await page.keyboard.press("ArrowRight");
  const right = await yaw(page);
  expect(right).toBeGreaterThan(0);
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  expect(await yaw(page)).toBeLessThan(right);
  await page.keyboard.press("Home");
  expect(await yaw(page)).toBe(0);
  expect(await tilt(page)).toBe(0);
});

test("a ball has a roll slider, a cup has none", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  await expect(page.locator("#roll-row")).toBeVisible();
  const before = await stageHtml(page);
  await page.locator("#roll").fill("40");
  await expect.poll(() => stageHtml(page)).not.toBe(before);
  await expect(page.locator("#roll-out")).toHaveText("40°");
  await page.goto("/?id=trophy:tennis-cup");
  await expect(page.locator("#roll-row")).toBeHidden();
});

test("Auto-turn turns the yaw over time and pressing it again stops it", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  await play(page).click();
  await expect(play(page)).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(0);
  const mid = await yaw(page);
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(mid);
  await play(page).click();
  await expect(play(page)).toHaveAttribute("aria-pressed", "false");
  const stopped = await stageHtml(page);
  await page.waitForTimeout(500);
  expect(await stageHtml(page)).toBe(stopped);
});

test("a drag holds the spin while the pointer is down, and it carries on from the new angle; only Auto-turn stops it", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  await play(page).click();
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(0);
  await page.locator("#stage").scrollIntoViewIfNeeded();
  const box = (await page.locator("#stage").boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const held = await yaw(page);
  await page.waitForTimeout(300);
  expect(Math.abs((await yaw(page)) - held)).toBeLessThan(2);
  await page.mouse.up();
  await expect(play(page)).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(held);
});

test("changing the emblem, the style, the tint or the look keeps the angles", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  await page.locator("#stage").focus();
  for (let i = 0; i < 6; i += 1) await page.keyboard.press("ArrowRight");
  const turned = await yaw(page);
  expect(turned).toBeGreaterThan(0);
  await page.locator("#emblem").selectOption("medal:gold");
  expect(await yaw(page)).toBe(turned);
  await page.getByRole("button", { name: "Line", exact: true }).click();
  await page.getByRole("button", { name: "Red", exact: true }).click();
  await page.locator('button[data-value="dark"]').click();
  expect(await yaw(page)).toBe(turned);
  await expect(page.locator("#stage-view > svg")).toHaveAttribute("color", "#eef1f3");
  expect(await stageHtml(page)).toContain("<title>Gold medal</title>");
});

test("a pictogram and a piece of gear turn like a coin, with the bar", async ({ page }) => {
  for (const id of ["sport:nhl", "gear:hurley", "award:crown", "gear:gunbai"]) {
    await page.goto(`/?id=${id}`);
    await expect(page.locator("#view-bar")).toBeVisible();
    await expect(page.locator("#stage")).toHaveAttribute("tabindex", "0");
    const before = await stageHtml(page);
    // WebKit may drop the first press of a page that has only just settled, so the drag is tried again until the drawing changes.
    await expect.poll(async () => {
      await dragStage(page, 60);
      return (await stageHtml(page)) !== before;
    }, { message: id, timeout: 5000 }).toBe(true);
  }
});

test("zoom moves the view and Fit puts it back, and the wheel zooms about the pointer", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const zoomIn = page.locator('#view-bar [data-b="in"]');
  await zoomIn.click();
  await expect.poll(async () => (await seen(page)).zoom).toBeGreaterThan(1);
  await expect(page.locator("#stage-view")).toHaveCSS("transform", /matrix/);
  await page.locator('#view-bar [data-b="fit"]').click();
  await expect.poll(async () => (await seen(page)).zoom).toBe(1);
  await expect(page.locator("#stage-view")).toHaveCSS("transform", "none");
});

test("the hint and the bar say it in English and in Japanese", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hint")).toContainText("Drag the emblem, or use the bar under it");
  await expect(play(page)).toContainText("Auto-turn");
  await page.goto("/?lang=ja");
  await expect(page.locator("#hint")).toContainText("ドラッグ");
  await expect(play(page)).not.toContainText("Auto-turn");
  await expect(play(page)).toContainText(/[\u3040-\u30ff\u4e00-\u9fff]/);
});

/** The numbers in a drawing, in order: two frames of one emblem at the same angle have the same ones, to a rounding. */
const numbers = (html: string) => (html.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);

test("the bar's speed buttons are the family's 0.5×, 1× and 2×: they multiply the turn's speed and the address keeps them as pace", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const bar = page.locator("#view-bar");
  const more = bar.locator('[data-b="more"]');
  if ((await more.getAttribute("aria-expanded")) === "false") await more.click();
  const buttons = bar.locator("kazoku-speed-buttons button");
  await expect(buttons).toHaveText(["0.5×", "1×", "2×"]);
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  // degrees a second the bar turns it at: the base speed (18) times the button
  const speed = () => bar.evaluate((el) => (el as unknown as { controller: { speed: number } }).controller.speed);
  expect(await speed()).toBe(18);
  await buttons.nth(2).click();
  await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true");
  expect(await speed()).toBe(36);
  await expect(page).toHaveURL(/pace=2/);
  expect(page.url()).not.toMatch(/[?&]speed=/);
  await buttons.nth(0).click();
  expect(await speed()).toBe(9);
  await expect(page).toHaveURL(/pace=0\.5/);
  await buttons.nth(1).click();
  await expect(page).not.toHaveURL(/pace=/);
  // an address opens at its speed
  await page.goto("/?id=trophy:tennis-cup&pace=2");
  expect(await speed()).toBe(36);
});

test("the trophy case has the same speed buttons, kept as casepace: twice as fast at 2× for all four", async ({ page, context }) => {
  // each run is on a page of its own, and the page's clock is the test's, so a second is a second however busy the machine is
  const turnedFor = async (url: string, ms: number) => {
    const tab = await context.newPage();
    await tab.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await tab.goto(url);
    await tab.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
    const first = tab.locator("#case li").first();
    await first.getByTestId("case-play").click();
    await tab.clock.runFor(ms);
    const html = await first.locator(".case-stage").innerHTML();
    await tab.close();
    return html;
  };
  await page.goto("/");
  const buttons = page.getByTestId("case-pace").locator("button");
  await expect(buttons).toHaveText(["0.5×", "1×", "2×"]);
  await expect(buttons.nth(1)).toHaveAttribute("aria-pressed", "true");
  // 3.2 seconds at 1× and 1.6 at 2× are the same turn
  const slow = numbers(await turnedFor("/", 3200));
  const fast = numbers(await turnedFor("/?casepace=2", 1600));
  expect(fast.length).toBe(slow.length);
  fast.forEach((n, i) => expect(Math.abs(n - slow[i]), `number ${i}`).toBeLessThan(0.15));
  const once = numbers(await turnedFor("/", 1600));
  const apart = once.reduce((sum, n, i) => sum + Math.abs(n - (fast[i] ?? 0)), 0);
  expect(apart, "one speed is not the other").toBeGreaterThan(5);
  // pressing a button in the page sets the speed and the address
  await page.goto("/?casepace=2");
  await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true");
  await buttons.nth(1).click();
  await expect(page).not.toHaveURL(/casepace=/);
  await buttons.nth(2).click();
  await expect(page).toHaveURL(/casepace=2/);
});

test("the trophy case turns each emblem on its own button, and nothing moves before", async ({ page }) => {
  await page.goto("/");
  const cells = page.locator("#case li");
  await expect(cells).toHaveCount(4);
  const first = cells.first();
  const before = await first.locator(".case-stage").innerHTML();
  await page.waitForTimeout(400);
  expect(await first.locator(".case-stage").innerHTML()).toBe(before);
  await first.getByTestId("case-play").click();
  await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => first.locator(".case-stage").innerHTML(), { timeout: 5000 }).not.toBe(before);
  // The others stay still.
  const other = await cells.nth(1).locator(".case-stage").innerHTML();
  await page.waitForTimeout(300);
  expect(await cells.nth(1).locator(".case-stage").innerHTML()).toBe(other);
  await first.getByTestId("case-play").click();
  await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "false");
});

test("the bar and the buttons are 44 pixels tall at least, and the page does not scroll sideways", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  for (const control of await page.locator("#view-bar button:visible, #roll, #picks button, #case .case-play").all()) expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(43.5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

// The page opens on a still emblem with its controls beside it; it turns while the pointer is over it (a tap on a phone), and Auto-turn and `?turn=1` keep it going. The suite runs with reduced motion on, so these ask for the ordinary setting.
test.describe("a reader who has not asked for reduced motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the emblem waits still when the page opens, turns while the mouse is over it, and stops where it leaves", async ({ page, hasTouch }) => {
    test.skip(hasTouch, "a touch screen has no pointer to hover with: the tap test covers it");
    await page.goto("/");
    await expect(page.locator("#stage-view > svg")).toBeVisible();
    await expect(play(page)).toHaveAttribute("aria-pressed", "false");
    await page.waitForTimeout(700);
    expect(await yaw(page)).toBe(0);
    expect(page.url()).not.toMatch(/turn=/);
    await page.locator("#stage").hover();
    await expect(play(page)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(0);
    // The pointer's turn is not the reader's own choice: the address does not say "turn".
    expect(page.url()).not.toMatch(/turn=/);
    await page.mouse.move(2, 2);
    await expect(play(page)).toHaveAttribute("aria-pressed", "false");
    const stopped = await yaw(page);
    await page.waitForTimeout(500);
    expect(await yaw(page)).toBe(stopped);
    await page.locator("#stage").hover();
    await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(stopped);
  });

  test("a tap on the stage turns it and a second tap holds it", async ({ page, hasTouch }) => {
    test.skip(!hasTouch, "needs a touch screen");
    await page.goto("/");
    await expect(page.locator("#stage-view > svg")).toBeVisible();
    await page.locator("#stage").tap();
    await expect(play(page)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(0);
    await page.locator("#stage").tap();
    await expect(play(page)).toHaveAttribute("aria-pressed", "false");
    const stopped = await yaw(page);
    await page.waitForTimeout(500);
    expect(await yaw(page)).toBe(stopped);
  });

  test("?turn=1 starts it with the page, Auto-turn holds and carries on, and turn=0 and an angle in the address open still", async ({ page }) => {
    await page.goto("/?turn=1");
    await expect(page.locator("#stage-view > svg")).toBeVisible();
    await expect(play(page)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(0);
    // The address leaves the angle out while it turns, so that a reload starts the turn again.
    expect(page.url()).not.toMatch(/yaw=/);
    await play(page).click();
    await expect(play(page)).toHaveAttribute("aria-pressed", "false");
    await expect(page).not.toHaveURL(/turn=1/);
    const stopped = await yaw(page);
    await page.waitForTimeout(400);
    expect(await yaw(page)).toBe(stopped);
    await play(page).click();
    await expect(page).toHaveURL(/turn=1/);
    await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(stopped);
    await page.goto("/?turn=0");
    await page.waitForTimeout(500);
    expect(await yaw(page)).toBe(0);
    await page.goto("/?turn=1&yaw=70");
    await expect(play(page)).toHaveAttribute("aria-pressed", "false");
    await page.waitForTimeout(400);
    expect(await yaw(page)).toBe(70);
  });

  test("the stage, the quick picks and the bar are in the first screen, and a change while it turns leaves the turn going", async ({ page }) => {
    await page.goto("/?turn=1");
    await expect(play(page)).toHaveAttribute("aria-pressed", "true");
    const height = page.viewportSize()!.height;
    for (const selector of ["#stage", "#picks button", "#view-bar"]) {
      const box = (await page.locator(selector).first().boundingBox())!;
      expect(box, selector).not.toBeNull();
      expect(box.y + box.height, `${selector} is in the first screen`).toBeLessThanOrEqual(height);
    }
    await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(0);
    const gap = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
    const changes = [
      () => page.locator('#style button[data-value="line"]').click(),
      () => page.locator('#style button[data-value="metal"]').click(),
      () => page.locator('#tint button[data-value="#c8102e"]').click(),
      () => page.locator('#picks button[data-id="ball:basketball"]').click(),
      () => page.locator('#picks button[data-id="trophy:stanley-cup"]').click(),
    ];
    for (const change of changes) {
      const before = await yaw(page);
      await change();
      await expect(play(page)).toHaveAttribute("aria-pressed", "true");
      const after = await yaw(page);
      expect(gap(before, after), "the angle was not reset").toBeLessThan(60);
      await expect.poll(async () => gap(after, await yaw(page)), { timeout: 8000 }).toBeGreaterThan(2);
    }
  });

  test("the trophy case waits still, turns an emblem while the pointer is over it or after a tap, and each button keeps one going", async ({ page, hasTouch }) => {
    await page.goto("/");
    const cells = page.locator("#case li");
    const first = cells.first();
    await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "false");
    const before = await first.locator(".case-stage").innerHTML();
    await page.waitForTimeout(500);
    expect(await first.locator(".case-stage").innerHTML()).toBe(before);
    if (hasTouch) await first.locator(".case-stage").tap();
    else await first.locator(".case-stage").hover();
    await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => first.locator(".case-stage").innerHTML(), { timeout: 8000 }).not.toBe(before);
    if (hasTouch) await first.locator(".case-stage").tap();
    else await page.mouse.move(2, 2);
    await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "false");
    // The button keeps it going wherever the pointer is.
    await first.getByTestId("case-play").click();
    await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "true");
    await page.mouse.move(2, 2);
    await page.waitForTimeout(300);
    await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "true");
    await first.getByTestId("case-play").click();
    await expect(first.getByTestId("case-play")).toHaveAttribute("aria-pressed", "false");
  });
});

test("a reader who prefers reduced motion is not turned for by the pointer or by ?turn=1, and Auto-turn still works", async ({ page, hasTouch }) => {
  await page.goto("/?turn=1");
  await expect(page.locator("#stage-view > svg")).toBeVisible();
  await expect(play(page)).toHaveAttribute("aria-pressed", "false");
  if (!hasTouch) {
    await page.locator("#stage").hover();
    await page.waitForTimeout(600);
    expect(await yaw(page)).toBe(0);
    await page.mouse.move(2, 2);
  }
  await play(page).click();
  await expect(play(page)).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => yaw(page), { timeout: 8000 }).not.toBe(0);
});
