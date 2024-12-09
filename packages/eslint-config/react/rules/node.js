import nodePlugin from 'eslint-plugin-n'

export default {
    plugins: {
        n: nodePlugin,
    },
    rules: {
        /**
         * When a function is named cb or callback, then it must be invoked with a first argument that is undefined, null, an Error class, or a subclass or Error
         * @see https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-callback-literal.md
         */
        'n/no-callback-literal': 'off',
    },
}
