// The demo's pages, made from demo/index.html and the family's shared head, header, footer and language chooser (family-template.mjs), and the gallery, made from the built package. The Pages build
// (site.ts) writes them into site/, and the dev server (dev.ts) serves the same text, so the tests play the page that is published.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { build, transformSync } from "esbuild";
import type { Plugin } from "esbuild";

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
    spin: "Auto-turn",
    play: "Auto-turn",
    stop: "Stop",
    slow: "Slow",
    medium: "Medium",
    fast: "Fast",
    hint: "Drag the emblem, or use the sliders or the arrow keys, to turn it.",
    caseHeading: "A trophy case",
    caseNote: "Each one turns when you press its button, or when you drag it. Nothing moves by itself.",
  },
  ja: {
    pitch: "トロフィー、メダル、紋章、ボールや用具など、スポーツのエンブレムをSVGで描きます。",
    name: "道具（どうぐ）は、何かをするために使うものです。",
    nameLink: "名前について",
    foot: "スポーツのエンブレムをSVGで描きます。依存パッケージはありません。",
    spin: "自動回転",
    play: "自動回転",
    stop: "停止",
    slow: "遅い",
    medium: "ふつう",
    fast: "速い",
    hint: "エンブレムは、ドラッグするか、スライダーや矢印キーで回せます。",
    caseHeading: "トロフィーケース",
    caseNote: "それぞれのボタンを押すか、エンブレムをドラッグすると回ります。自動では動きません。",
  },
};

/** A page's text with the family's blocks put in where its comments say. */
function withFamily(html: string, { title, description }: { title: string; description: string }) {
  return html
    .replace("<!--family:head-->", familyHead({ id, title, description }))
    .replace("<!--family:header-->", familyHeader({ id }))
    .replace("<!--family:unreviewed-->", familyUnreviewed({ id }))
    .replace("<!--family:footer-->", familyFooter({ id }))
    .replace(
      /<!--family:scripts ([\w.-]+)-->/,
      (_: string, script: string) => `<script>${FAMILY_SCRIPT}</script>\n<script>var familyPage = familyLanguage({ id: ${JSON.stringify(id)}, words: ${JSON.stringify(WORDS)} });</script>${script === "none" ? "" : `\n<script type="module" src="${script}"></script>`}`,
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
  const D = (await import(new URL("../dist/index.js", import.meta.url).href)) as typeof import("../src/index.ts");
  const japan = new Set<string>(D.JAPANESE_IDS);
  const nav = [...Object.entries(D.EMBLEM_GROUPS).map(([group, ids]) => [group, group, ids.filter((id) => !japan.has(id)).length] as const), ["japan", "Japanese sports", D.JAPANESE_IDS.length] as const]
    .filter(([, , count]) => count > 0)
    .map(([key, title, count]) => `<a href="#g-${key}">${title} <span>${count}</span></a>`)
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

/** The page for the composing functions: the podium, the award case, a sprite sheet, a data address and a sport's equipment, drawn in the browser from the built package. */
export function renderCompose() {
  const body = `<main>
<!--family:header-->
<p class="note"><a href="./">Back to the playground</a>. The podium, the award case, sprite sheets, data addresses and a sport's equipment, each drawn in your browser from <code>dist/index.js</code>, with the call that made it and a button that copies it.</p>
<div class="fam-panel controls">
  <div class="fam-row"><span class="fam-label">Look</span>
    <div class="fam-seg" role="group" aria-label="Look" id="look" data-testid="look"><button type="button" data-value="inherit">Page</button><button type="button" data-value="light">Light</button><button type="button" data-value="dark">Dark</button></div></div>
  <div class="fam-row"><span class="fam-label">Words</span>
    <div class="fam-seg" role="group" aria-label="Language of the titles" id="locale" data-testid="locale"><button type="button" data-value="en">English</button><button type="button" data-value="ja">日本語</button></div></div>
</div>
<div class="compose-grid" id="cards"></div>
<!--family:unreviewed-->
<!--family:footer-->
</main>
<!--family:scripts compose.js-->`;
  const html = `<!doctype html>\n<html lang="en">\n<head>\n  <!--family:head-->\n  <link rel="stylesheet" href="family.css" />\n  <link rel="stylesheet" href="demo.css" />\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  return withFamily(html, { title: "Podium, award case and sprites · Dougu Sports 道具", description: "A podium, an award case, sprite sheets, data addresses and a sport's equipment, drawn from Dougu Sports." });
}

/** The scripts of the demo's pages: demo/<name>.ts, served and published as <name>.js. */
export const DEMO_SCRIPTS = ["demo", "compose", "gallery"];

/**
 * The files a demo script imports for their types, and the files the browser loads in their place: the script imports ../src/index.ts, so that the editor and `pnpm typecheck` see the package's types,
 * and the page imports ./dist/index.js, the package as it is built and published. esbuild leaves the import in place and only changes its address.
 */
const AS_BUILT: Record<string, string> = { "src/index.ts": "./dist/index.js", "scripts/family-backgrounds.ts": "./family-backgrounds.js" };
const asBuilt: Plugin = {
  name: "as-built",
  setup(b) {
    b.onResolve({ filter: /^\.\.\/(src|scripts)\// }, (args) => {
      const target = AS_BUILT[args.path.slice(3)];
      return target === undefined ? undefined : { path: target, external: true };
    });
  },
};

/** One of the demo's scripts (demo/<name>.ts) as the JavaScript a browser runs. */
export async function demoScript(name: string): Promise<string> {
  const built = await build({ entryPoints: [fileURLToPath(new URL(`../demo/${name}.ts`, import.meta.url))], bundle: true, write: false, format: "esm", target: "es2022", plugins: [asBuilt], logLevel: "silent" });
  return built.outputFiles[0].text;
}

/** The family's background module as the plain JavaScript the demo's preview imports when a background is chosen (the module is TypeScript, copied from taisen-brackets into scripts/; the demo is the only thing that loads it). */
export function backgroundsModule() {
  return transformSync(readFileSync(new URL("family-backgrounds.ts", import.meta.url), "utf8"), { loader: "ts", format: "esm" }).code;
}
