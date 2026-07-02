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

## jsPlugins (experimental)

For rules oxlint has no native (Rust) implementation, the presets load ESLint-compatible plugins
via `jsPlugins` (string-array form, so it works on `oxlint@>=1.0`). These plugins ship as package
`dependencies` so they resolve for consumers:

- node preset — `eslint-plugin-unused-imports` → `unused-imports/no-unused-imports`
- react preset — `@naverpay/eslint-plugin` → `@naverpay/prevent-default-import`

`jsPlugins` arrays **merge across `extends`**, so the react preset inherits the node preset's
`unused-imports`. Two caveats, inherent to oxlint's JS-plugin support (not the format):

- oxlint prints an **experimental warning** on every run.
- JS plugins are **not supported in the language server** (no IDE/oxc-LSP diagnostics for them).

**String-format limitation.** JS plugins can't be renamed, so plugins whose `meta.name` collides
with a reserved native namespace **fail to load** (`import`, `react` are reserved). That blocks
`import/order` (`eslint-plugin-import`) and `eslint-plugin-react` option overrides — those need the
object form `{name, specifier}`, which requires a newer oxlint and drops `1.x` back-compat. They are
deferred to a follow-up. Note the scoped `@naverpay/eslint-plugin` registers under namespace
`@naverpay` (first path segment), so its rules are keyed `@naverpay/<rule>`.

## Adding rules

oxlint **silently ignores** unknown rule names — verify native support with `oxlint --rules` before
adding a native rule, or add a jsPlugin (mind the reserved-namespace limitation above). Edit the
preset files to change rules; add a changeset.
