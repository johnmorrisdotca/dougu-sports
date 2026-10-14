import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "site/", "node_modules/", "test-results/", "playwright-report/", ".readme-examples/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["scripts/**/*.mjs", "scripts/**/*.ts", "e2e/**/*.ts", "playwright.config.ts"], languageOptions: { globals: { console: "readonly", process: "readonly", URL: "readonly", Buffer: "readonly", document: "readonly", window: "readonly", matchMedia: "readonly", fetch: "readonly", setTimeout: "readonly", Image: "readonly", getComputedStyle: "readonly" } } },
  { files: ["demo/**/*.ts"], languageOptions: { globals: { document: "readonly", window: "readonly", location: "readonly", history: "readonly", navigator: "readonly", URLSearchParams: "readonly", localStorage: "readonly", matchMedia: "readonly", Blob: "readonly", URL: "readonly", console: "readonly", requestAnimationFrame: "readonly", setTimeout: "readonly", clearTimeout: "readonly", CSS: "readonly", Image: "readonly", MutationObserver: "readonly" } } },
);
