# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@naverpay/code-style` is a pnpm + Turborepo monorepo that publishes NaverPay's shared
linting/formatting tooling to npm. Each package under `packages/*` is independently versioned
and published. There are two kinds of packages:

- **Built packages** (`eslint-config`, `eslint-plugin`) — real source compiled by Vite into
  dual CJS/ESM bundles under `dist/`. Their `package.json` `exports` point at `./dist/cjs/...`
  and `./dist/esm/...`, so **the package must be built before its exports resolve**.
- **Config-only packages** (`prettier-config`, `stylelint-config`, `biome-config`,
  `oxlint-config`, `oxfmt-config`, `editorconfig`, `markdown-lint`, `code-style-cli`) — ship raw config files
  (`.json`/`.js`) referenced directly by `main`/`exports`/`bin`. No build step, no `dist/`.

The repo **dogfoods its own packages**: the root `eslint.config.mjs` consumes
`@naverpay/eslint-config` + `@naverpay/eslint-plugin` (via `workspace:*`), and `.prettierrc` /
`.stylelintrc` extend the published configs.

## Per-package guides

Each package has its own `CLAUDE.md` with precise structure, build/test, and extension notes —
read the relevant one before working inside a package.

| Package | Kind | Guide |
| --- | --- | --- |
| `@naverpay/eslint-config` | built (Vite) | [packages/eslint-config/CLAUDE.md](./packages/eslint-config/CLAUDE.md) |
| `@naverpay/eslint-plugin` | built (Vite) | [packages/eslint-plugin/CLAUDE.md](./packages/eslint-plugin/CLAUDE.md) |
| `@naverpay/code-style-cli` | CLI, no build | [packages/code-style-cli/CLAUDE.md](./packages/code-style-cli/CLAUDE.md) |
| `@naverpay/markdown-lint` | CLI + config | [packages/markdown-lint/CLAUDE.md](./packages/markdown-lint/CLAUDE.md) |
| `@naverpay/stylelint-config` | config (rule modules) | [packages/stylelint-config/CLAUDE.md](./packages/stylelint-config/CLAUDE.md) |
| `@naverpay/prettier-config` | config-only | [packages/prettier-config/CLAUDE.md](./packages/prettier-config/CLAUDE.md) |
| `@naverpay/biome-config` | config-only | [packages/biome-config/CLAUDE.md](./packages/biome-config/CLAUDE.md) |
| `@naverpay/oxfmt-config` | config-only | [packages/oxfmt-config/CLAUDE.md](./packages/oxfmt-config/CLAUDE.md) |
| `@naverpay/oxlint-config` | config-only | [packages/oxlint-config/CLAUDE.md](./packages/oxlint-config/CLAUDE.md) |
| `@naverpay/editorconfig` | config-only (copied) | [packages/editorconfig/CLAUDE.md](./packages/editorconfig/CLAUDE.md) |

## Commands

Requires Node `>=20.13.1` and pnpm `>=9.1.3` (pinned to `pnpm@9.1.3`). Always use `pnpm`.

```bash
pnpm install              # also runs `lefthook install` via postinstall
pnpm build                # turbo build — builds eslint-config & eslint-plugin only
pnpm test                 # turbo test (vitest); test depends on build, so build runs first
pnpm lint                 # eslint; `prelint` builds the workspace first
pnpm lint:fix
pnpm prettier             # check; `prettier:fix` to write
pnpm markdownlint         # `markdownlint:fix` to write
```

**Build ordering matters.** Turbo's `build` has `dependsOn: ["^build"]` and `eslint-config`
depends on `eslint-plugin`, so plugin builds first. `test`, `test:watch`, and `prelint` all
depend on `build` — a stale or missing `dist/` will produce confusing failures in lint/test.

### Running a single package's tests

Tests use **vitest** (`"test": "vitest run"` in each buildable package). Scope with Turbo:

```bash
pnpm turbo test --filter=@naverpay/eslint-plugin     # one package
pnpm --filter @naverpay/eslint-plugin test            # bypass turbo (no auto-build)
cd packages/eslint-plugin && pnpm vitest run lib/rules/sort-exports.test.js   # one file
cd packages/eslint-plugin && pnpm vitest watch
```

Note: `eslint-config` still contains a legacy `jest.config.js`, but the active runner is vitest
(see its `test` script). `markdown-lint` has its own `vitest.config.js`.

## Package internals

### eslint-config (`packages/eslint-config`)

Flat-config (ESLint 9) presets. Root `index.js` exposes `configs.{node,react,typescript,strict,packageJson}`;
each lives in its own directory (`node/`, `react/`, `typescript/`, `strict/`, `packageJson/`, `yaml/`)
as `index.js` + `configs.js` (+ `rules/`). A separate `./custom` export
(`custom/index.js`) provides composable rule factories (e.g. `importOrder`,
`typescriptNamingConvention`) that consumers call with options. Built via Vite with two entries
(`./index.js`, `./custom/index.js`). Tests in `tests/`.

### eslint-plugin (`packages/eslint-plugin`)

Custom ESLint rules in `lib/rules/*.js`, registered in `lib/index.js`, each documented in
`docs/<rule>.md` with a colocated `*.test.js`. Current rules: `cognitive-complexity`,
`import-server-only`, `memo-react-components`, `optimize-svg-components`,
`peer-deps-in-dev-deps`, `prevent-default-import`, `sort-exports`, `svg-unique-id`. Built via
Vite from `./lib/index.js`. **When adding a rule:** add to `lib/rules/`, register in
`lib/index.js`, add `docs/<rule>.md` + tests.

### code-style-cli (`packages/code-style-cli`)

`cli.js` (bin: `code-style`) — interactive installer using `@inquirer/prompts`. Detects the
package manager from lockfiles, then installs/updates selected configs and writes their config
files. The catalog of tools (package names + config file scaffolds) lives in `configs.js`; add
new installable tools there.

The Vite builds use `@naverpay/pite`'s `createViteConfig` wrapper (see each package's
`vite.config.mjs`), which emits the dual CJS/ESM `dist/` layout.

## Releasing & changesets

Versioning/publishing is driven by **Changesets** (`baseBranch: main`, `access: public`).

- Any change to a publishable package needs a changeset: `pnpm changeset` (or use the
  `naverpay-changeset:changeset` skill). A CI workflow (`changesets-detect-add.yml`) nudges PRs
  that are missing one.
- The publish workflow (`release.yml`) runs on push to `main`: it builds, then publishes via
  `pnpm release` (`changeset publish --directory dist`). **Canary/RC** releases are triggered by
  commenting `canary-publish` / `rc-publish` (or `/canary-publish` / `/rc-publish`) on a PR.

## Conventions enforced automatically

- **Git hooks via lefthook** (`lefthook.yml`): `pre-commit` runs eslint + prettier --check +
  markdownlint on staged files (parallel); `commit-msg` runs `@naverpay/commit-helper` to
  validate the message.
- `pnpm.overrides` in the root `package.json` replaces `@changesets/assemble-release-plan` with
  NaverPay's fork — do not remove.
- The root ESLint config enforces `@naverpay/peer-deps-in-dev-deps` on every `package.json`:
  peer dependencies must also appear in devDependencies.
