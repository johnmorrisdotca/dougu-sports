// Writes the gear modules that are copied from open icon sets (src/emblems/gear/gear.<name>.ts) from the files fetch-gear.mjs checked: each file minified (svgmin.mjs), its source, licence and the
// changes named in the module's header. Run it again and the same modules come out. `node scripts/dougu/build-gear.mjs`; `--check` writes nothing and fails if a module is not what would be written.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { CACHE, MANIFEST, cachePath, fetchAll } from "./fetch-gear.mjs";
import { iconPath, minify, prefixOf } from "./svgmin.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "..", "src", "emblems", "gear");
const check = process.argv.includes("--check");

const bad = await fetchAll();
if (bad.length > 0) {
  for (const b of bad) console.error(`HASH MISMATCH ${b.key}: expected ${b.expected}, got ${b.got}`);
  process.exit(1);
}
const asset = (key) => {
  const a = MANIFEST.assets.find((x) => x.key === key);
  if (a === undefined) throw new Error(`no asset ${key}`);
  return a;
};
const read = (a) => readFileSync(cachePath(a), "utf8");
const lit = (s) => `\`${s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\``;
const constName = (id) => `GEAR_${id.slice(id.indexOf(":") + 1).toUpperCase().replace(/-/g, "_")}`;
const SOURCE = { noto: "noto", mdi: "mdi", commons: "commons", gameicons: "gameicons" };
const WHERE = {
  noto: (a) => `Noto Emoji \`${a.ref}\` (${a.repo} at ${a.pin}), ${a.license}, ${a.credit}`,
  mdi: (a) => `Pictogrammers Material Design Icons \`${a.ref}\` (${a.repo} at ${a.pin}), ${a.license}, icon by ${a.author}`,
  commons: (a) => `Wikimedia Commons ${a.pageUrl} (revision ${a.revid}), ${a.license}, ${a.credit}`,
  gameicons: (a) => `game-icons.net ${a.pageUrl}, ${a.license}, ${a.credit}`,
};

const modules = new Map();
for (const piece of MANIFEST.pieces) {
  const colourAsset = asset(piece.colour);
  const prefix = prefixOf(piece.colour);
  let box, colour, line;
  if (piece.leather !== undefined) {
    const { box: b, d } = iconPath(read(colourAsset), ["M0 0h512v512H0z"]);
    box = b; colour = d; line = { box: b, d };
  } else {
    const m = minify(read(colourAsset), prefix);
    box = m.box; colour = m.markup;
    if (piece.line === "derived") line = "derived";
    else if (piece.line === piece.colour) line = iconPath(read(colourAsset));
    else line = iconPath(read(asset(piece.line)));
  }
  const credit = `${WHERE[colourAsset.source](colourAsset)}.${piece.line !== "derived" && piece.line !== piece.colour ? ` Line style: ${WHERE[asset(piece.line).source](asset(piece.line))}.` : ""}`;
  const header =
    `// Gear: ${piece.en}. Copied, with changes, from ${WHERE[colourAsset.source](colourAsset)}.\n` +
    `// SHA-256 of the file as published: ${colourAsset.sha256}.\n` +
    (piece.line !== "derived" && piece.line !== piece.colour ? `// The line style is the one-path icon ${WHERE[asset(piece.line).source](asset(piece.line))} (SHA-256 ${asset(piece.line).sha256}).\n` : piece.line === "derived" ? "// The line style is worked out of the colour artwork (dark parts become the ink); no other line artwork is used.\n" : "") +
    `// Changes: ${piece.leather !== undefined ? "the black background square of the original is left out, the shape is filled with leather and shaded" : "editor wrappers, metadata and ids removed, coordinates written absolute and rounded"}${piece.underlay !== undefined ? ", a pale face laid under the ink" : ""}. Modified files are marked as the Apache-2.0 licence asks. Do not edit by hand: scripts/dougu/build-gear.mjs writes this file.\n`;
  const ink = piece.underlay !== undefined ? "#232a36" : undefined;
  const body =
    `${header}import { copied } from "./gear.core.ts";\n\n` +
    `export const ${constName(piece.id)} = /* @__PURE__ */ copied({\n` +
    `  id: ${JSON.stringify(piece.id)},\n  en: ${JSON.stringify(piece.en)},\n  ja: ${JSON.stringify(piece.ja)},\n  source: ${JSON.stringify(SOURCE[colourAsset.source])},\n  credit: ${JSON.stringify(credit)},\n` +
    `  box: ${JSON.stringify(box)},\n  colour: ${lit(colour)},\n  line: ${line === "derived" ? '"derived"' : `{ box: ${JSON.stringify(line.box)}, d: ${lit(line.d)} }`},\n` +
    (piece.underlay !== undefined ? `  underlay: ${JSON.stringify(piece.underlay)},\n` : "") +
    (piece.leather !== undefined ? `  leather: ${JSON.stringify(piece.leather)},\n` : "") +
    (ink !== undefined ? `  ink: ${JSON.stringify(ink)},\n` : "") +
    `});\n`;
  modules.set(`gear.${piece.module}.ts`, body);
}
let drift = 0;
for (const [name, text] of modules) {
  const file = join(OUT, name);
  if (check) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== text) {
      console.error(`${name} is not what the build writes`);
      drift++;
    }
  } else writeFileSync(file, text);
}
const total = [...modules.values()].reduce((n, t) => n + t.length, 0);
console.log(`${modules.size} gear modules ${check ? "checked" : "written"}, ${total} bytes of source (cache ${CACHE.length > 0 ? "ok" : ""}, ${createHash("sha256").update([...modules.values()].join("")).digest("hex").slice(0, 12)})`);
if (drift > 0) process.exit(1);
