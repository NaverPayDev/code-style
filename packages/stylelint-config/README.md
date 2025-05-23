# @naverpay/stylelint-config

This package provides a stylelint-config compliant with the Naver Pay style guide.

## Install

Install the **stylelint** and **@naverpay/stylelint-config** packages.

```bash
npm install -D stylelint@^16 @naverpay/stylelint-config
```

## Configure

Create a `stylelint.config.mjs` file. The default value for `defaultSeverity` is `warning`.

```js
/** @type {import('stylelint').Config} */
const config = {
  extends: ['@naverpay/stylelint-config'],
  defaultSeverity: 'error',
  rules: {},
}

export default config
```

> Only pure ESM is supported. Please create the file with an `.mjs` extension or add `"type": "module"` to your `package.json`.

## CLI

You can add scripts to your `package.json` to perform format checks.

```jsonc
// package.json
{
    "scripts": {
        "stylelint": "stylelint '**/*.{css,scss}'",
        "stylelint:fix": "stylelint --fix '**/*.{css,scss}'",
    },
}
```

> - Since `stylelint@15.x`, formatting rules that Prettier can handle have been delegated to Prettier. Therefore, files linted by Stylelint must also be processed by Prettier. [https://github.com/stylelint/stylelint/blob/1c17fb87a2f16f041632e380dd0d600cb3532337/docs/migration-guide/to-15.md](https://github.com/stylelint/stylelint/blob/1c17fb87a2f16f041632e380dd0d600cb3532337/docs/migration-guide/to-15.md)
> - It is recommended to automate style checks before commits or pushes using [lefthook](https://github.com/evilmartians/lefthook).

## Integrating with IDE

### VSCode

With the [Stylelint extension][Stylelint], some properties can be automatically fixed on file save.

> To prevent auto-fixing in projects not using Stylelint, create a `.vscode/settings.json` file in your project's root folder.

After installing the [Stylelint extension][Stylelint], create a `.vscode/settings.json` file in your project's root folder.

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

Now, `stylelint --fix` will run automatically when you save `*.{css,scss}` files.

[stylelint]: https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint

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
