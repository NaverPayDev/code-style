---
"@naverpay/editorconfig": major
"@naverpay/markdown-lint": major
---

### Breaking Changes

- `postinstall` 스크립트 제거로 자동 설정 파일 생성 기능이 제거됨
- `@naverpay/code-style-cli` 사용을 권장하는 방식으로 설치 가이드 변경

### 변경 사항

- **@naverpay/editorconfig**: `postinstall` 스크립트 및 관련 파일(`createConfigFile.js`, `index.js`) 제거, README 업데이트
- **@naverpay/markdown-lint**: `postinstall` 스크립트 제거 및 npm 배포 대상에서 `postInstall` 제외, README 업데이트
