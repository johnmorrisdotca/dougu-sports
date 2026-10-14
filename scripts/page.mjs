// The demo's pages, made from demo/index.html and the family's shared head, header, footer and language chooser (family-template.mjs), and the gallery, made from the built package. The Pages build
// (site.mjs) writes them into site/, and the dev server (dev.mjs) serves the same text, so the tests play the page that is published.
import { readFileSync } from "node:fs";

import { FAMILY_SCRIPT, familyFooter, familyHead, familyHeader, familyUnreviewed } from "./family-template.mjs";

const id = "dougu-sports";
const TITLE = "Dougu Sports 道具: sports emblems as SVG";
const DESCRIPTION = "Trophies, medals, crests, and the ball and gear of every sport as SVG strings, in metal, line or flat colour, light and dark, with optional 3D turning. Zero dependencies.";

/** The words the shared header and footer say for this page, in both languages. The playground below them is English. */
const WORDS = {
  en: {
    pitch: "Sports emblems as SVG: trophies, medals, crests, balls and gear.",
    name: "Dougu (道具, どうぐ) is Japanese for equipment: the things a task is done with.",
    nameLink: "The name",
    foot: "Sports emblems as SVG, with no dependencies.",
  },
  ja: {
    pitch: "トロフィー、メダル、紋章、ボールや用具など、スポーツのエンブレムをSVGで描きます。",
    name: "道具（どうぐ）は、何かをするために使うものです。",
    nameLink: "名前について",
    foot: "スポーツのエンブレムをSVGで描きます。依存パッケージはありません。",
  },
};

/** A page's text with the family's blocks put in where its comments say. */
function withFamily(html, { title, description }) {
  return html
    .replace("<!--family:head-->", familyHead({ id, title, description }))
    .replace("<!--family:header-->", familyHeader({ id }))
    .replace("<!--family:unreviewed-->", familyUnreviewed({ id }))
    .replace("<!--family:footer-->", familyFooter({ id }))
    .replace(
      /<!--family:scripts ([\w.-]+)-->/,
      (_, script) => `<script>${FAMILY_SCRIPT}</script>\n<script>familyLanguage({ id: ${JSON.stringify(id)}, words: ${JSON.stringify(WORDS)} });</script>${script === "none" ? "" : `\n<script type="module" src="${script}"></script>`}`,
    );
}

/** demo/index.html, the playground. */
export function renderIndex() {
  return withFamily(readFileSync(new URL("../demo/index.html", import.meta.url), "utf8"), { title: TITLE, description: DESCRIPTION });
}

/**
 * The gallery: every emblem with its id, in each style, turned, with buttons that copy its id and the call that draws it. The page is a shell: demo/gallery.js draws the cards from the built package in the
 * browser, so the page stays light and cannot fall behind the package. A reader without script has docs/gallery.md, the same list as text. Needs `pnpm build` first, as the page imports ./dist.
 */
export async function renderGallery() {
  const D = await import(new URL("../dist/index.js", import.meta.url).href);
  const nav = Object.entries(D.EMBLEM_GROUPS)
    .filter(([, ids]) => ids.length > 0)
    .map(([group, ids]) => `<a href="#g-${group}">${group} <span>${ids.length}</span></a>`)
    .join(" ");
  const body = `<main>
<!--family:header-->
<p class="note"><a href="./">Back to the playground</a>. Every emblem in the package, in each style and turned, with its id and a button that copies it. The pictures are drawn in your browser from <code>dist/index.js</code>; the same list as text is <a href="https://github.com/johnmorrisdotca/dougu-sports/blob/main/docs/gallery.md">docs/gallery.md</a>.</p>
<div class="finder">
  <label class="fam-label" for="find">Find</label>
  <input class="fam-field" id="find" type="search" placeholder="hockey, medal, crest:shield" autocomplete="off" data-testid="find" />
  <p class="count" id="count" role="status" aria-live="polite"></p>
</div>
<nav class="chips" aria-label="Groups">${nav}</nav>
<div id="sections"><noscript><p>The gallery is drawn by a script. The list of every id, as text, is <a href="https://github.com/johnmorrisdotca/dougu-sports/blob/main/docs/gallery.md">docs/gallery.md</a>.</p></noscript></div>
<!--family:unreviewed-->
<!--family:footer-->
</main>
<!--family:scripts gallery.js-->`;
  const html = `<!doctype html>\n<html lang="en">\n<head>\n  <!--family:head-->\n  <link rel="stylesheet" href="family.css" />\n  <link rel="stylesheet" href="demo.css" />\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  return withFamily(html, { title: "Gallery · Dougu Sports 道具", description: "Every emblem of Dougu Sports in each style, and turned, with its id and a button that copies it." });
}
