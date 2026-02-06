# @naverpay/markdown-lint

## 2.0.1

### Patch Changes

- d4cbb0d: 테스트 러너를 jest에서 vitest로 마이그레이션

  - vitest 설정 파일 추가
  - 테스트 파일의 import 구문을 ESM 형식으로 변경
  - jest 관련 설정 및 의존성 제거
  - package.json의 test 스크립트를 vitest로 변경

## 2.0.0

### Major Changes

- 1a3a7ca: postinstall 스크립트 제거

  **Breaking Changes**

  - `postinstall` 스크립트가 제거되어 설치 시 `.markdownlint.json` 파일이 자동으로 생성되지 않습니다
  - 기존: `npm install` 시 자동으로 `.markdownlint.json` 파일 생성
  - 변경: [`@naverpay/code-style-cli`](../code-style-cli/README.md) 사용 또는 수동으로 설정 파일 생성 필요

  **문서 업데이트**

  - README에 권장 설치 방법 추가 (`@naverpay/code-style-cli` 사용)
  - 수동 설치 방법 안내 추가 (`.markdownlint.jsonc` extends 사용)

## 1.0.0

### Major Changes

- bdcd680: Create major version

## 0.0.3

### Patch Changes

- 4c4e207: [#19] 패키지별 메타정보 추가

## 0.0.2

### Patch Changes

- b8b23bb: [#5] @naverpay/markdown-lint 패키지를 추가합니다
