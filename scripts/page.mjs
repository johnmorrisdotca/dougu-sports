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

const escape = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

/** The gallery: every emblem in every style, and the turning ones in five views. Made from the built package, so it needs `pnpm build` first. */
export async function renderGallery() {
  const D = await import(new URL("../dist/index.js", import.meta.url).href);
  const sections = Object.entries(D.EMBLEM_GROUPS)
    .filter(([, ids]) => ids.length > 0)
    .map(([group, ids]) => {
      const cards = ids
        .map((emblem) => {
          const info = D.emblemInfo(emblem);
          const styles = D.EMBLEM_STYLES.map((style) => `<figure>${D.renderEmblem(emblem, { style, size: 72 })}<figcaption>${style}</figcaption></figure>`).join("");
          const turning = info.kind === "icon" ? "" : `<div class="turns" aria-label="${escape(info.en)} turned">${[-120, -60, 0, 60, 120].map((yaw) => D.emblemFrame(emblem, { yaw, size: 48 })).join("")}</div>`;
          return `<li id="${escape(emblem.replace(":", "-"))}"><h3>${escape(info.en)} <span lang="ja">${escape(info.ja)}</span></h3><p><code>${escape(emblem)}</code> · ${info.kind} · ${info.source}</p><div class="styles">${styles}</div>${turning}</li>`;
        })
        .join("");
      return `<section class="more" aria-labelledby="g-${group}"><h2 id="g-${group}">${group}</h2><ul class="cards">${cards}</ul></section>`;
    })
    .join("\n");
  const body = `<main>\n<!--family:header-->\n<p class="note"><a href="./">Back to the playground</a>. Every emblem in the package, in each style, and turned. This page is made by <code>scripts/make-gallery.mjs</code> from the built package.</p>\n${sections}\n<!--family:unreviewed-->\n<!--family:footer-->\n</main>\n<!--family:scripts none-->`;
  const html = `<!doctype html>\n<html lang="en">\n<head>\n  <!--family:head-->\n  <link rel="stylesheet" href="family.css" />\n  <link rel="stylesheet" href="demo.css" />\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  return withFamily(html, { title: "Gallery · Dougu Sports 道具", description: "Every emblem of Dougu Sports in each style, and turned." });
}
