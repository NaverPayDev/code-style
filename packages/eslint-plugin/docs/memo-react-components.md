# `@naverpay/memo-react-components`

> 🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

주어진 경로의 React 컴포넌트들을 자동으로 memoize 합니다.

## 설명

변수 선언문, 함수 표현식으로 작성된 컴포넌트를 memoize 합니다.  
함수 선언문으로 작성된 컴포넌트는 memoize 하지 않습니다.

### This will be reported

```tsx
const Foo = () => {
    return <></>
}

const Bar = function () {
    return <></>
}
```

### This will not be reported

```tsx
function Foo() {
    return <></>
}
```

## 옵션

### `path: [array]`

memoize 할 컴포넌트의 경로를 지정합니다.

```json
{
    "path": ["/src/assets/*.tsx", "/src/components/assets/*!(.stories).tsx"]
}
```

## 예시

```json
{
    "@naverpay/memo-react-components": [
        "warn",
        {
            "path": ["/src/assets/*.tsx", "/src/components/assets/*!(.stories).tsx"]
        }
    ]
}
```
