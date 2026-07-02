---
'@naverpay/oxlint-config': minor
---

[#164] oxlint-config 프리셋에 jsPlugins 룰 추가 (unused-imports, @naverpay/prevent-default-import)

oxlint 네이티브에 없는 룰을 문자열 배열 형식의 `jsPlugins`로 추가했습니다 (`oxlint@>=1.0` 호환 유지). 필요한 플러그인은 패키지 `dependencies`로 함께 설치됩니다.

- node 프리셋: `eslint-plugin-unused-imports` → `unused-imports/no-unused-imports`
- react 프리셋: `@naverpay/eslint-plugin` → `@naverpay/prevent-default-import` (node의 unused-imports는 `extends`로 병합 상속)

주의: `jsPlugins`는 experimental 단계라 실행 시 경고가 출력되고 IDE(oxc LSP)에서는 표시되지 않습니다. `import/order`·react 옵션 오버라이드는 네임스페이스 예약(`import`/`react`) 때문에 문자열 형식으로 불가하여 객체 형식(oxlint 상향 필요)과 함께 후속 작업으로 분리합니다.
