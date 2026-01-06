# @naverpay/code-style-cli

네이버페이 코드 스타일 패키지를 쉽게 설치하고 설정할 수 있는 CLI 도구입니다.

> pnpm v10+에서는 보안상의 이유로 postinstall 스크립트가 기본적으로 실행되지 않습니다. 이 CLI를 사용하면 패키지 설치와 설정 파일 생성을 한 번에 처리할 수 있습니다.

## 사용 방법

프로젝트 루트에서 실행합니다.

```bash
npx @naverpay/code-style-cli
```

1. 패키지 매니저를 자동으로 감지합니다. (npm, yarn, pnpm)
2. 설치할 패키지를 선택합니다.
3. 선택한 패키지가 설치되고 설정 파일이 자동으로 생성됩니다.

## 지원 패키지

| 패키지 | 설정 파일 |
|--------|-----------|
| [@naverpay/eslint-config](../eslint-config/README.md) | - |
| [@naverpay/eslint-plugin](../eslint-plugin/README.md) | - |
| [@naverpay/prettier-config](../prettier-config/README.md) | `.prettierrc` |
| [@naverpay/stylelint-config](../stylelint-config/README.md) | `stylelint.config.mjs` |
| [@naverpay/markdown-lint](../markdown-lint/README.md) | `.markdownlint.jsonc` |
| [@naverpay/editorconfig](../editorconfig/README.md) | `.editorconfig` |
| [@naverpay/oxlint-config](../oxlint-config/README.md) | `.oxlintrc.json` |
| [@naverpay/biome-config](../biome-config/README.md) | `biome.json` |
| [oxfmt](#oxfmt-가이드) | `.oxfmtrc.json` |

> eslint-config, eslint-plugin은 설정이 복잡하여 설정 파일을 자동 생성하지 않습니다.

## 설치 후 설정

CLI는 기본 설정 파일만 생성합니다. 추가 설정이 필요한 경우:

- **설정 변경**: 생성된 설정 파일을 직접 수정하세요.
- **CLI 명령어**: 각 패키지 README의 "CLI" 섹션을 참고하세요.
- **IDE 설정**: 각 패키지 README의 "Integrating with IDE" 섹션을 참고하세요.

## 주의 사항

- 프로젝트 루트에 `package.json`이 있어야 합니다.
- 이미 설정 파일이 존재하는 경우 덮어쓰지 않습니다.

---

## oxfmt 가이드

> oxfmt는 Prettier 호환 포매터로, Rust로 작성되어 빠른 속도를 제공합니다.
>
> **Note:** oxfmt는 현재 **alpha** 단계입니다. VSCode Extension 지원도 experimental 상태입니다.

oxfmt는 현재 `extends` 옵션을 지원하지 않아 별도 config 패키지가 없습니다. CLI에서 네이버페이 권장 설정이 포함된 `.oxfmtrc.json`을 생성합니다.

### 설정

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
    "ignorePatterns": ["dist", "pnpm-lock.yaml", ".github"]
}
```

### CLI

package.json에 스크립트를 추가하여 format 검사를 할 수 있습니다.

```json
{
    "scripts": {
        "format": "oxfmt",
        "format:check": "oxfmt --check"
    }
}
```

### Integrating with IDE

#### VSCode

> **Warning:** oxfmt의 VSCode 지원은 현재 **experimental** 단계입니다.

1. [oxc Extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)을 설치합니다.
2. `settings.json`에 아래 설정을 추가합니다.

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

#### WebStorm

[oxc-intellij-plugin](https://plugins.jetbrains.com/plugin/27061-oxc) (v0.0.21 이상)을 설치하여 사용할 수 있습니다.
