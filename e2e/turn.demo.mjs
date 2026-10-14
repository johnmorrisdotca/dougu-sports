// bindTurn in the playground, in a real browser: a drag, the arrow keys and the auto-turn turn the emblem, and the sliders follow.
import { expect, test } from "@playwright/test";

const yaw = (page) => page.locator("#yaw").inputValue().then(Number);
const dragStage = async (page, dx, dy = 0) => {
  await page.locator("#stage").scrollIntoViewIfNeeded();
  const box = await page.locator("#stage").boundingBox();
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
  const before = await page.locator("#stage").innerHTML();
  await page.waitForTimeout(600);
  expect(await page.locator("#stage").innerHTML()).toBe(before);
  expect(await yaw(page)).toBe(0);
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "false");
});

test("dragging the emblem turns it and moves the sliders and their readouts", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  const before = await page.locator("#stage").innerHTML();
  await dragStage(page, 40, -20);
  // The drawing is made on the next animation frame.
  await expect.poll(() => page.locator("#stage").innerHTML()).not.toBe(before);
  // 40 pixels at 1.5 degrees a pixel, and up is more tilt (the slider steps by 5).
  expect(await yaw(page)).toBeGreaterThanOrEqual(55);
  expect(await yaw(page)).toBeLessThanOrEqual(65);
  expect(Number(await page.locator("#pitch").inputValue())).toBeGreaterThan(0);
  await expect(page.locator("#yaw-out")).toHaveText(/^\d+°$/);
  await expect(page.locator("#code")).toContainText("emblemFrame");
  // The address settles on the angles.
  await expect(page).toHaveURL(/yaw=\d+/);
  const cursor = await page.locator("#stage").evaluate((el) => [el.style.touchAction, el.style.userSelect, getComputedStyle(el).cursor]);
  expect(cursor).toEqual(["none", "none", "grab"]);
});

test("the arrow keys turn it, Home puts it back, and the stage can be reached by keyboard", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  await page.locator("#stage").focus();
  await expect(page.locator("#stage")).toHaveAttribute("tabindex", "0");
  await expect(page.locator("#stage")).toHaveAttribute("aria-roledescription", /turnable/);
  await page.keyboard.press("ArrowRight");
  expect(await yaw(page)).toBe(5);
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  expect(await yaw(page)).toBe(-5);
  await page.keyboard.press("Shift+ArrowRight");
  expect(await yaw(page)).toBe(10);
  await page.keyboard.press("ArrowUp");
  expect(Number(await page.locator("#pitch").inputValue())).toBe(5);
  await page.keyboard.press("Home");
  expect(await yaw(page)).toBe(0);
  expect(Number(await page.locator("#pitch").inputValue())).toBe(0);
});

test("a ball has a roll slider, and Shift while dragging turns it", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  await expect(page.locator("#roll-row")).toBeVisible();
  await page.keyboard.down("Shift");
  await dragStage(page, 40);
  await page.keyboard.up("Shift");
  expect(Number(await page.locator("#roll").inputValue())).toBeGreaterThan(0);
  await page.goto("/?id=trophy:tennis-cup");
  await expect(page.locator("#roll-row")).toBeHidden();
});

test("Play turns the yaw over time and Pause stops it, and the slider follows the spin", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup&speed=90");
  await page.locator("#play").click();
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(0);
  const mid = await yaw(page);
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(mid);
  await expect(page.locator("#yaw-out")).toHaveText(/^-?\d+°$/);
  await page.locator("#play").click();
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "false");
  const stopped = await page.locator("#stage").innerHTML();
  await page.waitForTimeout(500);
  expect(await page.locator("#stage").innerHTML()).toBe(stopped);
});

test("a drag, a slider or a key takes over from the spin without a jump", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup&speed=90");
  await page.locator("#play").click();
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(0);
  // The slider pauses it.
  await page.locator("#yaw").fill("100");
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "false");
  await page.waitForTimeout(300);
  expect(await yaw(page)).toBe(100);
  // Space on the stage starts it again, and an arrow key stops it.
  await page.locator("#stage").focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "false");
  // A drag holds the spin while the pointer is down, and it carries on from the new angle.
  await page.locator("#play").click();
  await page.locator("#stage").scrollIntoViewIfNeeded();
  const box = await page.locator("#stage").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const held = await yaw(page);
  await page.waitForTimeout(300);
  expect(await yaw(page)).toBe(held);
  await page.mouse.up();
  await expect(page.locator("#play")).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => yaw(page), { timeout: 5000 }).not.toBe(held);
});

test("changing the emblem, the style, the tint or the look keeps the angles", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  await page.locator("#yaw").fill("60");
  await page.locator("#emblem").selectOption("medal:gold");
  expect(await yaw(page)).toBe(60);
  await page.getByRole("button", { name: "Line", exact: true }).click();
  await page.getByRole("button", { name: "Red", exact: true }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  expect(await yaw(page)).toBe(60);
  await expect(page.locator("#stage > svg")).toHaveAttribute("color", "#eef1f3");
  expect(await page.locator("#stage").innerHTML()).toContain("<title>Gold medal</title>");
});

test("a pictogram and a piece of gear turn like a coin, with the turning controls", async ({ page }) => {
  for (const id of ["sport:nhl", "gear:hurley", "award:crown", "gear:gunbai"]) {
    await page.goto(`/?id=${id}`);
    await expect(page.locator("#turn-row")).toBeVisible();
    await expect(page.locator("#spin-row")).toBeVisible();
    // The stage is ready for the drag when bindTurn has made it a tab stop.
    await expect(page.locator("#stage")).toHaveAttribute("tabindex", "0");
    const before = await page.locator("#stage").innerHTML();
    // WebKit may drop the first press of a page that has only just settled, so the drag is tried again until the drawing changes.
    await expect.poll(async () => {
      await dragStage(page, 60);
      return (await page.locator("#stage").innerHTML()) !== before;
    }, { message: id, timeout: 5000 }).toBe(true);
  }
});

test("the hint and the buttons say it in English and in Japanese", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#hint")).toContainText("Drag the emblem, or use the sliders or the arrow keys");
  await expect(page.locator("#play")).toContainText("Auto-turn");
  await page.goto("/?lang=ja");
  await expect(page.locator("#hint")).toContainText("ドラッグ");
  await expect(page.locator("#play")).toContainText("自動回転");
  await page.locator("#play").click();
  await expect(page.locator("#play")).toContainText("停止");
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

test("the turning controls are 44 pixels tall at least, and the page does not scroll sideways", async ({ page }) => {
  await page.goto("/?id=ball:soccer");
  for (const control of await page.locator("#play, #speed button, #roll, #case .case-play").all()) expect((await control.boundingBox()).height).toBeGreaterThanOrEqual(43.5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
