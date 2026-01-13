---
"@naverpay/editorconfig": major
---

### Breaking Changes

- `postinstall` 스크립트 제거로 패키지 설치 시 자동 설정 파일 생성 기능이 제거됨
  - 기존: `npm install` 시 `.editorconfig` 파일이 프로젝트 루트에 자동 생성
  - 변경: 수동으로 설정 파일 복사 필요 또는 `@naverpay/code-style-cli` 사용 권장

### 코드 정리

- `createConfigFile.js`, `index.js` 파일 삭제
- `package.json`에서 `postinstall` 스크립트 제거

### 문서 업데이트

- README에 새로운 설치 가이드 추가 (`@naverpay/code-style-cli` 사용 또는 수동 복사 방법 안내)
