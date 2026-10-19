// Writes demo/flags-data.ts: the three round flags the demo's podium shows, taken from @johnmorrisdotca/hata (a development
// dependency of the demo only; the package itself has no dependency on it), and the Commons credit of each. Run `pnpm flags` to make it again.
import { writeFileSync } from "node:fs";
import process from "node:process";
import { flag } from "@johnmorrisdotca/hata/load";
import { manifest } from "@johnmorrisdotca/hata/manifest";

const codes = ["JP", "FR", "IT"];
const flags = {};
const credits = {};
for (const code of codes) {
  const svg = await flag(code, { shape: "round", label: code });
  if (!svg) throw new Error(`hata has no flag for ${code}`);
  flags[code] = svg.replace(/<title>[^<]*<\/title>/, "").replace(/ role="img" aria-label="[^"]*"/, "");
  const m = manifest(code);
  credits[code] = { file: m?.file ?? null, page: m?.page ?? null, licence: m?.licence?.name ?? null, author: m?.author ?? null, attributionRequired: !!m?.attributionRequired };
}
const body = `// Made by scripts/make-flags.mjs from @johnmorrisdotca/hata; do not edit.\n// Round flags for the demo, by ISO 3166 code, and the credit of each (Wikimedia Commons, with the licence it states).\nexport const FLAGS: Record<string, string> = ${JSON.stringify(flags)};\nexport const FLAG_CREDITS: Record<string, { file: string | null; page: string | null; licence: string | null; author: string | null; attributionRequired: boolean }> = ${JSON.stringify(credits)};\n`;
writeFileSync(new URL("../demo/flags-data.ts", import.meta.url), body);
console.log(`${codes.length} flags (${codes.join(" ")}), ${(body.length / 1024).toFixed(1)} KB`);
console.log(JSON.stringify(credits));
process.exit(0);
