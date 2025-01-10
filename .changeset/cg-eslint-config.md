---
"@naverpay/eslint-config": major
---

- Support ESLint 9 and Flat Config
- **Config Changes**:
  - Renamed `front` to `react`
  - Removed `typescript/next` config
  - Added `strict` config that extends `unicorn` and `sonarjs`
  - Added YAML lint in `node` and `react` configs
  - Disallowed unused imports in `node` and `react` configs
  - Enforced consistent usage of type imports in `typescript` and `react` configs
- <https://github.com/NaverPayDev/code-style/pull/74>
