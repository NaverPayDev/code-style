# CLAUDE.md — @naverpay/prettier-config

NaverPay's Prettier config. **Config-only** — the entire package is `index.json` (the `main`).
No build, no tests. Peer dep: `prettier@^2.8.8 || ^3.0.0`.

Consumed as a string reference: `"@naverpay/prettier-config"` in `.prettierrc`, or the `"prettier"`
key in a project's `package.json`.

Current settings (`index.json`): `singleQuote: true`, `semi: false`, `tabWidth: 4`,
`printWidth: 120`, `bracketSpacing: false`, `arrowParens: "always"`, `trailingComma: "all"`,
`endOfLine: "auto"`. To change the house style, edit `index.json` and add a changeset — these
values must stay aligned with `@naverpay/biome-config` (the Biome formatter that mirrors them) and
`@naverpay/editorconfig` (indent/width).
