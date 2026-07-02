---
'@naverpay/oxlint-config': minor
---

[#164] oxlint-config 에 `react` 프리셋 추가

`node` 프리셋을 확장하는 `react/.oxlintrc.json` 프리셋을 신설했습니다. `@naverpay/eslint-config` 의 react 프리셋을 기준으로, oxlint 가 **네이티브로 지원하는 룰만** 미러링했습니다 (jsPlugins 미사용 → 새 의존성 없음, IDE(oxc LSP) 정상 동작, experimental 경고 없음).

- `plugins: ["react", "jsx-a11y"]` 선언 (두 플러그인은 기본 비활성 → 선언 시 correctness 룰 활성화)
- 명시 룰: `curly`, `no-restricted-imports`(lodash), `react/rules-of-hooks`, `react/exhaustive-deps`, `react/jsx-handler-names`, `jsx-a11y/{alt-text,label-has-associated-control}`
- 소비: `extends: ["./node_modules/@naverpay/oxlint-config/react/.oxlintrc.json"]`

> `import/order`, `unused-imports`, `@naverpay/*` 커스텀 룰 등 네이티브 미지원분은 jsPlugins 가 필요해 이번 범위에서 제외했습니다 (#164 후속).
