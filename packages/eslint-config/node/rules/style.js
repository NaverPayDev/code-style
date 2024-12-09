import nodePlugin from 'eslint-plugin-n'

export default {
    plugins: {
        n: nodePlugin,
    },
    rules: {
        /**
         * Require the use of === and !==
         * @see https://eslint.org/docs/latest/rules/eqeqeq
         */
        eqeqeq: ['error', 'smart'],

        /**
         * Disallow the use of console
         * @see https://eslint.org/docs/latest/rules/no-console
         */
        'no-console': 'error',

        /**
         * Disallow variable declarations from shadowing variables declared in the outer scope
         * @see https://eslint.org/docs/latest/rules/no-shadow
         */
        'no-shadow': 'error',

        /**
         * Enforce consistent spacing inside braces
         * @see https://eslint.org/docs/latest/rules/object-curly-spacing
         */
        'object-curly-spacing': ['error', 'never'],

        /**
         * Require quotes around object literal property names
         * @see https://eslint.org/docs/latest/rules/quote-props
         */
        'quote-props': ['warn', 'as-needed'],

        /**
         * Disallow assignments that can lead to race conditions due to usage of await or yield
         * @see https://eslint.org/docs/latest/rules/require-atomic-updates
         */
        'require-atomic-updates': 'off',

        /**
         * Enforce dot notation except snakecase
         * @see https://eslint.org/docs/latest/rules/dot-notation
         */
        'dot-notation': ['error', {allowPattern: '^[a-zA-Z]+(_[a-zA-Z]+)+$'}],

        /**
         * Require error handling in callbacks
         * @see https://eslint.org/docs/latest/rules/handle-callback-err
         */
        'n/handle-callback-err': ['error', '^(err|error)$'],

        /**
         * Disallow string concatenation with __dirname and __filename
         * @see https://eslint.org/docs/latest/rules/no-path-concat
         */
        'n/no-path-concat': 'error',
    },
}
