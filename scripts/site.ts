// Builds the static demo for GitHub Pages into ./site: the page (made by page.ts from the family's shared header and footer), its scripts and styles, the gallery, and the compiled library beside them.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

import { build } from "esbuild";

import { DEMO_SCRIPTS, backgroundsModule, demoScript, renderBrands, renderCompose, renderGallery, renderIndex } from "./page.ts";

rmSync("site", { recursive: true, force: true });
mkdirSync("site", { recursive: true });
// The scripts are TypeScript: they are built below, and the sources stay out of the site.
cpSync("demo", "site", { recursive: true, filter: (from) => !/\.ts$/.test(from) });
// The declarations are for editors, not for a browser.
cpSync("dist", "site/dist", { recursive: true, filter: (from) => !/\.d\.ts$/.test(from) });
// The shared parts (a dev dependency, used only by the demo) are served beside the pages.
cpSync("node_modules/@johnmorrisdotca/kazoku-ui/dist", "site/kazoku-ui", { recursive: true, dereference: true, filter: (from) => !/\.d\.ts$/.test(from) });
// The documentation site's header has the family's language picker and theme switch: one small module for its pages.
writeFileSync("site/kazoku-parts.src.js", `import "@johnmorrisdotca/kazoku-ui/language-picker/define";\nimport "@johnmorrisdotca/kazoku-ui/theme-switch/define";\n`);
await build({ entryPoints: ["site/kazoku-parts.src.js"], outfile: "site/kazoku-parts.js", bundle: true, format: "esm", minify: true, logLevel: "silent", absWorkingDir: process.cwd() });
rmSync("site/kazoku-parts.src.js");
writeFileSync("site/index.html", renderIndex());
writeFileSync("site/gallery.html", await renderGallery());
writeFileSync("site/compose.html", renderCompose());
writeFileSync("site/brands.html", renderBrands());
writeFileSync("site/family-backgrounds.js", backgroundsModule());
for (const name of DEMO_SCRIPTS) writeFileSync(`site/${name}.js`, await demoScript(name));
console.log("site/ is ready");
