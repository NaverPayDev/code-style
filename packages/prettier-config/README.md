# @naverpay/prettier-config

네이버페이 스타일 가이드에 맞게 prettier 설정을 커스텀하여 제공합니다.

## 설치 방법

```bash
npm install @naverpay/prettier-config -D
```

## 사용 방법

.prettierrc 파일을 생성하고 `@naverpay/prettier-config` 패키지를 추가합니다.

```json
"@naverpay/prettier-config"
```

또는

package.json 파일에 키를 추가합니다.

```json
"prettier": "@naverpay/prettier-config"
```

## CLI

package.json에 스크립트를 추가하여 format 검사를 할 수 있습니다.

```jsonc
// package.json
{
    "scripts": {
        "prettier": "prettier --check '**/*.{ts,tsx,js,mjs,cjs,jsx,json}'",
        "prettier:fix": "prettier --write '**/*.{ts,tsx,js,mjs,cjs,jsx,json}'",
    },
}
```

> [husky](https://github.com/typicode/husky) & [lint-staged](https://github.com/lint-staged/lint-staged)를 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

## Integrating with IDE

-   code-style에서는 **Formatting을 위해 Prettier**를, **Code-quality를 위해 ESlint**를 사용하고 있습니다. ([Prettier vs. Linters](https://prettier.io/docs/en/comparison))
-   IDE에서 autofix 하기 위해 아래 설정이 필요합니다.

### VSCode

1. [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)을 설치합니다.
2. IDE에서 Command Palette(CMD/CTRL + Shift + P)를 열고 `settings.json`을 입력하여 설정파일을 오픈합니다.
3. 아래 설정을 추가하면 파일 저장시 Prettier config에 맞게 autofix 할 수 있습니다.

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
}
```

### WebStorm

Settings > Language > JavaScript > Prettier > Automatic Prettier configuration 을 설정합니다.
