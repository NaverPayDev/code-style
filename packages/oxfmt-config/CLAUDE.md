# CLAUDE.md — @naverpay/oxfmt-config

NaverPay's [oxfmt](https://oxc.rs/docs/guide/usage/formatter) config (the oxc Rust-based formatter).
**Config-only** — the package is `.oxfmtrc.json` (`main`/`exports`). No build, no tests. Peer dep:
`oxfmt@>=0.50.0`.

## Scope: formatter only

By design this **replaces Prettier**, mirroring `@naverpay/prettier-config` and
`@naverpay/biome-config`: 4-space indent, `printWidth: 120`, `endOfLine: "lf"`, single quotes,
`semi: false`, `trailingComma: "all"`, `bracketSpacing: false`, `arrowParens: "always"`,
`bracketSameLine: false`, `useTabs: false`. Keep these in sync with the Prettier/Biome/editorconfig
packages when changing the house style. The `.oxfmtrc.json` values are exactly what
`oxfmt --migrate prettier` produces from `@naverpay/prettier-config`.

## Consumption — no `extends`, JS-config import

oxfmt has **no `extends` key** — the maintainers explicitly declined to add one
([oxc#16394](https://github.com/oxc-project/oxc/issues/16394)), pointing to JS/TS config files as
the composition mechanism. oxfmt auto-discovers `.oxfmtrc.json`, `.oxfmtrc.jsonc`, and
`oxfmt.config.ts` (verified: only `oxfmt.config.ts` among the JS/TS forms auto-loads in 0.56.0;
others like `oxfmt.config.js`/`.mjs` and `.oxfmtrc.ts` do **not**).

So the package is consumed by importing its JSON into an `oxfmt.config.ts`:

```ts
import {defineConfig} from 'oxfmt'
import config from '@naverpay/oxfmt-config' with {type: 'json'}

export default defineConfig(config) // or {...config, <overrides>}
```

This is why the package keeps `exports: {".": "./.oxfmtrc.json"}` — the `with {type: 'json'}` import
resolves through it. The raw file path
(`./node_modules/@naverpay/oxfmt-config/.oxfmtrc.json`) also works as a `-c`/`--config` argument for
JSON-only setups (no local overrides possible that way).

## Gotchas

- The package ships **no `ignorePatterns`** — oxfmt defaults to honoring `.gitignore` /
  `.prettierignore`; consumers add `ignorePatterns` in their `oxfmt.config.ts` override.
- The CLI catalog (`@naverpay/code-style-cli` → `configs.js`) scaffolds an `oxfmt.config.ts` that
  imports this package; the house-style values live only here.
