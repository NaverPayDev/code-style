# `peer-deps-in-dev-deps`

> **이 규칙은** `package.json`에 선언된 **모든 `peerDependencies`가 `devDependencies`에도 함께 선언되어 있는지** 검사합니다.

## 설명

팀 내 프로젝트 관리나 모듈 의존성 관리를 할 때, `peerDependencies`로 선언된 라이브러리가 `devDependencies`에도 존재하지 않는다면 로컬 개발 환경이나 CI/CD 환경에서 빌드 에러, 혹은 호환성 문제가 발생할 수 있습니다.

이 규칙은 `package.json` 파일을 확인하고, `peerDependencies` 항목에 있는 패키지가 `devDependencies`에도 선언되어 있는지 검사합니다.

- **대상 파일**: `package.json` (파일명이 정확히 `"package.json"`일 때만 검사)
- **검사 내용**: `peerDependencies`에 선언된 패키지가 `devDependencies`에 없는 경우 오류 리포트

## 규칙 상세

### 발생하는 케이스

```jsonc
// package.json
{
  "peerDependencies": {
    "example-lib": "^1.0.0"
  }
  // "devDependencies"에 "example-lib"가 없음
}
```

```jsonc
// package.json
{
  "peerDependencies": {
    "example-lib": "^1.0.0"
  }
  // "devDependencies"에 "example-lib"가 없음
  "devDependencies": {

  }
}
```

## 발생하지 않는 케이스

```jsonc
// package.json
{
  "peerDependencies": {
    "example-lib": "^1.0.0"
  },
  "devDependencies": {
    "example-lib": "^1.0.0"
  }
}
```

```jsonc
// package.json
{
  "peerDependencies": {
    "example-lib": "^1.0.0"
  },
  "devDependencies": {
    // 버전은 검사하지 않습니다.
    "example-lib": "^1.2.0"
  }
}
```

## 옵션

이 규칙은 별도 옵션이 필요하지 않습니다.

## 설정

```js
import naverpayPlugin from '@naverpay/eslint-plugin'

// eslint.config.js
export default [
  {
    files: ["**/package.json"],
    plugins: {'@naverpay': naverpayPlugin},
    rules: {
      '@naverpay/peer-deps-in-dev-deps': 'error',
    },
  },
]
```

## 제한

- 이 규칙은 수정(fixable) 기능을 제공하지 않으므로, 자동으로 `devDependencies`에 패키지를 추가해주지 않습니다. 경고 혹은 에러를 보고하면 수동으로 `package.json` 파일을 수정해야 합니다.
  - 개발하시는 패키지에서 필요한 버전을 특정할 수 없어 발생한 제약 입니다.
- 파일명이 정확히 `package.json`이 아니면 검사 대상에서 제외됩니다.
- 만약, eslint.config.js 내에 json 파일에 대해 이미 사용하고 parser가 없다면 jsonc-eslint-parser를 추가해주세요.

  ```js
  // eslint.config.js
  import naverpayPlugin from '@naverpay/eslint-plugin'
  import * as parserJsonc from 'jsonc-eslint-parser'

  export default [
    {
      files: ["**/package.json"],
      languageOptions: {
        parser: parserJsonc,
      },
      plugins: {'@naverpay': naverpayPlugin},
      rules: {
        '@naverpay/peer-deps-in-dev-deps': 'error',
      },
    },
  ]
  ```
