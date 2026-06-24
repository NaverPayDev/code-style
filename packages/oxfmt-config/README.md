# @naverpay/oxfmt-config

네이버페이 스타일 가이드에 맞게 [oxfmt](https://oxc.rs/docs/guide/usage/formatter) formatter 설정을 커스텀하여 제공합니다.

> oxfmt는 oxc(Rust 기반) 포매터로, prettier 를 대체하는 빠른 포매터입니다.
> `@naverpay/oxfmt-config`는 `@naverpay/prettier-config` · `@naverpay/biome-config`와 동일한 포매팅 규칙을 제공합니다.

## 설치 방법

```bash
npm install @naverpay/oxfmt-config oxfmt -D
```

## 사용 방법

> **Note:** oxfmt 는 `extends` 키가 없습니다. ([oxc#16394](https://github.com/oxc-project/oxc/issues/16394)) 대신 메인테이너 권장 방식인 `oxfmt.config.ts` 에서 공유 설정을 import 해서 사용합니다.

프로젝트 루트에 `oxfmt.config.ts` 파일을 생성하고 `@naverpay/oxfmt-config` 를 import 합니다.

```ts
// oxfmt.config.ts
import {defineConfig} from 'oxfmt'
import config from '@naverpay/oxfmt-config' with {type: 'json'}

export default defineConfig(config)
```

> `defineConfig` 는 선택사항이지만 타입 체크/자동완성을 제공합니다. `with {type: 'json'}` import attribute 로 패키지의 `.oxfmtrc.json` 을 그대로 가져옵니다.
>
> 프로젝트 `package.json` 에 `"type": "module"` 이 없으면 Node 가 성능 경고를 출력할 수 있습니다(동작에는 영향 없음). `"type": "module"` 을 추가하면 사라집니다.

### 일부 규칙만 덮어쓰기

공유 설정을 펼친 뒤 원하는 값만 덮어씁니다.

```ts
// oxfmt.config.ts
import {defineConfig, type OxfmtConfig} from 'oxfmt'
import config from '@naverpay/oxfmt-config' with {type: 'json'}

export default defineConfig({
    ...(config as OxfmtConfig),
    printWidth: 80,
    ignorePatterns: ['dist', 'node_modules'],
})
```

> ignore 는 기본적으로 `.gitignore` · `.prettierignore` 를 따르며, 추가로 제외할 경로는 `ignorePatterns` 로 지정합니다.

## CLI

`oxfmt` 는 `oxfmt.config.ts` 를 자동으로 탐색하므로 별도 옵션 없이 실행합니다.

```jsonc
// package.json
{
    "scripts": {
        "format": "oxfmt --check .",
        "format:fix": "oxfmt ."
    }
}
```

> 기본 동작은 파일을 직접 수정(`--write`)하는 것이며, `--check` 는 포매팅 여부만 검사합니다.

### JSON 설정만 쓰고 싶다면 (대안)

TS 설정 파일 대신 JSON 만 쓰고 싶다면, `-c`(`--config`) 로 패키지의 설정 파일 경로를 직접 가리킬 수 있습니다. (이 경우 로컬 override 는 불가합니다.)

```jsonc
// package.json
{
    "scripts": {
        "format": "oxfmt -c ./node_modules/@naverpay/oxfmt-config/.oxfmtrc.json --check ."
    }
}
```

> [lefthook](https://github.com/evilmartians/lefthook)을 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

## Integrating with IDE

- code-style에서는 **Formatting을 위해 oxfmt** 를, **Code-quality를 위해 oxlint/ESLint** 를 사용할 수 있습니다.
- IDE에서 autofix 하기 위해 아래 설정이 필요합니다.

### VSCode

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

### WebStorm

[oxc-intellij-plugin](https://plugins.jetbrains.com/plugin/27061-oxc)을 설치하여 사용할 수 있습니다.
