// Draws a contact sheet of emblems as a PNG, so the drawings can be looked at: each emblem in the metal style at 256, 64 and 16 pixels, in the line style at 64 and 16 and in flat colour at 64, on a light
// page and on a dark one. Chromium draws it (Playwright is already a dev dependency), so the pictures are what a browser makes of the markup.
//
//   node scripts/emblem-sheet.ts <out.png> [id-or-prefix ...] [--turn] [--yaw=40] [--scale=2]
//
// The ids are matched against the built package's EMBLEM_IDS (`trophy:` takes every trophy); a path under src/emblems (`trophy/hockey-cup`) takes the emblem that module exports, built or not.
// `--turn` adds a row of five yaws (-120 to 120) in the metal style. With `--grid --size=14 --style=line` every emblem goes in rows at one size and style, on light and on dark.
import { writeFileSync } from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { chromium } from "@playwright/test";

import type { Emblem, EmblemOptions, EmblemStyle } from "../src/emblems/emblem.core.ts";

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const rest = args.filter((a) => !a.startsWith("--"));
const out = rest.shift() ?? "emblems.png";
const root = process.cwd();

/** The emblems asked for: by id or prefix from the registry, or by module path. */
async function emblems(): Promise<Emblem[]> {
  const found: Emblem[] = [];
  const paths = rest.filter((a) => a.includes("/") && !a.includes(":"));
  const ids = rest.filter((a) => !paths.includes(a));
  for (const path of paths) {
    const module = (await import(`${pathToFileURL(join(root, "src/emblems", `${path}.ts`)).href}?${Date.now()}`)) as Record<string, unknown>;
    for (const value of Object.values(module)) if (value && typeof value === "object" && typeof (value as Emblem).svg === "function") found.push(value as Emblem);
  }
  if (ids.length > 0 || paths.length === 0) {
    const { EMBLEM_TABLE } = (await import(pathToFileURL(join(root, "src/emblems/emblem.registry.ts")).href)) as typeof import("../src/emblems/emblem.registry.ts");
    const { EMBLEM_IDS } = (await import(pathToFileURL(join(root, "src/emblems/emblem.ids.ts")).href)) as typeof import("../src/emblems/emblem.ids.ts");
    for (const id of EMBLEM_IDS) if (ids.length === 0 || ids.some((p) => id.startsWith(p))) found.push(EMBLEM_TABLE[id]);
  }
  return found;
}

const list = await emblems();
const yaw = flags.yaw === undefined ? 0 : Number(flags.yaw);
const draw = (e: Emblem, o: EmblemOptions) => (yaw === 0 ? e.svg(o) : e.frame({ ...o, yaw }));
const PAGE = { light: "#ffffff", dark: "#14181c" };
const text = { light: "#20262d", dark: "#eef1f3" };
let html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#e6e6e6;font:12px system-ui;color:#222}.row{display:flex;gap:10px;margin:8px;align-items:center}.name{width:150px}.panel{display:flex;gap:14px;align-items:center;padding:8px 12px}.panel svg{display:block}.light{background:#fff}.dark{background:#14181c;color:#eef1f3}</style>`;
if ("grid" in flags) {
  const size = Number(flags.size ?? 16);
  const style = (flags.style ?? "line") as EmblemStyle;
  for (const theme of ["light", "dark"] as const) {
    html += `<div class="panel ${theme}" style="flex-wrap:wrap;width:${17 * (size + 14)}px">${list.map((e) => draw(e, { style, size, theme })).join("")}</div>`;
  }
} else {
  for (const e of list) {
    html += `<div class="row"><div class="name">${e.id}<br>${e.kind}</div>`;
    for (const theme of ["light", "dark"] as const) {
      html += `<div class="panel ${theme}">`;
      const looks: [EmblemStyle, number][] = [["metal", 256], ["metal", 64], ["metal", 16], ["line", 64], ["line", 16], ["color", 64]];
      for (const [style, size] of looks) html += draw(e, { style, size, theme });
      html += `</div>`;
    }
    if ("turn" in flags) {
      html += `<div class="panel light">${[-120, -60, 0, 60, 120].map((y) => e.frame({ yaw: y, size: 72 })).join("")}</div>`;
    }
    html += `</div>`;
  }
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(flags.width ?? 1500), height: 400 }, deviceScaleFactor: Number(flags.scale ?? 2) });
await page.setContent(html);
const png = await page.screenshot({ fullPage: true });
await browser.close();
writeFileSync(out, png);
process.stdout.write(`${list.length} emblems -> ${out}\n`);
void text;
void PAGE;
