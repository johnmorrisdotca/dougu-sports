// Builds the static demo for GitHub Pages into ./site: the page (made by page.ts from the family's shared header and footer), its scripts and styles, the gallery, and the compiled library beside them.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

import { build } from "esbuild";

import { publishThumbnails, thumbnailHead } from "./family-thumbnail.mjs";
import { DEMO_SCRIPTS, backgroundsModule, demoScript, renderBrands, renderCompose, renderGallery, renderIndex } from "./page.ts";

/** What the family's card shows (scripts/screenshots.ts makes it): the words of og:image:alt and of the README's top picture. */
const ALT = "Dougu Sports: a soccer ball, a baseball glove, a gold cup with two handles, a basketball and a tennis racket, drawn as SVG.";

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
// The demo's page carries the family's card in its <head> (og:image, twitter:image, the icon); the three pictures are published beside it.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
writeFileSync("site/index.html", renderIndex().replace("</head>", `  ${thumbnailHead(pkg, { alt: ALT })}\n</head>`));
publishThumbnails(".", "site");
writeFileSync("site/gallery.html", await renderGallery());
writeFileSync("site/compose.html", renderCompose());
writeFileSync("site/brands.html", renderBrands());
writeFileSync("site/family-backgrounds.js", backgroundsModule());
for (const name of DEMO_SCRIPTS) writeFileSync(`site/${name}.js`, await demoScript(name));
console.log("site/ is ready");
