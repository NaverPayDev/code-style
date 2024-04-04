module.exports = {
    parser: '@babel/eslint-parser',
    extends: ['./recommends', './recommends/react', './rules/front'].map(require.resolve),
    env: {
        browser: true,
        jest: true,
        es2023: true,
    },
    parserOptions: {
        allowImportExportEverywhere: true,
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-react-jsx'],
        },
    },
    settings: {
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src'],
            },
        },
    },
    reportUnusedDisableDirectives: true,
}
