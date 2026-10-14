// Packs the package the way it is published (`npm pack`), installs the tarball into an empty project, and uses it as somebody
// who installed it would: every entry in `exports` imported by ESM (a wildcard entry, `./ball/*`, once for each module of its folder),
// and an emblem drawn that must equal the one this checkout draws. Then it bundles ONE item from the installed package with esbuild, as a
// page that wants one ball would, and holds the result small. A package whose `exports` name a file that is not in the tarball fails here,
// before it is published. `pnpm test:package` builds first.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const windows = process.platform === "win32";
const scratch = mkdtempSync(join(tmpdir(), "dougu-package-"));

function run(command, args, cwd, viaShell = false) {
  const shell = viaShell && windows;
  const ran = spawnSync(shell && /[\\/]/.test(command) ? `"${command}"` : command, args, { cwd, encoding: "utf8", shell });
  if (ran.status !== 0) {
    console.error(`FAIL ${command} ${args.join(" ")}\n${ran.stdout}\n${ran.stderr}`);
    process.exit(1);
  }
  return ran.stdout;
}

// 1. Pack, with npm.
const packed = JSON.parse(run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], root, true));
const tarball = join(scratch, packed[0].filename);
const inTarball = new Set(packed[0].files.map((file) => file.path));
console.log(`ok   npm pack: ${packed[0].filename}, ${packed[0].files.length} files`);
const shipped = [...inTarball].filter((file) => file.startsWith("docs/") || file.startsWith("demo/") || /\.(webp|png|jpe?g|gif)$/.test(file));
if (shipped.length > 0) {
  console.error(`FAIL the tarball holds the demo, docs or pictures: ${shipped.join(", ")}`);
  process.exit(1);
}
console.log("ok   no demo, doc or picture is in the tarball");

// 2. Everything package.json points at is in the tarball.
// A wildcard target (`./dist/emblems/ball/*.js`) stands for every file of its folder that npm packed.
const expand = (file) => {
  if (!file.includes("*")) return [file];
  const [before, after] = file.replace(/^\.\//, "").split("*");
  return [...inTarball].filter((path) => path.startsWith(before) && path.endsWith(after) && !path.slice(before.length, -after.length || undefined).includes("/"));
};
const pointed = [pkg.main, pkg.module, pkg.types, ...Object.values(pkg.exports).flatMap((entry) => (typeof entry === "string" ? [entry] : Object.values(entry)))].flatMap(expand);
for (const file of new Set(pointed)) {
  if (!inTarball.has(file.replace(/^\.\//, ""))) {
    console.error(`FAIL package.json points at ${file}, which is not in the tarball`);
    process.exit(1);
  }
}
console.log(`ok   every file package.json points at is in the tarball (${new Set(pointed).size})`);
for (const named of pkg.files) {
  if (![...inTarball].some((file) => file === named || file.startsWith(`${named}/`))) {
    console.error(`FAIL package.json's files names ${named}, which is not in the tarball`);
    process.exit(1);
  }
}
console.log(`ok   everything in package.json's files is in the tarball (${pkg.files.length})`);
if (Object.keys(pkg.dependencies ?? {}).length > 0) {
  console.error("FAIL the package has runtime dependencies; it is dependency-free");
  process.exit(1);
}
console.log("ok   no runtime dependencies");

// 3. Install it into an empty project.
const project = join(scratch, "project");
mkdirSync(project);
writeFileSync(join(project, "package.json"), JSON.stringify({ name: "scratch", private: true, version: "0.0.0" }));
run("npm", ["install", "--no-audit", "--no-fund", "--silent", tarball], project, true);
console.log("ok   npm install of the tarball");

// What the built package in this checkout makes: the installed one must make the same.
const local = await import(new URL("../dist/index.js", import.meta.url).href);
const medal = local.renderEmblem("award:medal", { style: "line", size: 40 });
const ball = local.renderEmblem("ball:soccer", { style: "color", tint: "#0b6e4f" });
const rolled = local.ballFrame("ball:soccer", { yaw: 70, pitch: -20 });

// 4. Every entry in `exports`, by ESM and by require; a wildcard entry once for each module in its folder.
const entries = [];
for (const key of Object.keys(pkg.exports)) {
  if (!key.includes("*")) {
    entries.push(key === "." ? pkg.name : `${pkg.name}/${key.slice(2)}`);
    continue;
  }
  const folder = pkg.exports[key].import.replace(/^\.\//, "").replace(/\*\.js$/, "");
  const names = [...inTarball].filter((path) => path.startsWith(folder) && path.endsWith(".js")).map((path) => path.slice(folder.length, -3));
  for (const name of names) entries.push(`${pkg.name}/${key.slice(2).replace("*", name)}`);
}
if (!entries.includes(`${pkg.name}/ball/soccer`) || !entries.includes(`${pkg.name}/award/medal`)) {
  console.error(`FAIL the sample items are not in the exports: ${entries.join(" ")}`);
  process.exit(1);
}
writeFileSync(
  join(project, "esm.mjs"),
  `${entries.map((entry, i) => `import * as m${i} from ${JSON.stringify(entry)};`).join("\n")}
const all = [${entries.map((_, i) => `m${i}`).join(", ")}];
const names = ${JSON.stringify(entries)};
all.forEach((m, i) => { if (Object.keys(m).length === 0) throw new Error(names[i] + " exports nothing"); });
const { renderEmblem, ballFrame, VERSION, AWARD_MEDAL } = m0;
if (renderEmblem("award:medal", { style: "line", size: 40 }) !== ${JSON.stringify(medal)}) throw new Error("the installed package drew another medal");
if (renderEmblem("ball:soccer", { style: "color", tint: "#0b6e4f" }) !== ${JSON.stringify(ball)}) throw new Error("the installed package drew another ball");
if (ballFrame("ball:soccer", { yaw: 70, pitch: -20 }) !== ${JSON.stringify(rolled)}) throw new Error("the installed package rolled the ball another way");
if (VERSION !== ${JSON.stringify(pkg.version)}) throw new Error("VERSION is " + VERSION);
const byName = Object.fromEntries(names.map((name, i) => [name, all[i]]));
if (byName[${JSON.stringify(`${pkg.name}/emblems`)}].renderEmblem !== renderEmblem) throw new Error("the emblems entry is another copy");
if (byName[${JSON.stringify(`${pkg.name}/turn`)}].ballFrame !== ballFrame) throw new Error("the turn entry is another copy");
if (byName[${JSON.stringify(`${pkg.name}/award/medal`)}].AWARD_MEDAL !== AWARD_MEDAL) throw new Error("the medal module is another copy");
console.log(names.length + " entries");
`,
);
console.log(`ok   import:  ${run(process.execPath, ["esm.mjs"], project).trim()}`);

// 5. A page that wants one ball: esbuild bundles the installed package's one module, and the other emblems stay out.
const { build } = await import("esbuild");
const one = await build({ stdin: { contents: `import { BALL_SOCCER } from ${JSON.stringify(`${pkg.name}/ball/soccer`)}; console.log(BALL_SOCCER.svg());`, resolveDir: project, loader: "js" }, bundle: true, minify: true, format: "esm", write: false, logLevel: "silent" });
const text = one.outputFiles[0].text;
const gzip = gzipSync(text).length;
if (!text.includes("ball:soccer") || text.includes("award:medal")) {
  console.error("FAIL the bundle of the soccer ball alone holds the wrong emblems");
  process.exit(1);
}
if (gzip > 3 * 1024) {
  console.error(`FAIL the soccer ball alone bundles to ${gzip} bytes gzipped, over 3 kB`);
  process.exit(1);
}
console.log(`ok   one ball, bundled from the installed package: ${text.length} bytes, ${gzip} gzipped`);
console.log(`ok   ${packed[0].files.length} files, ${(packed[0].size / 1024).toFixed(0)} kB packed, ${(packed[0].unpackedSize / 1024).toFixed(0)} kB unpacked`);
