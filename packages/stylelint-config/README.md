# @naverpay/stylelint-config

네이버페이 스타일 가이드에 맞게 stylelint-config 패키지를 제공합니다.

## Install

**stylelint**, **@naverpay/stylelint-config** 패키지를 설치합니다.

```bash
npm install -D stylelint@^16 @naverpay/stylelint-config
```

## Configure

`stylelint.config.mjs` 파일을 생성합니다. `defaultSeverity` 의 default 값은 `warning` 입니다.

```js
/** @type {import('stylelint').Config} */
const config = {
  extends: ['@naverpay/stylelint-config'],
  defaultSeverity: 'error',
  rules: {},
}

export default config
```

## CLI

package.json에 스크립트를 추가하여 format 검사를 할 수 있습니다.

```jsonc
// package.json
{
    "scripts": {
        "stylelint": "stylelint '**/*.{css,scss}'",
        "stylelint:fix": "stylelint --fix '**/*.{css,scss}'",
    },
}
```

> - `styelint@15.x` 버전 부터 prettier 가 할 수 있는 일을 prettier 에 위임 했기 때문에, stylelint 가 검사하는 파일은 반드시 `prettier`도 실행해야 합니다. <https://github.com/stylelint/stylelint/blob/1c17fb87a2f16f041632e380dd0d600cb3532337/docs/migration-guide/to-15.md>
> - [lefthook](https://github.com/evilmartians/lefthook)을 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

## Integrating with IDE

### VSCode

[Stylelint 확장 프로그램][Stylelint]을 통해 파일 저장 시 일부 속성에 대해 자동으로 수정할 수 있습니다.

> 스타일린트가 적용되지 않은 프로젝트에서 자동 수정이 되는 것을 방지하기 위해 프로젝트 루트 폴더에 `.vscode/settings.json` 생성

[Stylelint 확장 프로그램][Stylelint]설치 후 프로젝트 루트 폴더에 `.vscode/settings.json` 을 생성합니다.

```json
{
    "css.validate": false,
    "less.validate": false,
    "scss.validate": false,
    "[css]": {
        "editor.formatOnSave": false,
        "editor.codeActionsOnSave": {
            "source.fixAll.stylelint": true
        }
    },
    "[scss]": {
        "editor.formatOnSave": false,
        "editor.codeActionsOnSave": {
            "source.fixAll.stylelint": true
        }
    },
    "stylelint.validate": ["css", "scss"]
}
```

이제 `*.{css,scss}` 파일 저장 시 `stylelint --fix`를 자동으로 실행합니다.

[Stylelint]: https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint

## Rules

- [at-rule](./src/rules/stylelint/at-rule/README.md)
- [block](./src/rules/stylelint/block/README.md)
- [color](./src/rules/stylelint/color/README.md)
- [comment](./src/rules/stylelint/comment/README.md)
- [declaration](./src/rules/stylelint/declaration/README.md)
- [font](./src/rules/stylelint/font/README.md)
- [function](./src/rules/stylelint/function/README.md)
- [general](./src/rules/stylelint/general/README.md)
- [length](./src/rules/stylelint/length/README.md)
- [media-feature](./src/rules/stylelint/media-feature/README.md)
- [property](./src/rules/stylelint/property/README.md)
- [rule](./src/rules/stylelint/rule/README.md)
- [selector](./src/rules/stylelint/selector/README.md)
- [unit](./src/rules/stylelint/unit/README.md)
- [stylelint-order](./src/rules/stylelint-order/README.md)
- [stylelint-scss](./src/rules/stylelint-scss/README.md)
