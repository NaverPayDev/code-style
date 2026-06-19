# CLAUDE.md — @naverpay/stylelint-config

NaverPay's Stylelint config for CSS/SCSS. ESM (**consumers must use ESM** — `.mjs` config or
`"type": "module"`), `main` is `index.js`. **No build, no test script** (`turbo test` skips it).

## Structure

- `index.js` — the exported config object. Sets `overrides` so `**/*.css` parses with `postcss` and
  `**/*.{sass,scss}` with `postcss-scss`; registers the `stylelint-scss` + `stylelint-order`
  plugins; merges all rules; `defaultSeverity: 'warning'` (the repo root and the CLI scaffold
  override this to `'error'`).
- `src/rules/stylelint/index.js` — aggregates the core rules from per-category modules
  (`color/`, `font/`, `length/`, `unit/`, `declaration/`, `property/`, `function/`, `selector/`,
  `at-rule/`, `block/`, `comment/`, `rule/`, `media-feature/`, `general/`). Each category is a
  `{ruleName: value}` object in its own `index.js` with a sibling `README.md`.
- `src/rules/stylelint-order/` and `src/rules/stylelint-scss/` — plugin-specific rule sets, merged
  into `index.js` alongside the core rules.

## Test fixtures (not an automated suite)

`__test__/<category>/{valid,invalid}.test.scss|.css` are hand-written fixtures for verifying rule
changes manually — there is no test runner configured for this package. After editing a category's
rules, run Stylelint against the relevant fixtures to confirm valid passes and invalid fails.

## Adding/changing rules

Edit (or add) the category module under `src/rules/stylelint/<category>/index.js`, register new
categories in `src/rules/stylelint/index.js`, document in the category `README.md`, and update the
`__test__` fixtures.
