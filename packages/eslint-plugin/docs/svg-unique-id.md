# `@naverpay/svg-unique-id`

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

주어진 경로의 SVG 컴포넌트들에 고유한 id를 부여하는 HOC를 추가합니다.

## 필수 패키지

`@naverpay/svg-manager` 패키지가 필요합니다.  

```sh
npm i @naverpay/svg-manager -D
```

> **왜 필요한가요?**
>
> - `@naverpay/svg-manager`는 SVG 관련 타입과 HOC 등을 정의합니다.
> - 해당 규칙이 불필요한 환경에서 설치되는 것을 방지하고자, 규칙을 사용되는 곳에서만 의존성을 설치합니다.

## 설명

SVG 컴포넌트 내부 요소의 id가 동일할 때, SVG 컴포넌트를 같은 화면에서 여러 번 사용하게 된다면
SVG 내부 요소가 제대로 그려지지 않을 수 있습니다.  
id 중복 문제를 해결하기 위해 `<SvgUniqueID />` Wrapper로 SVG 컴포넌트를 감쌉니다.

## 옵션

### `paths: [array]`:

대상 파일 경로

## Examples

```json
"@naverpay/svg-unique-id": [
    "warn",
    {
        "paths": [
            "/packages/common-bi/src/assets/*.tsx"
        ]
    }
]
```
