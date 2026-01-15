---
"@naverpay/markdown-lint": patch
---

테스트 러너를 jest에서 vitest로 마이그레이션

- vitest 설정 파일 추가
- 테스트 파일의 import 구문을 ESM 형식으로 변경
- jest 관련 설정 및 의존성 제거
- package.json의 test 스크립트를 vitest로 변경
