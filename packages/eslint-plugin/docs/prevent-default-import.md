# `@naverpay/prevent-default-import`

> 🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

패키지 목록을 받아, 해당 패키지 default import를 금지합니다.

## 설명

default import로 모듈을 가져오는 것을 금지합니다.  
해당 rule이 적용된 패키지는 member import 하세요.

### This will be reported

```tsx
import React from 'react'

React.useEffect(() => {
  // ..
}, [])
```

### This will not be reported

```tsx
import {useEffect} from 'react'

useEffect(() => {
  // ..
}, [])
```

## 옵션

### `packages: [array]`

default import를 금지할 패키지 목록을 작성합니다.

```json
{
    "packages": ["react", "lodash"]
}
```

## 예시

```json
{
    "@naverpay/prevent-default-import": ["error", {"packages": ["react"]}],
}
```
