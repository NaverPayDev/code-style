import fs from 'fs'

// 설정 파일 내용
const PRETTIERRC_CONTENT = '"@naverpay/prettier-config"'

const STYLELINT_CONTENT = `/** @type {import('stylelint').Config} */
const config = {
    extends: ['@naverpay/stylelint-config'],
    defaultSeverity: 'error',
    rules: {},
}

export default config
`

const MARKDOWNLINT_CONTENT = JSON.stringify(
    {
        extends: '@naverpay/markdown-lint',
    },
    null,
    4,
)

const OXLINTRC_CONTENT = JSON.stringify(
    {
        $schema: './node_modules/oxlint/configuration_schema.json',
        extends: ['./node_modules/@naverpay/oxlint-config/node/.oxlintrc.json'],
    },
    null,
    4,
)

function getBiomeContent() {
    const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const version = pkgJson.devDependencies?.['@biomejs/biome']?.replace(/[\^~]/, '')
    if (!version) return null
    return JSON.stringify(
        {
            $schema: `https://biomejs.dev/schemas/${version}/schema.json`,
            extends: ['@naverpay/biome-config'],
        },
        null,
        4,
    )
}

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
    {
        value: 'prettier-config',
        packages: ['@naverpay/prettier-config'],
        configFile: '.prettierrc',
        configContent: PRETTIERRC_CONTENT,
    },
    {
        value: 'stylelint-config',
        packages: ['@naverpay/stylelint-config', 'stylelint'],
        configFile: 'stylelint.config.mjs',
        configContent: STYLELINT_CONTENT,
    },
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
    {
        value: 'oxlint-config',
        packages: ['@naverpay/oxlint-config', 'oxlint'],
        configFile: '.oxlintrc.json',
        configContent: OXLINTRC_CONTENT,
    },
    {
        value: 'biome-config',
        packages: ['@naverpay/biome-config', '@biomejs/biome'],
        configFile: 'biome.json',
        getContent: getBiomeContent,
    },
    {value: 'oxfmt', packages: ['oxfmt'], configFile: '.oxfmtrc.json', configContent: OXFMTRC_CONTENT},
]

export const TOOLS_MAP = Object.fromEntries(TOOLS.map((t) => [t.value, t]))

export const PACKAGE_MANAGERS = {
    npm: {lockFile: 'package-lock.json', installCmd: 'npm install -D'},
    yarn: {lockFile: 'yarn.lock', installCmd: 'yarn add -D'},
    pnpm: {lockFile: 'pnpm-lock.yaml', installCmd: 'pnpm add -D'},
}
