// Fetches the third-party artwork the gear is made from (scripts/dougu/gear-assets.json) into scripts/dougu/.cache/ and checks each file's SHA-256 against the pinned one. The files are untrusted data:
// they are only read and written, never run, and each is kept in a file of its own.
//   node scripts/dougu/fetch-gear.mjs            fetch what is missing, check every hash
//   node scripts/dougu/fetch-gear.mjs --refetch  fetch everything again (to prove that upstream still serves the pinned files)
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const CACHE = join(here, ".cache");
export const MANIFEST = JSON.parse(readFileSync(join(here, "gear-assets.json"), "utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

/** The path of an asset in the cache. */
export const cachePath = (asset) => join(CACHE, `${asset.key}.svg`);

/** One file, tried three times: a connection to Wikimedia's servers is sometimes refused the first time. */
async function download(url) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "kyogijo-gear-fetch (+https://github.com/johnmorrisdotca)" } });
      if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      last = error;
    }
  }
  throw last;
}

/** Fetches the assets and returns the ones whose hash is not the pinned one. */
export async function fetchAll({ refetch = false } = {}) {
  mkdirSync(CACHE, { recursive: true });
  const bad = [];
  for (const asset of MANIFEST.assets) {
    const file = cachePath(asset);
    if (refetch || !existsSync(file)) {
      writeFileSync(file, await download(asset.url));
    }
    const got = sha256(readFileSync(file));
    if (got !== asset.sha256) bad.push({ key: asset.key, expected: asset.sha256, got, url: asset.url });
  }
  return bad;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const bad = await fetchAll({ refetch: process.argv.includes("--refetch") });
  for (const b of bad) console.error(`HASH MISMATCH ${b.key}\n  expected ${b.expected}\n  got      ${b.got}\n  ${b.url}`);
  if (bad.length > 0) process.exit(1);
  console.log(`${MANIFEST.assets.length} files fetched or found, every SHA-256 as pinned`);
}
