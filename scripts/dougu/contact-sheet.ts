// Draws a contact sheet of every ball and every piece of gear, at 256, 64 and 16 pixels in colour and at 64 and 16 pixels as a line drawing, on a light page and a dark one, with a real browser.
// `pnpm build && node scripts/dougu/contact-sheet.ts [outDir]` (the default is docs/pieces). It writes balls-light.png, balls-dark.png, gear-light.png and gear-dark.png (PNG; the copies in docs/pieces are WebP, made from them).
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

import type { Piece } from "../../src/emblems/ball/ball.core.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = resolve(process.argv[2] ?? join(root, "docs", "pieces"));
mkdirSync(out, { recursive: true });
const { BALLS } = (await import(pathToFileURL(join(root, "dist", "emblems", "ball", "ball.index.js")).href)) as typeof import("../../src/emblems/ball/ball.index.ts");
const { GEARS } = (await import(pathToFileURL(join(root, "dist", "emblems", "gear", "gear.index.js")).href)) as typeof import("../../src/emblems/gear/gear.index.ts");

const PAGE = { light: { bg: "#ffffff", ink: "#20262d", sub: "#5a6270", line: "#e3e6ea" }, dark: { bg: "#14181c", ink: "#eef1f3", sub: "#9aa3ae", line: "#2a3038" } };

function sheet(pieces: readonly Piece[], theme: "light" | "dark") {
  const c = PAGE[theme];
  const cell = (p: Piece) =>
    `<figure><div class="big">${p.svg({ size: 256 })}</div><div class="row"><span>${p.svg({ size: 64 })}</span><span>${p.svg({ size: 16 })}</span><span>${p.svg({ size: 64, style: "line" })}</span><span>${p.svg({ size: 16, style: "line" })}</span></div><figcaption>${p.id}</figcaption></figure>`;
  return `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:16px;background:${c.bg};color:${c.ink};font:12px/1.3 system-ui,sans-serif}
.grid{display:grid;grid-template-columns:repeat(5,288px);gap:12px}
figure{margin:0;padding:8px;border:1px solid ${c.line};border-radius:8px}
.big{height:256px;width:256px;margin:0 auto}
.row{display:flex;gap:14px;align-items:center;justify-content:center;margin-top:8px;height:64px}
figcaption{text-align:center;color:${c.sub};margin-top:6px}
</style><body><div class="grid">${pieces.map(cell).join("")}</div>`;
}

const browser = await chromium.launch();
const sets: [string, readonly Piece[]][] = [["balls", BALLS], ["gear", GEARS]];
for (const [name, pieces] of sets) {
  for (const theme of ["light", "dark"] as const) {
    const page = await browser.newPage({ viewport: { width: 1520, height: 900 }, deviceScaleFactor: 1 });
    await page.setContent(sheet(pieces, theme));
    const file = join(out, `${name}-${theme}.png`);
    await page.screenshot({ path: file, fullPage: true });
    await page.close();
    console.log(file);
  }
}
await browser.close();
