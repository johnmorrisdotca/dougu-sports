// Writes docs/gallery.md, the list of every emblem the built package holds: its id, names, kind, source and the import that takes that one emblem alone. Made from the package, so it cannot fall
// behind the code.
//
//   node scripts/make-gallery.mjs           rewrite docs/gallery.md (build first: `pnpm gallery` does)
//   node scripts/make-gallery.mjs --check   exit 1, and say so, when docs/gallery.md is not what the package makes
//
// The pictures are on the demo's gallery page (`pnpm dev`, then /gallery.html): GitHub does not draw inline SVG, so this page is the text of it.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import process from "node:process";
import { URL } from "node:url";

const D = await import(new URL("../dist/index.js", import.meta.url).href);
const NAME = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).name;

const rows = Object.entries(D.EMBLEM_GROUPS).map(([group, ids]) => {
  const folder = D.EMBLEM_FOLDERS[group];
  const body = ids.length === 0
    ? "_No emblems yet._"
    : ["| Id | English | 日本語 | Kind | Source | Import one |", "| --- | --- | --- | --- | --- | --- |", ...ids.map((id) => {
        const info = D.emblemInfo(id);
        return `| \`${id}\` | ${info.en} | ${info.ja} | ${info.kind} | ${info.source} | \`${NAME}/${folder}/${id.split(":")[1]}\` |`;
      })].join("\n");
  return `## ${group}\n\n${body}\n`;
});

const text = `# Gallery

[Back to the README](../README.md). Every emblem in the package, by group: ${D.EMBLEM_IDS.length} so far. The pictures are on the demo's gallery page; this list is the text of it, made by \`scripts/make-gallery.mjs\` from the built package (\`pnpm gallery\`).

Ids are \`<group>:<name>\`. The folders the art lives in are in [layout.md](layout.md).

${rows.join("\n")}`;

const file = new URL("../docs/gallery.md", import.meta.url);
if (process.argv.includes("--check")) {
  if (!existsSync(file) || readFileSync(file, "utf8") !== text) {
    console.error("docs/gallery.md is not what the package makes: run `pnpm gallery`");
    process.exit(1);
  }
  console.log("ok   docs/gallery.md is what the package makes");
} else {
  writeFileSync(file, text);
  console.log(`docs/gallery.md: ${D.EMBLEM_IDS.length} emblems`);
}
