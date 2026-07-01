# CLAUDE.md — @naverpay/code-style-cli

Interactive installer that wires the other `@naverpay/*` configs into a target project. ESM, bin
`code-style` (`npx @naverpay/code-style-cli`). **No build, no tests** — `cli.js` runs directly.
Only runtime dep: `@inquirer/prompts`.

## How it works

`cli.js` flow: require a `package.json` in cwd → detect the package manager from its lockfile
(`PACKAGE_MANAGERS` in `configs.js`) → `checkbox` prompt to pick tools (already-installed ones are
labeled) → `execSync` the install command → for each picked tool, scaffold its config file
(prompting before overwriting an existing one).

`configs.js` is the catalog and the only place you edit to change behavior:

- `TOOLS` — array of `{value, packages, configFile?, ...}`. `packages` is what gets installed.
- `TOOLS_MAP` — `value → tool` lookup. `PACKAGE_MANAGERS` — lockfile + install command per pm.

A tool scaffolds its config file via exactly one of three modes:

- `configContent` — a static string written verbatim (e.g. `.prettierrc`, `.oxlintrc.json`).
- `getContent()` — computed at run time (e.g. `biome.json` reads the installed `@biomejs/biome`
  version from the target's `package.json` to pin the `$schema` URL).
- `copyFrom` — copies an existing file out of `node_modules` (e.g. `.editorconfig`).

## Adding an installable tool

Append an entry to `TOOLS` in `configs.js` with its npm `packages` and, if it needs a config file,
one of the three modes above. `TOOLS` entries are not limited to this repo's packages — `packages`
may list any npm package (e.g. an entry can install a third-party tool alongside a `@naverpay/*`
config).
