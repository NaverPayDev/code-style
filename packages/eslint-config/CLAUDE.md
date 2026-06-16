# CLAUDE.md — @naverpay/eslint-config

ESLint **flat-config** (ESLint 9) presets for NaverPay. ESM source, compiled by Vite into dual
CJS/ESM `dist/`. **Built package** — `package.json` `exports` point at `./dist/...`, so the
package must be built before its entry points resolve. Depends on `@naverpay/eslint-plugin`
(`workspace:*`), so the plugin builds first.

## Two entry points

`vite.config.mjs` builds exactly two entries; everything else is imported into them:

- `./index.js` → the default export `{meta, configs}`. `configs` = `{node, react, typescript, strict, packageJson}`.
- `./custom` (`custom/index.js`) → composable **rule factories** consumers call with options:
  `importOrder({ruleSeverities, pathGroups})` and `typescriptNamingConvention({...})`. The naming
  data lives in `custom/typescript/naming-convention.js`.

## Preset layout

Each preset is a directory exporting a flat-config array; `index.js` wires them into `configs`:

- `node/` — `js.configs.recommended` + `neostandard({noStyle: true})` + `eslint-config-prettier` +
  `eslint-plugin-yml`, then `node/rules/` (`style.js`, `variable.js`, `import.js`) + Node/commonjs/jest/vitest globals.
- `typescript/` — `tseslint.config(rules, recommended, stylistic)`.
- `react/` — composes `typescript` + `react/rules/` + `yaml` + browser globals.
- `strict/` — `eslint-plugin-sonarjs` recommended + `eslint-plugin-unicorn` flat/recommended.
- `packageJson/` — `eslint-plugin-package-json` rules.
- `yaml/` — internal only (consumed by `node`/`react`), not exposed in `configs`.

**Adding a preset:** create `<name>/index.js`, import it into the root `index.js` `configs` object,
and add a `tests/<name>.test.js`. You do **not** add a Vite entry (only `./index.js` and `./custom`
are built).

## Tests

`pnpm vitest run` (depends on build). Tests in `tests/*.test.js` use the helper in
`tests/utils/index.js`: `createLinter({ruleId, config})` runs the real `ESLint` programmatically and
returns only the messages for `ruleId`; assert with `lintText(code)` → `toHaveLength(0)` for valid,
`checkErrorRule(result, ruleId)` for invalid. A legacy `jest.config.js` remains but the active
runner is vitest.

Run one file: `pnpm vitest run tests/node.test.js`.
