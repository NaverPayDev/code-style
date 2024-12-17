export default {
    rules: {
        /**
         * Require return statements to either always or never specify values
         * @see https://eslint.org/docs/latest/rules/consistent-return
         */
        'consistent-return': 'off',

        /**
         * Enforce consistent brace style for all control statements
         * @see https://eslint.org/docs/latest/rules/curly
         */
        curly: ['error', 'all'],

        /**
         * Disallow the use of console
         * @see https://eslint.org/docs/latest/rules/no-console
         */
        'no-console': 'error',

        /**
         * Disallow if statements as the only statement in else blocks
         * @see https://eslint.org/docs/latest/rules/no-lonely-if
         */
        'no-lonely-if': 'off',

        /**
         * Disallow specified modules when loaded by import
         * @see https://eslint.org/docs/latest/rules/no-restricted-imports
         */
        'no-restricted-imports': [
            'warn',
            {
                patterns: ['../*', './*', '!*.scss'],
            },
        ],

        /**
         * Disallow variable declarations from shadowing variables declared in the outer scope
         * @see https://eslint.org/docs/latest/rules/no-shadow
         */
        'no-shadow': 'error',

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
    },
}
