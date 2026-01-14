# @naverpay/editorconfig

## 2.0.0

### Major Changes

- 1a3a7ca: postinstall 스크립트 제거

  **Breaking Changes**

  - `postinstall` 스크립트가 제거되어 설치 시 `.editorconfig` 파일이 자동으로 생성되지 않습니다
  - 기존: `npm install` 시 자동으로 `.editorconfig` 파일 생성
  - 변경: [`@naverpay/code-style-cli`](../code-style-cli/README.md) 사용 또는 수동으로 파일 복사 필요

  **문서 업데이트**

  - README에 권장 설치 방법 추가 (`@naverpay/code-style-cli` 사용)
  - 수동 설치 방법 안내 추가

## 1.0.0

### Major Changes

- bdcd680: Create major version

## 0.0.4

### Patch Changes

- 4c4e207: [#19] 패키지별 메타정보 추가

## 0.0.3

### Patch Changes

- 2acfdf7: [#11] @naverpay/eslint-config 추가

## 0.0.2

### Patch Changes

- 2157277: 0.0.2 버전 출시
