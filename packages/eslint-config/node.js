module.exports = {
    parser: '@babel/eslint-parser',
    extends: ['./recommends', './rules/node'].map(require.resolve),
    env: {
        commonjs: true,
        node: true,
        jest: true,
        es2023: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        requireConfigFile: false,
    },
    reportUnusedDisableDirectives: true,
}
