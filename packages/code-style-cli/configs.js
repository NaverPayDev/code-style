const MARKDOWNLINT_CONTENT = JSON.stringify({extends: '@naverpay/markdown-lint'}, null, 4)
const OXFMTRC_CONTENT = JSON.stringify(
    {
        $schema: './node_modules/oxfmt/configuration_schema.json',
        singleQuote: true,
        semi: false,
        useTabs: false,
        tabWidth: 4,
        endOfLine: 'lf',
        bracketSpacing: false,
        arrowParens: 'always',
        bracketSameLine: false,
        printWidth: 120,
        trailingComma: 'all',
    },
    null,
    4,
)

// 패키지 목록
export const TOOLS = [
    {value: 'eslint-config', packages: ['@naverpay/eslint-config']},
    {value: 'eslint-plugin', packages: ['@naverpay/eslint-plugin']},
    {value: 'prettier-config', packages: ['@naverpay/prettier-config']},
    {value: 'stylelint-config', packages: ['@naverpay/stylelint-config', 'stylelint']},
    {
        value: 'markdown-lint',
        packages: ['@naverpay/markdown-lint'],
        configFile: '.markdownlint.jsonc',
        configContent: MARKDOWNLINT_CONTENT,
    },
    {
        value: 'editorconfig',
        packages: ['@naverpay/editorconfig'],
        configFile: '.editorconfig',
        copyFrom: 'node_modules/@naverpay/editorconfig/.editorconfig',
    },
    {value: 'oxlint-config', packages: ['@naverpay/oxlint-config', 'oxlint']},
    {value: 'biome-config', packages: ['@naverpay/biome-config', '@biomejs/biome']},
    {value: 'oxfmt', packages: ['oxfmt'], configFile: '.oxfmtrc.json', configContent: OXFMTRC_CONTENT},
]

export const TOOLS_MAP = Object.fromEntries(TOOLS.map((t) => [t.value, t]))

export const INSTALL_CMD = {
    npm: 'npm install -D',
    yarn: 'yarn add -D',
    pnpm: 'pnpm add -D',
}
