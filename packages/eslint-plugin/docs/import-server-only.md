# `@naverpay/import-server-only`

> 🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

주어진 경로의 파일에 `server-only` 패키지를 포함하도록 강제합니다.

## 설명

서버에서만 이용되는 파일에 대해서 `server-only` 패키지를 필수적으로 포함하도록 강제합니다.

### This will be reported

```tsx
// import 'server-only'
```

### This will not be reported

```tsx
import 'server-only'
```

## 옵션

### `include: [array]`

server-only 패키지를 포함해야하는 경로

```json
{
    "include": ["app/server/**/*.ts"]
}
```

### `exclude: [array]`

server-only 패키지를 포함되지 않아도 되는 경로

```json
{
    "exclude": ["app/server/exclude/**/*.ts"]
}
```

## 예시

```json
{
    "@naverpay/import-server-only": [
        "error",
        {
            "include": ["app/server/**/*.ts"],
            "exclude": ["app/server/exclude/**/*.ts"]
        }
    ]
}
```
