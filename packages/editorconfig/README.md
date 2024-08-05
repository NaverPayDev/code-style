# @naverpay/editorconfig

다양한 IDE에 일정한 포맷을 적용하기 위한 config

## 설치 방법

```bash
npm install @naverpay/editorconfig -D
```

## 주의 사항

- pnpm 으로 설치 후 `.editorconfig` 파일이 생성되지 않았다면, `node_modules` 를 삭제 후 [side-effects-cache](https://pnpm.io/npmrc#side-effects-cache) 설정을 false로 하고 다시 설치해주세요.

    ```bash
    pnpm install @naverpay/editorconfig -D --side-effects-cache false
    ```
