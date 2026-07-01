# CLAUDE.md — @naverpay/oxlint-config

NaverPay's [oxlint](https://oxc.rs) config (Rust-based, ESLint-compatible linter). **Config-only** —
ships the `node/` and `react/` preset directories (`<preset>/.oxlintrc.json`). No build, no tests.
Peer dep: `oxlint@>=1.0.0`.

## Consumption gotcha — path resolution

oxlint resolves `extends` **relative to the config file's location**, not as a node module
specifier. Consumers therefore reference the full path, not the package name:

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json"]
}
```

This is why the package exposes real directories (`files: ["node", "react"]`) instead of
`exports`/`main`.

## Ruleset

`node/.oxlintrc.json` sets `env` (node/commonjs/es2023) and base rules (`eqeqeq: smart`,
`no-console`, `no-param-reassign`, `no-unused-vars` with `^_` ignore patterns) plus a set of
`@typescript-eslint/*` rules. An `overrides` block for `**/*.{ts,tsx}` disables the JS-only
`no-unused-vars`/`no-undef`/`no-unused-expressions` and switches to their `@typescript-eslint`
equivalents.

`react/.oxlintrc.json` `extends` the node preset (relative path `../node/.oxlintrc.json`), adds
`env.browser`, declares `plugins: ["react", "jsx-a11y"]` (both are **off by default** — declaring
them activates their `correctness` rules), and layers NaverPay's explicit React choices: `curly`,
`no-restricted-imports` (lodash), `react/rules-of-hooks`, `react/exhaustive-deps`,
`react/jsx-handler-names`, and `jsx-a11y/{alt-text,label-has-associated-control}`.

**Native-only.** These presets use only rules oxlint implements natively (Rust) — no `jsPlugins`.
Rules that require jsPlugins (`import/order`, `unused-imports`, `@naverpay/*` custom rules,
`@typescript-eslint` recommended-only rules) are intentionally out of scope; oxlint **silently
ignores** unknown rule names, so verify native support with `oxlint --rules` before adding one.
Edit these files to change rules; add a changeset.
