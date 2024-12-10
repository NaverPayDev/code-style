# @naverpay/eslint-config

네이버페이 스타일 가이드에 맞게 lint rule을 커스텀하여 제공합니다.

## 설치 방법

```bash
npm install @naverpay/eslint-config -D
```

## 사용 방법

프로젝트 환경에 알맞는 config를 import해 사용합니다.

- **node**
  - JS로 작성된 node 환경에서 사용합니다.
- **typescript**
  - TS로 작성된 환경에서 사용합니다.
- **react**
  - TS로 작성된 react17+ 환경에서 사용합니다.
- **strict**
  - [eslint-plugin-unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn), [eslint-config-sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs) 등을 적용해 보다 엄격한 룰을 원하는 환경에서 사용합니다.

```js
// eslint.config.js
import naverpay from '@naverpay/eslint-config'

export default [
    {
        ignores: ['**/dist/**'],
    },
    ...naverpay.configs.node,
    ...naverpay.configs.typescript,
    ...naverpay.configs.strict,
]
```

## CLI

package.json에 스크립트를 추가하여 lint 검사를 할 수 있습니다.

```jsonc
// package.json
{
    "scripts": {
        "lint": "eslint '**/*.{js,jsx,ts,tsx,yaml,yml}'",
        "lint:fix": "eslint '**/*.{js,jsx,ts,tsx,yaml,yml}' --fix",
    }
}
```

> [husky](https://github.com/typicode/husky) & [lint-staged](https://github.com/lint-staged/lint-staged)를 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

## Integrating with IDE

- code-style에서는 **Formatting을 위해 Prettier**를, **Code-quality를 위해 ESLint**를 사용하고 있습니다. ([Prettier vs. Linters](https://prettier.io/docs/en/comparison))
- Prettier는 [여기](../prettier-config/README.md)를 참고해주세요.
- IDE에서 AutoFix 하기 위해 아래 설정이 필요합니다.

### VSCode

1. [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)을 설치합니다.
2. IDE에서 Command Palette(CMD/CTRL + Shift + P)를 열고 `settings.json`을 입력하여 설정파일을 오픈합니다.
3. 아래 설정을 추가하면 파일 저장시 ESLint rule에 맞게 autofix 할 수 있습니다.

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
}
```

#### Typescript

만약 typescript 를 사용 중이라면 아래의 설정을 활성화해주세요.

```json
{
    "typescript.preferences.preferTypeOnlyAutoImports": true
}
```

### WebStorm

Settings > Language > JavaScript > Code Quality > ESLint > Automatic ESLint configuration 을 설정합니다.
