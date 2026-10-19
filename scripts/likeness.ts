// Tools for drawing a trophy as a close likeness of the real one (docs/likeness.md). The photograph is only looked at and measured; it is never copied into the package.
//
//   node scripts/likeness.ts grid <photo> <out.png> [--box=x,y,w,h] [--step=50] [--width=1000]
//       the photo (or a part of it) with a labelled grid in the photo's own pixels, to read where the parts of the object are.
//   node scripts/likeness.ts silhouette <photo> --box=x,y,w,h [--axis=x] [--rows=40] [--tol=60] [--to=y0,y1]
//       the half width of the object (against the colour of the box's corners) at evenly spaced rows, for a clean background; with --to the rows and radii are
//       scaled so that the object stands from y0 to y1 in the 64 unit box of a lathe emblem, which is the first draft of its profile, to be corrected by eye.
//   node scripts/likeness.ts contact <out.png> <photo> <photo>...
//       the photographs side by side at one height, each with its file name, to choose among references.
//   node scripts/likeness.ts compare <emblem module path under src/emblems> <photo> <out.png> --box=x,y,w,h [--yaw=0] [--style=metal]
//       the photo's object and the drawing (in the style asked and as a line) at the same height side by side, to adjust until they agree.
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

import type { Emblem } from "../src/emblems/emblem.core.ts";

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const rest = args.filter((a) => !a.startsWith("--"));
const mode = rest.shift();
const nums = (s: string | undefined): number[] | undefined => (s === undefined ? undefined : s.split(",").map(Number));
const box = nums(flags.box);

const mime = (p: string): string => (extname(p).toLowerCase() === ".png" ? "image/png" : extname(p).toLowerCase() === ".webp" ? "image/webp" : "image/jpeg");
const uri = (p: string): string => `data:${mime(p)};base64,${readFileSync(p).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
try {
  if (mode === "grid") {
    const [photo, out] = rest as [string, string];
    const step = Number(flags.step ?? 50);
    const width = Number(flags.width ?? 1000);
    await page.setContent(`<body style="margin:0;background:#888"><canvas id=c></canvas>`);
    await page.evaluate(async ({ src, box, step, width }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const [bx, by, bw, bh] = box ?? [0, 0, img.naturalWidth, img.naturalHeight];
      const k = width / bw;
      const c = document.getElementById("c") as HTMLCanvasElement;
      c.width = Math.round(bw * k);
      c.height = Math.round(bh * k);
      const g = c.getContext("2d") as CanvasRenderingContext2D;
      g.drawImage(img, bx, by, bw, bh, 0, 0, c.width, c.height);
      g.font = "12px sans-serif";
      for (let x = Math.ceil(bx / step) * step; x < bx + bw; x += step) {
        const px = (x - bx) * k;
        g.strokeStyle = x % (step * 2) === 0 ? "rgba(255,0,0,.8)" : "rgba(255,0,0,.4)";
        g.beginPath(); g.moveTo(px, 0); g.lineTo(px, c.height); g.stroke();
        g.fillStyle = "#fff"; g.fillRect(px + 1, 0, 30, 14); g.fillStyle = "#c00"; g.fillText(String(x), px + 2, 11);
      }
      for (let y = Math.ceil(by / step) * step; y < by + bh; y += step) {
        const py = (y - by) * k;
        g.strokeStyle = y % (step * 2) === 0 ? "rgba(0,80,255,.8)" : "rgba(0,80,255,.4)";
        g.beginPath(); g.moveTo(0, py); g.lineTo(c.width, py); g.stroke();
        g.fillStyle = "#fff"; g.fillRect(0, py + 1, 30, 14); g.fillStyle = "#04c"; g.fillText(String(y), 2, py + 12);
      }
    }, { src: uri(photo), box, step, width });
    await (await page.$("#c"))!.screenshot({ path: out });
  } else if (mode === "silhouette") {
    const [photo] = rest as [string];
    const rows = Number(flags.rows ?? 40);
    const tol = Number(flags.tol ?? 60);
    await page.setContent("<body>");
    const result = await page.evaluate(async ({ src, box, rows, tol, axisFlag }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const [bx, by, bw, bh] = box ?? [0, 0, img.naturalWidth, img.naturalHeight];
      const c = document.createElement("canvas");
      c.width = bw; c.height = bh;
      const g = c.getContext("2d") as CanvasRenderingContext2D;
      g.drawImage(img, bx, by, bw, bh, 0, 0, bw, bh);
      const data = g.getImageData(0, 0, bw, bh).data;
      const px = (x: number, y: number): number[] => { const i = (y * bw + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
      const corners = [px(2, 2), px(bw - 3, 2), px(2, bh - 3), px(bw - 3, bh - 3)];
      const bg = [0, 1, 2].map((k) => corners.reduce((s, q) => s + q[k], 0) / 4);
      const far = (x: number, y: number): boolean => { const q = px(x, y); return Math.abs(q[0] - bg[0]) + Math.abs(q[1] - bg[1]) + Math.abs(q[2] - bg[2]) > tol; };
      const out: { y: number; l: number; r: number }[] = [];
      for (let i = 0; i < rows; i++) {
        const y = Math.min(bh - 1, Math.round(((i + 0.5) * bh) / rows));
        let l = -1; let r = -1;
        for (let x = 0; x < bw; x++) if (far(x, y)) { if (l < 0) l = x; r = x; }
        out.push({ y, l, r });
      }
      return { bg, bw, bh, out, axis: axisFlag === undefined ? undefined : Number(axisFlag) - bx };
    }, { src: uri(photo), box, rows, tol, axisFlag: flags.axis });
    const rowsOut = result.out;
    const top = rowsOut.find((r) => r.l >= 0)?.y ?? 0;
    const bottom = [...rowsOut].reverse().find((r) => r.l >= 0)?.y ?? result.bh;
    const [y0, y1] = nums(flags.to) ?? [0, 64];
    const k = (y1 - y0) / Math.max(1, bottom - top);
    console.log(`background rgb ${result.bg.map((v) => Math.round(v)).join(",")}; object from row ${top} to ${bottom} of ${result.bh}; scale ${k.toFixed(4)} unit per pixel`);
    for (const r of rowsOut) {
      if (r.l < 0) continue;
      const axis = result.axis ?? (r.l + r.r) / 2;
      const half = Math.max(axis - r.l, r.r - axis);
      console.log(`[${(y0 + (r.y - top) * k).toFixed(1)}, ${(half * k).toFixed(1)}],  // row ${r.y}  ${r.l}..${r.r}`);
    }
  } else if (mode === "contact") {
    const [out, ...photos] = rest as string[];
    const height = Number(flags.height ?? 700);
    await page.setViewportSize({ width: 2400, height: height + 40 });
    await page.setContent(`<body style="margin:0;background:#fff;font:12px sans-serif;display:flex;gap:8px;flex-wrap:wrap">${photos.map((p) => `<div><img style="height:${height}px;display:block" src="${uri(p)}"><div>${p.split("/").pop()}</div></div>`).join("")}`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: out, fullPage: true });
  } else if (mode === "compare") {
    const [path, photo, out] = rest as [string, string, string];
    const module = (await import(`${pathToFileURL(join(process.cwd(), "src/emblems", `${path}.ts`)).href}?${Date.now()}`)) as Record<string, unknown>;
    const emblem = Object.values(module).find((v) => v && typeof v === "object" && typeof (v as Emblem).svg === "function") as Emblem;
    const yaw = Number(flags.yaw ?? 0);
    const draw = (style: string): string => (emblem.frame({ style: style as "metal", size: 600, theme: "light", yaw, pitch: 0, turnBox: false } as never));
    const still = (style: string): string => (yaw === 0 ? emblem.svg({ style: style as "metal", size: 600, theme: "light" }) : draw(style));
    const [bx, by, bw, bh] = box ?? [0, 0, 100, 100];
    const H = 600;
    const W = Math.round((bw * H) / bh);
    const styleName = flags.style ?? "metal";
    // The drawing's own box has a margin; the object in the photo is scaled to the drawing's content height, which is the model's top to its plinth.
    await page.setContent(`<body style="margin:0;background:#fff;display:flex;gap:16px;align-items:flex-start">
      <div style="position:relative;width:${W}px;height:${H}px;background:#ddd"><img id=p style="position:absolute;left:${(-bx * H) / bh}px;top:${(-by * H) / bh}px;width:${(1 * H) / bh * 1}px;height:auto" src="${uri(photo)}"></div>
      <div style="position:relative;width:600px;height:600px;background:#fff">${still(styleName)}</div>
      <div style="position:relative;width:600px;height:600px;background:#fff">${still("line")}</div>`);
    await page.evaluate(({ box, H }) => {
      const [bx, by, , bh] = box;
      const k = H / bh;
      for (const id of ["p"]) {
        const im = document.getElementById(id) as HTMLImageElement;
        const natW = im.naturalWidth;
        im.style.width = `${natW * k}px`;
        im.style.left = `${-bx * k}px`;
        im.style.top = `${-by * k}px`;
        (im.parentElement as HTMLElement).style.overflow = "hidden";
      }
    }, { box: [bx, by, bw, bh], H });
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: W + 1260, height: H + 20 });
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W + 1248, height: H } });
  } else {
    console.error("usage: likeness.ts grid|silhouette|compare ...");
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
