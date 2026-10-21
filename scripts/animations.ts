// Makes the README's moving pictures into docs/images, as animated webp: five famous trophies turning (the Stanley Cup first), seven balls rolling, and a medal, a banner, a crest and gear flipping like coins.
// Each is drawn by the package's own turn (`emblemFrame`, the frames the demo's turntable shows) inside the demo page, on one of the family's shared backgrounds (scripts/family-backgrounds.ts), in a light and
// a dark twin. Playwright takes one png per angle and `img2webp` (libwebp's tool: `brew install webp`) joins them into a looping lossy animation, each file well under 1.5 MB.
//
//   node scripts/animations.ts                 all of them (needs a build: `pnpm animations` builds first)
//   ONLY=trophies-turn node scripts/animations.ts   one scene (trophies-turn, balls-turn, pickleball-turn, slotted-turn, flips-turn), both twins
//   IMAGES_OUT=dir                             writes somewhere else than docs/images
//   FRAMES=48 DELAY=140 QUALITY=80             the number of frames in the circle, the milliseconds each is shown (140: half the speed of the first pictures, which used 70), the webp quality
//
// It serves the demo on port 7203, or TEST_PORT (this package's own block, tests and tools from 7201 up), and stops the server it started.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { backgroundSvg } from "./family-backgrounds.ts";
import type { BackgroundPresetName } from "./family-backgrounds.ts";

/** The built package, as the page imports it: what each scene's function is given. Each function is sent to the page as text, so it names this type only in its parameters. */
type Dist = typeof import("../src/index.ts");

/** What a scene is made of: its size, how many figures stand side by side, the background it stands on, and the function that draws every figure at one angle. */
interface Scene {
  name: string;
  width: number;
  height: number;
  cols: number;
  preset: BackgroundPresetName;
  intensity: number;
  make: (D: Dist, yaw: number) => string;
}

const root = fileURLToPath(new URL("..", import.meta.url));
const out = process.env.IMAGES_OUT ?? `${root}docs/images`;
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const frames = Number(process.env.FRAMES ?? 48);
const delay = Number(process.env.DELAY ?? 140);
const quality = Number(process.env.QUALITY ?? 80);
const port = Number(process.env.TEST_PORT ?? 7203);
const MAX_BYTES = 1.5 * 1024 * 1024;

if (spawnSync("img2webp", ["-version"], { stdio: "ignore" }).status === null) throw new Error("img2webp is not installed: `brew install webp` (libwebp's animation tool)");
mkdirSync(out, { recursive: true });

// The figures of each scene at one angle, as the page builds them from the built package (each function is sent to the page as text, so each carries what it uses).
// Every figure is a fifth, seventh or sixth of a turn behind the one before, so the row is never all front or all back (each function carries its own `f`).
const trophies = (D: Dist, yaw: number) => {
  const f = (svg: string) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${svg}</figure>`;
  return ["trophy:stanley-cup", "trophy:fifa-world-cup", "trophy:lombardi-trophy", "trophy:larry-obrien-trophy", "trophy:webb-ellis-cup"].map((id, i) => f(D.emblemFrame(id, { yaw: yaw + i * 72, size: 400 }))).join("");
};
const balls = (D: Dist, yaw: number) => {
  const f = (svg: string) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${svg}</figure>`;
  return ["ball:soccer", "ball:basketball", "ball:baseball", "ball:rugby", "ball:volleyball", "ball:tennis", "ball:golf"].map((id, i) => f(D.emblemFrame(id, { yaw: yaw + i * 51, pitch: 12, size: 112 }))).join("");
};
const pickleballs = (D: Dist, yaw: number) => {
  const f = (svg: string) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${svg}</figure>`;
  return ["ball:pickleball-outdoor", "ball:pickleball-indoor", "ball:pickleball-outdoor", "ball:pickleball-indoor"].map((id, i) => f(D.emblemFrame(id, { yaw: yaw + i * 90, pitch: 15, size: 170 }))).join("");
};
const slotted = (D: Dist, yaw: number) => {
  const f = (svg: string) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${svg}</figure>`;
  return [0, 1, 2, 3].map((i) => f(D.emblemFrame("ball:plastic-baseball-slotted", { yaw: yaw + i * 90, pitch: -10, size: 170 }))).join("");
};
const flips = (D: Dist, yaw: number) => {
  const f = (svg: string) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${svg}</figure>`;
  return ["medal:gold", "medal:silver", "trophy:championship-banner", "crest:shield", "gear:hockey-skate", "gear:baseball-glove"].map((id, i) => f(D.emblemFrame(id, { yaw: yaw + i * 60, size: 150 }))).join("");
};

const SCENES: Scene[] = [
  { name: "trophies-turn", width: 760, height: 280, cols: 5, preset: "royal", intensity: 0.9, make: trophies },
  { name: "balls-turn", width: 760, height: 180, cols: 7, preset: "floodlights", intensity: 0.9, make: balls },
  { name: "pickleball-turn", width: 760, height: 190, cols: 4, preset: "floodlights", intensity: 0.9, make: pickleballs },
  { name: "slotted-turn", width: 760, height: 190, cols: 4, preset: "floodlights", intensity: 0.9, make: slotted },
  { name: "flips-turn", width: 760, height: 200, cols: 6, preset: "royal", intensity: 0.9, make: flips },
];

const server = spawn(process.execPath, ["scripts/dev.ts"], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: "ignore" });
const work = mkdtempSync(join(tmpdir(), "dougu-animations-"));
try {
  await new Promise<void>((resolve, reject) => {
    const started = Date.now();
    const poll = async () => {
      try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return resolve(); } catch { /* not up yet */ }
      if (Date.now() - started > 8000) return reject(new Error("the demo server did not start"));
      setTimeout(poll, 150);
    };
    poll();
  });
  const browser = await chromium.launch();
  for (const scene of SCENES) {
    if (only && !only.includes(scene.name)) continue;
    for (const scheme of ["light", "dark"] as const) {
      const { width, height } = scene;
      const made = backgroundSvg(scene.preset, { width, height, theme: scheme, seed: 3, intensity: scene.intensity, id: `bg-${scene.name}` });
      const ground = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="position:absolute;left:0;top:0" aria-hidden="true"><defs>${made.defs}</defs><rect width="${width}" height="${height}" fill="${made.ink.base}"/>${made.body}</svg>`;
      const context = await browser.newContext({ viewport: { width, height: height + 40 }, colorScheme: scheme, deviceScaleFactor: 1.25, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}/`);
      await page.waitForSelector("#stage svg");
      await page.evaluate(async ({ source, cols, width, height, ground }) => {
        const dist = "/dist/index.js";
        const D = await import(dist);
        const box = document.createElement("div");
        box.id = "scene";
        box.style.cssText = `position:relative;width:${width}px;height:${height}px;overflow:hidden;font:600 11px system-ui,sans-serif`;
        box.innerHTML = `${ground}<div id="cells" style="position:relative;z-index:1;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:minmax(0,1fr);align-items:stretch;height:100%;padding:10px;box-sizing:border-box"></div>`;
        document.body.replaceChildren(box);
        const draw = new Function("D", "yaw", `return (${source})(D, yaw)`);
        const w = window as unknown as { paint: (yaw: number) => void };
        w.paint = (yaw) => { document.getElementById("cells")!.innerHTML = draw(D, yaw); };
      }, { source: scene.make.toString(), cols: scene.cols, width, height, ground });
      const dir = join(work, `${scene.name}-${scheme}`);
      mkdirSync(dir);
      const files: string[] = [];
      for (let i = 0; i < frames; i++) {
        await page.evaluate((yaw) => (window as unknown as { paint: (yaw: number) => void }).paint(yaw), (i * 360) / frames - 180);
        const file = join(dir, `${String(i).padStart(3, "0")}.png`);
        writeFileSync(file, await page.locator("#scene").screenshot({ type: "png" }));
        files.push(file);
      }
      const target = join(out, `${scene.name}-${scheme}.webp`);
      const run = spawnSync("img2webp", ["-loop", "0", "-lossy", "-q", String(quality), "-m", "6", "-d", String(delay), ...files, "-o", target], { encoding: "utf8" });
      if (run.status !== 0) throw new Error(`img2webp failed: ${run.stderr}`);
      const size = statSync(target).size;
      if (size > MAX_BYTES) throw new Error(`${target} is ${size} bytes, over 1.5 MB: lower FRAMES or QUALITY`);
      console.log(`ok   ${scene.name}-${scheme}.webp  ${Math.round(size / 1024)} kB, ${frames} frames`);
      await context.close();
    }
  }
  await browser.close();
} finally {
  server.kill();
  rmSync(work, { recursive: true, force: true });
}
