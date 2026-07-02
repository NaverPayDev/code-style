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

> **⚠️ 중요 — `extends`는 `rules`/`plugins`/`jsPlugins`만 상속합니다.**
>
> oxlint의 `extends`는 ESLint와 달리 `env`/`globals`/`categories`를 **상속하지 않습니다**. (oxlint 1.72.0 기준 확인, [oxc#20087](https://github.com/oxc-project/oxc/issues/20087) 참고)
>
> 따라서 아래 항목은 소비자의 **최상위** config에 직접 작성해야 합니다:
>
> - `env` — `no-undef`가 참조할 전역 변수 주입 (`node`, `browser`, `commonjs` 등). 프리셋에 선언된 `env`는 `extends`로 넘어오지 않습니다.
> - `categories` — oxlint 기본 `correctness` 카테고리를 끄지 않으면 프리셋에 없는 `unicorn/*` 룰이 의도치 않게 발화합니다. `categories: { "correctness": "off" }`를 명시하세요.
>
> 프리셋이 활성화하는 룰(`rules`)과 `jsPlugins`는 정상적으로 상속됩니다.

### Node.js 프로젝트

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json"],
    "env": { "node": true, "commonjs": true, "es2023": true },
    "categories": { "correctness": "off" }
}
```

### React 프로젝트

`react` 프리셋은 `node` 프리셋을 확장하고 React / JSX 접근성(a11y) 룰을 추가로 활성화합니다.

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/react/.oxlintrc.json"],
    "env": { "node": true, "browser": true, "commonjs": true, "es2023": true },
    "categories": { "correctness": "off" }
}
```

필요에 따라 `ignorePatterns`를 추가합니다.

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "extends": ["./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json"],
    "env": { "node": true, "commonjs": true, "es2023": true },
    "categories": { "correctness": "off" },
    "ignorePatterns": ["dist", "node_modules"]
}
```

**Tip:** `no-undef`가 `.js`/`.cjs` 파일에서 전역(`require`, `process` 등)을 잡는다면 `env.node`/`env.commonjs`가 최상위에 선언되어 있는지 확인하세요. TypeScript(`.ts`/`.tsx`)에서는 프리셋의 `overrides`가 `no-undef`를 끄므로 영향이 없습니다.

> **Note:** oxlint 네이티브에 없는 일부 룰(`unused-imports/no-unused-imports`, `@naverpay/prevent-default-import`)은 `jsPlugins`로 제공되며, 필요한 플러그인은 이 패키지의 의존성으로 함께 설치됩니다. `jsPlugins`는 아직 **experimental** 단계라 lint 실행 시 경고가 출력되고, IDE(oxc language server)에서는 해당 룰이 표시되지 않습니다.

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
    "oxc.enable": true
}
```

#### oxfmt와 함께 사용 시

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

### WebStorm

[oxc-intellij-plugin](https://plugins.jetbrains.com/plugin/27061-oxc)을 설치하여 사용할 수 있습니다.
