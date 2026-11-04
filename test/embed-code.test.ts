// The code the demo's embed panel writes for each tab: it is valid for its kind, the module runs against a stand-in page, the SVG and the image are the package's own drawing, and
// the tag and the framework tabs give the element only attributes it reads.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseTemplate } from "@angular/compiler";
import { build } from "esbuild";
import { compile } from "svelte/compiler";
import ts from "typescript";
import { compileScript, parse } from "vue/compiler-sfc";
import { emblemEmbedCode, renderEmblem, type EmbedOptions, type EmblemId } from "../src/index.ts";
import { attrsOf, BUILDER_KINDS, CREDIT, embedCode, KINDS, PACKAGE, type Kind } from "../demo/embed-code.ts";

const defined = new Map<string, { observedAttributes?: string[] }>();
Object.assign(globalThis, { HTMLElement: class {}, customElements: { define: (name: string, ctor: { observedAttributes?: string[] }) => defined.set(name, ctor), get: (name: string) => defined.get(name) } });
await import("../src/element.ts").catch(() => undefined);

const exportsOf = (JSON.parse(readFileSync("package.json", "utf8")) as { exports: Record<string, unknown> }).exports;
const CHOICES: [EmblemId, EmbedOptions][] = [
  ["trophy:stanley-cup", { style: "metal", size: 256, theme: "inherit", locale: "en" }],
  ["medal:gold", { style: "line", size: 64, theme: "dark", tint: "#c8102e", locale: "ja", turnable: true }],
  ["ball:soccer", { style: "color", size: 128, theme: "light", locale: "en", turnable: true, autoplay: true, yaw: 40, pitch: 10 }],
];
const syntax = (code: string, name: string): string[] => (ts.transpileModule(code, { reportDiagnostics: true, fileName: name, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).diagnostics ?? []).map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n"));
const tagAttrs = (code: string): [string, string][] => {
  const tag = /<dougu-emblem\b([^>]*?)\/?>/s.exec(code);
  assert.ok(tag, code);
  return [...tag[1]!.matchAll(/\s([\w-]+)(?:="([^"]*)")?/g)].map((one) => [one[1]!, (one[2] ?? "").replace(/&quot;/g, '"').replace(/&amp;/g, "&")]);
};

test("every tab of the panel is written, for every emblem", () => {
  for (const [id, options] of CHOICES) for (const kind of BUILDER_KINDS) assert.ok(embedCode(kind, id, options).length > 30, `${kind} ${id}`);
  assert.deepEqual([...KINDS], ["html", "module", "react", "vue", "angular", "svelte", "iframe", "image", "svg"]);
  assert.ok(CREDIT.includes("Dougu Sports"));
});

test("the five ways the old panel had are the package's own text, and the SVG and the image are its drawing", () => {
  for (const [id, options] of CHOICES) {
    const all = emblemEmbedCode(id, options);
    assert.equal(embedCode("html", id, options), all.html);
    assert.equal(embedCode("module", id, options), all.module);
    assert.equal(embedCode("iframe", id, options), all.iframe);
    assert.equal(embedCode("element", id, options), all.element);
    const drawn = renderEmblem(id, { style: options.style!, size: options.size!, theme: options.theme!, ...(options.tint ? { tint: options.tint } : {}), locale: options.locale! });
    assert.equal(embedCode("svg", id, options), drawn);
    const image = embedCode("image", id, options);
    assert.match(image, /^<img src="data:image\/svg\+xml/);
    assert.equal(decodeURIComponent(/src="data:image\/svg\+xml[^,]*,([^"]*)"/.exec(image)![1]!.replace(/&quot;/g, '"')).replace(/&amp;/g, "&").trim().startsWith("<svg"), true);
  }
});

test("the tag and every framework tab give the element the same attributes, and only ones it reads", () => {
  assert.ok(defined.has("dougu-emblem"));
  const read = new Set(defined.get("dougu-emblem")!.observedAttributes);
  for (const [id, options] of CHOICES) {
    const want = attrsOf(emblemEmbedCode(id, options).element);
    assert.equal(want[0]![0], "emblem");
    assert.equal(want[0]![1], id);
    for (const [name] of want) assert.ok(read.has(name), name);
    for (const kind of ["html", "element", "react", "vue", "angular", "svelte"] as Kind[]) assert.deepEqual(tagAttrs(embedCode(kind, id, options)), want, kind);
  }
});

test("the ES module runs against a page and makes the element with the attributes of the tag", async () => {
  for (const [id, options] of CHOICES) {
    const made: { tag: string; attrs: [string, string][] }[] = [];
    const document = {
      body: { append: () => undefined },
      createElement: (tag: string) => {
        const one = { tag, attrs: [] as [string, string][], setAttribute: (name: string, value: string) => one.attrs.push([name, value]) };
        made.push(one);
        return one;
      },
    };
    await new Function("document", embedCode("module", id, options).replace(/^import .*$/gm, ""))(document);
    assert.equal(made.length, 1);
    assert.equal(made[0]!.tag, "dougu-emblem");
    assert.deepEqual(made[0]!.attrs, attrsOf(emblemEmbedCode(id, options).element));
  }
});

test("the imports are paths the package exports", () => {
  for (const [id, options] of CHOICES) {
    for (const kind of ["module", "react", "vue", "angular", "svelte"] as Kind[]) {
      const paths = [...embedCode(kind, id, options).matchAll(new RegExp(`${PACKAGE}/([\\w/-]+)`, "g"))].map((one) => one[1]!);
      assert.ok(paths.length > 0, kind);
      for (const path of paths) assert.ok(`./${path}` in exportsOf, `${kind}: ./${path}`);
    }
  }
});

test("the module, React and Angular code is valid, the Angular template parses and React builds", async () => {
  for (const [id, options] of CHOICES) {
    for (const [kind, file] of [["module", "m.ts"], ["react", "r.tsx"], ["angular", "a.ts"]] as const) assert.deepEqual(syntax(embedCode(kind, id, options), file), [], `${kind} ${id}`);
    const parsed = parseTemplate(/template: `([^`]*)`/.exec(embedCode("angular", id, options))![1]!, "emblem.component.ts");
    assert.deepEqual(parsed.errors ?? [], []);
    const built = await build({ stdin: { contents: embedCode("react", id, options), loader: "tsx", resolveDir: process.cwd() }, bundle: true, write: false, format: "esm", platform: "node", jsx: "automatic", external: [`${PACKAGE}/*`, "react", "react/*"], logLevel: "silent" });
    assert.ok(built.outputFiles[0]!.text.includes("dougu-emblem"));
  }
});

test("the Vue and Svelte components compile and name the element", () => {
  for (const [id, options] of CHOICES) {
    const { descriptor, errors } = parse(embedCode("vue", id, options));
    assert.deepEqual(errors, []);
    assert.match(compileScript(descriptor, { id: "emblem" }).content, /onMounted/);
    assert.match(compile(embedCode("svelte", id, options), { filename: "Emblem.svelte", generate: "client" }).js.code, /dougu-emblem/);
  }
});

test("the iframe is the embed page at the size chosen, and every name in its address is one the embed page reads", () => {
  const page = readFileSync("demo/embed.ts", "utf8");
  const reads = new Set([...page.matchAll(/"(\w+)"/g)].map((one) => one[1]));
  for (const [id, options] of CHOICES) {
    const frame = embedCode("iframe", id, options);
    assert.match(frame, new RegExp(`width="${Math.ceil(options.size!) + 16}"`));
    const address = /src="([^"]*)"/.exec(frame)![1]!.replace(/&amp;/g, "&");
    for (const name of new URL(address).searchParams.keys()) assert.ok(reads.has(name), name);
  }
});
