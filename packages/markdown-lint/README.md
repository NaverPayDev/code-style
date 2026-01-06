# @naverpay/markdown-lint

markdown 파일 검사용 lint 도구입니다.  
[DavidAnson/markdownlint](https://github.com/DavidAnson/markdownlint)에서 제공하는 패키지와 규칙을 사용하고 있으며, 몇 가지 rule은 커스텀 되어 있습니다.

## 설치 방법

[`@naverpay/code-style-cli`](../code-style-cli/README.md)를 사용하여 설치하는 것을 권장합니다.

```bash
npx @naverpay/code-style-cli
```

또는 직접 설치 후 설정 파일을 생성할 수 있습니다.

```bash
npm install @naverpay/markdown-lint -D
echo '{"extends": "@naverpay/markdown-lint"}' > .markdownlint.jsonc
```

## Config

> [markdown-lint config](./.markdownlint.jsonc)는 [jsonc](https://code.visualstudio.com/docs/languages/json#_json-with-comments) 형식으로 작성되어 있어, 주석을 통해 rule에 대한 설명을 확인할 수 있습니다.
> 각 규칙의 명세는 [여기](https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md)서 확인할 수 있습니다.

## Integrating with IDE

1. IDE에 [markdownlint extension for vscode](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)를 설치합니다.
2. 저장시 lint가 동작할 수 있도록 `setting.json`에 설정을 추가합니다.

```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.markdownlint": true
    }
}
```

IDE에서 오류 표기를 하고 싶지 않은 파일이 있다면 `.markdownlintignore`를 추가합니다.

```jsonc
// .markdownlintignore
CHANGELOG.md
```

## CLI

`package.json`에 스크립트를 추가하여 CLI 환경에서 사용할 수 있습니다.

```jsonc
{
    "scripts": {
        "markdownlint": "markdownlint '**/*.md'",
        "markdownlint:fix": "markdownlint --fix '**/*.md'",
    },
}
```

기본으로 루트에 있는 config 파일을 읽습니다. (.markdownlint.`jsonc`/`json`/`yaml`/`yml`/`cjs`/`mjs`)  
그 외 위치에 config 파일을 둔다면 `--config` 인수로 정의해주어야 합니다.

```jsonc
{
    "scripts": {
        "markdownlint": "markdownlint --config 'config/.markdownlint.jsonc' '**/*.md'",
        "markdownlint:fix": "markdownlint --config 'config/.markdownlint.jsonc' --fix '**/*.md'",
    },
}
```

무시하고 싶은 파일이나 폴더가 있다면 `#`을 붙여 ignore 할 수 있습니다.  
(node_modules 폴더는 자동으로 무시됩니다.)

```jsonc
{
    "scripts": {
        "markdownlint": "markdownlint '**/*.md' '#**/CHANGELOG.md'",
        "markdownlint:fix": "markdownlint --fix '**/*.md' '#**/CHANGELOG.md'",
    },
}
```

이외 옵션은 [여기](https://github.com/DavidAnson/markdownlint-cli2?tab=readme-ov-file#command-line)서 확인할 수 있습니다.

## Conflict with prettier

`prettier`와 `markdown-lint`를 함께 사용한다면 몇 가지 rule에서 충돌이 발생할 수 있습니다.  
충돌하는 rule은 [여기](https://github.com/DavidAnson/markdownlint/blob/main/style/prettier.json)서 확인할 수 있습니다.  
해당 rule에 `false` 값을 주어 끄거나, `.prettierignore`에 마크다운 형식을 추가하여 해결할 수 있습니다.

```jsonc
// .markdownlint.jsonc
{
    "comment": "Disables rules that may conflict with Prettier",

    "blanks-around-fences": false,
    "blanks-around-headings": false,
    "blanks-around-lists": false,
    "code-fence-style": false,
    "emphasis-style": false,
    "heading-start-left": false,
    "hr-style": false,
    "line-length": false,
    "list-indent": false,
    "list-marker-space": false,
    "no-blanks-blockquote": false,
    "no-hard-tabs": false,
    "no-missing-space-atx": false,
    "no-missing-space-closed-atx": false,
    "no-multiple-blanks": false,
    "no-multiple-space-atx": false,
    "no-multiple-space-blockquote": false,
    "no-multiple-space-closed-atx": false,
    "no-trailing-spaces": false,
    "ol-prefix": false,
    "strong-style": false,
    "ul-indent": false,
}
```

```
# markdown
**/*.md
```
