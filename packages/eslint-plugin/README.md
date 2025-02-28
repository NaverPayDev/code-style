# @naverpay/eslint-plugin

네이버페이 스타일 가이드에 추가 기능을 제공하는 플러그인 패키지

## 설치 방법

```shell
npm install @naverpay/eslint-plugin -D
```

## 사용 방법

사용하고 싶은 rule이 있다면 eslint.config.js에 아래와 같이 설정해주세요:

1. plugins에 @naverpay/eslint-plugin을 추가합니다.
2. rules에 사용하고 싶은 규칙을 설정합니다.

```js
// eslint.config.js
import naverpay from "@naverpay/eslint-plugin";

export default [
    {
        plugins: {
            naverpay
        },
        rules: {
            // react 패키지에 대해 default import를 금지하는 규칙
            "naverpay/prevent-default-import": ["error", {"packages": ["react"]}]
        }
    }
];
```

## 규칙

🔧: [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix)을 통해 자동 수정이 가능합니다.

| Name                                                             | Description                                     | 🔧  |
| :--------------------------------------------------------------- | :---------------------------------------------- | :-- |
| [memo-react-components](docs/memo-react-components.md)     | 주어진 경로의 React 컴포넌트들을 자동으로 memoize 합니다.             | 🔧  |
| [optimize-svg-components](docs/optimize-svg-components.md)     | 주어진 경로의 svg 컴포넌트들을 [svgo](https://github.com/svg/svgo) 기반으로 최적화합니다.             | 🔧  |
| [prevent-default-import](docs/prevent-default-import.md)                       | 패키지 목록을 받아, 해당 패키지 default import를 금지합니다.                      | 🔧  |
| [sort-exports](docs/sort-exports.md)                       | 파일에 있는 모든 export 문을 정렬합니다.                      | 🔧  |
| [svg-unique-id](docs/svg-unique-id.md)                       | 주어진 경로의 SVG 컴포넌트들에 고유한 id를 부여하는 HOC를 추가합니다.                     | 🔧  |
| [import-server-only](docs/import-server-only.md)                       | 주어진 경로의 파일에 server-only 패키지를 포함하도록 강제합니다.                     | 🔧  |
| [peer-deps-in-dev-deps](docs/peer-deps-in-dev-deps.md)                       | `package.json`에서 동작하는 규칙으로, `peerDependencies` 에 있는 패키지가 `devDependencies` 에 선언되어 있지 않다면 에러를 발생시킵니다.                     |   |
