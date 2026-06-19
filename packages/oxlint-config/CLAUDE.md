# CLAUDE.md — @naverpay/oxlint-config

NaverPay's [oxlint](https://oxc.rs) config (Rust-based, ESLint-compatible linter). **Config-only** —
ships the `node/` directory (`node/.oxlintrc.json`). No build, no tests. Peer dep: `oxlint@>=1.0.0`.

## Consumption gotcha — path resolution

oxlint resolves `extends` **relative to the config file's location**, not as a node module
specifier. Consumers therefore reference the full path, not the package name:

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json"]
}
```

This is why the package exposes a real directory (`files: ["node"]`) instead of `exports`/`main`.

## Ruleset

`node/.oxlintrc.json` sets `env` (node/commonjs/es2023) and base rules (`eqeqeq: smart`,
`no-console`, `no-param-reassign`, `no-unused-vars` with `^_` ignore patterns) plus a set of
`@typescript-eslint/*` rules. An `overrides` block for `**/*.{ts,tsx}` disables the JS-only
`no-unused-vars`/`no-undef`/`no-unused-expressions` and switches to their `@typescript-eslint`
equivalents. Edit this file to change rules; add a changeset.
