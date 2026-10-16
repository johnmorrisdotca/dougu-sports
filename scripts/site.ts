// Builds the static demo for GitHub Pages into ./site: the page (made by page.ts from the family's shared header and footer), its scripts and styles, the gallery, and the compiled library beside them.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

import { DEMO_SCRIPTS, backgroundsModule, demoScript, renderBrands, renderCompose, renderGallery, renderIndex } from "./page.ts";

rmSync("site", { recursive: true, force: true });
mkdirSync("site", { recursive: true });
// The scripts are TypeScript: they are built below, and the sources stay out of the site.
cpSync("demo", "site", { recursive: true, filter: (from) => !/\.ts$/.test(from) });
// The declarations are for editors, not for a browser.
cpSync("dist", "site/dist", { recursive: true, filter: (from) => !/\.d\.ts$/.test(from) });
writeFileSync("site/index.html", renderIndex());
writeFileSync("site/gallery.html", await renderGallery());
writeFileSync("site/compose.html", renderCompose());
writeFileSync("site/brands.html", renderBrands());
writeFileSync("site/family-backgrounds.js", backgroundsModule());
for (const name of DEMO_SCRIPTS) writeFileSync(`site/${name}.js`, await demoScript(name));
console.log("site/ is ready");
