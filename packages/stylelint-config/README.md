# @naverpay/stylelint-config

네이버페이 스타일 가이드에 맞게 stylelint-config 패키지를 제공합니다.

## Install

**stylelint**, **@naverpay/stylelint-config** 패키지를 설치합니다.

```bash
$npm install --save-dev stylelint@^14.2.0 @naverpay/stylelint-config
```

## Configure

`.stylelintrc` 파일을 생성합니다. `defaultSeverity` 의 default 값은 `warning` 입니다.

```json
{
    "extends": ["@naverpay/stylelint-config"],
    "defaultSeverity": "error"
}
```

### Autofix

#### husky + lint-staged

`huksy + lint-staged` 가 적용된 프로젝트는 commit 시 `stylelint --fix` 를 자동으로 실행할 수 있습니다.

> 자동 수정을 비활성화 하는 경우 `--fix` 옵션 제거 가능

```json
// package.json
{
    "lint-staged": {
        "**/*.css": [
            "stylelint --fix"
        ]
    },
    "lint-staged": {
        "**/*.scss": [
            "stylelint --fix"
        ]
    },
    "lint-staged": {
        "**/*.{css,scss}": [
            "stylelint --fix"
        ]
    }
}
```

이제 Commit 시 `staged` 된 `*.{css,scss}` 파일에 대해 `stylelint --fix` 를 자동으로 실행합니다.

#### VSCode stylelint

VSCode 에디터를 사용하고 있다면 [Stylelint 확장 프로그램][Stylelint]을 통해 파일 저장 시 일부 속성에 대해 자동으로 수정할 수 있습니다.

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
- [number](./src/rules/stylelint/number/README.md)
- [property](./src/rules/stylelint/property/README.md)
- [rule](./src/rules/stylelint/rule/README.md)
- [selector](./src/rules/stylelint/selector/README.md)
- [string](./src/rules/stylelint/string/README.md)
- [unit](./src/rules/stylelint/unit/README.md)
- [value](./src/rules/stylelint/value/README.md)
- [stylelint-order](./src/rules/stylelint-order/README.md)
- [stylelint-scss](./src/rules/stylelint-scss/README.md)
