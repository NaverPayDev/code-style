# @naverpay/biome-config

네이버페이 스타일 가이드에 맞게 Biome formatter 설정을 커스텀하여 제공합니다.

> eslint 를 대체 하기에는 eslint 플러그인이 너무 방대하여, `@naverpay/biome-config`는 formatting 역할을 하는 prettier 만 대체하도록 설계되어 있습니다.

## 설치 방법

```bash
npm install @naverpay/biome-config @biomejs/biome -D
```

## 사용 방법

biome.json 파일을 생성하고 `@naverpay/biome-config` 패키지를 추가합니다.

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.6/schema.json",
  "extends": ["@naverpay/biome-config"],
  "files": {
    "includes": ["**", "!scripts/**", "!apps/web/public/**", "!apps/web/src/assets/lottie/applyCharge.json"]
  }
}

```

> ignore 설정이 없기 때문에, `includes`의 `!`로 무시하고 싶은 파일을 설정해주세요.

## CLI

package.json에 스크립트를 추가하여 format 검사를 할 수 있습니다.

```jsonc
// package.json
{
    "scripts": {
        "format": "biome check .",
        "format:fix": "biome check --write ."
    },
}
```

> [lefthook](https://github.com/evilmartians/lefthook)을 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

## 차이점

- [biome 에서 제공하는 assist](https://biomejs.dev/assist/javascript/actions/) 가 기본으로 활성화 되어 있습니다. 따라서 prettier 를 대체한다면 jsx elements 의 순서가 정렬되거나, js 객체의 키가 정렬될 수 있습니다. 해당 옵션을 원치 않는다면 반드시 꺼주세요.  
  - [organizeImports](https://biomejs.dev/assist/actions/organize-imports/) 규칙은 eslint 의  `import/order` 와 충돌하여 기본적으로 꺼져있습니다. 다음 major 버전 때 biome 로 대체될 예정입니다.

```jsonc
// biome.json
{
    "$schema": "https://biomejs.dev/schemas/2.2.6/schema.json",
    "assist": {
        "actions": {
            "source": {
                "organizeImports": "off"
            }
        }
    }
}
```

## Integrating with IDE

- code-style에서는 **Formatting을 위해 Biome**를, **Code-quality를 위해 ESLint**를 사용하고 있습니다.
- IDE에서 autofix 하기 위해 아래 설정이 필요합니다.

### VSCode

1. [Biome Extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)을 설치합니다.
2. IDE에서 Command Palette(CMD/CTRL + Shift + P)를 열고 `settings.json`을 입력하여 설정파일을 오픈합니다.
3. 아래 설정을 추가하면 파일 저장시 Biome config에 맞게 autofix 할 수 있습니다.

```json
{
    "editor.defaultFormatter": "biomejs.biome",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.biome": "explicit"
    }
}
```

### WebStorm

Settings > Languages & Frameworks > JavaScript > Prettier 에서 Prettier를 비활성화하고, [Biome Plugin](https://plugins.jetbrains.com/plugin/22761-biome)을 설치하여 사용할 수 있습니다.
