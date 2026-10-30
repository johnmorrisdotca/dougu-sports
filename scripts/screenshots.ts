// Takes the README's pictures of the demo into docs/images, as webp made in the browser: the balls, the vintage balls, the trophies with the medals and crests, the famous trophies, the gear and the phone sheet (each light
// and dark), the printed pucks, the judo suits from behind and the six steps of tying the belt (each light and dark) and four emblems turned. Every sheet stands on one of the family's shared backgrounds (scripts/family-backgrounds.ts, drawn in code, copied from taisen-brackets
// and never edited here), in the dark or the light variant, and its labels take the ink the background returns, so they read. The grid runs edge to edge and every row is full.
// It serves the demo on port 7210, or TEST_PORT (this package's own block, tests and tools from 7211 up) and stops the server it started. IMAGES_OUT writes somewhere else than docs/images; ONLY=name,name takes some.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { backgroundSvg } from "./family-backgrounds.ts";
import type { BackgroundInk, BackgroundPresetName } from "./family-backgrounds.ts";

/** The built package, as the page imports it, and the ink a background returns: what each sheet's function is given. Each function is sent to the page as text, so it names these types only in its parameters. */
type Dist = typeof import("../src/index.ts");
type Ink = BackgroundInk;

/** What a sheet is made of: its size, how its grid is cut, and the background it stands on. */
interface SheetOptions {
  width: number;
  cols: number;
  rows: number[];
  gap?: number;
  pad?: number;
  scheme?: "light" | "dark";
  phone?: boolean;
  preset: BackgroundPresetName;
  intensity?: number;
  seed?: number;
  scale?: number;
}

const root = fileURLToPath(new URL("..", import.meta.url));
const out = process.env.IMAGES_OUT ?? `${root}docs/images`;
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
mkdirSync(out, { recursive: true });
const port = Number(process.env.TEST_PORT ?? 7210);
const server = spawn(process.execPath, ["scripts/dev.ts"], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: "ignore" });
try {
  await new Promise<void>((resolve, reject) => {
    const started = Date.now();
    const poll = async () => {
      try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return resolve(); } catch { /* not up yet */ }
      if (Date.now() - started > 8000) return reject(new Error("the demo server did not start"));
      setTimeout(poll, 150);
    };
    poll();
  });
  const browser = await chromium.launch();
  /** Photographs a page element as a webp, made in the browser (no tool beyond Chromium), small enough for a README. */
  const webp = async (png: Buffer, file: string) => {
    const page = await browser.newPage();
    const base64 = await page.evaluate(async (data: string) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d")!.drawImage(image, 0, 0);
      const blob = await new Promise<Blob>((done) => canvas.toBlob((made) => done(made!), "image/webp", 0.82));
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise((done) => { reader.onloadend = done; });
      return String(reader.result).split(",")[1];
    }, png.toString("base64"));
    await page.close();
    writeFileSync(file, Buffer.from(base64, "base64"));
  };
  /**
   * Opens the demo, replaces the page by a grid of equal cells the callback fills from the built package, and photographs it, standing on one of the family's backgrounds.
   * Every row is full (the cell count is `cols` times the number of `rows`), each row has its own height and the grid runs edge to edge, so no picture has a ragged last row or a band of empty paper.
   * The background is drawn at the sheet's own size (the preset, in the variant of the scheme) and the callback gets the ink it returns, to colour its labels.
   */
  const sheet = async (name: string, { width, cols, rows, gap = 6, pad = 14, scheme = "light", phone = false, preset, intensity, seed = 1, scale = 2 }: SheetOptions, make: (D: Dist, ink: Ink) => string) => {
    if (only && !only.includes(name)) return;
    const height = pad * 2 + rows.reduce((a, b) => a + b, 0) + gap * (rows.length - 1);
    const background = backgroundSvg(preset, { width, height, theme: scheme, seed, ...(intensity === undefined ? {} : { intensity }), id: `bg-${name}` });
    const picture = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="position:absolute;inset:0;z-index:0" aria-hidden="true"><defs>${background.defs}</defs><rect width="${width}" height="${height}" fill="${background.ink.base}"/>${background.body}</svg>`;
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, hasTouch: phone, isMobile: phone, deviceScaleFactor: scale, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}/`);
    await page.waitForSelector("#stage svg");
    await page.evaluate(async ({ source, cols, rows, gap, pad, width, picture, ink }) => {
      const dist = "/dist/index.js";
      const D = await import(dist);
      const box = document.createElement("div");
      box.id = "sheet";
      box.style.cssText = `position:relative;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:${rows.map((h: number) => `${h}px`).join(" ")};gap:${gap}px;padding:${pad}px;width:${width}px;box-sizing:border-box;color:${ink.text};font:600 11px system-ui,sans-serif`;
      box.innerHTML = picture + new Function("D", "ink", `return (${source})(D, ink)`)(D, ink);
      for (const cell of box.children) if (cell.tagName === "FIGURE") (cell as HTMLElement).style.cssText += ";position:relative;z-index:1";
      document.body.replaceChildren(box);
    }, { source: make.toString(), cols, rows, gap, pad, width, picture, ink: background.ink });
    await webp(await page.locator("#sheet").screenshot({ type: "png" }), `${out}/${name}.webp`);
    await context.close();
  };
  // (Each function is sent to the page as text, so each carries what it uses.)
  // Trophies, awards, medals and crests, and three cups in the three styles.
  const trophies = (D: Dist, ink: Ink) => {
    const one = (id: string, o: object = {}, caption = "") => `<figure style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center">${D.renderEmblem(id, o)}${caption ? `<figcaption style="margin-top:-2px;color:${ink.muted}">${caption}</figcaption>` : ""}</figure>`;
    const row = (ids: string[], size: number) => ids.map((id) => one(id, { size })).join("");
    const cups = ["trophy:hockey-cup", "trophy:baseball", "trophy:football", "trophy:basketball", "trophy:canadian-bowl", "trophy:soccer-globe", "trophy:tennis-plate", "trophy:tennis-cup", "trophy:cricket-urn"];
    const awards = ["trophy:rugby-cup", "trophy:sumo-cup", "trophy:soccer-ball", "trophy:laurel", "trophy:rosette", "trophy:belt", "trophy:championship-banner", "trophy:ring", "trophy:plaque"];
    const medals = ["medal:gold", "medal:silver", "medal:bronze", "medal:place-1", "medal:place-2", "medal:place-3", "crest:shield", "crest:roundel", "crest:diamond"];
    const styled = ["trophy:hockey-cup", "trophy:rugby-cup", "trophy:tennis-cup"].flatMap((id) => D.EMBLEM_STYLES.map((style) => one(id, { style, size: 144 }, style))).join("");
    return row(cups, 144) + row(awards, 144) + row(medals, 124) + styled;
  };
  // Balls and pucks: soccer in its constructions and colours, the ball of every big sport, the small ones, and the odd ones out. Forty, four rows of ten.
  const balls = (D: Dist) => ["ball:soccer", "ball:soccer-26", "ball:soccer-14", "ball:soccer-6", "ball:soccer-orange", "ball:soccer-12-yellow", "ball:soccer-colour", "ball:futsal", "ball:beach-soccer",
    "ball:basketball", "ball:basketball-3x3", "ball:baseball", "ball:softball", "ball:football", "ball:rugby", "ball:afl", "ball:volleyball", "ball:beach-volleyball",
    "ball:tennis", "ball:padel", "ball:pickleball-outdoor", "ball:squash", "ball:racquetball", "ball:golf", "ball:cricket-red", "ball:cricket-pink", "ball:water-polo",
    "ball:sepak-takraw", "ball:shuttlecock-feather", "ball:puck", "ball:curling-stone", "ball:lacrosse", "ball:handball", "ball:table-tennis", "ball:sliotar", "ball:roundnet"]
    .map((id) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(id, { size: 146 })}</figure>`).join("");
  // The vintage leather balls, four baseballs of other threads and nine of the era-style soccer balls: eighteen, two rows of nine.
  const vintage = (D: Dist) => ["ball:soccer-1870-hand-stitched", "ball:soccer-1900-laced", "ball:soccer-1930-18-panel", "ball:soccer-1950-12-panel", "ball:soccer-1960-32-panel-leather", "ball:baseball-lemon-peel", "ball:baseball-red-blue", "ball:baseball-black-red", "ball:baseball-vintage-leather",
    "ball:soccer-retro-pentagons", "ball:soccer-retro-leaves", "ball:soccer-retro-rosette", "ball:soccer-retro-star", "ball:soccer-retro-pinwheel", "ball:soccer-retro-kites", "ball:soccer-14-panel-double-border", "ball:soccer-8-panel-plain", "ball:soccer-6-panel-bands"]
    .map((id) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(id, { size: 146 })}</figure>`).join("");
  // The famous trophies, each a likeness measured on a photograph (docs/likeness.md), with its name: the world's thirteen, the leagues' own and the NHL's main ones. Forty, four rows of ten.
  const famous = (D: Dist, ink: Ink) => ([["fifa-world-cup", "FIFA World Cup"], ["stanley-cup", "Stanley Cup"], ["lombardi-trophy", "Lombardi Trophy"], ["larry-obrien-trophy", "Larry O'Brien"], ["grey-cup", "Grey Cup"], ["fa-cup", "FA Cup"], ["americas-cup", "America's Cup"], ["borg-warner-trophy", "Borg-Warner"], ["wimbledon-gentlemens-trophy", "Wimbledon"],
    ["venus-rosewater-dish", "Rosewater Dish"], ["ballon-dor", "Ballon d'Or"], ["champions-league-trophy", "Champions League"], ["webb-ellis-cup", "Webb Ellis Cup"], ["ashes-urn", "The Ashes urn"], ["cricket-world-cup", "Cricket World Cup"], ["woodlawn-vase", "Woodlawn Vase"], ["dfb-pokal", "DFB-Pokal"],
    ["commissioners-trophy", "Commissioner's"], ["cy-young-award", "Cy Young"], ["gold-glove-award", "Gold Glove"], ["silver-slugger-award", "Silver Slugger"], ["mlb-mvp-award", "MLB MVP"], ["world-series-mvp-trophy", "World Series MVP"], ["wnba-championship-trophy", "WNBA"], ["lamar-hunt-trophy", "Lamar Hunt"],
    ["hart-trophy", "Hart"], ["vezina-trophy", "Vezina"], ["norris-trophy", "Norris"], ["calder-trophy", "Calder"], ["conn-smythe-trophy", "Conn Smythe"], ["art-ross-trophy", "Art Ross"], ["presidents-trophy", "Presidents'"], ["prince-of-wales-trophy", "Prince of Wales"], ["campbell-bowl", "Campbell Bowl"], ["rocket-richard-trophy", "Rocket Richard"], ["walter-cup", "Walter Cup"], ["calder-cup", "Calder Cup"], ["kelly-cup", "Kelly Cup"], ["mls-cup", "MLS Cup"], ["cfp-trophy", "CFP Trophy"]] as const)
    .map(([id, name]) => `<figure style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center">${D.renderEmblem(`trophy:${id}`, { size: 128 })}<figcaption style="margin-top:-2px;color:${ink.muted}">${name}</figcaption></figure>`).join("");
  // Gear: thirty-six of the pieces.
  const gear = (D: Dist) => ["gear:hockey-stick", "gear:hockey-skate", "gear:goalie-mask", "gear:field-hockey-stick", "gear:lacrosse-stick", "gear:hurley", "gear:cricket-bat", "gear:wicket", "gear:baseball-bat",
    "gear:baseball-glove", "gear:football-helmet", "gear:goalposts", "gear:basketball-hoop", "gear:volleyball-net", "gear:tennis-racket", "gear:badminton-racket", "gear:table-tennis-paddle", "gear:padel-racket",
    "gear:pickleball-paddle", "gear:curling-broom", "gear:figure-skate", "gear:speed-skate", "gear:swim-goggles", "gear:starting-blocks", "gear:relay-baton", "gear:javelin", "gear:hurdles",
    "gear:kendo-men", "gear:shinai", "gear:gunbai", "gear:mawashi", "gear:judogi", "gear:obi", "gear:yumi", "gear:ya", "gear:karate-gi"]
    .map((id) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(id, { size: 146 })}</figure>`).join("");
  // Three columns by four rows on a phone: cups, a medal, balls, gear.
  const phoneCells = (D: Dist) => ["trophy:hockey-cup", "trophy:baseball", "trophy:soccer-globe", "trophy:tennis-cup", "medal:gold", "crest:shield", "ball:soccer", "ball:basketball", "ball:curling-stone", "gear:hockey-skate", "gear:baseball-glove", "gear:tennis-racket"].map((id) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(id, { size: 120 })}</figure>`).join("");
  // Four rows of seven turns: a cup, a medal flipping, a ball rolling and a flat banner.
  const turned = (D: Dist) => ["trophy:tennis-cup", "medal:gold", "ball:soccer", "trophy:championship-banner"].flatMap((id) => [-120, -80, -40, 0, 40, 80, 120].map((yaw) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.emblemFrame(id, { yaw, size: 180 })}</figure>`)).join("");
  // The two pickleballs, each at rest and then at three turns that show the page through their holes: the outdoor ball above, the indoor ball below.
  const pickleball = (D: Dist) => [["ball:pickleball-outdoor", [{}, { yaw: 45 }, { yaw: 240 }, { yaw: 270 }]], ["ball:pickleball-indoor", [{}, { yaw: 165, pitch: 15 }, { yaw: 300, pitch: 15 }, { yaw: 0, pitch: 15 }]]].flatMap(([id, turns]) => (turns as object[]).map((turn, i) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${i === 0 ? D.renderEmblem(id as string, { size: 236 }) : D.emblemFrame(id as string, { ...turn, size: 236 })}</figure>`)).join("");
  // The slotted plastic practice baseball at rest, from the side (a near slot over a far one: the page shows through), from the pole and from the solid half.
  const slotted = (D: Dist) => [{}, { yaw: 112, pitch: -22 }, { yaw: 22, pitch: -22 }, { yaw: 202, pitch: -22 }].map((turn, i) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${i === 0 ? D.renderEmblem("ball:plastic-baseball-slotted", { size: 236 }) : D.emblemFrame("ball:plastic-baseball-slotted", { ...turn, size: 236 })}</figure>`).join("");
  // The eight printed pucks, four to a row.
  const pucks = (D: Dist) => ["puck:canada", "puck:canada-red", "puck:canada-white", "puck:usa", "puck:usa-navy", "puck:player", "puck:signed", "puck:souvenir"].map((id) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(id, { size: 240 })}</figure>`).join("");
  // The judo suit from the front and from behind with its back number: white (TANAKA, JPN), blue (TREMBLAY, CAN) and white with a gold band (SMITH, USA), four to a row.
  const judogi = (D: Dist) => ([["gear:judogi", {}], ["gear:judogi-back", { backnumber: { name: "TANAKA", code: "JPN" } }], ["gear:judogi-blue-back", { backnumber: { name: "TREMBLAY", code: "CAN" } }], ["gear:judogi-back", { backnumber: { name: "SMITH", code: "USA", band: "gold" } }]] as [string, object][])
    .map(([id, o]) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(id, { size: 250, ...o })}</figure>`).join("");
  // The six steps of tying the judo belt, three to a row.
  const obiSteps = (D: Dist) => [1, 2, 3, 4, 5, 6].map((n) => `<figure style="margin:0;display:flex;align-items:center;justify-content:center">${D.renderEmblem(`gear:obi-step-${n}`, { size: 250 })}</figure>`).join("");
  // Which preset stands behind which picture, in the dark and in the light variant: the balls under floodlights, the cups and medals on royal purple, the gear on carbon fibre (dark) and a hardwood floor (light),
  // the vintage balls on a warm sunburst, the pucks on the ice, the phone on a glow and the turned emblems on a dark royal. A stronger intensity (0.9, the default is 0.6) keeps the pattern from being a mere tint.
  for (const scheme of ["light", "dark"] as const) {
    await sheet(`balls-desk-${scheme}`, { width: 1400, cols: 9, rows: [150, 150, 150, 150], scheme, preset: "floodlights", intensity: 0.9 }, balls);
    await sheet(`vintage-desk-${scheme}`, { width: 1400, cols: 9, rows: [150, 150], scheme, preset: "sunburst" }, vintage);
    await sheet(`hero-desk-${scheme}`, { width: 1400, cols: 9, rows: [152, 152, 132, 160], scheme, preset: "royal", intensity: 0.9 }, trophies);
    await sheet(`famous-desk-${scheme}`, { width: 1400, cols: 10, rows: [160, 160, 160, 160], scheme, preset: "royal", intensity: 0.9 }, famous);
    await sheet(`gear-desk-${scheme}`, { width: 1400, cols: 9, rows: [150, 150, 150, 150], scheme, preset: scheme === "dark" ? "carbon" : "hardwood", intensity: scheme === "dark" ? 1 : 0.9 }, gear);
    await sheet(`phone-${scheme}`, { width: 390, cols: 3, rows: [124, 124, 124, 124], gap: 4, phone: true, scheme, preset: "glow" }, phoneCells);
    await sheet(`judogi-${scheme}`, { width: 1000, cols: 4, rows: [260], gap: 10, pad: 20, scheme, preset: scheme === "dark" ? "carbon" : "hardwood", intensity: scheme === "dark" ? 1 : 0.9 }, judogi);
    await sheet(`obi-steps-${scheme}`, { width: 780, cols: 3, rows: [260, 260], gap: 10, pad: 20, scheme, preset: scheme === "dark" ? "carbon" : "hardwood", intensity: scheme === "dark" ? 1 : 0.9 }, obiSteps);
    await sheet(`pickleball-${scheme}`, { width: 1000, cols: 4, rows: [250, 250], gap: 10, pad: 20, scheme, preset: "floodlights", intensity: 0.9 }, pickleball);
    await sheet(`slotted-${scheme}`, { width: 1000, cols: 4, rows: [250], gap: 10, pad: 20, scheme, preset: "floodlights", intensity: 0.9 }, slotted);
    await sheet(`pucks-${scheme}`, { width: 1000, cols: 4, rows: [250, 250], gap: 10, pad: 20, scheme, preset: "ice" }, pucks);
  }
  await sheet("turn-desk", { width: 1280, cols: 7, rows: [176, 176, 176, 176], scheme: "dark", preset: "royal", intensity: 0.9 }, turned);
  await browser.close();
  console.log(`pictures written to ${out}`);
} finally {
  server.kill();
}
