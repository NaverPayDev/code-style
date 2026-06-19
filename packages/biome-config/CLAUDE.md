# CLAUDE.md — @naverpay/biome-config

NaverPay's Biome config. **Config-only** — the package is `biome.json` (`main`/`exports`). No build,
no tests. Peer dep: `@biomejs/biome@^2.0.6`. Consumed via `"extends": ["@naverpay/biome-config"]`.

## Scope: formatter only

By design this **replaces Prettier, not ESLint** — `linter.enabled: false`. Biome's `assist` is
**on** (so JSX props / object keys may get sorted), but `organizeImports` is deliberately **off**
because it conflicts with ESLint's `import/order`. Don't enable `organizeImports` here while
`@naverpay/eslint-config`'s import ordering is in use.

Formatter settings mirror `@naverpay/prettier-config`: 4-space indent, `lineWidth: 120`, `lf`,
single quotes, `semicolons: "asNeeded"`, `trailingCommas: "all"`, `bracketSpacing: false`,
`arrowParentheses: "always"`; JSON uses `trailingCommas: "none"`. Keep these in sync with the
Prettier/editorconfig packages when changing the house style.

## Gotchas

- The package ships **no `ignore`** — consumers exclude files via `files.includes` with `!` globs.
- The `$schema` version pinned in `biome.json` should track the Biome major in `peerDependencies`.
