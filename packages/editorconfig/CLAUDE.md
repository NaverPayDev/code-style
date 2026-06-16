# CLAUDE.md — @naverpay/editorconfig

NaverPay's shared `.editorconfig`. **Config-only** — the package is the `.editorconfig` file. No
build, no tests, and intentionally **no `main`/`exports`/`bin`**: it is consumed by copying the file
into a project, not by importing it.

Installation is by copy: `@naverpay/code-style-cli` uses its `copyFrom` mode
(`node_modules/@naverpay/editorconfig/.editorconfig`), or a user runs `cp` manually.

Current rules (`.editorconfig`): `*.{js,ts,tsx}` → utf-8, `lf`, 4-space indent, final newline,
`max_line_length = 120`, trim trailing whitespace; `*.{json,yml,yaml}` → same but no
`max_line_length`. Keep indent/width aligned with `@naverpay/prettier-config` and
`@naverpay/biome-config` when changing the house style.
