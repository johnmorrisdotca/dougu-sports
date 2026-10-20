# Contributing

Thank you for helping. Bug reports, ideas and pull requests are all welcome.
Bug reports and ideas go in the
[issues](https://github.com/johnmorrisdotca/dougu-sports/issues).

## The rules

- **No runtime dependencies.** The package is a few modules of plain TypeScript that return strings; a dependency is not
  added for convenience.
- **The core is pure.** Every function returns new values and never changes what it was given.
- **A drawing is a pure function of its options.** No clock, no random number, no counter: the same id and options give the
  same string, and a test holds it. A gradient's id comes from the colour it paints.
- **Anything from outside is made safe.** A colour is read as `#rgb`, `#rrggbb` or `rgb()` and anything else is ignored; text is
  escaped. A new option that reaches the markup has a test with a hostile value.
- **One module per item.** An emblem is one file, `src/emblems/<group>/<name>.ts`, made with `/* @__PURE__ */` and exported by
  its id in capitals, so that one import takes one emblem (the balls and the gear are one module per family). [docs/layout.md](docs/layout.md)
  says where each group goes and how to add one; `test/size.test.ts` holds a single item to a limit for its kind (a medal 4.6 kB,
  a cup 7.1 kB or a ball 7.6 kB gzipped, most of it the renderer; `bindTurn` and a cup 10 kB).
- **A named trophy is a very close likeness, drawn and never traced** ([docs/likeness.md](docs/likeness.md)). Where a trophy stands for one real trophy (a cup, a bowl, an award with a name), the drawing is a very, very close likeness of the original: the photographs of
  the real object are the reference, the proportions of each part are measured on them, and the drawing is checked against the photograph at the same height until someone who knows the trophy knows it at once. The drawing is our own vector, made in the lathe's
  numbers: never the photograph, never a copy of anyone's drawing, never an automatic trace. The id, the title and the docs may carry the trophy's own name (`trophy:stanley-cup`, "Stanley Cup"), because the name is what it is; the drawing carries no lettering, no logo,
  no league, team or sponsor mark, and no real engraving (a band that holds an engraving is left plain, for the `engrave` option). A trophy that stands for no real one stays generic and is named for what it is (`trophy:hockey-cup`: a tall banded silver cup). The
  photograph looked at, and its licence, go in `docs/likeness-sources.md`. Look at a contact sheet (`node scripts/emblem-sheet.ts sheet.png trophy/<name>`) at 256, 64 and 16 pixels, light and dark, and at the comparison (`node scripts/likeness.ts compare`).
- **Japanese names are read** by someone who reads Japanese before they ship.
- **Test what you change.** Tests sit in `test/`. A rule you change has a test that would have caught it.
- **Art is drawn for this package, never copied.** No icon set, emoji, clip art or photograph goes in, so `LICENSES/` holds the MIT text and nothing
  else, and `NOTICE.md` has no sources to list (it keeps the rulebooks the balls' sizes are read from: facts, not art). No logo or mark of a league,
  team or federation: every emblem is generic.
- **Names are short.** An emblem's `en` and `ja` are its accessible name (the `<title>` a screen reader reads): about 26 characters at most in English
  and 12 in Japanese. What does not fit goes in `src/emblems/emblem.descriptions.ts`, for the docs and the gallery.
- **`docs/gallery.md` (English) and `docs/gallery.ja.md` (Japanese) are made from the package**: `pnpm gallery` rewrites them, and `pnpm test:readme` checks them.
- **Docs pages are single-language.** Every page of the README and of `docs/` is in one language: one page per language, made from one source where that is practical, the Japanese one named `<name>.ja.md`, and the two linked at the top with a line such as `日本語 · English`. No page mixes English and Japanese in a table or in its prose, and a demo switches language with a control. Proper nouns and code identifiers (an id such as `gear:judogi`, a constant) stay as they are on both pages, and a Japanese term that is itself the subject (the package's own name, a knot) may appear once on an English page as a quoted name. The exception is a page about the translations themselves (`docs/strings-ja.md`, a terminology reference), which may show both languages side by side. A test, `docs-language.test`, holds the docs to this and lists each exception with its reason.
- **A README table, example or count that a test holds to the code** changes together with the code: `pnpm test:readme` runs
  every example of the README and of `docs/`, and checks that the README names every export.
- **Option values and names are kebab case where they are words** (`"metal"`, `"line"`, `"color"`).
- **Needs Node 22 or later** to use the package, and **22.18 or later** to work on it: the tests, the scripts (`scripts/*.ts`) and the demo's server run TypeScript directly with Node's own type stripping, with no `tsx` and no build step. So the TypeScript in `scripts/`, `test/`, `e2e/` and `demo/` uses only syntax that can be erased: no `enum`, no `namespace`, no constructor parameter properties (`erasableSyntaxOnly` rejects them), `import type` for types, and a `.ts` extension on every relative import. `pnpm typecheck` checks all of it. The demo's scripts (`demo/*.ts`) run in a browser, so `scripts/page.ts` builds them with esbuild into `.js`.
- **Ports.** This package owns local ports 7200 to 7299 and nothing outside them. The demo's server is on 7200 (`scripts/dev.ts`),
  the tests' on 7201 (`playwright.config.ts`; `TEST_PORT` names another, so that two worktrees do not meet), the picture script's on 7202, and any other server or worktree takes 7203 and up.
  Check with `lsof -iTCP:<port> -sTCP:LISTEN` first, and stop a server by its process id, never by name.

## Pull requests

One change per pull request. Say what changed and how you checked it, and add a line to `CHANGELOG.md` under **Unreleased**:
for a change a user would notice, and for one to the repository alone.

## Commands

```sh
pnpm check          # lint, types, tests, the build and the packed package
pnpm test:package   # pack it as npm does, install it in an empty project, import every entry, bundle one item
pnpm test:demo      # build the demo and play it in a real browser at a phone's width and a desk's
pnpm test:readme    # run the examples of the README and of docs/ against the built package
pnpm gallery        # rewrite docs/gallery.md and docs/gallery.ja.md from the built package
pnpm screenshots    # the README's pictures, into docs/images
pnpm dev            # the demo on http://127.0.0.1:7200/ (and /gallery.html)
```

## A release that adds something to look at

New visual feature (a trophy, a ball series, a uniform or gear, a style)? Update the README images (`pnpm screenshots`, or `ONLY=<name> node scripts/screenshots.ts` for one) and add a showcase section to the docs if the current examples do not show it well, linked from the README. A small fix or an internal change needs neither.

## Releasing

Maintainers bump the version in `package.json` and in `src/version.ts`, move *Unreleased* to the new version in
`CHANGELOG.md`, dated, push, wait for CI and tag `vX.Y.Z`, the same as `package.json`'s version. The Release workflow
(`.github/workflows/release.yml`) checks and builds the package, attaches the tarball to a GitHub release and publishes it to
npm by trusted publishing, with provenance and no token. A version already on npm is not published again.
