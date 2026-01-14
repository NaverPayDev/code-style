---
"@naverpay/editorconfig": major
---

postinstall 스크립트 제거

**Breaking Changes**

- `postinstall` 스크립트가 제거되어 설치 시 `.editorconfig` 파일이 자동으로 생성되지 않습니다
- 기존: `npm install` 시 자동으로 `.editorconfig` 파일 생성
- 변경: [`@naverpay/code-style-cli`](../code-style-cli/README.md) 사용 또는 수동으로 파일 복사 필요

**문서 업데이트**

- README에 권장 설치 방법 추가 (`@naverpay/code-style-cli` 사용)
- 수동 설치 방법 안내 추가
