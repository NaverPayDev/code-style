# @naverpay/eslint-plugin

네이버페이 스타일 가이드에 추가 기능을 제공하는 플러그인 패키지

## 설치 방법

```shell
npm install @naverpay/eslint-plugin -D
```

## 사용 방법

사용하고 싶은 plugin이 있다면 eslint config 파일에서 `@naverpay/eslint-plugin`을 `plugins`에 추가하세요.

```jsonc
// .eslintrc
{
  "plugins": ["@naverpay/eslint-plugin"]
}
```

사용하고 싶은 plugin은 rules에 적용해주세요.

```jsonc
// .eslintrc
{
  "rules": {
    "@naverpay/prevent-default-import": ["error", {"packages": ["react"]}],
  }
}
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
