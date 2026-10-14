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
- **One module per item.** An emblem is one file, `src/emblems/<folder>/<name>.ts`, made with `/* @__PURE__ */` and exported by
  its id in capitals, so that one import takes one emblem. [docs/layout.md](docs/layout.md) says where each group goes and how to
  add one; `test/size.test.ts` holds a single item under 3 kB gzipped.
- **Test what you change.** Tests sit in `test/`. A rule you change has a test that would have caught it.
- **Art is shipped only when its licence lets it be**, with the notice kept in `NOTICE.md` and the licence text in `LICENSES/`.
  Allowed: art drawn for this package, Apache-2.0 (Material Symbols, Noto, Pictogrammers MDI), CC BY 3.0 (game-icons.net, with
  each author credited), CC0, public domain. No GPL or LGPL, no non-commercial or no-derivatives licence, and no logo or mark of a
  league, team or federation: every emblem is generic.
- **`docs/gallery.md` is made from the package**: `pnpm gallery` rewrites it, and `pnpm test:readme` checks it.
- **A README table, example or count that a test holds to the code** changes together with the code: `pnpm test:readme` runs
  every example of the README and of `docs/`, and checks that the README names every export.
- **Option values and names are kebab case where they are words** (`"metal"`, `"line"`, `"color"`).
- **Needs Node 22 or later**; the tests run the TypeScript source with `node --test`, which needs 22.18 or later.
- **Ports.** This package owns local ports 7200 to 7299 and nothing outside them. The demo's server is on 7200 (`scripts/dev.mjs`),
  the tests' on 7201 (`playwright.config.mjs`), the picture script's on 7202, and any other server or worktree takes 7203 and up.
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
pnpm gallery        # rewrite docs/gallery.md from the built package
pnpm screenshots    # the README's pictures, into docs/images
pnpm dev            # the demo on http://127.0.0.1:7200/ (and /gallery.html)
```

## Releasing

Maintainers bump the version in `package.json` and in `src/version.ts`, move *Unreleased* to the new version in
`CHANGELOG.md`, dated, push, wait for CI and tag `vX.Y.Z`, the same as `package.json`'s version. The Release workflow
(`.github/workflows/release.yml`) checks and builds the package, attaches the tarball to a GitHub release and publishes it to
npm by trusted publishing, with provenance and no token. A version already on npm is not published again.
