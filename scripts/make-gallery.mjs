// Writes docs/gallery.md (English) and docs/gallery.ja.md (Japanese), the list of every emblem the built package holds: its id, name, kind, source and description, each page in one language only. The constant
// and the import follow from the id by a rule stated once at the top of each page, and this script checks that the rule holds for every emblem. Made from the package, so it cannot fall behind the code.
//
//   node scripts/make-gallery.mjs           rewrite both pages (build first: `pnpm gallery` does)
//   node scripts/make-gallery.mjs --check   exit 1, and say so, when either page is not what the package makes
//
// The pictures are on the demo's gallery page (`pnpm dev`, then /gallery.html): GitHub does not draw inline SVG, so this page is the text of it.
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import process from "node:process";
import { URL } from "node:url";

const D = await import(new URL("../dist/index.js", import.meta.url).href);
const NAME = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).name;

const DIST = new URL("../dist/emblems/", import.meta.url);
/** The module of a folder that exports a constant. */
const moduleOf = (folder, constant) => readdirSync(new URL(`${folder}/`, DIST)).find((file) => file.endsWith(".js") && new RegExp(`export const ${constant} =`).test(readFileSync(new URL(`${folder}/${file}`, DIST), "utf8")))?.slice(0, -3);

/** Folders whose items share modules named for the family (`ball/ball.soccer`), so that the import of one is not its id. */
const FAMILY_FOLDERS = new Set(["ball", "gear"]);
/** The one id whose constant is not the id's name: the plain squash ball is the double-yellow-dot one. */
const OTHER_NAME = { "ball:squash": "BALL_SQUASH_DOUBLE_YELLOW" };

/** The words of a page, one set for each language; the rows are the same data. */
const PAGES = {
  en: {
    file: "gallery.md",
    head: ["Id", "English", "Kind", "Source", "Description"],
    top: (count) => `# Gallery\n\n[Back to the README](../README.md) · [日本語](gallery.ja.md) · English\n\nEvery emblem in the package, by group: ${count} of them. The pictures are on the demo's gallery page; this list is the text of it, made by \`scripts/make-gallery.mjs\` from the built package (\`pnpm gallery\`).`,
    rule: `Ids are \`<group>:<name>\`. The constant and the import follow from the id, so they are not repeated in every row:

- The constant is the id in capitals with \`:\` and \`-\` made \`_\`: \`trophy:lidded-cup\` → \`TROPHY_LIDDED_CUP\`. One id breaks it: \`ball:squash\` is \`BALL_SQUASH_DOUBLE_YELLOW\`, the double-yellow-dot ball.
- Import one alone from \`${NAME}/<group>/<name>\`: \`trophy:lidded-cup\` → \`${NAME}/trophy/lidded-cup\`. This holds for award, trophy, medal, crest, sport and pennant.
- Balls and gear are made in family modules, several to a file, so their import is \`${NAME}/ball/ball.<file>\` (or \`gear/gear.<file>\`), with the family named in [layout.md](layout.md) (the squash balls are in \`ball/ball.squash\`); the constant above is also exported from the main entry.

The printed pucks (\`puck:*\`) are made in one family module, \`${NAME}/ball/ball.puck.print\`, and take a \`face\` option ([pucks.md](pucks.md)).

The folders the art lives in are in [layout.md](layout.md).`,
    none: "_No emblems yet._",
    name: (info) => info.en,
    description: (info) => info.description?.en ?? "",
  },
  ja: {
    file: "gallery.ja.md",
    head: ["Id", "日本語", "種類", "出どころ", "説明"],
    top: (count) => `# ギャラリー\n\n[README に戻る](../README.md) · 日本語 · [English](gallery.md)\n\nパッケージに含まれるすべてのエンブレムを、グループごとに並べた一覧です（全 ${count} 点）。画像はデモのギャラリーページで見られます。この一覧はそのテキスト版で、ビルド済みのパッケージから \`scripts/make-gallery.mjs\` が生成します（\`pnpm gallery\`）。`,
    rule: `id は \`<グループ>:<名前>\` の形です。定数とインポートパスは id から決まるので、行ごとには書いていません。

- 定数は、id を大文字にし、\`:\` と \`-\` を \`_\` に置き換えたものです。\`trophy:lidded-cup\` → \`TROPHY_LIDDED_CUP\`。例外は 1 つだけで、\`ball:squash\` は \`BALL_SQUASH_DOUBLE_YELLOW\`（黄色い点が 2 つ付いたボール）です。
- 1 つだけインポートするときは、\`${NAME}/<グループ>/<名前>\` を指定します。\`trophy:lidded-cup\` → \`${NAME}/trophy/lidded-cup\`。award、trophy、medal、crest、sport、pennant は、すべてこの形でインポートできます。
- ball と gear は、ファミリーごとのモジュールにまとめてあり、1 つのファイルに複数のエンブレムが入っています。そのため、インポートのパスは \`${NAME}/ball/ball.<ファイル>\`（gear は \`gear/gear.<ファイル>\`）になります。ファミリーの名前は [layout.md](layout.md)（英語）に載っています（スカッシュのボールは \`ball/ball.squash\`）。上の定数は、パッケージのメインエントリからもインポートできます。

印刷パック（\`puck:*\`）は 1 つのファミリーモジュール \`${NAME}/ball/ball.puck.print\` にまとめてあり、\`face\` オプションを受け取ります（[pucks.ja.md](pucks.ja.md)）。

エンブレムのソース（元の画像）が入っているフォルダーは、[layout.md](layout.md)（英語）にまとめてあります。`,
    none: "_まだエンブレムはありません。_",
    name: (info) => info.ja,
    description: (info) => info.description?.ja ?? "",
  },
};

/** The rows of every group, checked against the rule that the text above the tables states. */
const check = (id, folder) => {
  const constant = OTHER_NAME[id] ?? id.replace(/[:-]/g, "_").toUpperCase();
  const name = id.slice(id.indexOf(":") + 1);
  if (D[constant]?.id !== id) throw new Error(`${id} is not exported as ${constant}, the name the gallery states`);
  if (!FAMILY_FOLDERS.has(folder) && moduleOf(folder, constant) !== name) throw new Error(`${id} is not in ${folder}/${name}`);
};

const pageOf = (lang) => {
  const L = PAGES[lang];
  const rows = Object.entries(D.EMBLEM_GROUPS).map(([group, ids]) => {
    const folder = D.EMBLEM_FOLDERS[group];
    const body = ids.length === 0
      ? L.none
      : [`| ${L.head.join(" | ")} |`, `| ${L.head.map(() => "---").join(" | ")} |`, ...ids.map((id) => {
          check(id, folder);
          const info = D.emblemInfo(id);
          return `| \`${id}\` | ${L.name(info)} | ${info.kind} | ${info.source} | ${L.description(info)} |`;
        })].join("\n");
    return `## ${group}\n\n${body}\n`;
  });
  return `${L.top(D.EMBLEM_IDS.length)}\n\n${L.rule}\n\n${rows.join("\n")}`;
};

let stale = false;
for (const lang of Object.keys(PAGES)) {
  const file = new URL(`../docs/${PAGES[lang].file}`, import.meta.url);
  const text = pageOf(lang);
  if (process.argv.includes("--check")) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== text) {
      console.error(`docs/${PAGES[lang].file} is not what the package makes: run \`pnpm gallery\``);
      stale = true;
    } else console.log(`ok   docs/${PAGES[lang].file} is what the package makes`);
  } else {
    writeFileSync(file, text);
    console.log(`docs/${PAGES[lang].file}: ${D.EMBLEM_IDS.length} emblems`);
  }
}
if (stale) process.exit(1);
