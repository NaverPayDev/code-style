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
  "extends": ["@naverpay/biome-config"]
}
```

## CLI

package.json에 스크립트를 추가하여 format 검사를 할 수 있습니다.

```jsonc
// package.json
{
    "scripts": {
        "format": "biome format .",
        "format:fix": "biome format --write ."
    },
}
```

> [lefthook](https://github.com/evilmartians/lefthook)을 사용해서 commit 또는 push 전에 스타일 확인을 자동화할 것을 권장합니다.

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
    "editor.formatOnSave": true
}
```

### WebStorm

Settings > Languages & Frameworks > JavaScript > Prettier 에서 Prettier를 비활성화하고, [Biome Plugin](https://plugins.jetbrains.com/plugin/22761-biome)을 설치하여 사용할 수 있습니다.
