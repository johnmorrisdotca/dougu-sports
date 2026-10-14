// Draws a sheet of the emblems that used to be cut off, at the angles where they were cut off most, so that the clipping can be looked at: each drawing is an image of the size the SVG says, with a thin frame round it,
// so whatever the view box cuts off is missing at the frame. Chromium draws it (Playwright is a dev dependency). Run it from a checkout, before and after a change, and compare the two:
//
//   node scripts/turn-sheet.ts <out.png> [--scale=2]
import { writeFileSync } from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const out = args.find((a) => !a.startsWith("--")) ?? "turn-sheet.png";
const D = (await import(pathToFileURL(join(process.cwd(), "src/index.ts")).href)) as typeof import("../src/index.ts");

const SIZE = 150;
/** The worst angle of each cup, found by sweeping every 5 degrees of yaw and the whole of the tilt (scripts/turn-boxes.ts), and the pieces of flat art whose still drawing reaches past the box. */
const CUPS: [string, number, number][] = [
  ["trophy:sumo-cup", 90, 60],
  ["trophy:canadian-bowl", 0, 60],
  ["trophy:baseball", 0, 60],
  ["trophy:globe", 0, 60],
  ["trophy:hockey-cup", 0, 60],
  ["trophy:rugby-cup", 90, 60],
  ["trophy:bowl", 0, 60],
  ["trophy:tennis-plate", 0, 40],
  ["trophy:soccer-ball", 0, 60],
  ["trophy:tennis-cup", 90, 60],
];
const FLATS = ["gear:swim-goggles", "gear:figure-skate", "gear:diving-board", "gear:speed-skate", "gear:gunbai", "sport:athletics", "sport:sumo"];

const cell = (svg: string, caption: string) => `<figure><img width="${SIZE}" height="${SIZE}" src="data:image/svg+xml;utf8,${encodeURIComponent(svg)}"><figcaption>${caption}</figcaption></figure>`;
let html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#fff;font:11px system-ui;color:#222}h2{font-size:13px;margin:10px 12px 2px}.row{display:flex;gap:8px;margin:4px 12px;align-items:flex-start}.name{width:120px;padding-top:60px}figure{margin:0}img{outline:1px dashed #b33;outline-offset:0;background:#fff}figcaption{text-align:center;color:#666}</style>`;
html += `<h2>A cup at the angle where it was cut off most: the still, and the same turn in metal and in line. The red dashes are the edge of the drawing.</h2>`;
for (const [id, yaw, pitch] of CUPS) {
  html += `<div class="row"><div class="name">${id}</div>`;
  html += cell(D.renderEmblem(id, { size: SIZE, theme: "light" }), "still");
  html += cell(D.emblemFrame(id, { size: SIZE, theme: "light", yaw, pitch }), `yaw ${yaw}, pitch ${pitch}`);
  html += cell(D.emblemFrame(id, { size: SIZE, theme: "light", yaw, pitch, style: "line" }), "line");
  html += cell(D.emblemFrame(id, { size: SIZE, theme: "light", yaw: 0, pitch: 0 }), "yaw 0, pitch 0");
  html += `</div>`;
}
html += `<h2>Flat art whose still drawing reached past its box, in metal and in line, and turned.</h2>`;
for (const id of FLATS) {
  html += `<div class="row"><div class="name">${id}</div>`;
  html += cell(D.renderEmblem(id, { size: SIZE, theme: "light" }), "still");
  html += cell(D.renderEmblem(id, { size: SIZE, theme: "light", style: "line" }), "line");
  html += cell(D.emblemFrame(id, { size: SIZE, theme: "light", yaw: 12, pitch: 0, style: "line" }), "line, yaw 12");
  html += cell(D.emblemFrame(id, { size: SIZE, theme: "light", yaw: 40, pitch: 0 }), "yaw 40");
  html += `</div>`;
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 4 * (SIZE + 8) + 160, height: 800 }, deviceScaleFactor: Number(flags.scale ?? 2) });
await page.setContent(html);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
writeFileSync(out, await page.screenshot({ fullPage: true }));
await browser.close();
console.log(out);
