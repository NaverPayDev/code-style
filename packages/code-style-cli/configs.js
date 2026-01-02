export const TOOLS = [
    {value: '@naverpay/eslint-config'},
    {value: '@naverpay/prettier-config'},
    {value: '@naverpay/stylelint-config'},
    {value: '@naverpay/markdown-lint'},
    {value: '@naverpay/editorconfig'},
    {value: '@naverpay/oxlint-config'},
    {value: '@naverpay/biome-config'},
]

export const INSTALL_CMD = {
    npm: 'npm install -D',
    yarn: 'yarn add -D',
    pnpm: 'pnpm add -D',
}

export const CONFIG_FILES = {
    '@naverpay/editorconfig': {
        file: '.editorconfig',
        copyFrom: 'node_modules/@naverpay/editorconfig/.editorconfig',
    },
    '@naverpay/markdown-lint': {
        file: '.markdownlint.jsonc',
        content: JSON.stringify({extends: '@naverpay/markdown-lint'}, null, 4),
    },
}
