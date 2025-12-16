# @naverpay/oxfmt-config

네이버페이 스타일 가이드에 맞게 oxfmt formatter 설정을 커스텀하여 제공합니다.

> oxfmt는 Prettier 호환 포매터로, Rust로 작성되어 빠른 속도를 제공합니다.
>
> **Note:** oxfmt는 현재 **alpha** 단계입니다. VSCode Extension 지원도 experimental 상태입니다.

## 설치 방법

```bash
npm install @naverpay/oxfmt-config oxfmt -D
```

## 사용 방법

> **Note:** oxfmt는 현재 `extends` 옵션을 지원하지 않습니다. ([관련 이슈](https://github.com/oxc-project/oxc/issues/16394))

패키지 설치 시 `.oxfmtrc.json` 파일이 프로젝트 루트에 자동으로 생성됩니다. 이미 파일이 존재하면 덮어쓰지 않습니다.

필요에 따라 `ignorePatterns`를 추가합니다.

```json
{
    "$schema": "./node_modules/oxfmt/configuration_schema.json",
    "singleQuote": true,
    "semi": false,
    "useTabs": false,
    "tabWidth": 4,
    "endOfLine": "lf",
    "bracketSpacing": false,
    "arrowParens": "always",
    "bracketSameLine": false,
    "printWidth": 120,
    "trailingComma": "all",
    "ignorePatterns": [
        "dist",
        "pnpm-lock.yaml",
        ".github"
    ]
}
```

## CLI

package.json에 스크립트를 추가하여 format 검사를 할 수 있습니다.

```json
{
    "scripts": {
        "format": "oxfmt",
        "format:check": "oxfmt --check"
    }
}
```

> [lefthook](https://github.com/evilmartians/lefthook)을 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

## Integrating with IDE

- code-style에서는 **Formatting을 위해 oxfmt**를, **Code-quality를 위해 oxlint**를 사용할 수 있습니다.
- IDE에서 autofix 하기 위해 아래 설정이 필요합니다.

### VSCode

> **Warning:** oxfmt의 VSCode 지원은 현재 **experimental** 단계입니다. 예상대로 동작하지 않을 수 있습니다.

1. [oxc Extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)을 설치합니다.
2. IDE에서 Command Palette(CMD/CTRL + Shift + P)를 열고 `settings.json`을 입력하여 설정파일을 오픈합니다.
3. 아래 설정을 추가하면 파일 저장시 oxfmt config에 맞게 autofix 할 수 있습니다.

```json
{
    "oxc.enable": true,
    "oxc.fmt.experimental": true,
    "editor.defaultFormatter": "oxc.oxc-vscode",
    "editor.formatOnSave": true,
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
| `oxc.fmt.experimental` | experimental 포매터 활성화 (필수) |
| `editor.defaultFormatter` | 기본 포매터로 oxc 사용 |
| `editor.formatOnSave` | 저장 시 자동 포맷 |

### WebStorm

[oxc-intellij-plugin](https://plugins.jetbrains.com/plugin/27061-oxc) (v0.0.21 이상)을 설치하여 사용할 수 있습니다.
