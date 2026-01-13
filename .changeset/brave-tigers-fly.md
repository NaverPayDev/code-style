---
"@naverpay/markdown-lint": major
---

### Breaking Changes

- `postinstall` 스크립트 제거로 패키지 설치 시 자동 설정 파일 생성 기능이 제거됨
  - 기존: `npm install` 시 `.markdownlint.json` 파일이 프로젝트 루트에 자동 생성
  - 변경: 수동으로 설정 파일 생성 필요 또는 `@naverpay/code-style-cli` 사용 권장

### 코드 정리

- `package.json`에서 `postinstall` 스크립트 제거
- npm 배포 대상(`files`)에서 `postInstall` 디렉토리 제외

### 문서 업데이트

- README에 새로운 설치 가이드 추가 (`@naverpay/code-style-cli` 사용 또는 수동 설정 방법 안내)
