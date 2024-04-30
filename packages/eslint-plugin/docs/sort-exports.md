# `@naverpay/sort-exports`

> 🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

주어진 경로에 있는 모든 export 구문을 알파벳 또는 경로 순으로 정렬합니다.

## 설명

### This will be reported

```tsx
export {default as C} from './assets/C'
export {default as B} from './assets/B'
export {default as F} from './assets/F'
export * from './assets/Apple'
export * from './assets/Banana'
export {default as A} from './assets/new/A' 
export {default as G} from './assets/G'
export {default as D} from './assets/new/D' 
export {default as E} from './assets/new/E' 
export {default as H} from './assets/new/H'
```

### This will not be reported

```tsx
export {default as B} from './assets/B'
export {default as C} from './assets/C'
export {default as F} from './assets/F'
export {default as G} from './assets/G'
export {default as A} from './assets/new/A' 
export {default as D} from './assets/new/D' 
export {default as E} from './assets/new/E' 
export {default as H} from './assets/new/H'
export * from './assets/Apple'
export * from './assets/Banana'
```

## 옵션

### `rules: [object array]`

정렬할 파일과 규칙을 지정합니다.

- `paths`: 정렬 대상의 파일 경로
- `sortBy`
  - `path`: 경로를 우선 정렬, 경로가 동일하다면 변수명으로 정렬
  - `identifier`: 변수명을 기준으로 정렬

## 예시

```json
{
    "@naverpay/sort-exports": [
        "error",
        {
            "rules": [
                {
                    "paths": ["/src/components/index.ts"],
                    "sortBy": "path",
                    "depth": 3
                },
                {
                    "paths": ["/src/index.ts"],
                    "sortBy": "identifier"
                }
            ]
        }
    ]
}
```

## 주의사항

- 정렬시 마지막 줄에 있는 주석을 함께 가져오지만, 이전 주석은 가져오지 않습니다.
- 주석이 복잡하게 걸쳐 있는 경우에 대한 고려가 되어있지 않습니다. 😇
  - 기존 주석과 충돌될 여지가 있으니, 기존 주석을 모두 삭제하시고 정렬하는 것을 추천합니다.
- 기존 export 구문 사이에 위치만 변경하므로, 이전에 작성되어 있는 개행까지 정렬해주지 않습니다.
