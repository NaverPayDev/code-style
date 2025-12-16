# @naverpay/oxlint-config

네이버페이 스타일 가이드에 맞게 oxlint 설정을 제공합니다.

> oxlint는 ESLint 호환 린터로, Rust로 작성되어 빠른 속도를 제공합니다.

## 설치 방법

```bash
npm install @naverpay/oxlint-config oxlint -D
```

## 사용 방법

> **Note:** oxlint의 `extends`는 설정 파일 위치 기준으로 경로를 해석합니다. ([공식 문서](https://oxc.rs/docs/guide/usage/linter/config-file-reference))

프로젝트 루트에 `.oxlintrc.json` 파일을 생성하고 아래와 같이 설정합니다.

### Node.js 프로젝트

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json"]
}
```

필요에 따라 `ignorePatterns`를 추가합니다.

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json"],
    "ignorePatterns": ["dist", "node_modules"]
}
```

## CLI

package.json에 스크립트를 추가하여 lint 검사를 할 수 있습니다.

```json
{
    "scripts": {
        "lint": "oxlint"
    }
}
```

`--report-unused-disable-directives` 옵션을 추가하면 불필요한 `eslint-disable` 주석을 감지합니다. 필요에 따라 사용합니다.

```json
{
    "scripts": {
        "lint": "oxlint --report-unused-disable-directives"
    }
}
```

> [lefthook](https://github.com/evilmartians/lefthook)을 사용해서 commit 또는 push 전에 lint 검사를 자동화할 것을 권장합니다.

## Integrating with IDE

### VSCode

1. [oxc Extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)을 설치합니다.
2. IDE에서 Command Palette(CMD/CTRL + Shift + P)를 열고 `settings.json`을 입력하여 설정파일을 오픈합니다.
3. 아래 설정을 추가합니다.

```json
{
    "oxc.enable": true,
    "oxc.configPath": ".oxlintrc.json",
    "[typescript]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "oxc.oxc-vscode"
    }
}
```

| 설정 | 설명 |
|------|------|
| `oxc.enable` | oxc 익스텐션 활성화 |
| `oxc.configPath` | oxlint 설정 파일 경로 |

### WebStorm

[oxc-intellij-plugin](https://plugins.jetbrains.com/plugin/27061-oxc)을 설치하여 사용할 수 있습니다.
