# @naverpay/code-style-cli

## 0.1.1

### Patch Changes

- 10b922c: [#162] code-style-cli 에 oxfmt-config 지원 추가

  oxfmt 항목을 `@naverpay/oxfmt-config` 설치 + `oxfmt.config.ts` scaffold 방식으로 변경. (oxfmt 는 `extends` 가 없어 `oxfmt.config.ts` 에서 `import config from '@naverpay/oxfmt-config' with {type: 'json'}` 로 사용)

  > `@naverpay/oxfmt-config` 패키지(0.0.1)는 첫 배포라 OIDC 가 없어 로컬에서 수동 배포했습니다.

## 0.1.0

### Minor Changes

- 8f6112c: [code-style-cli] 패키지 설치 및 설정 파일 생성 CLI 도구 추가

  PR: [[code-style-cli] 패키지 설치 및 설정 파일 생성 CLI 도구 추가](https://github.com/NaverPayDev/code-style/pull/139)
