// The family's gesture check (kazoku-ui's checkGestures) on the playground's emblem: the bar under the stage owns the hands. Every gesture is done with a real mouse, key
// or two fingers and must change the view as the family's rule says. `pnpm test:demo` builds the demo and runs it.
import { checkGestures } from "@johnmorrisdotca/kazoku-ui/testing";
import { expect, test } from "@playwright/test";

test.beforeEach(({ viewport }) => {
  test.skip((viewport?.width ?? 1280) <= 640, "the gestures are the mouse's and the keyboard's; the phone is checked by the zoom and pinch tests");
});

test("the playground's emblem answers every gesture", async ({ page }) => {
  await page.goto("/?id=trophy:tennis-cup");
  await expect(page.locator("#stage-view svg").first()).toBeVisible();
  const report = await checkGestures(page, "#stage");
  expect(report.filter((r) => r.result === "lacks")).toEqual([]);
});
