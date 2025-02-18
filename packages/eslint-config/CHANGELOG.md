# @naverpay/eslint-config

## 2.1.0

### Minor Changes

- 3583e33: 🔥 naming-convention 룰 제거

  PR: [🔥 naming-convention 룰 제거](https://github.com/NaverPayDev/code-style/pull/81)

### Patch Changes

- Updated dependencies [d4022dc]
  - @naverpay/eslint-plugin@2.0.1

## 2.0.0

### Major Changes

- 8277a65: - Support ESLint 9 and Flat Config
  - **Config Changes**:
    - Renamed `front` to `react`
    - Removed `typescript/next` config
    - Added `strict` config that extends `unicorn` and `sonarjs`
    - Added YAML lint in `node` and `react` configs
    - Disallowed unused imports in `node` and `react` configs
    - Enforced consistent usage of type imports in `typescript` and `react` configs
  - <https://github.com/NaverPayDev/code-style/pull/74>

### Patch Changes

- Updated dependencies [8277a65]
  - @naverpay/eslint-plugin@2.0.0

## 1.0.8

### Patch Changes

- Updated dependencies [0dfb8c9]
  - @naverpay/eslint-plugin@1.3.0

## 1.0.7

### Patch Changes

- Updated dependencies [8ace9da]
  - @naverpay/eslint-plugin@1.2.1

## 1.0.6

### Patch Changes

- 662f265: prevent-default-import jsx 문법 지원
- Updated dependencies [662f265]
  - @naverpay/eslint-plugin@1.2.0

## 1.0.5

### Patch Changes

- 294f2b7: peer dep 버전 범위 완화

## 1.0.4

### Patch Changes

- Updated dependencies [20133a4]
  - @naverpay/eslint-plugin@1.1.0

## 1.0.3

### Patch Changes

- 2e0d208: [#34] prettier 를 peerDependencies 로 이동합니다

## 1.0.2

### Patch Changes

- 4c4e207: [#19] 패키지별 메타정보 추가
- Updated dependencies [4c4e207]
  - @naverpay/eslint-plugin@1.0.2

## 1.0.1

### Patch Changes

- 04d855a: [#27] typescript-eslint update
- Updated dependencies [04d855a]
  - @naverpay/eslint-plugin@1.0.1

## 1.0.0

### Major Changes

- d2e94f1: - eslint-config에 plugin을 추가합니다.
  - plugin babel build 과정을 삭제합니다.

### Patch Changes

- Updated dependencies [d2e94f1]
  - @naverpay/eslint-plugin@1.0.0

## 0.2.0

### Minor Changes

- a498210: eslint config 내부 eslint 버전을 8로 고정합니다.

## 0.1.0

### Minor Changes

- 2acfdf7: [#11] @naverpay/eslint-config 추가
