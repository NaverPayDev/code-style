# CLAUDE.md — @naverpay/markdown-lint

NaverPay's markdownlint ruleset + a thin CLI. CommonJS, `main` is `.markdownlint.jsonc`, bin
`markdownlint`. **No build.** Published `files`: `cli.js`, `.markdownlint.jsonc`.

## Pieces

- `.markdownlint.jsonc` — the ruleset, and the package's `main`. Written as **jsonc**: starts from
  `"default": false`, then turns on/configures rules individually with an explanatory comment above
  each (`// MDxxx: ...`). This file is the source of truth; consumers `extends` it.
- `cli.js` — wraps `markdownlint-cli2`'s `run()` and always appends `#**/node_modules` to ignore
  vendored markdown. Invoked as the `markdownlint` bin.
- `postInstall/` — `createConfigFile()` writes a `.markdownlint.jsonc` (`extends @naverpay/markdown-lint`)
  at the git root if absent. **Not currently wired** as an npm `postinstall` hook in `package.json`
  — it's a helper, so don't assume it runs on install.

## Tests

`pnpm vitest run` (`vitest.config.js` includes `**/*.test.js`). `index.test.js` loads the real
`.markdownlint.jsonc` with `markdownlint.readConfigSync(..., [parse])` (jsonc-parser) and runs
`markdownlint.sync` over inline good/bad strings, asserting the bad case reports the expected
`ruleNames`. **When you change a rule in `.markdownlint.jsonc`, add/adjust a matching case here.**
