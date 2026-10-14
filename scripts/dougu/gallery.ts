// Writes the gallery page of the balls and the gear. `pnpm build && node scripts/dougu/gallery.ts [outFile] [libBase]`: the page is written to `site/pieces.html` by default and finds the built
// library at `./dist` beside it (`pnpm site` puts it there); give a different `libBase` if you put the page somewhere else.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { galleryHtml } from "./gallery-page.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = resolve(process.argv[2] ?? join(root, "site", "pieces.html"));
const { BALLS, lineup } = await import(pathToFileURL(join(root, "dist", "emblems", "ball", "ball.index.js")).href);
const { GEARS } = await import(pathToFileURL(join(root, "dist", "emblems", "gear", "gear.index.js")).href);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, galleryHtml({ BALLS, GEARS, lineup }, process.argv[3] ?? "./dist"));
console.log(out);
