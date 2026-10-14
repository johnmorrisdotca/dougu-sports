// Takes the README's pictures of the demo into docs/images: every emblem in each style (desk, light and dark), the stage on a phone, and an emblem turned.
// It serves the demo on port 7202 (this package's own block, tests and tools from 7201 up; the tests use 7201) and stops the server it started.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = `${root}docs/images`;
mkdirSync(out, { recursive: true });
const port = 7202;
const server = spawn(process.execPath, ["scripts/dev.mjs"], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: "ignore" });
try {
  await new Promise((resolve, reject) => {
    const started = Date.now();
    const poll = async () => {
      try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return resolve(); } catch { /* not up yet */ }
      if (Date.now() - started > 8000) return reject(new Error("the demo server did not start"));
      setTimeout(poll, 150);
    };
    poll();
  });
  const browser = await chromium.launch();
  /** Opens the demo, replaces the page by a sheet the callback makes from the built package, and photographs the sheet. */
  const sheet = async (name, { width, height = 900, scheme = "light", phone = false }, make) => {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, hasTouch: phone, isMobile: phone, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}/`);
    await page.waitForSelector("#stage svg");
    await page.evaluate(async (source) => {
      const D = await import("/dist/index.js");
      const box = document.createElement("div");
      box.id = "sheet";
      box.style.cssText = `display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end;padding:18px;width:max-content;max-width:${window.innerWidth}px;background:${matchMedia("(prefers-color-scheme: dark)").matches ? "#141614" : "#f4efe4"};color:${matchMedia("(prefers-color-scheme: dark)").matches ? "#ece8dc" : "#1f2320"};font:600 13px system-ui,sans-serif`;
      box.innerHTML = new Function("D", `return (${source})(D)`)(D);
      document.body.replaceChildren(box);
    }, make.toString());
    await (await page.$("#sheet")).screenshot({ path: `${out}/${name}.png` });
    await context.close();
  };
  // The ten trophies that stand for a league's cup, then a medal of each metal and a crest, then the same cup in the three styles.
  // (Each function is sent to the page as text, so each carries what it uses.)
  const everyStyle = (D) => {
    const figure = (id, o, caption) => `<figure style="margin:0;text-align:center">${D.renderEmblem(id, o)}<figcaption>${caption ?? D.emblemName(id)}</figcaption></figure>`;
    const FAMOUS = ["trophy:hockey-cup", "trophy:baseball", "trophy:football", "trophy:basketball", "trophy:canadian-bowl", "trophy:soccer-globe", "trophy:tennis-plate", "trophy:tennis-cup", "trophy:cricket-urn", "trophy:rugby-cup"];
    const trophies = FAMOUS.map((id) => figure(id, { size: 150 })).join("");
    const rest = ["medal:gold", "medal:silver", "medal:bronze", "medal:place-1", "crest:shield", "crest:roundel", "trophy:rosette", "trophy:laurel", "trophy:belt"].map((id) => figure(id, { size: 96 })).join("");
    const styles = D.EMBLEM_STYLES.map((style) => figure("trophy:hockey-cup", { style, size: 120 }, style)).join("");
    return `${trophies}<div style="flex-basis:100%"></div>${rest}<div style="flex-basis:100%"></div>${styles}`;
  };
  const phone = (D) => ["trophy:hockey-cup", "trophy:baseball", "trophy:football", "trophy:soccer-globe", "trophy:tennis-cup", "medal:gold"].map((id) => `<figure style="margin:0;text-align:center">${D.renderEmblem(id, { size: 96 })}<figcaption>${D.emblemName(id)}</figcaption></figure>`).join("");
  const turned = (D) => ["trophy:tennis-cup", "trophy:hockey-cup", "medal:gold", "ball:soccer"].map((id) => `<div style="display:flex;gap:10px">${[-120, -60, 0, 60, 120].map((yaw) => D.emblemFrame(id, { yaw, size: 110 })).join("")}</div>`).join("");
  await sheet("hero-desk-light", { width: 1280 }, everyStyle);
  await sheet("hero-desk-dark", { width: 1280, scheme: "dark" }, everyStyle);
  await sheet("phone-light", { width: 390, height: 844, phone: true }, phone);
  await sheet("phone-dark", { width: 390, height: 844, phone: true, scheme: "dark" }, phone);
  await sheet("turn-desk-light", { width: 1280 }, turned);
  await browser.close();
  console.log(`pictures written to ${out}`);
} finally {
  server.kill();
}
